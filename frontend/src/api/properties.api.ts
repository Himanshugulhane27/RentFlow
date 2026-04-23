import apiClient from './client';
import type { ApiResponse, PaginationParams, CreatePropertyRequest } from '../types/api';
import type { Property } from '../types/models';

export const propertyApi = {
  /**
   * Get paginated properties list.
   */
  getAll: async (params?: PaginationParams): Promise<ApiResponse<Property[]>> => {
    const res = await apiClient.get<ApiResponse<Property[]>>('/properties', { params });
    return res.data;
  },

  /**
   * Get a single property by ID.
   */
  getById: async (id: string): Promise<Property> => {
    const res = await apiClient.get<ApiResponse<Property>>(`/properties/${id}`);
    return res.data.data!;
  },

  /**
   * Search properties by query string.
   */
  search: async (q: string): Promise<Property[]> => {
    const res = await apiClient.get<ApiResponse<Property[]>>('/properties/search', { params: { q } });
    return res.data.data!;
  },

  /**
   * Create a new property.
   */
  create: async (data: CreatePropertyRequest): Promise<Property> => {
    const res = await apiClient.post<ApiResponse<Property>>('/properties', data);
    return res.data.data!;
  },

  /**
   * Update an existing property.
   */
  update: async (id: string, data: Partial<CreatePropertyRequest>): Promise<Property> => {
    const res = await apiClient.put<ApiResponse<Property>>(`/properties/${id}`, data);
    return res.data.data!;
  },

  /**
   * Toggle property availability.
   */
  toggleAvailability: async (id: string): Promise<Property> => {
    const res = await apiClient.patch<ApiResponse<Property>>(`/properties/${id}/toggle`);
    return res.data.data!;
  },

  /**
   * Delete a property.
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },
};
