import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    leaseId: z.string().min(1, 'Lease is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    propertyId: z.string().min(1, 'Property is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    dueDate: z.string().min(1, 'Due date is required'),
    paymentMethod: z.enum(['cash', 'bank_transfer', 'card', 'upi', 'cheque', 'other']).optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'paid', 'overdue', 'partial', 'cancelled']).optional(),
    paymentMethod: z.enum(['cash', 'bank_transfer', 'card', 'upi', 'cheque', 'other']).optional(),
    paidDate: z.string().optional(),
    transactionId: z.string().optional(),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const markPaidSchema = z.object({
  body: z.object({
    paymentMethod: z.enum(['cash', 'bank_transfer', 'card', 'upi', 'cheque', 'other']),
    transactionId: z.string().optional(),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>['body'];
export type MarkPaidInput = z.infer<typeof markPaidSchema>['body'];
