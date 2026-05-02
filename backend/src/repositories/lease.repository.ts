import { Lease, LeaseDocument } from '../models/Lease.model';
import { BaseRepository } from './base.repository';
import { FilterQuery } from 'mongoose';

export class LeaseRepository extends BaseRepository<LeaseDocument> {
  constructor() {
    super(Lease);
  }

  async findPaginated(
    organizationId: string,
    options: any,
    filter: FilterQuery<LeaseDocument> = {}
  ) {
    const query = { ...filter, organizationId } as FilterQuery<LeaseDocument>;
    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .populate('tenantId', 'firstName lastName email')
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .exec(),
      this.model.countDocuments(query),
    ]);
    const totalPages = Math.ceil(total / options.limit);
    return { 
      data, 
      pagination: { 
        page: options.page, 
        limit: options.limit, 
        total, 
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      } 
    };
  }

  async findActive(organizationId: string): Promise<LeaseDocument[]> {
    return this.findAll(organizationId, { status: 'active' } as FilterQuery<LeaseDocument>);
  }

  async findByProperty(
    organizationId: string,
    propertyId: string
  ): Promise<LeaseDocument[]> {
    return this.model
      .find({ organizationId, propertyId })
      .populate('tenantId', 'firstName lastName email')
      .sort({ startDate: -1 })
      .exec();
  }

  async findByTenant(
    organizationId: string,
    tenantId: string
  ): Promise<LeaseDocument[]> {
    return this.model
      .find({ organizationId, tenantId })
      .populate('propertyId', 'address city')
      .sort({ startDate: -1 })
      .exec();
  }

  async findExpiringSoon(
    organizationId: string,
    days: number = 30
  ): Promise<LeaseDocument[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.model
      .find({
        organizationId,
        status: 'active',
        endDate: { $gte: now, $lte: futureDate },
      })
      .populate('propertyId', 'address city')
      .populate('tenantId', 'firstName lastName email')
      .sort({ endDate: 1 })
      .exec();
  }

  async findActiveForProperty(
    organizationId: string,
    propertyId: string
  ): Promise<LeaseDocument | null> {
    return this.model.findOne({
      organizationId,
      propertyId,
      status: 'active',
    });
  }

  async getMonthlyRevenue(organizationId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { organizationId, status: 'active' } },
      { $group: { _id: null, total: { $sum: '$monthlyRent' } } },
    ]);
    return result[0]?.total || 0;
  }
}

export const leaseRepository = new LeaseRepository();
