import apiClient from './client';
import type { ApiResponse, PaginationParams, CreateLeaseRequest } from '../types/api';
import type { Lease } from '../types/models';

export const leaseApi = {
  /**
   * Get paginated leases list.
   */
  getAll: async (params?: PaginationParams): Promise<ApiResponse<Lease[]>> => {
    const res = await apiClient.get<ApiResponse<Lease[]>>('leases', { params });
    return res.data;
  },

  /**
   * Get a single lease by ID.
   */
  getById: async (id: string): Promise<Lease> => {
    const res = await apiClient.get<ApiResponse<Lease>>(`leases/${id}`);
    return res.data.data!;
  },

  /**
   * Create a new lease.
   */
  create: async (data: CreateLeaseRequest): Promise<Lease> => {
    const res = await apiClient.post<ApiResponse<Lease>>('leases', data);
    return res.data.data!;
  },

  /**
   * Update an existing lease.
   */
  update: async (id: string, data: Partial<CreateLeaseRequest>): Promise<Lease> => {
    const res = await apiClient.put<ApiResponse<Lease>>(`leases/${id}`, data);
    return res.data.data!;
  },

  /**
   * Terminate an active lease.
   */
  terminate: async (id: string): Promise<Lease> => {
    const res = await apiClient.patch<ApiResponse<Lease>>(`leases/${id}/terminate`);
    return res.data.data!;
  },

  /**
   * Renew a lease with a new end date.
   */
  renew: async (id: string, newEndDate: string): Promise<Lease> => {
    const res = await apiClient.patch<ApiResponse<Lease>>(`leases/${id}/renew`, { newEndDate });
    return res.data.data!;
  },

  /**
   * Get leases expiring soon.
   */
  getExpiring: async (days?: number): Promise<Lease[]> => {
    const res = await apiClient.get<ApiResponse<Lease[]>>('leases/expiring', {
      params: days ? { days } : undefined,
    });
    return res.data.data!;
  },
};
