import { z } from 'zod'

export const actionResultSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), data: z.unknown().optional() }),
  z.object({ success: z.literal(false), error: z.string() }),
])

export type ActionResult = z.infer<typeof actionResultSchema>
