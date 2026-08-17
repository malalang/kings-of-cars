# King of Cars

A production-oriented dealership platform built as an independent Malalang-managed monorepo, using Next.js, Supabase and Vercel.

## Monorepo

- `apps/client` — public server-rendered customer website (canonical)
- `apps/admin` — authenticated dealership operations
- `packages/contracts` — shared application contracts and runtime validation
- `packages/supabase` — Supabase client/server/cache/types, queries and mutations
- `packages/config` — shared tooling configuration
- `docs` — architecture and engineering documentation

## Public experience

- Home
- Vehicles
- Vehicle details
- Sell Your Car
- Finance Solution
- Value Added Products
- Contact
- Motoring News

## Architecture principles

Supabase is the operational source of truth for vehicles, media, leads and content. Public routes are server-rendered by default. Public form submissions use validated server actions or secure route handlers; browser-side Supabase database writes are not the default pattern.

Shared application contracts live in `packages/contracts`. Generated database types live only in `packages/supabase/src/supabaseType.ts`. Reusable reads and writes live in `packages/supabase/src/Queries` and `packages/supabase/src/Mutations`.

Application data shapes use camelCase. SQL/legacy snake_case is isolated to explicit boundaries.

## King of Cars source reference

The public King of Cars website is used as the customer-experience and information-architecture reference:

https://www.kingofcars.co.za/

The implementation is an independent application and does not copy proprietary site code or content wholesale.
