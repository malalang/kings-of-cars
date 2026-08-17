import { createServerClient } from '@supabase/ssr'

type CookieStore = {
  getAll(): { name: string; value: string }[]
  setAll(cookies: { name: string; value: string; options?: Record<string, unknown> }[]): void
}

export function createClient(cookieStore: CookieStore) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookieStore.setAll(cookies),
      },
    },
  )
}
