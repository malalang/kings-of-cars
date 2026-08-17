# King of Cars

A production-oriented dealership platform inspired by the public King of Cars website and built with Next.js, Supabase, and an operational admin application.

## Monorepo

- `apps/web` — public customer website
- `apps/admin` — dealership operations/admin
- `packages/supabase` — shared Supabase client/types/server utilities

## Public experience

- Home
- Vehicles
- Vehicle details
- Sell Your Car
- Finance Solution
- Value Added Products
- Contact
- Motoring News

## Operational direction

Supabase is intended to become the source of truth for vehicles, vehicle media, leads and content. The admin application will provide authenticated CRUD and vehicle-media management.

## Source reference

The public King of Cars website is used as a customer-experience and information-architecture reference: https://www.kingofcars.co.za/

The implementation should reproduce the underlying dealership experience without copying proprietary site code or content wholesale.
