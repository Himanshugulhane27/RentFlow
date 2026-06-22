import apiClient from './client';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import type { User } from '../types/models';

export const authApi = {
  /**
   * Register a new user + organization.
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('auth/register', data);
    return res.data.data!;
  },

  /**
   * Login with email and password.
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('auth/login', data);
    return res.data.data!;
  },

  /**
   * Refresh access token.
   */
  refreshToken: async (refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken: string } }> => {
    const res = await apiClient.post<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return res.data.data!;
  },

  /**
   * Get current user profile.
   */
  getProfile: async (): Promise<{ user: User }> => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('auth/profile');
    return res.data.data!;
  },

  /**
   * Invite a new user to the organization (admin only).
   */
  inviteUser: async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'manager' | 'tenant';
  }): Promise<{ user: User }> => {
    const res = await apiClient.post<ApiResponse<{ user: User }>>('auth/invite', data);
    return res.data.data!;
  },
};
