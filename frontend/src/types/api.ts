// ─── API Response Wrappers ──────────────────────────────────

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

// ─── Query Params ───────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// ─── Auth ───────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  phone?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: TokenPair;
}

// ─── Create/Update DTOs ─────────────────────────────────────

export interface CreatePropertyRequest {
  address: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  rent: number;
  description?: string;
  amenities?: string[];
  available?: boolean;
}

export interface CreateTenantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  idNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export interface CreateLeaseRequest {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit?: number;
  terms?: string;
}

export interface CreatePaymentRequest {
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paymentMethod?: string;
  notes?: string;
}

export interface MarkPaidRequest {
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}
