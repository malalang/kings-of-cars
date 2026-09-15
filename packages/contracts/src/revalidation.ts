import { z } from "zod";

export const revalidationModeSchema = z.enum(["max", "immediate"]);
export type RevalidationMode = z.infer<typeof revalidationModeSchema>;

export const revalidationPayloadSchema = z.object({
  tags: z.array(z.string()).optional(),
  paths: z.array(z.string()).optional(),
  tag: z.string().optional(),
  path: z.string().optional(),
  mode: revalidationModeSchema.optional(),
});

export type RevalidationPayload = z.infer<typeof revalidationPayloadSchema>;
export type RevalidationRequest = RevalidationPayload;
