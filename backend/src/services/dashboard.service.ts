import { propertyRepository } from '../repositories/property.repository';
import { leaseRepository } from '../repositories/lease.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { tenantRepository } from '../repositories/tenant.repository';
import { IDashboardStats, ITenantRiskScore } from '../types/models.types';
import { tenantService } from './tenant.service';

class DashboardService {
  async getStats(organizationId: string): Promise<IDashboardStats> {
    const [propertyStats, activeLeases, expiringLeases, totalTenants] = await Promise.all([
      propertyRepository.getStats(organizationId),
      leaseRepository.findActive(organizationId),
      leaseRepository.findExpiringSoon(organizationId, 30),
      tenantRepository.count(organizationId),
    ]);

    const monthlyRevenue = activeLeases.reduce((sum, l) => sum + l.monthlyRent, 0);

    // Get overdue payments
    const overduePayments = await paymentRepository.findOverdue(organizationId);
    const overdueAmount = overduePayments.reduce((sum, p) => sum + p.totalAmount, 0);

    // Get pending payments
    const pendingPayments = await paymentRepository.findPending(organizationId);

    // Revenue growth: compare this month vs last month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      paymentRepository.getTotalRevenue(organizationId, thisMonthStart, now),
      paymentRepository.getTotalRevenue(organizationId, lastMonthStart, lastMonthEnd),
    ]);

    const revenueGrowth = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    const occupancyRate = propertyStats.total > 0
      ? Math.round((propertyStats.occupied / propertyStats.total) * 100)
      : 0;

    return {
      totalProperties: propertyStats.total,
      occupiedProperties: propertyStats.occupied,
      availableProperties: propertyStats.available,
      occupancyRate,
      totalTenants,
      activeLeases: activeLeases.length,
      expiringLeases: expiringLeases.length,
      totalRevenue: await paymentRepository.getTotalRevenue(organizationId),
      monthlyRevenue,
      pendingPayments: pendingPayments.length,
      overduePayments: overduePayments.length,
      overdueAmount,
      revenueGrowth,
      expectedNextRevenue: monthlyRevenue,
    };
  }

  async getRevenueTrend(organizationId: string, months: number = 12) {
    return paymentRepository.getMonthlyRevenueTrend(organizationId, months);
  }

  async getHighRiskTenants(organizationId: string): Promise<ITenantRiskScore[]> {
    const tenants = await tenantRepository.getHighRiskTenants(organizationId);
    const scores: ITenantRiskScore[] = [];

    for (const tenant of tenants) {
      const score = await tenantService.calculateRiskScore(
        tenant._id.toString(),
        organizationId
      );
      scores.push(score);
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  async getExpiringLeases(organizationId: string, days: number = 30) {
    return leaseRepository.findExpiringSoon(organizationId, days);
  }

  async getOverduePayments(organizationId: string) {
    return paymentRepository.findOverdue(organizationId);
  }
}

export const dashboardService = new DashboardService();
