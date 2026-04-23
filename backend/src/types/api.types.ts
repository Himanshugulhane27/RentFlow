import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRole } from './models.types';

// ─── Authenticated Request ──────────────────────────────────
export interface AuthPayload {
  userId: string;
  organizationId: string;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}

// ─── API Response ───────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// ─── Token Pair ─────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
