import { createSupabaseServerClient } from "./server";

export async function requireAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    throw new Error("Forbidden");
  }

  return user;
}
