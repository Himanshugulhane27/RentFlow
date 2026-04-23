export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Property Manager',
  tenant: 'Tenant',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'success',
  expired: 'danger',
  terminated: 'danger',
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  partial: 'warning',
  cancelled: 'surface',
};

export const PROPERTY_TYPES: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  condo: 'Condo',
  commercial: 'Commercial',
  other: 'Other',
};

export const PAYMENT_METHODS: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  upi: 'UPI',
  cheque: 'Cheque',
  other: 'Other',
};
