"use server";

import type { ActionResult } from "@kings-of-cars/contracts/actionResult";
import { leadInputSchema } from "@kings-of-cars/contracts/lead";
import { submitLead as submitLeadMutation } from "@kings-of-cars/supabase/Mutations/leads";

export async function submitEnquiry(formData: FormData): Promise<ActionResult> {
  const parsed = leadInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message") || undefined,
    carId: formData.get("vehicleId") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "message");
      fieldErrors[key] = [issue.message];
    }
    return {
      ok: false,
      error: "Please check your details and try again.",
      fieldErrors,
    };
  }

  try {
    await submitLeadMutation(parsed.data);
  } catch (error) {
    console.error("Failed to submit enquiry:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return {
    ok: true,
    message:
      "Thanks! We have received your enquiry and will be in touch shortly.",
  };
}
