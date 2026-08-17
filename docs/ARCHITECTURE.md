# King of Cars Architecture

## Purpose

This repository follows the Malalang Engineering Blueprint while remaining an independent King of Cars product. It owns its own deployment, database, branding, business logic, content and environment variables.

## Repository structure

```text
apps/
  client/                 # canonical public website
  admin/                  # authenticated dealership operations

packages/
  contracts/              # application contracts and runtime validation
  supabase/                # database clients, types, cache, queries, mutations
  config/                  # shared tooling configuration

scripts/
docs/
```

The current public app exists under `apps/web` as a transitional migration location. New architecture work should target `apps/client`; `apps/web` should not receive new business logic once migration starts.

## Public client rules

`apps/client` is a public server-rendered website.

- Server pages by default.
- Server-side data fetching.
- Client components only for interactive islands and browser-only behavior.
- No public browser-side Supabase database writes by default.
- Public forms submit through validated server actions or secure route handlers.
- Public cache invalidation is triggered by the admin workflow.

Preferred flow:

```text
Server page
  -> small client form island when needed
  -> validated server action
  -> Supabase mutation
  -> typed action result
  -> admin/public revalidation
```

## Data ownership

### Supabase

Supabase is the source of truth for dealership data:

- cars
- vehicle media
- leads
- finance applications
- articles / motoring news
- reviews
- testimonials
- profiles / permissions
- dealership content

### Contracts

`packages/contracts` owns application payloads and runtime validation. It does not own generated database types.

### Generated database types

Generated Supabase types live only in:

```text
packages/supabase/src/supabaseType.ts
```

## Supabase package

The package follows explicit entry points and no barrel exports:

```text
packages/supabase/
  src/
    client.ts
    server.ts
    middleware.ts
    cache.ts
    supabaseType.ts
    Queries/
    Mutations/
```

Queries are read-only. Mutations create/update/delete data. Low-level mutations do not contain public revalidation logic.

## Contracts package

Use explicit domain files instead of generic type buckets:

```text
packages/contracts/src/
  actionResult.ts
  car.ts
  contact.ts
  finance.ts
  lead.ts
  media.ts
  revalidation.ts
  env.ts
```

Use Zod for runtime validation of forms, server actions, route handlers, API payloads, mutation inputs, search parameters and environment variables. Infer TypeScript types from Zod schemas rather than duplicating manual types.

## Naming

Application and contract shapes use camelCase:

```text
fullName
createdAt
vehicleId
imageUrl
```

Snake case is restricted to SQL migrations, raw SQL, external payload boundaries, generated code and other documented legacy boundaries. Do not hide schema drift with compatibility aliases.

## Package boundaries

Prefer explicit package exports such as:

```text
@kings-of-cars/contracts/car
@kings-of-cars/contracts/lead
@kings-of-cars/supabase/server
@kings-of-cars/supabase/Queries/cars
@kings-of-cars/supabase/Mutations/cars
```

Do not create barrel `index.ts` files solely for re-exporting modules.

## Revalidation

Separate business mutation, admin workflow and public cache invalidation.

Target flow:

```text
Admin mutation
   -> Supabase mutation
   -> admin revalidation
   -> public revalidation endpoint
   -> revalidateTag / revalidatePath
```

Public revalidation contracts belong in `packages/contracts/src/revalidation.ts`.

## Dealership domain

The first-class vehicle domain should support:

```text
car
  identity
  pricing
  mileage
  specifications
  availability
  overview
  features
  health
  review
  media
```

Customer workflows:

```text
vehicle enquiry
finance application
sell-your-car enquiry
contact enquiry
```

Operational workflows:

```text
inventory CRUD
vehicle media management
lead management
finance management
motoring news/content management
reviews/testimonials
user roles and permissions
```

## Security

- Never expose service-role credentials to the browser.
- Keep privileged Supabase operations server-side.
- Authenticate admin routes through Supabase Auth.
- Authorize admin operations through profile/role permissions rather than email-only checks.
- Validate every public and admin mutation payload at its boundary.

## Validation

Vercel is the deployment source of truth. The implementation workflow is:

```text
implement
commit
push
inspect deployment
read logs
fix
redeploy
verify
```

A feature is not considered complete merely because its GitHub commit exists; the relevant Vercel deployment must succeed and the affected user flow must be manually verified after deployment.

## King of Cars public information architecture

The live King of Cars site is the reference for customer journeys:

```text
Home
Vehicles
Sell Your Car
Finance Solution
Value Added Products
Contact Us
Motoring News
```

The new application may improve the UX while preserving these core dealership journeys.
