import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  createdAt: z.string().optional(),
});

export type ContactType = z.infer<typeof contactSchema>;
