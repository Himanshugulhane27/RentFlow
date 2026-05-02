import { leaseRepository } from '../repositories/lease.repository';
import { propertyRepository } from '../repositories/property.repository';
import { CreateLeaseInput, UpdateLeaseInput } from '../schemas/lease.schema';
import { PaginationQuery } from '../types/api.types';
import { parsePagination } from '../utils/pagination';
import { AppError, ConflictError } from '../utils/errors';
import mongoose from 'mongoose';
import { paymentService } from './payment.service';
import { TimelineEventService } from './timelineEvent.service';

class LeaseService {
  async getAll(organizationId: string, query: PaginationQuery) {
    const options = parsePagination(query);
    return leaseRepository.findPaginated(organizationId, options);
  }

  async getById(id: string, organizationId: string) {
    return leaseRepository.findById(id, organizationId);
  }

  async create(data: CreateLeaseInput, organizationId: string) {
    // Check if property already has an active lease
    const activeLease = await leaseRepository.findActiveForProperty(
      organizationId,
      data.propertyId
    );
    if (activeLease) {
      throw new ConflictError('Property already has an active lease');
    }

    // Validate dates
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      throw new AppError('End date must be after start date');
    }

    const lease = await leaseRepository.create({
      ...data,
      startDate: start,
      endDate: end,
      organizationId: new mongoose.Types.ObjectId(organizationId),
      propertyId: new mongoose.Types.ObjectId(data.propertyId),
      tenantId: new mongoose.Types.ObjectId(data.tenantId),
    });

    // Mark property as occupied
    await propertyRepository.update(data.propertyId, organizationId, {
      available: false,
    });

    // Generate monthly payment schedule
    const payments = await paymentService.generateLeasePayments(lease);

    // Write timeline event
    await TimelineEventService.write({
      entityType: 'lease',
      entityId: lease._id.toString(),
      type: 'lease',
      title: 'Lease Created',
      description: `Lease created for ${lease.monthlyRent}/month. ${payments.length} payment records generated.`,
      organizationId: lease.organizationId.toString(),
    });

    return lease;
  }

  async update(id: string, organizationId: string, data: UpdateLeaseInput) {
    const oldLease = await leaseRepository.findById(id, organizationId);
    const lease = await leaseRepository.update(id, organizationId, data);

    const rentChanged = data.monthlyRent !== undefined && data.monthlyRent !== oldLease.monthlyRent;
    const endChanged = data.endDate !== undefined && new Date(data.endDate).getTime() !== new Date(oldLease.endDate).getTime();

    if (rentChanged || endChanged) {
      await paymentService.generateLeasePayments(lease);
    }

    return lease;
  }

  async terminate(id: string, organizationId: string) {
    const lease = await leaseRepository.findById(id, organizationId);

    if (lease.status !== 'active') {
      throw new AppError('Only active leases can be terminated');
    }

    await leaseRepository.update(id, organizationId, {
      status: 'terminated',
    });

    // Mark property as available
    await propertyRepository.update(
      lease.propertyId.toString(),
      organizationId,
      { available: true }
    );

    return leaseRepository.findById(id, organizationId);
  }

  async renew(id: string, organizationId: string, newEndDate: string) {
    const lease = await leaseRepository.findById(id, organizationId);

    const end = new Date(newEndDate);
    if (end <= lease.endDate) {
      throw new AppError('New end date must be after current end date');
    }

    return leaseRepository.update(id, organizationId, {
      endDate: end,
      status: 'active',
    });
  }

  async getByProperty(organizationId: string, propertyId: string) {
    return leaseRepository.findByProperty(organizationId, propertyId);
  }

  async getByTenant(organizationId: string, tenantId: string) {
    return leaseRepository.findByTenant(organizationId, tenantId);
  }

  async getExpiringSoon(organizationId: string, days: number = 30) {
    return leaseRepository.findExpiringSoon(organizationId, days);
  }

  async getActive(organizationId: string) {
    return leaseRepository.findActive(organizationId);
  }
}

export const leaseService = new LeaseService();
