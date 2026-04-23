import { tenantRepository } from '../repositories/tenant.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { CreateTenantInput, UpdateTenantInput } from '../schemas/tenant.schema';
import { PaginationQuery } from '../types/api.types';
import { ITenantRiskScore } from '../types/models.types';
import { parsePagination } from '../utils/pagination';
import { ConflictError } from '../utils/errors';
import mongoose from 'mongoose';

class TenantService {
  async getAll(organizationId: string, query: PaginationQuery) {
    const options = parsePagination(query);
    return tenantRepository.findPaginated(organizationId, options);
  }

  async getById(id: string, organizationId: string) {
    return tenantRepository.findById(id, organizationId);
  }

  async create(data: CreateTenantInput, organizationId: string) {
    // Check duplicate email within org
    const existing = await tenantRepository.findByEmail(organizationId, data.email);
    if (existing) {
      throw new ConflictError('A tenant with this email already exists');
    }

    return tenantRepository.create({
      ...data,
      organizationId: new mongoose.Types.ObjectId(organizationId),
    });
  }

  async update(id: string, organizationId: string, data: UpdateTenantInput) {
    return tenantRepository.update(id, organizationId, data);
  }

  async delete(id: string, organizationId: string) {
    return tenantRepository.delete(id, organizationId);
  }

  async search(organizationId: string, searchTerm: string) {
    return tenantRepository.search(organizationId, searchTerm);
  }

  /**
   * Calculate risk score for a tenant based on payment history.
   * Score: 0 (no risk) → 100 (high risk)
   */
  async calculateRiskScore(
    tenantId: string,
    organizationId: string
  ): Promise<ITenantRiskScore> {
    const tenant = await tenantRepository.findById(tenantId, organizationId);
    const stats = await paymentRepository.getPaymentStatsForTenant(organizationId, tenantId);

    if (stats.total === 0) {
      return {
        tenantId,
        tenantName: tenant.fullName,
        score: 0,
        label: 'low',
        onTimeRate: 100,
        averageDaysLate: 0,
        missedPayments: 0,
        totalPayments: 0,
      };
    }

    const onTimeRate = stats.total > 0 ? (stats.onTime / stats.total) * 100 : 100;

    // Weighted scoring:
    // - On-time rate (weight: 0.4) — lower rate = higher risk
    // - Average days late (weight: 0.3) — more days = higher risk
    // - Missed payment ratio (weight: 0.3) — more missed = higher risk
    const onTimeScore = (1 - onTimeRate / 100) * 40;
    const lateScore = Math.min(stats.avgDaysLate / 30, 1) * 30;
    const missedScore = stats.total > 0 ? (stats.missed / stats.total) * 30 : 0;

    const score = Math.round(onTimeScore + lateScore + missedScore);

    let label: 'low' | 'medium' | 'high' = 'low';
    if (score >= 60) label = 'high';
    else if (score >= 30) label = 'medium';

    // Persist the score
    await tenantRepository.updateRiskScore(tenantId, organizationId, score);

    return {
      tenantId,
      tenantName: tenant.fullName,
      score,
      label,
      onTimeRate: Math.round(onTimeRate),
      averageDaysLate: stats.avgDaysLate,
      missedPayments: stats.missed,
      totalPayments: stats.total,
    };
  }

  async getHighRiskTenants(organizationId: string) {
    return tenantRepository.getHighRiskTenants(organizationId);
  }
}

export const tenantService = new TenantService();
