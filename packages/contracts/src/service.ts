import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.string().optional(),
});

export type ServiceType = z.infer<typeof serviceSchema>;
