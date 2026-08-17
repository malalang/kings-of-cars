import { z } from 'zod'

export const revalidationInputSchema = z.object({
  tags: z.array(z.string()).default([]),
  paths: z.array(z.string()).default([]),
})

export type RevalidationInput = z.infer<typeof revalidationInputSchema>
