import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    address: z.string().min(1, 'Address is required').max(200),
    unit: z.string().max(20).optional(),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(50),
    zipCode: z.string().min(1, 'Zip code is required').max(10),
    propertyType: z.enum(['apartment', 'house', 'condo', 'commercial', 'other']).default('apartment'),
    bedrooms: z.number().int().min(0).max(20),
    bathrooms: z.number().int().min(0).max(20),
    squareFeet: z.number().min(0).optional(),
    rent: z.number().min(0, 'Rent must be positive'),
    description: z.string().max(2000).optional(),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    available: z.boolean().default(true),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: createPropertySchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>['body'];
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>['body'];
