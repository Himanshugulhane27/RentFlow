import { Tenant, TenantDocument } from '../models/Tenant.model';
import { BaseRepository } from './base.repository';

export class TenantRepository extends BaseRepository<TenantDocument> {
  constructor() {
    super(Tenant);
  }

  async findByEmail(
    organizationId: string,
    email: string
  ): Promise<TenantDocument | null> {
    return this.model.findOne({ organizationId, email: email.toLowerCase() });
  }

  async search(
    organizationId: string,
    searchTerm: string
  ): Promise<TenantDocument[]> {
    const regex = new RegExp(searchTerm, 'i');
    return this.model
      .find({
        organizationId,
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { phone: regex },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getHighRiskTenants(
    organizationId: string,
    threshold: number = 60
  ): Promise<TenantDocument[]> {
    return this.model
      .find({
        organizationId,
        riskScore: { $gte: threshold },
      })
      .sort({ riskScore: -1 })
      .exec();
  }

  async updateRiskScore(
    tenantId: string,
    organizationId: string,
    score: number
  ): Promise<void> {
    await this.model.updateOne(
      { _id: tenantId, organizationId },
      { $set: { riskScore: Math.round(score) } }
    );
  }
}

export const tenantRepository = new TenantRepository();
