import { paymentRepository } from '../repositories/payment.repository';
import { leaseRepository } from '../repositories/lease.repository';
import { Payment } from '../models/Payment.model';
import { Organization } from '../models/Organization.model';
import { CreatePaymentInput, MarkPaidInput } from '../schemas/payment.schema';
import { PaginationQuery } from '../types/api.types';
import { parsePagination } from '../utils/pagination';
import { AppError, NotFoundError } from '../utils/errors';
import { daysBetween } from '../utils/helpers';
import mongoose from 'mongoose';
import { TimelineEventService } from './timelineEvent.service';

class PaymentService {
  async getAll(organizationId: string, query: PaginationQuery) {
    const options = parsePagination(query);
    return paymentRepository.findPaginated(organizationId, options);
  }

  async getById(id: string, organizationId: string) {
    return paymentRepository.findById(id, organizationId);
  }

  async getPayments(filters: {
    organizationId: string;
    status?: string;
    tenantId?: string;
    leaseId?: string;
    month?: string; // format: "2025-01"
  }) {
    const query: Record<string, unknown> = { 
      organizationId: filters.organizationId 
    };

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.tenantId) {
      query.tenantId = filters.tenantId;
    }

    if (filters.leaseId) {
      query.leaseId = filters.leaseId;
    }

    if (filters.month) {
      const [year, month] = filters.month.split('-').map(Number);
      query.dueDate = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      };
    }

    return Payment.find(query)
      .populate('tenantId', 'firstName lastName email phone')
      .populate('leaseId', 'startDate endDate monthlyRent')
      .populate('propertyId', 'name address')
      .sort({ dueDate: -1 });
  }

  async create(data: CreatePaymentInput, organizationId: string) {
    return paymentRepository.create({
      ...data,
      dueDate: new Date(data.dueDate),
      totalAmount: data.amount,
      lateFee: 0,
      organizationId: new mongoose.Types.ObjectId(organizationId),
      leaseId: new mongoose.Types.ObjectId(data.leaseId),
      tenantId: new mongoose.Types.ObjectId(data.tenantId),
      propertyId: new mongoose.Types.ObjectId(data.propertyId),
    });
  }

  async markPaid(id: string, organizationId: string, input: MarkPaidInput) {
    const payment = await paymentRepository.findById(id, organizationId);

    if (payment.status === 'paid') {
      throw new AppError('Payment is already marked as paid');
    }

    const updatedPayment = await paymentRepository.update(id, organizationId, {
      status: 'paid',
      paidDate: new Date(),
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId,
      notes: input.notes,
    });

    // Write timeline event
    await TimelineEventService.write({
      entityType: 'tenant',
      entityId: payment.tenantId.toString(),
      type: 'payment',
      title: 'Payment Received',
      description: `₹${payment.totalAmount} received for ${
        new Date(payment.dueDate).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
      }`,
      amount: payment.totalAmount,
      organizationId,
    });

    return paymentRepository.findById(id, organizationId);
  }

  async delete(id: string, organizationId: string) {
    return paymentRepository.delete(id, organizationId);
  }

  /**
   * Calculate late fee based on org settings.
   */
  async calculateLateFee(paymentId: string, organizationId: string): Promise<number> {
    const payment = await paymentRepository.findById(paymentId, organizationId);

    if (payment.status === 'paid') return 0;

    const org = await Organization.findById(organizationId);
    if (!org) throw new NotFoundError('Organization');

    const gracePeriod = org.settings.gracePeriodDays;
    const daysLate = daysBetween(payment.dueDate, new Date()) - gracePeriod;

    if (daysLate <= 0) return 0;

    const lateFee = payment.amount * (org.settings.lateFeePercentage / 100);

    // Update the payment with the late fee
    await paymentRepository.update(paymentId, organizationId, {
      lateFee,
      totalAmount: payment.amount + lateFee,
      status: 'overdue',
    });

    return lateFee;
  }

  async getOverdue(organizationId: string) {
    return paymentRepository.findOverdue(organizationId);
  }

  async getByTenant(organizationId: string, tenantId: string) {
    return paymentRepository.findByTenant(organizationId, tenantId);
  }

  async getByLease(organizationId: string, leaseId: string) {
    return paymentRepository.findByLease(organizationId, leaseId);
  }

  async getRevenueTrend(organizationId: string, months: number = 12) {
    return paymentRepository.getMonthlyRevenueTrend(organizationId, months);
  }

  /**
   * Generate payments for the current month from all active leases.
   */
  async generateMonthlyPayments(organizationId: string): Promise<number> {
    const activeLeases = await leaseRepository.findActive(organizationId);
    let created = 0;

    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of current month

    for (const lease of activeLeases) {
      // Check if payment already exists for this month
      const existing = await paymentRepository.findAll(organizationId, {
        leaseId: lease._id,
        dueDate: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      });

      if (existing.length === 0) {
        await paymentRepository.create({
          organizationId: lease.organizationId,
          leaseId: lease._id,
          tenantId: lease.tenantId,
          propertyId: lease.propertyId,
          amount: lease.monthlyRent,
          lateFee: 0,
          totalAmount: lease.monthlyRent,
          dueDate,
          status: 'pending',
        });
        created++;
      }
    }

    return created;
  }

  async generateLeasePayments(lease: any): Promise<any[]> {
    // Delete any existing PENDING payments for this lease
    await Payment.deleteMany({ 
      leaseId: lease._id, 
      status: 'pending',
      organizationId: lease.organizationId 
    });

    const payments: any[] = [];
    const current = new Date(lease.startDate);
    const end = new Date(lease.endDate);

    while (current <= end) {
      const dueDate = new Date(current);
      
      const payment = await Payment.create({
        leaseId: lease._id,
        tenantId: lease.tenantId,
        propertyId: lease.propertyId,
        amount: lease.monthlyRent,
        totalAmount: lease.monthlyRent,
        dueDate: dueDate,
        status: 'pending',
        organizationId: lease.organizationId,
      });
      
      payments.push(payment);
      current.setMonth(current.getMonth() + 1);
    }

    return payments;
  }
}

export const paymentService = new PaymentService();
