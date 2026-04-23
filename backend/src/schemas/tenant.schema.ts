import { z } from 'zod';

export const createTenantSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    dateOfBirth: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    idNumber: z.string().optional(),
    emergencyContact: z
      .object({
        name: z.string().min(1),
        phone: z.string().min(1),
        relationship: z.string().min(1),
      })
      .optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateTenantSchema = z.object({
  body: createTenantSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>['body'];
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>['body'];
