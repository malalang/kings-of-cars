import { z } from "zod";

export const actionErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});

export const actionSuccessSchema = z.object({
  ok: z.literal(true),
  message: z.string().optional(),
  data: z.unknown().optional(),
  revalidate: z
    .object({
      paths: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

export type ActionError = z.infer<typeof actionErrorSchema>;
export type ActionSuccess = z.infer<typeof actionSuccessSchema>;

export type ActionResult<TData = undefined> =
  | {
      ok: true;
      data?: TData;
      message?: string;
      revalidate?: {
        paths?: string[];
        tags?: string[];
      };
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
