import { z } from 'zod';

export const createLeaseSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, 'Property is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    monthlyRent: z.number().min(0, 'Monthly rent must be positive'),
    securityDeposit: z.number().min(0).default(0),
    terms: z.string().max(5000).optional(),
  }),
});

export const updateLeaseSchema = z.object({
  body: z.object({
    endDate: z.string().optional(),
    monthlyRent: z.number().min(0).optional(),
    status: z.enum(['active', 'expired', 'terminated']).optional(),
    terms: z.string().max(5000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateLeaseInput = z.infer<typeof createLeaseSchema>['body'];
export type UpdateLeaseInput = z.infer<typeof updateLeaseSchema>['body'];
