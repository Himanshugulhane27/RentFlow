import apiClient from './client';
import type { ApiResponse, PaginationParams, CreateTenantRequest } from '../types/api';
import type { Tenant, TenantRiskScore } from '../types/models';

export const tenantApi = {
  /**
   * Get paginated tenants list.
   */
  getAll: async (params?: PaginationParams): Promise<ApiResponse<Tenant[]>> => {
    const res = await apiClient.get<ApiResponse<Tenant[]>>('/tenants', { params });
    return res.data;
  },

  /**
   * Get a single tenant by ID.
   */
  getById: async (id: string): Promise<Tenant> => {
    const res = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return res.data.data!;
  },

  /**
   * Create a new tenant.
   */
  create: async (data: CreateTenantRequest): Promise<Tenant> => {
    const res = await apiClient.post<ApiResponse<Tenant>>('/tenants', data);
    return res.data.data!;
  },

  /**
   * Update an existing tenant.
   */
  update: async (id: string, data: Partial<CreateTenantRequest>): Promise<Tenant> => {
    const res = await apiClient.put<ApiResponse<Tenant>>(`/tenants/${id}`, data);
    return res.data.data!;
  },

  /**
   * Delete a tenant.
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
  },

  /**
   * Get risk score for a specific tenant.
   */
  getRiskScore: async (id: string): Promise<TenantRiskScore> => {
    const res = await apiClient.get<ApiResponse<TenantRiskScore>>(`/tenants/${id}/risk-score`);
    return res.data.data!;
  },

  /**
   * Get all high-risk tenants.
   */
  getHighRisk: async (): Promise<Tenant[]> => {
    const res = await apiClient.get<ApiResponse<Tenant[]>>('/tenants/high-risk');
    return res.data.data!;
  },
};
