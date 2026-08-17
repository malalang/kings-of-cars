import { z } from 'zod'

export const financeApplicationInputSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  employmentStatus: z.string().min(1),
  monthlyIncome: z.number().nonnegative().optional(),
  depositAmount: z.number().nonnegative().optional(),
  carId: z.string().uuid().optional(),
  notes: z.string().max(5000).optional(),
})

export type FinanceApplicationInput = z.infer<typeof financeApplicationInputSchema>
