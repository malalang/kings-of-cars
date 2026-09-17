import { z } from "zod";

export const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  imageUrl: z.string().url(),
  createdAt: z.string().optional(),
});

export type GalleryType = z.infer<typeof gallerySchema>;
