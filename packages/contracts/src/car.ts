import { z } from 'zod'

export const carStatusSchema = z.enum(['draft', 'published', 'reserved', 'sold'])

export const carInputSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  price: z.number().nonnegative(),
  mileage: z.number().int().nonnegative(),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  color: z.string().optional(),
  imageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).max(50).default([]),
  status: carStatusSchema.default('draft'),
})

export type CarInput = z.infer<typeof carInputSchema>
export type CarStatus = z.infer<typeof carStatusSchema>
