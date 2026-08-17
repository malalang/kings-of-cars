import { z } from 'zod'

export const contactMessageInputSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  subject: z.string().min(1),
  message: z.string().min(1).max(5000),
})

export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>
