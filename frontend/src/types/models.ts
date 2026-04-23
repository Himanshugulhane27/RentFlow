// ─── Roles & Enums ──────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'tenant';
export type OrgPlan = 'free' | 'pro' | 'enterprise';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'upi' | 'cheque' | 'other';
export type PropertyType = 'apartment' | 'house' | 'condo' | 'commercial' | 'other';

// ─── User ───────────────────────────────────────────────────
export interface User {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Organization ───────────────────────────────────────────
export interface OrganizationSettings {
  currency: string;
  timezone: string;
  lateFeePercentage: number;
  gracePeriodDays: number;
  dateFormat: string;
}

export interface Organization {
  _id: string;
  id: string;
  name: string;
  slug: string;
  plan: OrgPlan;
  settings: OrganizationSettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Property ───────────────────────────────────────────────
export interface Property {
  _id: string;
  id: string;
  organizationId: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  rent: number;
  description?: string;
  amenities: string[];
  images: string[];
  available: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Tenant ─────────────────────────────────────────────────
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Tenant {
  _id: string;
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  idNumber?: string;
  emergencyContact?: EmergencyContact;
  avatar?: string;
  notes?: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Lease ──────────────────────────────────────────────────
export interface Lease {
  _id: string;
  id: string;
  organizationId: string;
  propertyId: string | Property;
  tenantId: string | Tenant;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  terms?: string;
  documents: string[];
  isActive: boolean;
  durationMonths: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ────────────────────────────────────────────────
export interface Payment {
  _id: string;
  id: string;
  organizationId: string;
  leaseId: string | Lease;
  tenantId: string | Tenant;
  propertyId: string | Property;
  amount: number;
  lateFee: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  notes?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ──────────────────────────────────────────────
export interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  availableProperties: number;
  occupancyRate: number;
  totalTenants: number;
  activeLeases: number;
  expiringLeases: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  overdueAmount: number;
  revenueGrowth: number;
  expectedNextRevenue: number;
}

export interface TenantRiskScore {
  tenantId: string;
  tenantName: string;
  score: number;
  label: 'low' | 'medium' | 'high';
  onTimeRate: number;
  averageDaysLate: number;
  missedPayments: number;
  totalPayments: number;
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
}

export interface DashboardAlerts {
  expiringLeases: Lease[];
  overduePayments: Payment[];
  totalAlerts: number;
}
