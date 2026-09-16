import { z } from "zod";

export const actionErrorSchema = z.object({
  message: z.string(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});

export const actionSuccessSchema = z.object({
  message: z.string().optional(),
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
