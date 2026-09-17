import type { LeadInput } from "@kings-of-cars/contracts/lead";
import { createSupabasePublicClient } from "../server";

// Public-facing insert for the sell-your-car enquiry form on the client
// website. Auth is intentionally omitted because this is an unauthenticated
// public lead submission from apps/client/app/sell-your-car.
export async function submitLead(input: LeadInput) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("KingsOfCars_leads")
    .insert({
      vehicle_id: input.carId ?? null,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message ?? null,
      source: "website",
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Unable to submit enquiry: ${error.message}`);
  }

  return data;
}
