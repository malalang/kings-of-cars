import { z } from 'zod'

export const vehicleMediaInputSchema = z.object({
  carId: z.string().uuid(),
  imageUrl: z.string().url(),
  altText: z.string().max(250).optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
})

export type VehicleMediaInput = z.infer<typeof vehicleMediaInputSchema>
