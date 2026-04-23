import apiClient from './client';
import type { ApiResponse, PaginationParams, CreatePaymentRequest, MarkPaidRequest } from '../types/api';
import type { Payment, RevenueTrendPoint } from '../types/models';

export const paymentApi = {
  /**
   * Get paginated payments list.
   */
  getAll: async (params?: PaginationParams): Promise<ApiResponse<Payment[]>> => {
    const res = await apiClient.get<ApiResponse<Payment[]>>('/payments', { params });
    return res.data;
  },

  /**
   * Get a single payment by ID.
   */
  getById: async (id: string): Promise<Payment> => {
    const res = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return res.data.data!;
  },

  /**
   * Create a new payment record.
   */
  create: async (data: CreatePaymentRequest): Promise<Payment> => {
    const res = await apiClient.post<ApiResponse<Payment>>('/payments', data);
    return res.data.data!;
  },

  /**
   * Mark a payment as paid.
   */
  markPaid: async (id: string, data: MarkPaidRequest): Promise<Payment> => {
    const res = await apiClient.patch<ApiResponse<Payment>>(`/payments/${id}/pay`, data);
    return res.data.data!;
  },

  /**
   * Delete a payment record.
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
  },

  /**
   * Get all overdue payments.
   */
  getOverdue: async (): Promise<Payment[]> => {
    const res = await apiClient.get<ApiResponse<Payment[]>>('/payments/overdue');
    return res.data.data!;
  },

  /**
   * Get payments for a specific tenant.
   */
  getByTenant: async (tenantId: string): Promise<Payment[]> => {
    const res = await apiClient.get<ApiResponse<Payment[]>>(`/payments/tenant/${tenantId}`);
    return res.data.data!;
  },

  /**
   * Get revenue trend data (monthly).
   */
  getRevenueTrend: async (months?: number): Promise<RevenueTrendPoint[]> => {
    const res = await apiClient.get<ApiResponse<RevenueTrendPoint[]>>('/payments/revenue-trend', {
      params: months ? { months } : undefined,
    });
    return res.data.data!;
  },

  /**
   * Auto-generate monthly payments from active leases (admin only).
   */
  generateMonthly: async (): Promise<{ generated: number }> => {
    const res = await apiClient.post<ApiResponse<{ generated: number }>>('/payments/generate-monthly');
    return res.data.data!;
  },
};
