import { z } from "zod";

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
]);

export const leadInputSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  message: z.string().max(5000).optional(),
  carId: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
