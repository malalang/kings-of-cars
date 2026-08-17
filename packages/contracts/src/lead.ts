import { z } from 'zod'

export const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'won', 'lost'])

export const leadInputSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  carId: z.string().uuid().optional(),
  source: z.string().min(1),
  message: z.string().max(5000).optional(),
  status: leadStatusSchema.default('new'),
})

export type LeadInput = z.infer<typeof leadInputSchema>
export type LeadStatus = z.infer<typeof leadStatusSchema>
