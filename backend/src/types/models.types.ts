import { Types } from 'mongoose';

// ─── Role System ────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'tenant';
export type OrgPlan = 'free' | 'pro' | 'enterprise';
export type LeaseStatus = 'active' | 'expired' | 'terminated';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'upi' | 'cheque' | 'other';
export type DocumentType = 'lease_agreement' | 'id_proof' | 'receipt' | 'other';
export type AlertCategory = 'lease_expiry' | 'overdue_payment' | 'low_occupancy' | 'general';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

// ─── Organization ───────────────────────────────────────────
export interface IOrganizationSettings {
  currency: string;
  timezone: string;
  lateFeePercentage: number;
  gracePeriodDays: number;
  dateFormat: string;
}

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  plan: OrgPlan;
  settings: IOrganizationSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User ───────────────────────────────────────────────────
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: Types.ObjectId;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Property ───────────────────────────────────────────────
export interface IProperty {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'commercial' | 'other';
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
  createdAt: Date;
  updatedAt: Date;
}

// ─── Tenant ─────────────────────────────────────────────────
export interface ITenant {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  idNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  avatar?: string;
  notes?: string;
  riskScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Lease ──────────────────────────────────────────────────
export interface ILease {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  propertyId: Types.ObjectId;
  tenantId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  terms?: string;
  documents: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Payment ────────────────────────────────────────────────
export interface IPayment {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  leaseId: Types.ObjectId;
  tenantId: Types.ObjectId;
  propertyId: Types.ObjectId;
  amount: number;
  lateFee: number;
  totalAmount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Invoice ────────────────────────────────────────────────
export interface IInvoice {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  invoiceNumber: string;
  leaseId: Types.ObjectId;
  tenantId: Types.ObjectId;
  propertyId: Types.ObjectId;
  items: {
    description: string;
    amount: number;
  }[];
  subtotal: number;
  lateFee: number;
  total: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Document ───────────────────────────────────────────────
export interface IDocument {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  linkedTo: {
    model: 'Property' | 'Tenant' | 'Lease';
    id: Types.ObjectId;
  };
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Dashboard ──────────────────────────────────────────────
export interface IDashboardStats {
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

export interface ITenantRiskScore {
  tenantId: string;
  tenantName: string;
  score: number;
  label: 'low' | 'medium' | 'high';
  onTimeRate: number;
  averageDaysLate: number;
  missedPayments: number;
  totalPayments: number;
}
