import { z } from "zod";

export const carStatusSchema = z.enum([
  "draft",
  "published",
  "reserved",
  "sold",
]);

export const carInputSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  price: z.number().nonnegative(),
  mileage: z.number().int().nonnegative(),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  color: z.string().optional(),
  imageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).max(50).default([]),
  status: carStatusSchema.default("draft"),
});

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  stockNumber: z.string().nullable().optional(),
  slug: z.string(),
  make: z.string(),
  model: z.string(),
  variant: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  mileage: z.number().int().nullable().optional(),
  price: z.number().nullable().optional(),
  monthlyPayment: z.number().nullable().optional(),
  bodyType: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  fuelType: z.string().nullable().optional(),
  colour: z.string().nullable().optional(),
  engineSize: z.string().nullable().optional(),
  powerKw: z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  features: z.array(z.string()).default([]),
  healthCheck: z.record(z.string(), z.unknown()).default({}),
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).default([]),
  status: z.string(),
  featured: z.boolean().default(false),
  sourceUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export type CarInput = z.infer<typeof carInputSchema>;
export type CarStatus = z.infer<typeof carStatusSchema>;
