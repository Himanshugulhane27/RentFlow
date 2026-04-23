import apiClient from './client';
import type { ApiResponse } from '../types/api';
import type { DashboardStats, DashboardAlerts, RevenueTrendPoint, TenantRiskScore } from '../types/models';

export const dashboardApi = {
  /**
   * Get all dashboard KPI stats.
   */
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data.data!;
  },

  /**
   * Get revenue trend (monthly data).
   */
  getRevenueTrend: async (months?: number): Promise<RevenueTrendPoint[]> => {
    const res = await apiClient.get<ApiResponse<RevenueTrendPoint[]>>('/dashboard/revenue-trend', {
      params: months ? { months } : undefined,
    });
    return res.data.data!;
  },

  /**
   * Get high-risk tenants with scores.
   */
  getHighRiskTenants: async (): Promise<TenantRiskScore[]> => {
    const res = await apiClient.get<ApiResponse<TenantRiskScore[]>>('/dashboard/high-risk-tenants');
    return res.data.data!;
  },

  /**
   * Get active alerts (expiring leases + overdue payments).
   */
  getAlerts: async (): Promise<DashboardAlerts> => {
    const res = await apiClient.get<ApiResponse<DashboardAlerts>>('/dashboard/alerts');
    return res.data.data!;
  },
};
