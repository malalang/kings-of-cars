This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.github/workflows/sync-kings-of-cars.yml
.github/workflows/sync-live-pages-once.yml
.gitignore
apps/admin/.gitignore
apps/admin/app/globals.css
apps/admin/app/layout.tsx
apps/admin/app/page.tsx
apps/admin/next-env.d.ts
apps/admin/next.config.ts
apps/admin/package.json
apps/admin/tsconfig.json
apps/client/.gitignore
apps/client/app/_lib/cached-public-data.ts
apps/client/app/actions.ts
apps/client/app/api/revalidate/route.ts
apps/client/app/articles/page.tsx
apps/client/app/cars.css
apps/client/app/cars/[slug]/page.tsx
apps/client/app/cars/cars-page.css
apps/client/app/cars/page.tsx
apps/client/app/contact/page.tsx
apps/client/app/finance/page.tsx
apps/client/app/globals.css
apps/client/app/layout.tsx
apps/client/app/page.tsx
apps/client/app/sell-your-car/page.tsx
apps/client/app/value-added-products/page.tsx
apps/client/components/cars-sort.tsx
apps/client/components/enquire-form.css
apps/client/components/enquire-form.tsx
apps/client/components/site-header.tsx
apps/client/components/vehicle-gallery.tsx
apps/client/components/whatsapp-float.tsx
apps/client/next-env.d.ts
apps/client/next.config.ts
apps/client/package.json
apps/client/public/HeroSection.png
apps/client/public/images/home/branch-premium.png
apps/client/public/images/home/branch-trichardts.png
apps/client/public/images/home/cta-all-vehicles.jpg
apps/client/public/images/home/cta-finance.jpg
apps/client/public/images/home/cta-sell-your-car.jpg
apps/client/public/images/home/cta-value-added-products.jpg
apps/client/public/images/home/intro-contact-us.jpg
apps/client/public/images/home/intro-preowned-premium.jpg
apps/client/public/images/home/intro-preowned-trichardts.jpg
apps/client/public/images/home/intro-sell-your-car.jpg
apps/client/public/logo.png
apps/client/tsconfig.json
biome.json
docs/ARCHITECTURE.md
package.json
packages/contracts/package.json
packages/contracts/src/actionResult.ts
packages/contracts/src/business.ts
packages/contracts/src/car.ts
packages/contracts/src/contact.ts
packages/contracts/src/env.ts
packages/contracts/src/gallery.ts
packages/contracts/src/lead.ts
packages/contracts/src/revalidation.ts
packages/contracts/src/service.ts
packages/contracts/tsconfig.json
packages/supabase/package.json
packages/supabase/sql/001_kings_of_cars_schema.sql
packages/supabase/src/auth.ts
packages/supabase/src/cache.ts
packages/supabase/src/client.ts
packages/supabase/src/Mutations/leads.ts
packages/supabase/src/Queries/cars.ts
packages/supabase/src/server.ts
packages/supabase/src/supabaseType.ts
packages/supabase/tsconfig.json
pnpm-workspace.yaml
README.md
scripts/import-kingofcars-batch.mjs
scripts/lib/kingofcars-engine-api-v2.mjs
scripts/lib/kingofcars-engine-api.mjs
scripts/normalize-kingofcars-poa.mjs
scripts/seed-kingofcars-batch-1.mjs
scripts/sync-kings-of-cars-live-pages.mjs
scripts/sync-kings-of-cars-v2.mjs
scripts/verify-kings-of-cars-inventory.mjs
turbo.json
```

# Files

## File: apps/admin/next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
````

## File: docs/ARCHITECTURE.md
````markdown
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
````

## File: packages/supabase/sql/001_kings_of_cars_schema.sql
````sql
-- King of Cars schema for Supabase project: srlnoxhqudgvskntekze (phb)
-- Canonical table naming requested for this product: KingsOfCars_*

create extension if not exists pgcrypto;

create table if not exists public."KingsOfCars_vehicles" (
  id uuid primary key default gen_random_uuid(), stock_number text unique, slug text unique not null,
  make text not null, model text not null, variant text, year integer, mileage integer,
  price numeric(12,2), monthly_payment numeric(12,2), body_type text, transmission text,
  fuel_type text, colour text, engine_size text, power_kw integer, description text, overview text,
  features text[] default '{}', health_check jsonb default '{}'::jsonb, image_url text,
  gallery_urls text[] default '{}', status text not null default 'available' check (status in ('available','reserved','sold','archived')),
  featured boolean not null default false, source_url text, source_updated_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_vehicle_images" (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid not null references public."KingsOfCars_vehicles"(id) on delete cascade,
  image_url text not null, sort_order integer not null default 0, is_primary boolean not null default false,
  alt_text text, created_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_leads" (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid references public."KingsOfCars_vehicles"(id) on delete set null,
  name text not null, email text, phone text, message text, source text not null default 'website',
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_finance_applications" (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid references public."KingsOfCars_vehicles"(id) on delete set null,
  first_name text not null, last_name text not null, email text, phone text not null,
  employment_status text, gross_income numeric(12,2), deposit numeric(12,2), notes text,
  status text not null default 'new' check (status in ('new','reviewing','approved','declined','closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_articles" (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  excerpt text, content text, image_url text, published boolean not null default false,
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_testimonials" (
  id uuid primary key default gen_random_uuid(), author text not null, rating integer not null default 5 check (rating between 1 and 5),
  content text not null, published boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public."KingsOfCars_branches" (
  id uuid primary key default gen_random_uuid(), name text not null, address text, city text, province text,
  phone text, email text, latitude numeric(10,7), longitude numeric(10,7), opening_hours jsonb default '{}'::jsonb,
  active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index if not exists "KingsOfCars_vehicles_status_idx" on public."KingsOfCars_vehicles" (status);
create index if not exists "KingsOfCars_vehicles_make_idx" on public."KingsOfCars_vehicles" (make);
create index if not exists "KingsOfCars_vehicles_price_idx" on public."KingsOfCars_vehicles" (price);
create index if not exists "KingsOfCars_vehicle_images_vehicle_idx" on public."KingsOfCars_vehicle_images" (vehicle_id, sort_order);

alter table public."KingsOfCars_vehicles" enable row level security;
alter table public."KingsOfCars_vehicle_images" enable row level security;
alter table public."KingsOfCars_articles" enable row level security;
alter table public."KingsOfCars_testimonials" enable row level security;
alter table public."KingsOfCars_branches" enable row level security;
alter table public."KingsOfCars_leads" enable row level security;
alter table public."KingsOfCars_finance_applications" enable row level security;

create policy "KingsOfCars public read available vehicles" on public."KingsOfCars_vehicles" for select to anon, authenticated using (status = 'available');
create policy "KingsOfCars public read vehicle images" on public."KingsOfCars_vehicle_images" for select to anon, authenticated using (exists (select 1 from public."KingsOfCars_vehicles" v where v.id = vehicle_id and v.status = 'available'));
create policy "KingsOfCars public read published articles" on public."KingsOfCars_articles" for select to anon, authenticated using (published = true);
create policy "KingsOfCars public read testimonials" on public."KingsOfCars_testimonials" for select to anon, authenticated using (published = true);
create policy "KingsOfCars public read branches" on public."KingsOfCars_branches" for select to anon, authenticated using (active = true);
create policy "KingsOfCars public submit leads" on public."KingsOfCars_leads" for insert to anon, authenticated with check (source = 'website');
create policy "KingsOfCars public submit finance" on public."KingsOfCars_finance_applications" for insert to anon, authenticated with check (true);
````

## File: README.md
````markdown
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
````

## File: .github/workflows/sync-live-pages-once.yml
````yaml
name: One-time King of Cars live-page enrichment

on:
  push:
    branches: [main]
    paths:
      - '.github/workflows/sync-live-pages-once.yml'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  enrich-live-pages:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install --no-audit --no-fund

      - name: Enrich existing available vehicles from live King of Cars pages
        env:
          SUPABASE_URL: ${{ secrets.KINGS_OF_CARS_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.KINGS_OF_CARS_SUPABASE_SERVICE_ROLE_KEY }}
          KINGS_OF_CARS_LIVE_CONCURRENCY: 4
          KINGS_OF_CARS_MIN_SYNC_ROWS: 50
        run: npm run sync:live-pages

      - name: Verify live enrichment fields
        env:
          SUPABASE_URL: ${{ secrets.KINGS_OF_CARS_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.KINGS_OF_CARS_SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          node --input-type=module <<'NODE'
          import { createClient } from '@supabase/supabase-js'
          const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
          const { data, error } = await supabase.from('KingsOfCars_vehicles').select('id,fuel_type,transmission,body_type,image_url,source_url').eq('status','available')
          if (error) throw error
          const rows = data ?? []
          const missing = {
            fuel_type: rows.filter(r => !r.fuel_type).length,
            transmission: rows.filter(r => !r.transmission).length,
            body_type: rows.filter(r => !r.body_type).length,
            image_url: rows.filter(r => !r.image_url).length,
            source_url: rows.filter(r => !r.source_url).length,
          }
          console.log(JSON.stringify({ available: rows.length, missing }, null, 2))
          if (missing.fuel_type || missing.transmission || missing.body_type || missing.source_url) process.exit(1)
          NODE
````

## File: .gitignore
````
node_modules/
.next/
.turbo/
dist/
build/
*.tsbuildinfo
coverage/
.DS_Store
*.log
.env*
!.env.example
````

## File: apps/admin/.gitignore
````
.vercel
.env*
````

## File: apps/admin/app/globals.css
````css
:root {
  --red: #b10f1b;
  --ink: #18212b;
  --paper: #f5f4f1;
  --line: #dde0e3;
  --muted: #737b84;
}
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--paper);
  color: var(--ink);
}
a {
  text-decoration: none;
  color: inherit;
}
.admin-shell {
  min-height: 100vh;
}
.admin-topbar {
  height: 68px;
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px;
}
.admin-brand {
  font-weight: 900;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
.admin-brand span {
  color: #e33a48;
}
.admin-nav {
  display: flex;
  gap: 18px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.admin-main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 34px 24px 60px;
}
.page-title {
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.04em;
}
.page-copy {
  margin-top: 8px;
  color: var(--muted);
  max-width: 650px;
  line-height: 1.7;
  font-size: 13px;
}
.admin-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}
.admin-card {
  background: #fff;
  border: 1px solid var(--line);
  padding: 22px;
}
.admin-card h2 {
  margin: 0;
  font-size: 15px;
}
.admin-card p {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}
.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--red);
}
@media (max-width: 800px) {
  .admin-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 560px) {
  .admin-topbar {
    padding: 0 16px;
  }
  .admin-nav {
    display: none;
  }
  .admin-main {
    padding: 24px 16px;
  }
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
````

## File: apps/admin/app/layout.tsx
````typescript
import "./globals.css";

export const metadata = { title: "King of Cars Admin" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
````

## File: apps/admin/app/page.tsx
````typescript
import {
  ArrowRight,
  CarFront,
  FileText,
  Handshake,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

const areas: Array<[string, string, string, typeof CarFront]> = [
  [
    "Inventory",
    "Manage vehicles, prices, mileage, specifications and media.",
    "/inventory",
    CarFront,
  ],
  [
    "Leads",
    "Manage vehicle enquiries, finance leads and customer conversations.",
    "/leads",
    Handshake,
  ],
  [
    "Content",
    "Manage articles, reviews, testimonials and dealership content.",
    "/content",
    FileText,
  ],
];

export default function AdminHome() {
  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-brand">
          King <span>of</span> Cars · Admin
        </div>
        <nav className="admin-nav">
          <Link href="/">Dashboard</Link>
          <Link href="/inventory">Inventory</Link>
          <Link href="/leads">Leads</Link>
        </nav>
      </header>
      <div className="admin-main">
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color: "var(--red)",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            <LayoutDashboard size={14} /> Operations
          </div>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            King of Cars dashboard
          </h1>
          <p className="page-copy">
            The operational foundation for vehicle inventory, customer leads and
            dealership content. Supabase will become the source of truth for
            every public record.
          </p>
        </div>
        <div className="admin-grid">
          {areas.map(([title, copy, href, Icon]) => (
            <section className="admin-card" key={title}>
              <Icon size={24} color="var(--red)" />
              <h2 style={{ marginTop: 20 }}>{title}</h2>
              <p>{copy}</p>
              <Link className="admin-link" href={href as string}>
                Open {title} <ArrowRight size={13} />
              </Link>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
````

## File: apps/admin/next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = { reactStrictMode: true };
export default nextConfig;
````

## File: apps/admin/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
````

## File: apps/client/.gitignore
````
.vercel
.env*
````

## File: apps/client/app/_lib/cached-public-data.ts
````typescript
import { CACHE_TAGS } from "@kings-of-cars/supabase/cache";
import { getCarBySlug, getCars } from "@kings-of-cars/supabase/Queries/cars";
import { unstable_cache } from "next/cache";

export const getCachedCars = async () =>
  unstable_cache(async () => getCars(), ["cars"], {
    tags: [CACHE_TAGS.cars],
  })();

export const getCachedCarBySlug = async (slug: string) =>
  unstable_cache(async () => getCarBySlug(slug), [`car-${slug}`], {
    tags: [CACHE_TAGS.cars],
  })();
````

## File: apps/client/app/actions.ts
````typescript
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
````

## File: apps/client/app/api/revalidate/route.ts
````typescript
import { revalidationPayloadSchema } from "@kings-of-cars/contracts/revalidation";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = revalidationPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { tags, paths, tag, path, mode } = parsed.data;

  for (const value of tags ?? []) {
    revalidateTag(value, mode === "immediate" ? { expire: 0 } : "max");
  }
  if (tag) {
    revalidateTag(tag, mode === "immediate" ? { expire: 0 } : "max");
  }
  for (const value of paths ?? []) {
    revalidatePath(value);
  }
  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
````

## File: apps/client/app/articles/page.tsx
````typescript
import Link from "next/link";
export default function ArticlesPage() {
  return (
    <main className="koc-shell">
      <section style={{ background: "#111", color: "#fff", padding: "92px 0" }}>
        <div className="koc-container">
          <div className="koc-kicker" style={{ color: "#e33a48" }}>
            Motoring News
          </div>
          <h1
            className="koc-display"
            style={{ fontSize: "clamp(48px,7vw,88px)", marginTop: 14 }}
          >
            Know your
            <br />
            <span style={{ color: "#e33a48" }}>next move.</span>
          </h1>
          <p
            style={{
              maxWidth: 650,
              marginTop: 20,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.7,
            }}
          >
            Motoring news, buying guidance, finance information and ownership
            advice.
          </p>
          <Link
            href="/contact"
            className="koc-button koc-button-primary"
            style={{ marginTop: 24 }}
          >
            Talk to us
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/app/cars.css
````css
/* Scoped source-site visual contract for /cars. Kept separate so the existing site CSS remains intact. */
.koc-legacy-header {
  position: relative;
  top: auto;
  background: #242424;
}
.koc-legacy-header .koc-header-top {
  height: 31px;
  background: #242424;
  border-bottom: 1px solid #6c0704;
}
.koc-legacy-header .koc-header-top-inner {
  min-height: 31px;
  width: calc(100% - 40px);
  font-size: 8px;
  letter-spacing: 0;
  text-transform: none;
}
.koc-legacy-top-left,
.koc-legacy-top-phones {
  display: flex;
  align-items: center;
  gap: 14px;
}
.koc-legacy-top-left a,
.koc-legacy-top-phones a {
  color: #fff;
}
.koc-legacy-top-left .koc-wishlist {
  gap: 4px;
}
.koc-legacy-top-phones {
  gap: 12px;
}
.koc-legacy-top-phones a {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.koc-legacy-header .koc-header-main {
  background: #242424;
}
.koc-legacy-header .koc-header-main-inner {
  min-height: 62px;
  width: calc(100% - 40px);
  gap: 28px;
}
.koc-legacy-header .koc-logo {
  height: 52px;
  width: auto;
}
.koc-legacy-header .koc-desktop-nav {
  gap: 20px;
  font-size: 8px;
  letter-spacing: 0.05em;
}
.koc-legacy-header .koc-desktop-nav a {
  padding: 24px 0 22px;
  color: #fff;
}
.koc-legacy-header .koc-desktop-nav a:hover {
  color: #af2a23;
}
.koc-legacy-header .koc-menu-button {
  display: none;
  color: #fff;
}
@media (max-width: 900px) {
  .koc-legacy-header .koc-desktop-nav {
    display: flex;
    gap: 12px;
  }
  .koc-legacy-header .koc-desktop-nav a {
    font-size: 7px;
  }
  .koc-legacy-header .koc-logo {
    height: 46px;
  }
  .koc-legacy-header .koc-menu-button {
    display: none;
  }
}
@media (max-width: 640px) {
  .koc-legacy-header .koc-header-top-inner,
  .koc-legacy-header .koc-header-main-inner {
    width: calc(100% - 20px);
  }
  .koc-legacy-top-phones {
    gap: 6px;
  }
  .koc-legacy-top-phones a {
    font-size: 6px;
  }
  .koc-legacy-header .koc-desktop-nav {
    gap: 7px;
  }
  .koc-legacy-header .koc-desktop-nav a {
    font-size: 6px;
    padding-left: 0;
    padding-right: 0;
  }
  .koc-legacy-header .koc-logo {
    height: 40px;
  }
}

.koc-legacy-cars-page {
  background: #fff;
  color: #5d5b5a;
  font-family: Lato, Arial, Helvetica, sans-serif;
}
.koc-legacy-inner {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 72px 15px 30px;
  background: #fff;
}
.koc-legacy-title {
  margin: 0 0 20px;
}
.koc-legacy-title h1 {
  font-family: "Open Sans", Lato, Arial, sans-serif;
  font-size: 18px !important;
  font-weight: 500 !important;
  line-height: 1.2 !important;
  color: #5d5b5a !important;
  margin: 0;
}
.koc-legacy-title .divider {
  margin: 16px 0 20px !important;
  width: 100px;
  height: 1px;
}
.koc-legacy-inner > p {
  font-size: 12px;
  line-height: 1.5;
  color: #707070;
  font-weight: 300;
  margin: 0 0 10px;
}
.koc-legacy-inner > p a {
  color: #000;
  text-decoration: underline;
  font-weight: 600;
}
.koc-legacy-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin: 30px -15px 0;
}
.koc-legacy-sidebar {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;
}
.koc-legacy-results {
  flex: 0 0 75%;
  max-width: 75%;
  padding: 0 15px;
  position: relative;
  min-width: 0;
}
.koc-legacy-stock-title {
  font-size: 11px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}
.koc-legacy-clear {
  display: inline-block;
  color: #5d5b5a;
  text-decoration: underline;
  font-size: 9px;
  margin-bottom: 9px;
}
.koc-legacy-search {
  display: flex;
  width: 100%;
  margin-bottom: 7px;
}
.koc-legacy-search input {
  height: 31px;
  min-width: 0;
  flex: 1;
  border: 1px solid #ced4da;
  border-radius: 3px 0 0 3px;
  padding: 0 9px;
  font-size: 10px;
  color: #495057;
  outline: 0;
}
.koc-legacy-search button {
  width: 34px;
  height: 31px;
  border: 0;
  background: #6c0704;
  color: #fff;
  border-radius: 0 3px 3px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.koc-legacy-filters label {
  display: block;
  border-bottom: 1px solid #e5e5e5;
  margin: 0;
}
.koc-legacy-filters label > span {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
  color: #5d5b5a;
}
.koc-legacy-filters select {
  appearance: none;
  width: 100%;
  height: 24px;
  border: 0;
  background: #fff;
  color: #6b6b6b;
  font-size: 9px;
  padding: 0 2px;
  outline: 0;
}
.koc-legacy-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  color: #707070;
  margin: 8px 0;
}
.koc-legacy-checkbox input {
  margin: 0;
}
.koc-legacy-search-button {
  width: 100%;
  height: 32px;
  border: 0;
  border-radius: 2px;
  background: #6c0704;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}
.koc-legacy-clear.bottom {
  display: block;
  text-align: center;
  margin-top: 7px;
}
.koc-legacy-results-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
}
.koc-legacy-count {
  font-size: 9px;
  color: #999;
  white-space: nowrap;
}
.koc-legacy-time {
  font-size: 8px;
  color: #aaa;
}
.koc-legacy-pagination {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}
.koc-legacy-pagination a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 20px;
  padding: 0 5px;
  border: 1px solid #e1e1e1;
  background: #fff;
  color: #555;
  font-size: 8px;
}
.koc-legacy-pagination a.active {
  background: #333;
  color: #fff;
  border-color: #333;
}
.koc-legacy-pagination a.disabled {
  opacity: 0.45;
  pointer-events: none;
}
.koc-legacy-sort {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 6px;
}
.koc-legacy-sort select {
  height: 26px;
  background: #333;
  color: #fff;
  border: 0;
  border-radius: 3px;
  padding: 0 8px;
  font-size: 9px;
}
.koc-legacy-vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.koc-legacy-vehicle-card {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  min-height: 112px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
}
.koc-legacy-gallery {
  position: relative;
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  aspect-ratio: 1.52 / 1;
  background: #ededed;
  overflow: hidden;
}
.koc-legacy-gallery > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.koc-legacy-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b8b8b8;
  font-size: 9px;
  gap: 5px;
}
.koc-legacy-no-image span {
  color: #999;
}
.koc-legacy-image-count {
  position: absolute;
  right: 4px;
  top: 4px;
  background: rgba(108, 7, 4, 0.95);
  color: #fff;
  border-radius: 2px;
  padding: 2px 4px;
  font-size: 7px;
}
.koc-legacy-vehicle-main {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 8px 10px 6px;
  min-width: 0;
}
.koc-legacy-name {
  font-size: 9px;
  color: #5d5b5a;
  line-height: 1.15;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  white-space: normal;
}
.koc-legacy-name strong {
  color: #6c0704;
}
.koc-legacy-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  white-space: nowrap;
}
.koc-legacy-price-row strong {
  font-size: 12px;
  color: #6c0704;
}
.koc-legacy-price-row span {
  font-size: 8px;
  color: #444;
}
.koc-legacy-calc {
  margin-left: auto;
  border: 1px solid #444;
  background: #222;
  color: #fff;
  border-radius: 2px;
  font-size: 7px;
  padding: 3px 5px;
}
.koc-legacy-spec-line {
  display: flex;
  gap: 14px;
  margin-top: 9px;
  font-size: 8px;
  color: #5d5b5a;
}
.koc-legacy-spec-line span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.koc-legacy-location {
  font-size: 8px;
  color: #5d5b5a;
  margin-top: 5px;
}
.koc-legacy-social {
  display: flex;
  gap: 3px;
  margin-top: 7px;
}
.koc-legacy-social span {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 2px;
  font-size: 9px;
}
.koc-legacy-social .share-plus {
  background: #1877f2;
  font-weight: 700;
}
.koc-legacy-social .share-whatsapp {
  background: #25d366;
  font-weight: 700;
}
.koc-legacy-social .share-facebook {
  background: #1877f2;
  font-weight: 700;
}
.koc-legacy-social .share-mail {
  background: #999;
}
.koc-legacy-buttons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 3px;
  margin-top: 6px;
}
.koc-legacy-buttons a,
.koc-legacy-buttons button {
  height: 22px;
  border: 0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 7px;
  color: #fff;
  white-space: nowrap;
}
.koc-legacy-buttons .more {
  background: #242424;
}
.koc-legacy-buttons .enquire {
  background: #6c0704;
}
.koc-legacy-buttons .finance,
.koc-legacy-buttons .compare {
  background: #555;
}
.koc-legacy-buttons .more:hover,
.koc-legacy-buttons .finance:hover,
.koc-legacy-buttons .compare:hover {
  background: #222;
}
.koc-legacy-buttons .enquire:hover {
  background: #af2a23;
}
.koc-legacy-spec-panel {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
  background: #f7f7f7;
  border-top: 3px solid #242424;
  padding: 8px 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: flex-start;
  font-size: 8px;
  color: #5d5b5a;
  line-height: 1.3;
}
.koc-legacy-spec-panel span {
  display: block;
}
.koc-legacy-results > .koc-legacy-pagination {
  margin: 10px 0 0;
}
.koc-legacy-footer {
  background: #242424;
  color: #fff;
  text-align: center;
  padding: 18px 15px 10px;
  font-size: 9px;
  margin-top: 30px;
}
.koc-legacy-footer nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 12px 0;
}
.koc-legacy-footer nav a {
  color: #fff;
  font-size: 8px;
}
.koc-legacy-footer-buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
}
.koc-legacy-footer-buttons a {
  background: #6c0704;
  color: #fff;
  min-width: 120px;
  padding: 6px 12px;
  border-radius: 2px;
  font-size: 8px;
}
@media (max-width: 900px) {
  .koc-legacy-inner {
    padding-top: 48px;
  }
  .koc-legacy-row {
    margin-top: 20px;
  }
  .koc-legacy-gallery {
    flex-basis: 34%;
    max-width: 34%;
  }
  .koc-legacy-vehicle-main {
    flex-basis: 49%;
    max-width: 49%;
  }
  .koc-legacy-spec-panel {
    flex-basis: 17%;
    max-width: 17%;
  }
  .koc-legacy-name {
    font-size: 8px;
  }
  .koc-legacy-buttons a,
  .koc-legacy-buttons button {
    font-size: 6px;
  }
}
@media (max-width: 640px) {
  .koc-legacy-inner {
    padding-left: 10px;
    padding-right: 10px;
  }
  .koc-legacy-row {
    margin-left: -10px;
    margin-right: -10px;
  }
  .koc-legacy-sidebar,
  .koc-legacy-results {
    padding-left: 10px;
    padding-right: 10px;
  }
  .koc-legacy-sort select {
    font-size: 8px;
  }
  .koc-legacy-footer nav {
    gap: 8px;
  }
  .koc-legacy-footer-buttons {
    gap: 5px;
  }
  .koc-legacy-footer-buttons a {
    min-width: 90px;
  }
}
````

## File: apps/client/app/contact/page.tsx
````typescript
import Link from "next/link";
export default function ContactPage() {
  return (
    <main className="koc-shell">
      <section style={{ background: "#111", color: "#fff", padding: "92px 0" }}>
        <div className="koc-container">
          <div className="koc-kicker" style={{ color: "#e33a48" }}>
            Contact Us
          </div>
          <h1
            className="koc-display"
            style={{ fontSize: "clamp(48px,7vw,88px)", marginTop: 14 }}
          >
            Let's talk
            <br />
            <span style={{ color: "#e33a48" }}>motoring.</span>
          </h1>
          <p
            style={{
              maxWidth: 650,
              marginTop: 20,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.7,
            }}
          >
            Reach King of Cars about a vehicle, finance, selling your car or any
            other motoring need.
          </p>
          <Link
            href="/cars"
            className="koc-button koc-button-primary"
            style={{ marginTop: 24 }}
          >
            Browse vehicles
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/app/finance/page.tsx
````typescript
import Link from "next/link";
export default function FinancePage() {
  return (
    <main className="koc-shell">
      <section style={{ background: "#111", color: "#fff", padding: "92px 0" }}>
        <div className="koc-container">
          <div className="koc-kicker" style={{ color: "#e33a48" }}>
            Finance Solution
          </div>
          <h1
            className="koc-display"
            style={{ fontSize: "clamp(48px,7vw,88px)", marginTop: 14 }}
          >
            Make the
            <br />
            <span style={{ color: "#e33a48" }}>next move.</span>
          </h1>
          <p
            style={{
              maxWidth: 650,
              marginTop: 20,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.7,
            }}
          >
            A guided finance journey for customers buying their next vehicle.
          </p>
          <Link
            href="/contact"
            className="koc-button koc-button-primary"
            style={{ marginTop: 24 }}
          >
            Talk to the team
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;
:root {
  --koc-red: #b10f1b;
  --koc-dark: #111;
  --koc-sand: #f2f0eb;
  --koc-gray: #6b6b6b;
  --koc-gray-light: #f3f3f3;
  --koc-line: #dedbd4;
  --koc-muted: #6c6a66;
  --koc-charcoal: #242424;
  --koc-brand-red: #6c0704;
  --koc-brand-red-hover: #af2a23;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  background: var(--koc-sand);
  color: var(--koc-dark);
  font-family: Arial, Helvetica, sans-serif;
}
a {
  color: inherit;
  text-decoration: none;
}
.koc-shell {
  min-height: 100vh;
  background: var(--koc-sand);
}
.koc-container {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}
.koc-kicker {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--koc-red);
}
.koc-display {
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.95;
  text-transform: uppercase;
}
.koc-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.koc-button-primary {
  background: var(--koc-red);
  color: #fff;
}
.koc-button-light {
  background: #fff;
  color: var(--koc-dark);
}
.koc-card {
  background: #fff;
  border: 1px solid var(--koc-line);
}
.koc-site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--koc-charcoal);
  color: #fff;
}
.koc-header-top {
  background: var(--koc-charcoal);
  color: #fff;
  border-bottom: 2px solid var(--koc-brand-red);
}
.koc-header-top-inner {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.koc-branch-links,
.koc-header-contact,
.koc-wishlist {
  display: flex;
  align-items: center;
  gap: 10px;
}
.koc-branch-links a:first-child {
  color: #fff;
}
.koc-header-contact {
  gap: 18px;
}
.koc-header-contact a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.koc-header-contact svg,
.koc-wishlist svg {
  color: #fff;
}
.koc-wishlist {
  white-space: nowrap;
}
.koc-header-main {
  background: var(--koc-charcoal);
}
.koc-header-main-inner {
  min-height: 100px;
  display: flex;
  align-items: center;
  gap: 42px;
}
.koc-brand {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}
.koc-logo {
  display: block;
  width: auto;
  height: 68px;
  object-fit: contain;
}
.koc-desktop-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  flex: 1;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.koc-desktop-nav a {
  position: relative;
  padding: 40px 0 37px;
}
.koc-desktop-nav a:hover {
  color: var(--koc-brand-red-hover);
}
.koc-desktop-nav a:last-child {
  color: #fff;
  background: var(--koc-brand-red);
  padding: 13px 17px;
  border-radius: 2px;
}
.koc-desktop-nav a:last-child:hover {
  background: var(--koc-brand-red-hover);
  color: #fff;
}
.koc-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.koc-header-phone {
  display: none;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.koc-menu-button {
  display: none;
  border: 0;
  background: transparent;
  padding: 8px;
  cursor: pointer;
}
.koc-mobile-nav {
  display: none;
}
.koc-brand:focus-visible,
.koc-desktop-nav a:focus-visible,
.koc-wishlist:focus-visible,
.koc-header-contact a:focus-visible,
.koc-menu-button:focus-visible {
  outline: 2px solid var(--koc-brand-red-hover);
  outline-offset: 4px;
}
@media (max-width: 1050px) {
  .koc-header-main-inner {
    gap: 24px;
  }
  .koc-desktop-nav {
    gap: 18px;
  }
  .koc-logo {
    height: 60px;
  }
}
@media (max-width: 900px) {
  .koc-header-main-inner {
    min-height: 78px;
    justify-content: space-between;
  }
  .koc-desktop-nav {
    display: none;
  }
  .koc-header-phone,
  .koc-menu-button {
    display: flex;
  }
  .koc-mobile-nav {
    display: flex;
    flex-direction: column;
    background: var(--koc-charcoal);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  }
  .koc-mobile-nav a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 17px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .koc-mobile-nav a:hover {
    color: var(--koc-brand-red-hover);
  }
}
@media (max-width: 640px) {
  .koc-container {
    width: min(100% - 28px, 1200px);
  }
  .koc-header-top-inner {
    min-height: 34px;
    font-size: 8px;
  }
  .koc-branch-links span,
  .koc-branch-links a:nth-of-type(2),
  .koc-header-contact > a:not(.koc-wishlist) {
    display: none;
  }
  .koc-header-contact {
    gap: 0;
  }
  .koc-logo {
    height: 50px;
  }
  .koc-header-phone {
    display: none;
  }
}
.koc-home {
  color: #707070;
}
.koc-home h1,
.koc-home h2 {
  color: #5d5b5a;
  font-weight: 600;
  line-height: 1.125;
  margin: 0;
}
.koc-wide {
  width: min(1600px, calc(100% - 40px));
  margin: 0 auto;
}
.koc-divider {
  position: relative;
  width: 100px;
  height: 1px;
  background: #5d5b5a;
  margin: 16px auto 20px;
}
.koc-divider:after {
  content: "";
  position: absolute;
  left: 15px;
  bottom: -4px;
  width: 70px;
  height: 1px;
  background: #5d5b5a;
}
.koc-divider-left {
  margin-left: 0;
  margin-right: auto;
}
.koc-divider-right {
  margin-left: auto;
  margin-right: 0;
}
.koc-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 1920 / 780;
  min-height: 300px;
  overflow: hidden;
  background: #141414;
}
.koc-intro {
  padding: 100px 0 40px;
  background: #fff;
}
.koc-intro-heading {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 24px;
}
.koc-intro-block {
  display: flex;
  gap: 20px;
}
.koc-intro-tile {
  position: relative;
  display: block;
  width: 170px;
  height: 250px;
  overflow: hidden;
  border-bottom: 5px solid #6c0804;
  transition: border-color 0.3s;
}
.koc-intro-tile:before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: background 0.3s;
  z-index: 1;
}
.koc-intro-tile span {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  line-height: 1.45;
  transition: color 0.3s;
}
.koc-intro-tile:hover {
  border-color: #222;
}
.koc-intro-tile:hover:before {
  background: rgba(0, 0, 0, 0.8);
}
.koc-intro-tile:hover span {
  color: #af2a23;
}
.koc-intro-title {
  text-align: center;
}
.koc-intro-title span {
  font-size: 20px;
  color: #5d5b5a;
}
.koc-intro-title h1 {
  font-size: 2.5rem;
  margin-top: 6px;
}
.koc-intro-copy {
  display: flex;
  margin-top: 80px;
}
.koc-intro-copy p {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 20px;
  line-height: 1.5;
  font-size: 1rem;
  font-weight: 300;
  color: #707070;
  margin: 0;
}
.koc-branches {
  padding: 60px 0 40px;
  background: linear-gradient(to bottom, #fffcfc 0, #f6f6f6 76%, #eee 100%);
}
.koc-branch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}
.koc-branch-img {
  flex: 0 0 60%;
  max-width: 60%;
  display: flex;
  align-items: center;
}
.koc-branch-copy {
  flex: 0 0 40%;
  max-width: 40%;
}
.koc-branch-row:first-child .koc-branch-copy {
  padding: 0 100px 0 30px;
  text-align: right;
}
.koc-branch-row:last-child .koc-branch-copy {
  padding: 0 30px 0 100px;
  text-align: left;
}
.koc-branch-copy h2 {
  font-size: 2rem;
}
.koc-branch-copy p {
  line-height: 1.6;
  margin: 0;
}
.koc-branch-copy a {
  color: #6c0704;
  font-weight: 600;
}
.koc-branch-copy a:hover {
  color: #af2a23;
}
.koc-help {
  padding: 60px 0 40px;
  background: #eee;
}
.koc-help-head {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 50px;
}
.koc-help-head p {
  line-height: 1.5;
  color: #707070;
  margin: 0;
}
.koc-help-row {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding: 20px 0;
}
.koc-help-box {
  position: relative;
  width: 430px;
  max-width: 100%;
  height: 260px;
  margin: 0 8px 48px;
  padding-left: 23px;
  border-right: 1px solid #333;
  overflow: hidden;
}
.koc-help-box-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  background: #000;
  transform: skewX(6deg);
  overflow: hidden;
  box-shadow: -4px 0 0 0 #6c0704;
  transition: transform 0.3s;
}
.koc-help-box-img {
  position: absolute;
  top: 50%;
  left: 47%;
  transform: translate(-50%, -50%) skewX(-6deg);
  width: 130%;
  height: 130%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.koc-help-box-link:before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 1;
}
.koc-help-box-link:after {
  content: "";
  position: absolute;
  top: 0;
  left: 170%;
  width: 100%;
  height: 100%;
  background: rgba(198, 198, 198, 0.3);
  transform: skewX(45deg);
  transition: left 0.75s;
  z-index: 1;
}
.koc-help-box-link:hover:before {
  opacity: 1;
}
.koc-help-box-link:hover:after {
  left: -170%;
}
.koc-help-box-content {
  position: absolute;
  z-index: 2;
  top: -50%;
  left: 49%;
  transform: translate(-50%, -50%) skewX(-6deg);
  text-align: center;
  color: #fff;
  transition: top 0.5s;
  width: 100%;
}
.koc-help-box-link:hover .koc-help-box-content {
  top: 50%;
}
.koc-help-box-content svg {
  width: 35px;
  height: 35px;
}
.koc-help-box-content .copy {
  display: block;
  font-size: 16px;
  margin-top: 12px;
}
.koc-help-box-content .copy-cta {
  display: inline-block;
  border: 3px solid #6c0704;
  padding: 2px 6px;
  margin-top: 20px;
  font-size: 14px;
  transition: all 0.5s;
}
.koc-help-box-link:hover .copy-cta {
  background: #fff;
  color: #6c0704;
}
.koc-news {
  padding: 60px 0;
  background: linear-gradient(to bottom, #eee 0, #f6f6f6 24%, #fffcfc 100%);
  text-align: center;
}
@media (max-width: 1280px) {
  .koc-intro {
    padding: 60px 0 40px;
  }
  .koc-intro-heading {
    flex-direction: column;
  }
  .koc-intro-title {
    order: -1;
  }
  .koc-intro-copy {
    margin-top: 40px;
  }
  .koc-branch-img,
  .koc-branch-copy {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .koc-branch-row:first-child .koc-branch-copy,
  .koc-branch-row:last-child .koc-branch-copy {
    padding: 0 50px;
  }
}
@media (max-width: 960px) {
  .koc-branch-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  .koc-branch-img,
  .koc-branch-copy {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .koc-branch-row:first-child .koc-branch-copy {
    order: -1;
    text-align: left;
    padding: 0 30px;
  }
  .koc-branch-row:last-child .koc-branch-copy {
    text-align: left;
    padding: 0 30px;
  }
  .koc-branch-row:last-child .koc-branch-img {
    padding: 0 40px;
  }
  .koc-branch-row:first-child .koc-branch-img {
    padding: 0 40px 0 0;
  }
  .koc-help-box-link:before {
    opacity: 1;
    background: rgba(0, 0, 0, 0.65);
  }
  .koc-help-box-content {
    top: 50%;
  }
}
@media (max-width: 767px) {
  .koc-intro-copy {
    flex-direction: column;
    margin-top: 50px;
  }
  .koc-intro-copy p {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .koc-intro-copy p:last-child {
    margin-top: 24px;
  }
  .koc-intro-block {
    flex-direction: column;
    align-items: center;
  }
}
@media (max-width: 576px) {
  .koc-help-box {
    padding-left: 0;
  }
  .koc-help-box-link {
    transform: none;
  }
  .koc-help-box-img {
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .koc-help-box-content {
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.koc-cars {
  background: #fff;
  padding: 70px 0 90px;
}
.koc-page-head h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #5d5b5a;
  margin: 0;
  line-height: 1.125;
}
.koc-page-head .koc-divider {
  margin-left: 0;
  margin-right: 0;
}
.koc-page-copy {
  max-width: 1100px;
  line-height: 1.6;
  color: #707070;
  margin: 14px 0 0;
  font-size: 1rem;
  font-weight: 300;
}
.koc-page-copy a {
  color: #6c0704;
  font-weight: 600;
}
.koc-page-copy a:hover {
  color: #af2a23;
}
.koc-vs-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px;
  background: var(--koc-charcoal);
  padding: 18px 20px;
  margin: 36px 0 0;
  border-radius: 2px;
}
.koc-vs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 150px;
  min-width: 140px;
}
.koc-vs-field label {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.koc-vs-field select {
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #fff;
  color: #111;
  border-radius: 2px;
  padding: 0 10px;
  font-size: 13px;
}
.koc-vs-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 26px;
  background: var(--koc-brand-red);
  color: #fff;
  border: 0;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s;
}
.koc-vs-search:hover {
  background: var(--koc-brand-red-hover);
}
.koc-vs-reset {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 14px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.koc-vs-reset:hover {
  color: #fff;
}
.koc-vs-count {
  margin: 26px 0 18px;
  font-size: 13px;
  color: var(--koc-muted);
}
.koc-vs-count strong {
  color: #242424;
}
.koc-vs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.koc-vs-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e3e3e3;
  overflow: hidden;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}
.koc-vs-card:hover {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);
  transform: translateY(-3px);
}
.koc-vs-card-img {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #ececec;
  overflow: hidden;
}
.koc-vs-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.koc-vs-card:hover .koc-vs-card-img img {
  transform: scale(1.05);
}
.koc-vs-card-noimg {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 12px;
}
.koc-vs-card-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #4c4c4c;
}
.koc-vs-card-tag {
  position: absolute;
  right: 0;
  bottom: 12px;
  background: var(--koc-brand-red);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  padding: 6px 14px 6px 16px;
}
.koc-vs-card-tag:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: rgba(0, 0, 0, 0.18);
}
.koc-vs-card-head {
  padding: 16px 18px 10px;
  min-height: 86px;
}
.koc-vs-card-head span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9a9a9a;
}
.koc-vs-card-head h3 {
  font-size: 18px;
  font-weight: 800;
  color: #242424;
  margin: 4px 0 0;
  line-height: 1.25;
}
.koc-vs-card-head p {
  font-size: 12px;
  color: var(--koc-muted);
  margin: 3px 0 0;
}
.koc-vs-card-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 0 18px 16px;
  font-size: 11px;
  color: var(--koc-muted);
  border-bottom: 1px solid #efefef;
}
.koc-vs-card-specs span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.koc-vs-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 14px 18px 16px;
  height: 40px;
  background: #000;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: background 0.3s;
}
.koc-vs-card:hover .koc-vs-card-btn {
  background: var(--koc-brand-red);
}
.koc-vs-empty {
  background: #fff;
  border: 1px solid #e3e3e3;
  padding: 60px 20px;
  text-align: center;
  color: var(--koc-muted);
}
.koc-vs-empty .koc-vs-card-btn {
  display: inline-flex;
  margin: 18px auto 0;
  padding: 0 30px;
  width: auto;
}

/* --- King of Cars boksburg-used-cars exact html replication --- */
.container-fluid {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
.inner {
  padding: 90px 15px 30px !important;
  margin: 0 auto !important;
  max-width: 1600px;
  width: 100%;
  background: #fff;
}
.title {
  margin-bottom: 20px;
  text-align: center;
}
.title.left {
  text-align: left;
}
.title h1 {
  line-height: 1.125 !important;
  font-size: 2rem !important;
  font-weight: 500;
  font-family: "Open Sans Bold", Lato, sans-serif;
  color: #5d5b5a;
  margin: 0;
}
.divider,
.divider:after {
  position: relative;
  width: 100px;
  margin: 0 auto;
  height: 1px;
  background-color: #5d5b5a;
  margin-bottom: 20px !important;
  margin-top: 16px !important;
}
.divider:after {
  content: "";
  display: inline-block;
  position: relative;
  width: 70px;
  bottom: 10px;
}
.title.left .divider {
  margin: 0;
}
.title.left .divider:after {
  left: 0;
  margin-right: 0;
  transform: none;
}
.inner p {
  line-height: 1.5;
  font-size: 1rem;
  font-weight: 300;
  color: #707070;
  margin: 0 0 1rem;
}
.inner p a {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}
.inner p a:hover {
  color: #6c0704;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0;
  margin-left: 0;
}
.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
@media (min-width: 768px) {
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
@media (min-width: 992px) {
  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
}
@media (min-width: 1200px) {
  .col-xl-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}
.m-0 {
  margin: 0 !important;
}
.p-0 {
  padding: 0 !important;
}
.p-2 {
  padding: 0.5rem !important;
}
.pl-0 {
  padding-left: 0 !important;
}
.pr-0 {
  padding-right: 0 !important;
}
.pl-2 {
  padding-left: 0.5rem !important;
}
.ml-3 {
  margin-left: 1rem !important;
}
.mr-3 {
  margin-right: 1rem !important;
}
.mt-2 {
  margin-top: 0.5rem !important;
}
.mt-3 {
  margin-top: 1rem !important;
}
.mb-1 {
  margin-bottom: 0.25rem !important;
}
.mb-2 {
  margin-bottom: 0.5rem !important;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}
.mb-5 {
  margin-bottom: 3rem !important;
}
.col-form-label {
  padding-top: calc(0.375rem + 1px);
  padding-bottom: calc(0.375rem + 1px);
  margin-bottom: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}
.font-weight-bold {
  font-weight: 700 !important;
}
.font-weight-bold {
  font-weight: 700 !important;
}
.small,
small {
  font-size: 80%;
  font-weight: 400;
}
.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}
.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s;
}
.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}
.input-group > .form-control {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
  margin-bottom: 0;
}
.input-group-append {
  display: flex;
}
.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.button-group {
  position: relative;
  display: block;
}
.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition:
    color 0.15s,
    background-color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
}
.btn-primary {
  color: #fff !important;
  background-color: #6c0704 !important;
  border-color: #6c0704 !important;
}
.btn-primary:hover {
  background-color: #af2a23 !important;
  border-color: #af2a23 !important;
}
.btn-secondary {
  color: #fff !important;
  background-color: #242424 !important;
  border-color: #242424 !important;
}
.btn-secondary:hover {
  background-color: #363636 !important;
  border-color: #363636 !important;
}
.btn-outline-dark {
  color: #000 !important;
  background-color: #fff !important;
  border: 1px solid #000 !important;
}
.btn-outline-dark:hover {
  background-color: #000 !important;
  color: #fff !important;
}
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
.btn-block {
  display: block;
  width: 100%;
}
.form-check {
  position: relative;
  display: block;
  padding-left: 1.25rem;
}
.form-check-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: -1.25rem;
}
.form-check-label {
  margin-bottom: 0;
  font-size: 0.85rem;
  color: #5d5b5a;
}
.vs-list-tile {
  border: 1px solid #e3e3e3 !important;
  background: #fff;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}
.vs-list-year {
  color: #6c0704 !important;
  font-weight: 700;
}
.vs-list-name {
  color: #5d5b5a;
  font-weight: 500;
}
.vs-list-price {
  color: #6c0704 !important;
  font-weight: 700;
  font-size: large;
}
.vs-list-mileage,
.vs-list-colour,
.vs-list-location {
  color: #5d5b5a;
}
.text-primary {
  color: #6c0704 !important;
}
.text-muted {
  color: #6c757d !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.border-primary {
  border-color: #000 !important;
}
.no-gutters {
  margin-right: 0;
  margin-left: 0;
}
.no-gutters > .col,
.no-gutters > [class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}
.SearchStats {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 8px 0;
}
.koc-filter-stack {
  display: flex;
  flex-direction: column;
}
.koc-filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #5d5b5a;
  margin-bottom: 0.25rem;
  display: block;
}
.koc-filter-select {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #ced4da;
  border-radius: 0.2rem;
  background: #fff;
  color: #495057;
}
.koc-filter-actions {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.koc-filter-clear {
  display: inline-block;
  font-size: 0.8rem;
  color: #6c0704;
  text-align: center;
}
.koc-search-group .input-group-text {
  cursor: pointer;
  background: #6c0704;
  color: #fff;
  border-color: #6c0704;
}
.koc-search-group .input-group-text:hover {
  background: #af2a23;
}
.koc-tile-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #ececec;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.koc-tile-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.imagePlaceHolder {
  padding: 2rem;
  color: #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}
.imagePlaceHolder i {
  font-size: 3rem;
}
.koc-search-stats {
  margin: 16px 0 8px;
  font-size: 0.85rem;
  color: #707070;
}
.koc-search-stats strong {
  color: #242424;
}
.koc-widget-results {
  margin-top: 12px;
}
.koc-sort-row {
  margin-bottom: 12px;
}
.vs-result-more-button {
  font-size: 0.85rem;
}
.koc-vs-empty {
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
  color: #5d5b5a;
}
@media (max-width: 767px) {
  .inner {
    padding: 40px 15px 30px !important;
  }
}
@media (max-width: 960px) {
  .main-header .container-fluid .row .mh-logo {
    position: relative;
    top: 0;
    left: unset;
    margin: 0;
    transform: unset;
    width: 100%;
    text-align: center;
  }
}
/* bootstrap display/flex/border utilities for vs-list-tile */
.d-none {
  display: none !important;
}
.d-flex {
  display: flex !important;
}
.d-inline-flex {
  display: inline-flex !important;
}
.d-block {
  display: block !important;
}
.flex-column {
  flex-direction: column !important;
}
.flex-fill {
  flex: 1 1 auto !important;
}
.align-items-center {
  align-items: center !important;
}
.align-items-baseline {
  align-items: baseline !important;
}
.align-self-center {
  align-self: center !important;
}
.justify-content-center {
  justify-content: center !important;
}
.text-center {
  text-align: center !important;
}
.text-right {
  text-align: right !important;
}
.w-100 {
  width: 100% !important;
}
.mw-100 {
  max-width: 100% !important;
}
.float-right {
  float: right !important;
}
.ml-auto {
  margin-left: auto !important;
}
.mr-auto {
  margin-right: auto !important;
}
@media (min-width: 992px) {
  .d-lg-none {
    display: none !important;
  }
  .d-lg-flex {
    display: flex !important;
  }
  .d-lg-block {
    display: block !important;
  }
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
}
.border-primary {
  border-color: #242424 !important;
}
.border-3 {
  border-width: 3px !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.no-gutters {
  margin-right: 0;
  margin-left: 0;
}
.no-gutters > .col,
.no-gutters > [class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}
````

## File: apps/client/app/page.tsx
````typescript
import { CarFront, Cog, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ctaRows = [
  [
    {
      title: "Sell Your Car",
      href: "/sell-your-car",
      image: "/images/home/cta-sell-your-car.jpg",
      Icon: CarFront,
    },
    {
      title: "All Vehicles",
      href: "/cars",
      image: "/images/home/cta-all-vehicles.jpg",
      Icon: CarFront,
    },
  ],
  [
    {
      title: "Finance Solution",
      href: "/finance",
      image: "/images/home/cta-finance.jpg",
      Icon: FileText,
    },
    {
      title: "Value Added Products",
      href: "/value-added-products",
      image: "/images/home/cta-value-added-products.jpg",
      Icon: Cog,
    },
  ],
];

export default function HomePage() {
  return (
    <main className="koc-home">
      <section className="koc-hero">
        <Image
          src="/HeroSection.png"
          alt="King of Cars — AA Certified Pre-Owned, a brand you can trust"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </section>

      <section className="koc-intro">
        <div className="koc-wide">
          <div className="koc-intro-heading">
            <div className="koc-intro-block">
              <Link
                href="/cars"
                className="koc-intro-tile"
                title="Pre-Owned Trichardts Road"
              >
                <Image
                  src="/images/home/intro-preowned-trichardts.jpg"
                  alt="Preowned cars"
                  fill
                  sizes="170px"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  Pre-Owned
                  <br />
                  Trichardts Road
                </span>
              </Link>
              <a
                href="https://www.kingofcarspremium.co.za/used-vehicles"
                target="_blank"
                rel="noreferrer"
                className="koc-intro-tile"
                title="Pre-Owned Premium"
              >
                <Image
                  src="/images/home/intro-preowned-premium.jpg"
                  alt="Used models"
                  fill
                  sizes="170px"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  Pre-Owned
                  <br />
                  Premium
                </span>
              </a>
            </div>

            <div className="koc-intro-title">
              <span>Welcome to</span>
              <div className="koc-divider" />
              <h1>King of Cars</h1>
            </div>

            <div className="koc-intro-block">
              <Link
                href="/sell-your-car"
                className="koc-intro-tile"
                title="Sell your car"
              >
                <Image
                  src="/images/home/intro-sell-your-car.jpg"
                  alt="Sell your car"
                  fill
                  sizes="170px"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  Sell
                  <br />
                  Your Car
                </span>
              </Link>
              <Link
                href="/contact"
                className="koc-intro-tile"
                title="Contact Us"
              >
                <Image
                  src="/images/home/intro-contact-us.jpg"
                  alt="Contact"
                  fill
                  sizes="170px"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  Contact
                  <br />
                  Us
                </span>
              </Link>
            </div>
          </div>

          <div className="koc-intro-copy">
            <p>
              With 20 years of success in the motor industry, we are a buyer and
              seller of quality used vehicles. With our wide range of experience
              and skills, we are well equipped to assist you with your every
              need. We offer advice and assistance to all our clients, from
              suggestions on financial solutions to the smart way to buy or sell
              your vehicle.
            </p>
            <p>
              View the pre-owned cars on offer in the showroom section and find
              the vehicle that is right for you. We have two branches in
              Boksburg, Premium and North Rand Road ready to assist in any way
              possible. Visit the websites linked below or contact the branches
              directly using the provided contact details.
            </p>
          </div>
        </div>
      </section>

      <section className="koc-branches">
        <div className="koc-wide">
          <div className="koc-branch-row">
            <div className="koc-branch-img">
              <Image
                src="/images/home/branch-trichardts.png"
                alt="King Of Cars Trichardts Road, Boksburg"
                width={860}
                height={400}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="koc-branch-copy">
              <h2>King of Cars Trichardts Road, Boksburg</h2>
              <div className="koc-divider koc-divider-right" />
              <p>
                We have a team that is both experienced and skilled in assisting
                you with all of your motoring needs. We offer free advice and
                assistance to all our clients, from financial solutions to the
                smart way to buy or sell your vehicle. We&apos;ll help you make
                the car of your dreams a reality!{" "}
                <Link href="/contact">Contact us today!</Link>
              </p>
            </div>
          </div>

          <div className="koc-branch-row">
            <div className="koc-branch-copy">
              <h2>King of Cars Premium</h2>
              <div className="koc-divider koc-divider-left" />
              <p>
                Offering you a wide selection of amazing used cars, King of Cars
                Premium is here to help you achieve all your motoring needs. Our
                team will make sure that you receive the dedicated service that
                you deserve.{" "}
                <a
                  href="https://www.kingofcarspremium.co.za/contact-us"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact us today!
                </a>
              </p>
            </div>
            <div className="koc-branch-img">
              <Image
                src="/images/home/branch-premium.png"
                alt="Contact us today"
                width={860}
                height={400}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="koc-help">
        <div className="koc-wide">
          <div className="koc-help-head">
            <h2>How can we help?</h2>
            <div className="koc-divider" />
            <p>
              King of Cars is here to take care of all your motoring needs. We
              offer advice and assistance to all our clients, from suggestions
              on financial solutions to the smart way to buy or sell your
              vehicle.
            </p>
          </div>
          {ctaRows.map((row, rowIndex) => (
            <div className="koc-help-row" key={rowIndex}>
              {row.map(({ title, href, image, Icon }) => (
                <div className="koc-help-box" key={title}>
                  <Link href={href} className="koc-help-box-link" title={title}>
                    <span
                      className="koc-help-box-img"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <span className="koc-help-box-content">
                      <Icon />
                      <span className="copy">{title}</span>
                      <span className="copy-cta">Find Out More</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="koc-news">
        <div className="koc-wide">
          <div className="koc-help-head">
            <h2>Motoring News</h2>
            <div className="koc-divider" />
            <p>
              Read the latest motoring news on our website by clicking an
              article below.
            </p>
          </div>
          <Link href="/articles" className="koc-button koc-button-primary">
            View Articles
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/app/sell-your-car/page.tsx
````typescript
import Link from "next/link";
export default function SellYourCarPage() {
  return (
    <main className="koc-shell">
      <section style={{ background: "#111", color: "#fff", padding: "92px 0" }}>
        <div className="koc-container">
          <div className="koc-kicker" style={{ color: "#e33a48" }}>
            Sell Your Car
          </div>
          <h1
            className="koc-display"
            style={{ fontSize: "clamp(48px,7vw,88px)", marginTop: 14 }}
          >
            Sell smart.
            <br />
            <span style={{ color: "#e33a48" }}>Move forward.</span>
          </h1>
          <p
            style={{
              maxWidth: 650,
              marginTop: 20,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.7,
            }}
          >
            Start a guided selling journey with King of Cars.
          </p>
          <Link
            href="/contact"
            className="koc-button koc-button-primary"
            style={{ marginTop: 24 }}
          >
            Start enquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/app/value-added-products/page.tsx
````typescript
import Link from "next/link";
export default function ValueAddedProductsPage() {
  return (
    <main className="koc-shell">
      <section style={{ background: "#111", color: "#fff", padding: "92px 0" }}>
        <div className="koc-container">
          <div className="koc-kicker" style={{ color: "#e33a48" }}>
            Value Added Products
          </div>
          <h1
            className="koc-display"
            style={{ fontSize: "clamp(48px,7vw,88px)", marginTop: 14 }}
          >
            More confidence.
            <br />
            <span style={{ color: "#e33a48" }}>More cover.</span>
          </h1>
          <p
            style={{
              maxWidth: 650,
              marginTop: 20,
              color: "rgba(255,255,255,.65)",
              lineHeight: 1.7,
            }}
          >
            Ownership and vehicle-care products will be managed alongside
            dealership content.
          </p>
          <Link
            href="/contact"
            className="koc-button koc-button-primary"
            style={{ marginTop: 24 }}
          >
            Ask us
          </Link>
        </div>
      </section>
    </main>
  );
}
````

## File: apps/client/components/cars-sort.tsx
````typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CarsSort({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changeSort(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (nextValue === "featured") params.delete("sort");
    else params.set("sort", nextValue);
    router.push(`/cars${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <select
      value={value}
      aria-label="Sort vehicles"
      onChange={(event) => changeSort(event.target.value)}
    >
      <option value="featured">Sort: Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="mileage-asc">Mileage: Lowest</option>
      <option value="year-desc">Year: Newest</option>
    </select>
  );
}
````

## File: apps/client/next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## File: apps/client/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
````

## File: packages/contracts/src/business.ts
````typescript
export const BUSINESS_INFO = {
  brandName: "King of Cars",
  legalName: "King Of Cars Group",
  branchName: "Trichardts Road, Boksburg",
  address: "82 Trichardts Rd, Ravenswood, Boksburg, 1459, South Africa",
  email: "leads@kingofcars.co.za",
  agentName: "King of Cars Sales Team",
  phones: [
    "010 823 9006",
    "010 492 6780",
    "011 594 2556",
    "011 918 9210",
  ] as const,
  primaryPhone: "011 894 5233",
  whatsappNumber: "011 894 5233",
  officeHours: {
    weekdays: "Monday - Friday: 08:00 - 18:00",
    saturday: "Saturday: 09:00 - 15:00",
    sunday: "Sunday: Closed",
    publicHolidays: "Public Holidays: 09:00 - 13:00",
  },
  website: "https://www.kingofcars.co.za",
  whatsapp: {
    number: "011 894 5233",
    internationalNumber: "27118945233",
    baseUrl: "https://wa.me/27118945233",
  },
  messages: {
    general:
      "Hi King of Cars, I would like to enquire about your available vehicles.",
    vehicle: (vehicleTitle: string, price?: string, url?: string) =>
      `Hi ${"King of Cars Sales Team"}, I am interested in the ${vehicleTitle}${price ? ` listed at ${price}` : ""}.${url ? `\n\nVehicle: ${url}` : ""}\n\nPlease assist me with availability and more information.`,
    sell: "Hi King of Cars, I would like to enquire about selling my car.",
    finance: "Hi King of Cars, I would like to enquire about vehicle finance.",
  },
} as const;

export type BusinessInfo = typeof BUSINESS_INFO;

export const BUSINESS_PHONE_LINKS = BUSINESS_INFO.phones.map((phone) => ({
  label: phone,
  href: `tel:${phone.replace(/\s/g, "")}`,
}));

export const WHATSAPP_LINK = BUSINESS_INFO.whatsapp.baseUrl;
````

## File: packages/contracts/src/gallery.ts
````typescript
import { z } from "zod";

export const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  imageUrl: z.string().url(),
  createdAt: z.string().optional(),
});

export type GalleryType = z.infer<typeof gallerySchema>;
````

## File: packages/contracts/src/lead.ts
````typescript
import { z } from "zod";

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
]);

export const leadInputSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  message: z.string().max(5000).optional(),
  carId: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
````

## File: packages/contracts/src/service.ts
````typescript
import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.string().optional(),
});

export type ServiceType = z.infer<typeof serviceSchema>;
````

## File: packages/contracts/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
````

## File: packages/supabase/src/auth.ts
````typescript
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
````

## File: packages/supabase/src/client.ts
````typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
````

## File: packages/supabase/src/server.ts
````typescript
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./supabaseType";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and/or anonymous key not provided.");
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Server Actions and Route
          // Handlers can, so refreshed sessions are persisted where supported.
        }
      },
    },
  });
}

export function createSupabasePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and/or anonymous key not provided.");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
````

## File: packages/supabase/src/supabaseType.ts
````typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, string>;
    Functions: Record<string, never>;
    Views: Record<string, never>;
    Tables: {
      KingsOfCars_vehicles: {
        Row: {
          id: string;
          stock_number: string | null;
          slug: string;
          make: string;
          model: string;
          variant: string | null;
          year: number | null;
          mileage: number | null;
          price: number | null;
          monthly_payment: number | null;
          body_type: string | null;
          transmission: string | null;
          fuel_type: string | null;
          colour: string | null;
          engine_size: string | null;
          power_kw: number | null;
          description: string | null;
          overview: string | null;
          features: string[];
          health_check: Json;
          image_url: string | null;
          gallery_urls: string[];
          status: string;
          featured: boolean;
          source_url: string | null;
          source_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stock_number?: string | null;
          slug: string;
          make: string;
          model: string;
          variant?: string | null;
          year?: number | null;
          mileage?: number | null;
          price?: number | null;
          monthly_payment?: number | null;
          body_type?: string | null;
          transmission?: string | null;
          fuel_type?: string | null;
          colour?: string | null;
          engine_size?: string | null;
          power_kw?: number | null;
          description?: string | null;
          overview?: string | null;
          features?: string[];
          health_check?: Json;
          image_url?: string | null;
          gallery_urls?: string[];
          status?: string;
          featured?: boolean;
          source_url?: string | null;
          source_updated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_vehicles"]["Row"]
        >;
        Relationships: [];
      };
      KingsOfCars_vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          image_url: string;
          sort_order: number;
          is_primary: boolean;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          image_url: string;
          sort_order?: number;
          is_primary?: boolean;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_vehicle_images"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_vehicle_images_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_leads: {
        Row: {
          id: string;
          vehicle_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          message: string | null;
          source: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_leads"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_leads_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_finance_applications: {
        Row: {
          id: string;
          vehicle_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          employment_status: string | null;
          gross_income: number | null;
          deposit: number | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          employment_status?: string | null;
          gross_income?: number | null;
          deposit?: number | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["KingsOfCars_finance_applications"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "KingsOfCars_finance_applications_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "KingsOfCars_vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      KingsOfCars_articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      KingsOfCars_testimonials: {
        Row: {
          id: string;
          author: string;
          rating: number;
          content: string;
          published: boolean;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      KingsOfCars_branches: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          province: string | null;
          phone: string | null;
          email: string | null;
          latitude: number | null;
          longitude: number | null;
          opening_hours: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
  };
};
````

## File: packages/supabase/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
````

## File: apps/admin/package.json
````json
{
  "name": "@kings-of-cars/admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "lucide-react": "catalog:",
    "next": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:"
  },
  "devDependencies": {
    "@biomejs/biome": "catalog:",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "catalog:"
  }
}
````

## File: apps/client/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { WhatsAppFloat } from "../components/whatsapp-float";
import "./globals.css";
import "./cars/cars-page.css";

export const metadata: Metadata = {
  title: "King of Cars | Quality Used Cars",
  description:
    "Browse quality pre-owned vehicles, explore finance solutions, sell your car and connect with King of Cars in Boksburg.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
````

## File: apps/client/components/enquire-form.css
````css
.koc-enquire-form {
  border: 1px solid #ddd;
  background: #fff;
  padding: 28px;
}
.koc-enquire-form h2 {
  font-size: 32px;
  line-height: 1.05;
  margin: 8px 0 0;
}
.koc-enquire-vehicle {
  font-size: 12px;
  color: #777;
  margin: 10px 0 22px;
}
.koc-enquire-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
  margin-top: 13px;
}
.koc-enquire-form input,
.koc-enquire-form textarea {
  border: 1px solid #d5d5d5;
  background: #fff;
  padding: 11px 12px;
  font: inherit;
  font-size: 13px;
  text-transform: none;
  letter-spacing: normal;
  color: #333;
  outline: none;
}
.koc-enquire-form input:focus,
.koc-enquire-form textarea:focus {
  border-color: #720a06;
}
.koc-enquire-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.koc-enquire-form button {
  margin-top: 18px;
  width: 100%;
  justify-content: center;
}
.koc-enquire-error {
  margin-top: 12px;
  color: #b42318;
  font-size: 12px;
}
.koc-enquire-success {
  border: 1px solid #ddd;
  background: #fff;
  padding: 36px;
  text-align: center;
}
.koc-enquire-success svg {
  color: #720a06;
  margin: auto;
}
.koc-enquire-success h3 {
  font-size: 24px;
  margin-top: 12px;
}
.koc-enquire-success p {
  color: #777;
  line-height: 1.6;
  margin-top: 8px;
}
.koc-spin {
  animation: koc-spin 1s linear infinite;
}
@keyframes koc-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 600px) {
  .koc-enquire-grid {
    grid-template-columns: 1fr;
  }
  .koc-enquire-form {
    padding: 20px;
  }
}
````

## File: apps/client/components/site-header.tsx
````typescript
"use client";

import { BUSINESS_INFO } from "@kings-of-cars/contracts/business";
import { Heart, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { label: "Home", href: "/" },
  { label: "BUY A CAR", href: "/cars" },
  { label: "Finance Solution", href: "/finance" },
  { label: "Finance Calculator", href: "/finance" },
  { label: "About Us", href: "/about" },
  { label: "SELL A CAR", href: "/sell-your-car" },
  { label: "Contact Us", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="koc-site-header koc-legacy-header">
      <div className="koc-header-top">
        <div className="koc-container koc-header-top-inner">
          <div className="koc-legacy-top-left">
            <Link href="/">{BUSINESS_INFO.brandName}</Link>
            <Link href="/cars" className="koc-wishlist">
              <Heart size={12} fill="currentColor" /> Wishlist
            </Link>
          </div>
          <div className="koc-legacy-top-phones">
            {BUSINESS_INFO.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone size={9} /> {phone}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="koc-header-main">
        <div className="koc-container koc-header-main-inner">
          <Link
            href="/"
            className="koc-brand"
            aria-label={`${BUSINESS_INFO.brandName} home`}
          >
            <Image
              src="/logo.png"
              alt={BUSINESS_INFO.brandName}
              width={180}
              height={64}
              priority
              className="koc-logo"
            />
          </Link>
          <nav className="koc-desktop-nav" aria-label="Main navigation">
            {nav.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            className="koc-header-whatsapp"
            href={`${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with King of Cars on WhatsApp"
          >
            WhatsApp
          </a>
          <button
            className="koc-menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="koc-mobile-nav" aria-label="Mobile navigation">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </a>
          <Link href="/cars" onClick={() => setOpen(false)}>
            <Heart size={14} /> Wishlist
          </Link>
        </nav>
      )}
    </header>
  );
}
````

## File: apps/client/components/whatsapp-float.tsx
````typescript
"use client";

import { BUSINESS_INFO } from "@kings-of-cars/contracts/business";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppFloat() {
  const href = `${BUSINESS_INFO.whatsapp.baseUrl}?text=${encodeURIComponent(BUSINESS_INFO.messages.general)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${BUSINESS_INFO.brandName} on WhatsApp`}
      title="Chat with King of Cars on WhatsApp"
      style={{
        position: "fixed",
        right: 22,
        bottom: 22,
        zIndex: 1000,
        width: 58,
        height: 58,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        background: "#25D366",
        color: "#fff",
        boxShadow: "0 10px 28px rgba(0,0,0,.25)",
        textDecoration: "none",
        transition: "transform .2s ease, box-shadow .2s ease",
      }}
    >
      <FaWhatsapp size={31} aria-hidden="true" />
    </a>
  );
}
````

## File: apps/client/next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kings-of-cars/contracts", "@kings-of-cars/supabase"],
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default nextConfig;
````

## File: biome.json
````json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**", "!**/node_modules", "!**/.next", "!**/dist", "!**/build"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": {
        "noAriaHiddenOnFocusable": "off",
        "noLabelWithoutControl": "off",
        "noStaticElementInteractions": "off",
        "noSvgWithoutTitle": "off",
        "useButtonType": "off",
        "useKeyWithClickEvents": "off",
        "useMediaCaption": "off",
        "useSemanticElements": "off"
      },
      "correctness": {
        "noInvalidUseBeforeDeclaration": "off",
        "useExhaustiveDependencies": "off"
      },
      "performance": {
        "noImgElement": "off"
      },
      "security": {
        "noDangerouslySetInnerHtml": "off"
      },
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noArrayIndexKey": "off",
        "noAssignInExpressions": "off",
        "noExplicitAny": "off",
        "noImplicitAnyLet": "off",
        "useIterableCallbackReturn": "off",
        "noUnknownAtRules": "off"
      }
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
````

## File: packages/contracts/src/env.ts
````typescript
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;
````

## File: packages/contracts/src/revalidation.ts
````typescript
import { z } from "zod";

export const revalidationModeSchema = z.enum(["max", "immediate"]);
export type RevalidationMode = z.infer<typeof revalidationModeSchema>;

export const revalidationPayloadSchema = z.object({
  tags: z.array(z.string()).optional(),
  paths: z.array(z.string()).optional(),
  tag: z.string().optional(),
  path: z.string().optional(),
  mode: revalidationModeSchema.optional(),
});

export type RevalidationPayload = z.infer<typeof revalidationPayloadSchema>;
````

## File: packages/supabase/src/Mutations/leads.ts
````typescript
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
````

## File: pnpm-workspace.yaml
````yaml
packages:
  - "apps/*"
  - "packages/*"

catalog:
  next: "16.2.7"
  react: "19.2.4"
  react-dom: "19.2.4"
  typescript: "5.9.3"
  lucide-react: "^1.17.0"
  zod: "^4.4.3"
  "@types/node": "^22.19.19"
  "@types/react": "19.2.4"
  "@types/react-dom": "19.2.3"
  "@biomejs/biome": "2.2.0"
  turbo: "^2.9.14"
  "@supabase/supabase-js": "^2.107.0"
  "@supabase/ssr": "^0.10.3"
  react-icons: "^5.5.0"
  playwright: "1.55.0"
  "@sparticuz/chromium": "149.0.0"
````

## File: scripts/import-kingofcars-batch.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";

const SHOWROOM_URL =
  process.env.KINGS_OF_CARS_SHOWROOM_URL ??
  "https://www.kingofcars.co.za/boksburg-used-cars";
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MAX_PAGES = Number(process.env.KINGS_OF_CARS_MAX_PAGES ?? 40);
const BATCH_SIZE = Number(process.env.KINGS_OF_CARS_BATCH_SIZE ?? 20);
const BATCH_OFFSET = Number(process.env.KINGS_OF_CARS_BATCH_OFFSET ?? 0);
const CONCURRENCY = Number(process.env.KINGS_OF_CARS_DETAIL_CONCURRENCY ?? 3);

if (!SUPABASE_URL || !SERVICE_ROLE_KEY)
  throw new Error("Missing Supabase credentials");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const clean = (v) =>
  String(v ?? "")
    .replace(/\s+/g, " ")
    .trim();
const slugify = (v) =>
  clean(v)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const num = (v) => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const int = (v) => {
  const n = Number(String(v ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

function parseJsonLd(blocks) {
  const out = [];
  for (const raw of blocks) {
    try {
      const x = JSON.parse(raw);
      if (Array.isArray(x)) out.push(...x);
      else if (x?.["@graph"]) out.push(...x["@graph"]);
      else out.push(x);
    } catch {}
  }
  return out;
}
function pickVehicle(items) {
  return (
    items.find(
      (x) =>
        ["Vehicle", "Car", "Product"].includes(x?.["@type"]) ||
        (Array.isArray(x?.["@type"]) &&
          x["@type"].some((t) => ["Vehicle", "Car", "Product"].includes(t))),
    ) ?? null
  );
}
function textValue(text, re) {
  const m = text.match(re);
  return m?.[1] ? clean(m[1]) : null;
}

function makeVehicle({ url, title, description, text, jsonLdBlocks, images }) {
  const item = pickVehicle(parseJsonLd(jsonLdBlocks));
  const name = clean(item?.name || title);
  if (!name) return null;
  const make =
    clean(
      item?.brand?.name ||
        item?.manufacturer?.name ||
        item?.make ||
        textValue(text, /\bMake\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const model =
    clean(
      item?.model ||
        item?.vehicleModel ||
        textValue(text, /\bModel\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const variant =
    clean(
      item?.vehicleConfiguration ||
        item?.trim ||
        item?.variant ||
        textValue(text, /\bVariant\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const year = int(
    item?.vehicleModelDate ||
      item?.modelDate ||
      textValue(text, /\b(?:Year|Model Year)\s*[:-]\s*(20\d{2})/i),
  );
  const mileage = int(
    item?.mileageFromOdometer?.value ??
      item?.mileage ??
      textValue(text, /\bMileage\s*[:-]?\s*([0-9,]+)/i),
  );
  const price = num(
    item?.offers?.price ??
      item?.offers?.lowPrice ??
      item?.price ??
      textValue(text, /\bPrice\s*[:-]?\s*R?\s*([0-9,.]+)/i),
  );
  const transmission =
    clean(
      item?.vehicleTransmission ||
        item?.transmission ||
        textValue(text, /\bTransmission\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const fuelType =
    clean(
      item?.fuelType || textValue(text, /\bFuel(?: Type)?\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const colour =
    clean(
      item?.color ||
        item?.colour ||
        textValue(text, /\bColou?r\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const bodyType =
    clean(
      item?.bodyType || textValue(text, /\bBody Type\s*[:-]\s*([^|\n]+)/i),
    ) || null;
  const stockNumber =
    clean(
      item?.sku ||
        item?.mpn ||
        item?.productID ||
        textValue(
          text,
          /\bStock(?: Number| No\.?| #)?\s*[:#-]?\s*([A-Z0-9-]+)/i,
        ),
    ) || null;
  const displayName =
    [year, make, model, variant].filter(Boolean).join(" ") || name;
  const vehicleId = images.join("|").match(/\/Used\/(\d+)\//i)?.[1] || null;
  const sourceKey = stockNumber || vehicleId || slugify(displayName);
  const slug = slugify(`${displayName}-${sourceKey}`);
  return {
    stock_number: stockNumber,
    slug,
    make: make || name.split(/\s+/)[0],
    model: model || name,
    variant,
    year,
    mileage,
    price,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    colour,
    description: clean(item?.description || description) || null,
    overview: clean(item?.description || description) || null,
    image_url: images[0] ?? null,
    gallery_urls: [...new Set(images)],
    source_url: url,
    source_updated_at: new Date().toISOString(),
    status: "available",
  };
}

async function discoverUrls(page) {
  const urls = new Set();
  for (let p = 1; p <= MAX_PAGES; p++) {
    await page.waitForTimeout(1200);
    const found = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.href),
    );
    for (const href of found)
      if (/^https:\/\/www\.kingofcars\.co\.za\/result\//i.test(href))
        urls.add(href.split("#")[0]);
    const clicked = await page.evaluate(() => {
      const els = [...document.querySelectorAll("a,button")];
      const next = els.find((e) => {
        const t = (e.textContent || "").trim().toLowerCase();
        const a = (e.getAttribute("aria-label") || "").toLowerCase();
        const c = String(e.className || "").toLowerCase();
        return (
          !e.disabled &&
          !e.classList.contains("disabled") &&
          (t === "next" ||
            t === "›" ||
            t === "»" ||
            a.includes("next") ||
            c.includes("next"))
        );
      });
      if (!next) return false;
      next.click();
      return true;
    });
    if (!clicked) break;
    await page.waitForTimeout(1600);
  }
  return [...urls];
}

async function scrape(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    const d = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const text = document.body?.innerText || "";
      const images = [
        ...new Set([
          ...[...document.images]
            .flatMap((i) => [
              i.currentSrc,
              i.src,
              i.dataset.src,
              i.dataset.lazySrc,
            ])
            .filter(Boolean),
          ...[
            ...html.matchAll(
              /https?:\/\/image\.blob\.ix\.co\.za\/Used\/[^"'\\s<>]+/gi,
            ),
          ].map((m) => m[0].replace(/&amp;/g, "&")),
        ]),
      ];
      return {
        text,
        title:
          document.querySelector("h1")?.textContent?.trim() || document.title,
        description:
          document.querySelector('meta[name="description"]')?.content || "",
        jsonLdBlocks: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((x) => x.textContent || ""),
        images,
      };
    });
    return makeVehicle({
      url,
      ...d,
      images: d.images.filter((x) =>
        /image\.blob\.ix\.co\.za\/Used\//i.test(x),
      ),
    });
  } finally {
    await page.close();
  }
}

async function upsertBatch(vehicles) {
  const unique = [...new Map(vehicles.map((v) => [v.slug, v])).values()];
  if (!unique.length) return 0;
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .upsert(unique, { onConflict: "slug" })
    .select("id,slug");
  if (error) throw error;
  const idBySlug = new Map((data || []).map((r) => [r.slug, r.id]));
  for (const v of unique) {
    const id = idBySlug.get(v.slug);
    if (!id) continue;
    const { error: delError } = await supabase
      .from("KingsOfCars_vehicle_images")
      .delete()
      .eq("vehicle_id", id);
    if (delError) throw delError;
    if (v.gallery_urls.length) {
      const rows = v.gallery_urls.map((image_url, sort_order) => ({
        vehicle_id: id,
        image_url,
        sort_order,
        is_primary: sort_order === 0,
        alt_text: v.slug,
      }));
      const { error: imgError } = await supabase
        .from("KingsOfCars_vehicle_images")
        .insert(rows);
      if (imgError) throw imgError;
    }
  }
  return unique.length;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(SHOWROOM_URL, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await page.waitForTimeout(2500);
    const urls = await discoverUrls(page);
    await page.close();
    console.log(
      `Discovered ${urls.length} vehicles. Batch offset=${BATCH_OFFSET}, size=${BATCH_SIZE}`,
    );
    const batchUrls = urls.slice(BATCH_OFFSET, BATCH_OFFSET + BATCH_SIZE);
    if (!batchUrls.length) {
      console.log("No vehicles in this batch.");
      return;
    }
    const vehicles = [];
    for (let i = 0; i < batchUrls.length; i += CONCURRENCY) {
      const chunk = batchUrls.slice(i, i + CONCURRENCY);
      const result = await Promise.all(
        chunk.map((u) =>
          scrape(browser, u).catch((e) => {
            console.warn(`[skip] ${u}: ${e.message}`);
            return null;
          }),
        ),
      );
      vehicles.push(...result.filter(Boolean));
      console.log(
        `Scraped ${Math.min(i + chunk.length, batchUrls.length)}/${batchUrls.length}`,
      );
    }
    const count = await upsertBatch(vehicles);
    console.log(
      `Imported batch ${BATCH_OFFSET}-${BATCH_OFFSET + batchUrls.length - 1}: ${count} vehicles`,
    );
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
````

## File: scripts/normalize-kingofcars-poa.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// All supplied King of Cars Boksburg listings are POA.
// A NULL numeric price is intentional: the client renders NULL as POA.
const { data, error } = await supabase
  .from("KingsOfCars_vehicles")
  .update({ price: null })
  .eq("source_url", "https://www.kingofcars.co.za/boksburg-used-cars")
  .select("id,stock_number,slug");

if (error)
  throw new Error(`Unable to normalize POA vehicles: ${error.message}`);

console.log(`Normalized ${data?.length ?? 0} King of Cars vehicles to POA.`);
````

## File: scripts/seed-kingofcars-batch-1.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const cars = [
  {
    stock_number: "9089517",
    slug: "2025-toyota-land-cruiser-79-2-8-gd-6-d-c-at-9089517",
    make: "Toyota",
    model: "Land Cruiser 79",
    variant: "2.8 GD-6 D/C AT",
    year: 2025,
    mileage: null,
    price: 1499950,
    body_type: "Double Cab",
    transmission: "Automatic",
    fuel_type: "Diesel",
    colour: "White",
    description: "Toyota Land Cruiser 79 2.8 GD-6 D/C AT",
    overview: "Toyota Land Cruiser 79 2.8 GD-6 D/C AT",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: [
      "https://image.blob.ix.co.za/Used/9089517/1/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-1-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/2/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-2-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/3/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-3-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/4/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-4-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/5/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-5-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/6/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-6-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/7/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-7-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/8/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-8-832x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/9/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-9-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/9089517/10/2025-White-Toyota-Land-Cruiser-79-28-GD-6-DC-AT-9089517-10-1023x768.jpg",
    ],
  },
  {
    stock_number: "8927634",
    slug: "2024-ineos-grenadier-3-0td-8927634",
    make: "INEOS",
    model: "Grenadier",
    variant: "3.0TD",
    year: 2024,
    mileage: null,
    price: null,
    body_type: "SUV",
    transmission: null,
    fuel_type: "Diesel",
    colour: "White",
    description: "INEOS Grenadier 3.0TD",
    overview: "INEOS Grenadier 3.0TD",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: [
      "https://image.blob.ix.co.za/Used/8927634/1/2024-White-INEOS-Grenadier-30TD-8927634-1-630x767.jpg",
      "https://image.blob.ix.co.za/Used/8927634/2/2024-White-INEOS-Grenadier-30TD-8927634-2-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8927634/3/2024-White-INEOS-Grenadier-30TD-8927634-3-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8927634/4/2024-White-INEOS-Grenadier-30TD-8927634-4-624x767.jpg",
      "https://image.blob.ix.co.za/Used/8927634/5/2024-White-INEOS-Grenadier-30TD-8927634-5-853x768.jpg",
      "https://image.blob.ix.co.za/Used/8927634/6/2024-White-INEOS-Grenadier-30TD-8927634-6-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8927634/7/2024-White-INEOS-Grenadier-30TD-8927634-7-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8927634/8/2024-White-INEOS-Grenadier-30TD-8927634-8-1023x768.jpg",
    ],
  },
  {
    stock_number: "8898568",
    slug: "2026-volkswagen-amarok-3-0-tdi-v6-4motion-panamericana-auto-d-c-8898568",
    make: "Volkswagen",
    model: "Amarok",
    variant: "3.0 TDI V6 4Motion PanAmericana Auto D/C",
    year: 2026,
    mileage: null,
    price: null,
    body_type: "Double Cab",
    transmission: "Automatic",
    fuel_type: "Diesel",
    colour: "White",
    description: "Volkswagen Amarok 3.0 TDI V6 4Motion PanAmericana Auto D/C",
    overview: "Volkswagen Amarok 3.0 TDI V6 4Motion PanAmericana Auto D/C",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: [
      "https://image.blob.ix.co.za/Used/8898568/1/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-1-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/2/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-2-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/3/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-3-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/4/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-4-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/5/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-5-867x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/6/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-6-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/7/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-7-1023x768.jpg",
      "https://image.blob.ix.co.za/Used/8898568/8/2026-White-Volkswagen-Light-Commercial-Amarok-30-TDI-V6-4Motion-PanAmericana-Auto-DC-8898568-8-1023x768.jpg",
    ],
  },
  {
    stock_number: "8764953",
    slug: "2020-toyota-land-cruiser-79-4-5d-v8-p-u-d-c-8764953",
    make: "Toyota",
    model: "Land Cruiser 79",
    variant: "4.5D V8 P/U D/C",
    year: 2020,
    mileage: null,
    price: null,
    body_type: "Double Cab",
    transmission: null,
    fuel_type: "Diesel",
    colour: "White",
    description: "Toyota Land Cruiser 79 4.5D V8 P/U D/C",
    overview: "Toyota Land Cruiser 79 4.5D V8 P/U D/C",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: Array.from(
      { length: 9 },
      (_, i) =>
        `https://image.blob.ix.co.za/Used/8764953/${i + 1}/2020-White-Toyota-Land-Cruiser-79-79-45D-V8-PU-DC-8764953-${i + 1}-1023x768.jpg`,
    ),
  },
  {
    stock_number: "9011950",
    slug: "2023-ineos-grenadier-3-0td-trialmaster-9011950",
    make: "INEOS",
    model: "Grenadier",
    variant: "3.0TD Trialmaster",
    year: 2023,
    mileage: null,
    price: null,
    body_type: "SUV",
    transmission: null,
    fuel_type: "Diesel",
    colour: "Beige",
    description: "INEOS Grenadier 3.0TD Trialmaster",
    overview: "INEOS Grenadier 3.0TD Trialmaster",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: Array.from(
      { length: 16 },
      (_, i) =>
        `https://image.blob.ix.co.za/Used/9011950/${i + 1}/2023-Beige-INEOS-Grenadier-30TD-Trialmaster-9011950-${i + 1}-1023x768.jpg`,
    ),
  },
  {
    stock_number: "9027426",
    slug: "2017-porsche-718-cayman-s-9027426",
    make: "Porsche",
    model: "718 Cayman",
    variant: "S",
    year: 2017,
    mileage: null,
    price: null,
    body_type: "Coupe",
    transmission: null,
    fuel_type: null,
    colour: "White",
    description: "Porsche 718 Cayman S",
    overview: "Porsche 718 Cayman S",
    source_url: "https://www.kingofcars.co.za/boksburg-used-cars",
    source_updated_at: new Date().toISOString(),
    status: "available",
    gallery_urls: Array.from(
      { length: 13 },
      (_, i) =>
        `https://image.blob.ix.co.za/Used/9027426/${i + 1}/2017-White-Porsche-Cayman-718-Cayman-S-9027426-${i + 1}-1023x768.jpg`,
    ),
  },
];

for (const car of cars) {
  const image_url = car.gallery_urls[0] ?? null;
  const { gallery_urls, ...vehicle } = car;
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .upsert({ ...vehicle, image_url }, { onConflict: "slug" })
    .select("id,slug")
    .single();
  if (error) throw new Error(`${car.stock_number}: ${error.message}`);

  const { error: deleteError } = await supabase
    .from("KingsOfCars_vehicle_images")
    .delete()
    .eq("vehicle_id", data.id);
  if (deleteError)
    throw new Error(`${car.stock_number}: ${deleteError.message}`);

  if (gallery_urls.length) {
    const rows = gallery_urls.map((image_url, sort_order) => ({
      vehicle_id: data.id,
      image_url,
      sort_order,
      is_primary: sort_order === 0,
      alt_text: car.variant
        ? `${car.make} ${car.model} ${car.variant}`
        : `${car.make} ${car.model}`,
    }));
    const { error: imageError } = await supabase
      .from("KingsOfCars_vehicle_images")
      .insert(rows);
    if (imageError)
      throw new Error(`${car.stock_number}: ${imageError.message}`);
  }

  console.log(`Seeded ${car.stock_number}: ${car.make} ${car.model}`);
}

console.log(`Seeded ${cars.length} vehicles.`);
````

## File: scripts/verify-kings-of-cars-inventory.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { count: total, error: totalError } = await supabase
  .from("KingsOfCars_vehicles")
  .select("id", { count: "exact", head: true });
if (totalError) throw totalError;

const { count: available, error: availableError } = await supabase
  .from("KingsOfCars_vehicles")
  .select("id", { count: "exact", head: true })
  .eq("status", "available");
if (availableError) throw availableError;

const { count: sourceRows, error: sourceError } = await supabase
  .from("KingsOfCars_vehicles")
  .select("id", { count: "exact", head: true })
  .ilike("source_url", "%kingofcars.co.za%");
if (sourceError) throw sourceError;

const { count: withImages, error: imageError } = await supabase
  .from("KingsOfCars_vehicles")
  .select("id", { count: "exact", head: true })
  .ilike("source_url", "%kingofcars.co.za%")
  .not("image_url", "is", null);
if (imageError) throw imageError;

console.log(
  JSON.stringify(
    {
      total,
      available,
      kingOfCarsSourceRows: sourceRows,
      kingOfCarsRowsWithImages: withImages,
    },
    null,
    2,
  ),
);

if ((sourceRows ?? 0) < 50)
  throw new Error(
    `Verification failed: only ${sourceRows ?? 0} King of Cars rows are present.`,
  );
if ((withImages ?? 0) < 50)
  throw new Error(
    `Verification failed: only ${withImages ?? 0} King of Cars rows have primary images.`,
  );

console.log(
  "VERIFIED: at least 50 King of Cars vehicles with images are present in Supabase.",
);
````

## File: apps/client/components/enquire-form.tsx
````typescript
"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { submitEnquiry } from "../app/actions";
import "./enquire-form.css";

type Props = { vehicleId: string; vehicleTitle: string };

export function EnquireForm({ vehicleId, vehicleTitle }: Props) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("vehicleId", vehicleId);
    const result = await submitEnquiry(form);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
    event.currentTarget.reset();
  }

  if (sent)
    return (
      <div className="koc-enquire-success">
        <CheckCircle2 size={28} />
        <h3>Thank you</h3>
        <p>
          Your enquiry has been received. The Kings of Cars team will contact
          you shortly.
        </p>
      </div>
    );
  return (
    <form className="koc-enquire-form" onSubmit={submit}>
      <div className="koc-kicker">Get in touch</div>
      <h2 className="koc-display">Enquire about this vehicle</h2>
      <p className="koc-enquire-vehicle">{vehicleTitle}</p>
      <label>
        Name
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
        />
      </label>
      <div className="koc-enquire-grid">
        <label>
          Email
          <input
            name="email"
            type="email"
            maxLength={320}
            autoComplete="email"
          />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          rows={5}
          maxLength={5000}
          defaultValue={`I am interested in the ${vehicleTitle}.`}
        />
      </label>
      {error && (
        <p className="koc-enquire-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="koc-button koc-button-primary"
        type="submit"
        disabled={busy}
      >
        {busy ? <Loader2 size={16} className="koc-spin" /> : <Send size={16} />}{" "}
        {busy ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
````

## File: packages/contracts/package.json
````json
{
  "name": "@kings-of-cars/contracts",
  "version": "0.1.0",
  "private": true,
  "exports": {
    "./actionResult": "./src/actionResult.ts",
    "./business": "./src/business.ts",
    "./car": "./src/car.ts",
    "./service": "./src/service.ts",
    "./gallery": "./src/gallery.ts",
    "./contact": "./src/contact.ts",
    "./env": "./src/env.ts",
    "./lead": "./src/lead.ts",
    "./revalidation": "./src/revalidation.ts"
  },
  "dependencies": {
    "zod": "catalog:"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
````

## File: packages/contracts/src/actionResult.ts
````typescript
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
````

## File: packages/contracts/src/contact.ts
````typescript
import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  createdAt: z.string().optional(),
});

export type ContactType = z.infer<typeof contactSchema>;
````

## File: packages/supabase/src/Queries/cars.ts
````typescript
import type { CarType } from "@kings-of-cars/contracts/car";
import { createSupabasePublicClient } from "../server";
import type { Database } from "../supabaseType";

type CarRow = Database["public"]["Tables"]["KingsOfCars_vehicles"]["Row"];

function normalizeCar(row: CarRow, galleryUrls: string[]): CarType {
  return {
    id: row.id,
    stockNumber: row.stock_number,
    slug: row.slug,
    make: row.make,
    model: row.model,
    variant: row.variant,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    monthlyPayment: row.monthly_payment,
    bodyType: row.body_type,
    transmission: row.transmission,
    fuelType: row.fuel_type,
    colour: row.colour,
    engineSize: row.engine_size,
    powerKw: row.power_kw,
    description: row.description,
    overview: row.overview,
    features: row.features ?? [],
    healthCheck: (row.health_check ?? {}) as CarType["healthCheck"],
    imageUrl: row.image_url,
    galleryUrls,
    status: row.status,
    featured: row.featured,
    sourceUrl: row.source_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadGallery(
  supabase: ReturnType<typeof createSupabasePublicClient>,
  carIds: string[],
) {
  const { data, error } = await supabase
    .from("KingsOfCars_vehicle_images")
    .select("vehicle_id, image_url")
    .in("vehicle_id", carIds)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load vehicle images: ${error.message}`);
  }

  const galleryByCar = new Map<string, string[]>();
  for (const image of data ?? []) {
    if (!image.vehicle_id || !image.image_url) continue;
    const current = galleryByCar.get(image.vehicle_id) ?? [];
    current.push(image.image_url);
    galleryByCar.set(image.vehicle_id, current);
  }
  return galleryByCar;
}

export async function getCars(): Promise<CarType[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("*")
    .eq("status", "available")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load vehicles: ${error.message}`);
  }

  const rows = data ?? [];
  const galleryByCar = rows.length
    ? await loadGallery(
        supabase,
        rows.map((row) => row.id),
      )
    : new Map<string, string[]>();

  return rows.map((row) => normalizeCar(row, galleryByCar.get(row.id) ?? []));
}

export async function getCarBySlug(slug: string): Promise<CarType | undefined> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load vehicle: ${error.message}`);
  }

  if (!data) return undefined;
  const galleryByCar = await loadGallery(supabase, [data.id]);
  return normalizeCar(data, galleryByCar.get(data.id) ?? []);
}
````

## File: scripts/sync-kings-of-cars-live-pages.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = Math.max(
  Number(process.env.KINGS_OF_CARS_LIVE_CONCURRENCY ?? 4),
  1,
);
const MIN_ROWS = Math.max(
  Number(process.env.KINGS_OF_CARS_MIN_SYNC_ROWS ?? 50),
  1,
);

if (!SUPABASE_URL || !SERVICE_ROLE_KEY)
  throw new Error(
    "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const clean = (value) =>
  String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const numberValue = (value) => {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const sourceStockFromImage = (imageUrl) =>
  String(imageUrl ?? "").match(/\/Used\/(\d+)\//i)?.[1] ?? null;
const resultUrl = (row) => {
  if (row.source_url) return row.source_url;
  const stock = sourceStockFromImage(row.image_url);
  return stock
    ? `https://www.kingofcars.co.za/result/VehicleStockSearch-BarTile/${stock}_Lead_Inline__PCM_PCP_SVV`
    : null;
};
const linesFromText = (text) =>
  String(text ?? "")
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean);
const firstMatch = (text, regex) =>
  clean(String(text ?? "").match(regex)?.[1] ?? "") || null;

function inferFuel(text, fallback = null) {
  const value = clean(text).toLowerCase();
  if (
    /\b(diesel|tdi|d-4d|d4d|gd-6|gd6|2\.8d|2\.5d|3\.0d|4\.5d|4\.5d v8|bi[- ]?turbo diesel|turbo diesel)\b/.test(
      value,
    )
  )
    return "Diesel";
  if (
    /\b(petrol|fsi|tsi|t-gdi|tgdi|vti|mpi|gti|ecoboost|e[- ]?power)\b/.test(
      value,
    )
  )
    return "Petrol";
  if (/\b(hybrid|hev|phev)\b/.test(value)) return "Hybrid";
  if (/\belectric\b|\bev\b/.test(value)) return "Electric";
  return fallback;
}

function inferTransmission(text, fallback = null) {
  const value = clean(text).toLowerCase();
  if (/\bmanual\b|\bm\/t\b|\bmt\b/.test(value)) return "Manual";
  if (
    /\bautomatic\b|\ba\/t\b|\bat\b|\bauto\b|\bdct\b|\bdsg\b|\bcvt\b|\bzf automatic\b/.test(
      value,
    )
  )
    return "Automatic";
  return fallback;
}

function parseLivePage(text, fallback) {
  const lines = linesFromText(text);
  const mileageIndex = lines.findIndex((line) =>
    /^\d[\d\s,]*\s*km$/i.test(line),
  );
  const mileage = mileageIndex >= 0 ? numberValue(lines[mileageIndex]) : null;
  const colour = mileageIndex >= 0 ? (lines[mileageIndex + 1] ?? null) : null;
  const boksburgIndex = lines.findIndex(
    (line, index) => index > mileageIndex && /Boksburg/i.test(line),
  );
  const afterLocation =
    boksburgIndex >= 0
      ? lines.slice(boksburgIndex + 1, boksburgIndex + 12)
      : [];
  const bodyType =
    afterLocation.find((line) =>
      /^(single cab|double cab|extra cab|crew cab|hatchback|sedan|suv|coupe|convertible|panel van|mpv|bus|wagon|station wagon|bakkie|pickup|pick-up)$/i.test(
        line,
      ),
    ) ?? null;
  const transmission = inferTransmission(afterLocation.join(" "), null);
  const fuelType = inferFuel(afterLocation.join(" "), null);
  const yearIndex = lines.findIndex((line) => /^20\d{2}$/.test(line));
  const title = yearIndex >= 0 ? (lines[yearIndex + 1] ?? null) : null;
  const price = firstMatch(text, /Price\s*:\s*R\s*([0-9\s,]+)/i);
  const monthlyPayment = firstMatch(text, /R\s*([0-9\s,]+)\s*pm/i);
  const powerKw = firstMatch(text, /([0-9]+)\s*kW\b/i);
  const engineCc = firstMatch(text, /Engine\s*CC\s*([0-9]+)/i);
  const sourceReference = firstMatch(text, /Listing\s*ref\s+([A-Z0-9-]+)/i);
  const titleAndSpecs = `${title ?? ""} ${afterLocation.join(" ")}`;

  return {
    title,
    year: yearIndex >= 0 ? numberValue(lines[yearIndex]) : fallback.year,
    mileage,
    price: numberValue(price),
    monthly_payment: numberValue(monthlyPayment),
    colour,
    body_type: bodyType,
    transmission:
      transmission ?? inferTransmission(titleAndSpecs, fallback.transmission),
    fuel_type: fuelType ?? inferFuel(titleAndSpecs, fallback.fuel_type),
    power_kw: numberValue(powerKw),
    engine_size: engineCc ? `${engineCc} cc` : null,
    source_reference: sourceReference,
  };
}

function splitTitle(title, fallback) {
  if (!title) return fallback;
  const value = clean(title);
  const knownMakes = [
    "Toyota",
    "Volkswagen",
    "Hyundai",
    "Ford",
    "Nissan",
    "Kia",
    "Suzuki",
    "Renault",
    "BMW",
    "Mercedes-Benz",
    "Mercedes",
    "Audi",
    "Lexus",
    "Land Rover",
    "Jaguar",
    "Isuzu",
    "Mahindra",
    "Chery",
    "Haval",
    "GWM",
    "LDV",
    "Jetour",
    "Volvo",
    "Honda",
    "Mazda",
    "Mitsubishi",
    "Subaru",
    "Peugeot",
    "Citroen",
    "Opel",
    "Fiat",
    "Jeep",
    "Porsche",
    "Mini",
    "Alfa Romeo",
  ];
  const make = knownMakes.find((candidate) =>
    value.startsWith(`${candidate} `),
  );
  if (!make) return fallback;
  const remainder = value.slice(make.length).trim();
  const modelWords = remainder.split(/\s+/);
  const model = modelWords.slice(0, Math.min(3, modelWords.length)).join(" ");
  const variant = modelWords.slice(model.split(/\s+/).length).join(" ") || null;
  return { ...fallback, make, model, variant };
}

async function enrichRow(browser, row) {
  const url = resultUrl(row);
  if (!url) return { row, ok: false, reason: "no source URL" };
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(700);
    const card = page.locator("article.koc-legacy-vehicle-card").first();
    const cardCount = await page
      .locator("article.koc-legacy-vehicle-card")
      .count();
    const text =
      cardCount > 0
        ? await card.innerText()
        : await page.locator("body").innerText();
    const parsed = parseLivePage(text, row);
    const identity = splitTitle(parsed.title, {
      make: row.make,
      model: row.model,
      variant: row.variant,
    });
    const patch = {
      source_url: url,
      source_updated_at: new Date().toISOString(),
      year: parsed.year ?? row.year,
      mileage: parsed.mileage ?? row.mileage,
      price: parsed.price ?? row.price,
      monthly_payment: parsed.monthly_payment ?? row.monthly_payment,
      colour: parsed.colour || row.colour,
      body_type: parsed.body_type || row.body_type,
      transmission: parsed.transmission || row.transmission,
      fuel_type: parsed.fuel_type || row.fuel_type,
      power_kw: parsed.power_kw ?? row.power_kw,
      engine_size: parsed.engine_size || row.engine_size,
      make: identity.make || row.make,
      model: identity.model || row.model,
      variant: identity.variant || row.variant,
      vehicle_name: parsed.title || row.vehicle_name,
    };
    return { row, patch, ok: true, url };
  } catch (error) {
    return {
      row,
      ok: false,
      url,
      reason: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const { data: rows, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!rows?.length || rows.length < MIN_ROWS)
    throw new Error(
      `Only ${rows?.length ?? 0} available rows found; refusing live enrichment.`,
    );

  const browser = await chromium.launch({ headless: true });
  let cursor = 0;
  let success = 0;
  let failed = 0;
  try {
    async function worker() {
      while (true) {
        const index = cursor++;
        if (index >= rows.length) return;
        const result = await enrichRow(browser, rows[index]);
        if (!result.ok) {
          failed += 1;
          console.warn(
            `LIVE FAIL ${index + 1}/${rows.length} ${rows[index].id}: ${result.reason}`,
          );
          continue;
        }
        const { error: updateError } = await supabase
          .from("KingsOfCars_vehicles")
          .update(result.patch)
          .eq("id", rows[index].id);
        if (updateError) throw updateError;
        success += 1;
        console.log(
          `LIVE OK ${success + failed}/${rows.length}: ${result.patch.vehicle_name ?? rows[index].id}`,
        );
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, rows.length) }, worker),
    );
  } finally {
    await browser.close();
  }

  const { data: verification, error: verifyError } = await supabase
    .from("KingsOfCars_vehicles")
    .select(
      "id,make,model,variant,year,mileage,price,monthly_payment,body_type,transmission,fuel_type,colour,image_url,source_url",
    )
    .eq("status", "available");
  if (verifyError) throw verifyError;
  const missing = {
    transmission: (verification ?? []).filter((row) => !row.transmission)
      .length,
    fuel_type: (verification ?? []).filter((row) => !row.fuel_type).length,
    body_type: (verification ?? []).filter((row) => !row.body_type).length,
    image_url: (verification ?? []).filter((row) => !row.image_url).length,
    source_url: (verification ?? []).filter((row) => !row.source_url).length,
  };
  console.log(
    `LIVE ENRICHMENT COMPLETE: success=${success}; failed=${failed}; available=${verification?.length ?? 0}; missing=${JSON.stringify(missing)}`,
  );
}

main().catch((error) => {
  console.error("LIVE SYNC FAILED:", error);
  process.exit(1);
});
````

## File: packages/contracts/src/car.ts
````typescript
import { z } from "zod";

export const carStatusSchema = z.enum([
  "draft",
  "published",
  "reserved",
  "sold",
]);

export const carInputSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  price: z.number().nonnegative(),
  mileage: z.number().int().nonnegative(),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  colour: z.string().optional(),
  imageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).max(50).default([]),
  status: carStatusSchema.default("draft"),
});

export const carSchema = z.object({
  id: z.string().uuid(),
  stockNumber: z.string().nullable().optional(),
  slug: z.string(),
  make: z.string(),
  model: z.string(),
  variant: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  mileage: z.number().int().nullable().optional(),
  price: z.number().nullable().optional(),
  monthlyPayment: z.number().nullable().optional(),
  bodyType: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  fuelType: z.string().nullable().optional(),
  colour: z.string().nullable().optional(),
  engineSize: z.string().nullable().optional(),
  powerKw: z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  features: z.array(z.string()).default([]),
  healthCheck: z.record(z.string(), z.unknown()).default({}),
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).default([]),
  status: z.string(),
  featured: z.boolean().default(false),
  sourceUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CarType = z.infer<typeof carSchema>;

export type CarInput = z.infer<typeof carInputSchema>;
export type CarStatus = z.infer<typeof carStatusSchema>;
````

## File: packages/supabase/package.json
````json
{
  "name": "@kings-of-cars/supabase",
  "version": "0.1.0",
  "private": true,
  "exports": {
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./auth": "./src/auth.ts",
    "./cache": "./src/cache.ts",
    "./supabaseType": "./src/supabaseType.ts",
    "./Queries/cars": "./src/Queries/cars.ts",
    "./Mutations/leads": "./src/Mutations/leads.ts"
  },
  "scripts": {
    "supabase:types": "supabase gen types typescript --local > src/supabaseType.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@kings-of-cars/contracts": "workspace:*",
    "@supabase/ssr": "catalog:",
    "@supabase/supabase-js": "catalog:",
    "next": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:"
  }
}
````

## File: packages/supabase/src/cache.ts
````typescript
export const CACHE_TAGS = {
  cars: "cars",
  car: (id: string) => `car:${id}`,
} as const;

export const CACHE_PATHS = {
  home: "/",
  cars: "/cars",
  carDetail: (slug: string) => `/cars/${slug}`,
} as const;
````

## File: scripts/sync-kings-of-cars-v2.mjs
````javascript
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { fetchInventory, mapVehicle } from "./lib/kingofcars-engine-api-v2.mjs";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UPSERT_BATCH_SIZE = 50;
const MIN_SYNC_VEHICLES = Math.max(
  Number(process.env.KINGS_OF_CARS_MIN_SYNC_ROWS ?? 50),
  1,
);

if (!SUPABASE_URL || !SERVICE_ROLE_KEY)
  throw new Error(
    "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function upsert(rows) {
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .upsert(rows, { onConflict: "stock_number" })
    .select("id,slug");
  if (error) throw error;
  return data ?? [];
}

async function rebuildImages(vehicles, idsBySlug) {
  const ids = vehicles
    .map((vehicle) => idsBySlug.get(vehicle.slug))
    .filter(Boolean);
  if (!ids.length) return;
  const { error: deleteError } = await supabase
    .from("KingsOfCars_vehicle_images")
    .delete()
    .in("vehicle_id", ids);
  if (deleteError) throw deleteError;

  const imageRows = [];
  for (const vehicle of vehicles) {
    const vehicleId = idsBySlug.get(vehicle.slug);
    for (const [sortOrder, imageUrl] of vehicle.gallery_urls.entries()) {
      imageRows.push({
        vehicle_id: vehicleId,
        image_url: imageUrl,
        sort_order: sortOrder,
        is_primary: sortOrder === 0,
        alt_text: [vehicle.year, vehicle.make, vehicle.model, vehicle.variant]
          .filter(Boolean)
          .join(" "),
      });
    }
  }
  for (let index = 0; index < imageRows.length; index += 500) {
    const { error } = await supabase
      .from("KingsOfCars_vehicle_images")
      .insert(imageRows.slice(index, index + 500));
    if (error) throw error;
  }
}

async function removeStale(activeSlugs) {
  const { data, error } = await supabase
    .from("KingsOfCars_vehicles")
    .select("id,slug,source_url")
    .ilike("source_url", "%kingofcars.co.za%");
  if (error) throw error;
  const staleIds = (data ?? [])
    .filter((row) => !activeSlugs.has(row.slug))
    .map((row) => row.id);
  if (!staleIds.length) return 0;
  const { error: imageError } = await supabase
    .from("KingsOfCars_vehicle_images")
    .delete()
    .in("vehicle_id", staleIds);
  if (imageError) throw imageError;
  const { error: vehicleError } = await supabase
    .from("KingsOfCars_vehicles")
    .delete()
    .in("id", staleIds);
  if (vehicleError) throw vehicleError;
  return staleIds.length;
}

async function main() {
  const { rows, finalCount, partial } = await fetchInventory();
  const mapped = rows
    .map(mapVehicle)
    .filter((vehicle) => vehicle.slug && vehicle.model);
  const bySlug = [
    ...new Map(mapped.map((vehicle) => [vehicle.slug, vehicle])).values(),
  ];
  const vehicles = bySlug.filter(
    (vehicle, index) =>
      vehicle.stock_number === null ||
      bySlug.findIndex(
        (candidate) => candidate.stock_number === vehicle.stock_number,
      ) === index,
  );
  if (vehicles.length < MIN_SYNC_VEHICLES)
    throw new Error(`Mapped ${vehicles.length} vehicles; refusing sync.`);
  console.log(
    `Mapped ${vehicles.length} Boksburg vehicles from source count ${finalCount}; partial=${partial}.`,
  );

  const imported = [];
  for (let index = 0; index < vehicles.length; index += UPSERT_BATCH_SIZE) {
    imported.push(
      ...(await upsert(vehicles.slice(index, index + UPSERT_BATCH_SIZE))),
    );
    console.log(
      `Upserted ${Math.min(index + UPSERT_BATCH_SIZE, vehicles.length)}/${vehicles.length}`,
    );
  }

  const idsBySlug = new Map(imported.map((row) => [row.slug, row.id]));
  await rebuildImages(vehicles, idsBySlug);

  let stale = 0;
  if (!partial) {
    stale = await removeStale(new Set(vehicles.map((vehicle) => vehicle.slug)));
    console.log(`Removed ${stale} stale King of Cars rows.`);
  } else {
    console.log(
      `PARTIAL SYNC: preserved existing King of Cars rows because source count=${finalCount} exceeded returned rows=${rows.length}. No stale rows were deleted.`,
    );
  }

  const { count: total, error: totalError } = await supabase
    .from("KingsOfCars_vehicles")
    .select("id", { count: "exact", head: true });
  if (totalError) throw totalError;
  const { count: available, error: availableError } = await supabase
    .from("KingsOfCars_vehicles")
    .select("id", { count: "exact", head: true })
    .eq("status", "available");
  if (availableError) throw availableError;
  if ((available ?? 0) < MIN_SYNC_VEHICLES)
    throw new Error(`Verification failed: available=${available}`);
  console.log(
    `VERIFIED: total=${total}; available=${available}; imported=${vehicles.length}; source=${finalCount}; partial=${partial}`,
  );
  console.log("SUCCESS: Boksburg inventory sync completed.");
}

main().catch((error) => {
  console.error("SYNC FAILED:", error);
  process.exit(1);
});
````

## File: apps/client/app/cars/[slug]/page.tsx
````typescript
import {
  Camera,
  CheckCircle2,
  Fuel,
  Gauge,
  MapPin,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquireForm } from "../../../components/enquire-form";
import { VehicleGallery } from "../../../components/vehicle-gallery";
import { getCachedCarBySlug } from "../../_lib/cached-public-data";

const money = (value: number | null) =>
  value == null
    ? "POA"
    : new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }).format(value);
export const revalidate = 60;

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car: any = await getCachedCarBySlug(slug);
  if (!car) notFound();
  const title =
    `${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""} ${car.variant ?? ""}`
      .replace(/\s+/g, " ")
      .trim();
  const gallery = Array.from(
    new Set([
      ...(Array.isArray(car.galleryUrls) ? car.galleryUrls : []),
      ...(car.imageUrl ? [car.imageUrl] : []),
    ]),
  );
  const specs = [
    ["Year", car.year, Gauge],
    [
      "Mileage",
      car.mileage != null
        ? `${Number(car.mileage).toLocaleString("en-ZA")} km`
        : "—",
      Gauge,
    ],
    ["Transmission", car.transmission || "—", Settings2],
    ["Fuel", car.fuelType || "—", Fuel],
    ["Colour", car.colour || "—", null],
    ["Body type", car.bodyType || "—", null],
  ];

  return (
    <main className="koc-shell">
      <section
        style={{ background: "#111", color: "#fff", padding: "28px 0 64px" }}
      >
        <div className="koc-container">
          <Link
            href="/cars"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,.65)",
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".12em",
            }}
          >
            ← Back to showroom
          </Link>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.2fr) minmax(300px,.8fr)",
              gap: 36,
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 760 }}>
              <VehicleGallery images={gallery} alt={title} variant="square" />
            </div>
            <div>
              <div className="koc-kicker" style={{ color: "#e33a48" }}>
                Vehicle details
              </div>
              <h1
                className="koc-display"
                style={{ fontSize: "clamp(38px,5vw,70px)", marginTop: 10 }}
              >
                {car.make} {car.model}
              </h1>
              {car.variant && (
                <p
                  style={{
                    color: "rgba(255,255,255,.62)",
                    marginTop: 8,
                    fontSize: 15,
                  }}
                >
                  {car.variant}
                </p>
              )}
              <div style={{ fontSize: 30, fontWeight: 900, marginTop: 22 }}>
                {money(car.price)}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 12,
                  color: "rgba(255,255,255,.55)",
                  fontSize: 11,
                }}
              >
                <MapPin size={13} /> {car.location || "Boksburg"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "54px 0 70px" }}>
        <div className="koc-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 10,
            }}
          >
            {specs.map(([label, value, Icon]) => (
              <div
                className="koc-card"
                key={String(label)}
                style={{ padding: 20 }}
              >
                {Icon ? <Icon size={17} color="var(--koc-red)" /> : null}
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: ".12em",
                    fontWeight: 900,
                    color: "var(--koc-muted)",
                    marginTop: Icon ? 10 : 0,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontWeight: 900, marginTop: 7 }}>
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>

          <section style={{ marginTop: 64 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 24,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="koc-kicker">Vehicle gallery</div>
                <h2
                  className="koc-display"
                  style={{ fontSize: "clamp(34px,4vw,54px)", marginTop: 8 }}
                >
                  Every angle
                </h2>
                <p
                  style={{
                    color: "var(--koc-muted)",
                    margin: "12px 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  A visual walk-around of this vehicle. Click any photograph to
                  view it full screen.
                </p>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  border: "1px solid var(--koc-line)",
                  background: "#fff",
                  padding: "12px 16px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                }}
              >
                <Camera size={17} color="var(--koc-red)" />
                <strong>{gallery.length}</strong>
                <span style={{ color: "var(--koc-muted)" }}>photos</span>
              </div>
            </div>
            <VehicleGallery images={gallery} alt={title} variant="full" />
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.1fr) minmax(320px,.9fr)",
              gap: 50,
              marginTop: 70,
            }}
          >
            <article>
              <div className="koc-kicker">About this vehicle</div>
              <h2
                className="koc-display"
                style={{ fontSize: "clamp(34px,4vw,54px)", marginTop: 10 }}
              >
                Vehicle overview
              </h2>
              <p
                style={{
                  color: "var(--koc-muted)",
                  lineHeight: 1.8,
                  marginTop: 18,
                }}
              >
                {car.overview ||
                  car.description ||
                  "A quality pre-owned vehicle selected for the King of Cars showroom."}
              </p>
              {Array.isArray(car.features) && car.features.length > 0 && (
                <>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 42 }}>
                    Features &amp; equipment
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                      gap: 10,
                      marginTop: 18,
                    }}
                  >
                    {car.features.map((feature: string) => (
                      <div
                        key={feature}
                        className="koc-card"
                        style={{
                          padding: 14,
                          fontSize: 13,
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <CheckCircle2 size={15} color="var(--koc-red)" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
            <div>
              <EnquireForm vehicleId={car.id} vehicleTitle={title} />
              <aside
                className="koc-card"
                style={{ padding: 28, marginTop: 18 }}
              >
                <ShieldCheck color="var(--koc-red)" />
                <h3 style={{ fontSize: 22, fontWeight: 900, marginTop: 16 }}>
                  Vehicle confidence
                </h3>
                <p
                  style={{
                    color: "var(--koc-muted)",
                    lineHeight: 1.7,
                    marginTop: 10,
                  }}
                >
                  Vehicle information is maintained from the dealership
                  inventory source. Confirm final specification, availability
                  and pricing before purchase.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

## File: scripts/lib/kingofcars-engine-api.mjs
````javascript
const API_URL =
  process.env.KINGS_OF_CARS_ENGINE_API_URL ??
  "https://engineapi.e5.ix.co.za/api/v1.0/vehiclestocksearch/filter";
const DEALER_ID = Number(process.env.KINGS_OF_CARS_DEALER_ID ?? 13400);
const PAGE_SIZE = Number(process.env.KINGS_OF_CARS_PAGE_SIZE ?? 500);

const clean = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
const first = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : null;
};
const integerValue = (value) => {
  const number = numberValue(value);
  return number === null ? null : Math.round(number);
};
const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value
      .split(/[,|\n]/)
      .map(clean)
      .filter(Boolean);
  return [];
};
const pickImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object")
    return first(
      value.url,
      value.imageUrl,
      value.imageURL,
      value.src,
      value.href,
      value.originalUrl,
      value.largeUrl,
    );
  return null;
};

function extractImages(vehicle) {
  const candidates = [
    vehicle.images,
    vehicle.imageUrls,
    vehicle.galleryUrls,
    vehicle.gallery,
    vehicle.photos,
    vehicle.pictures,
    vehicle.media,
    vehicle.vehicleImages,
    vehicle.imageList,
  ];
  const urls = candidates.flatMap(asArray).map(pickImageUrl).filter(Boolean);
  const direct = [
    vehicle.imageUrl,
    vehicle.imageURL,
    vehicle.primaryImage,
    vehicle.primaryImageUrl,
    vehicle.mainImage,
    vehicle.thumbnail,
  ]
    .map(pickImageUrl)
    .filter(Boolean);
  return [...new Set([...direct, ...urls])];
}

function extractRows(payload) {
  const candidates = [
    payload?.vehicles,
    payload?.Vehicles,
    payload?.results,
    payload?.Results,
    payload?.items,
    payload?.Items,
    payload?.data,
    payload?.Data,
    payload?.stock,
    payload?.Stock,
    payload?.vehicleStock,
    payload?.VehicleStock,
    payload?.records,
    payload?.Records,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      for (const nested of [
        candidate.items,
        candidate.results,
        candidate.vehicles,
        candidate.data,
        candidate.records,
        candidate.Rows,
        candidate.rows,
        candidate.vehicleStock,
        candidate.VehicleStock,
        candidate.stock,
        candidate.Stock,
        candidate.list,
        candidate.List,
      ]) {
        if (Array.isArray(nested)) return nested;
      }
    }
  }
  return Array.isArray(payload) ? payload : [];
}

function extractCount(payload, rows) {
  return integerValue(
    first(
      payload?.finalCount,
      payload?.FinalCount,
      payload?.totalCount,
      payload?.TotalCount,
      payload?.count,
      payload?.Count,
      payload?.pagination?.total,
      payload?.Pagination?.Total,
      payload?.total,
      payload?.Total,
      rows.length,
    ),
  );
}

async function request(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      origin: "https://www.kingofcars.co.za",
      referer: "https://www.kingofcars.co.za/boksburg-used-cars",
      "user-agent": "KingsOfCarsInventorySync/1.0",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!response.ok) {
    const detail =
      typeof body === "string"
        ? body.slice(0, 1000)
        : JSON.stringify(body).slice(0, 1000);
    throw new Error(`King of Cars API ${response.status}: ${detail}`);
  }
  return body;
}

export async function fetchInventory() {
  const payloads = [
    { LimitToDealer: [DEALER_ID], page: 1, pageSize: PAGE_SIZE },
    { LimitToDealer: [DEALER_ID], Page: 1, PageSize: PAGE_SIZE },
    { limitToDealer: [DEALER_ID], page: 1, pageSize: PAGE_SIZE },
  ];
  let lastError;
  for (const payload of payloads) {
    try {
      const body = await request(payload);
      const rows = extractRows(body);
      const finalCount = extractCount(body, rows);
      console.log(
        `Engine API attempt ${JSON.stringify(payload)} -> rows=${rows.length}, finalCount=${finalCount}`,
      );
      if (rows.length > 0) return { rows, finalCount, payload };
      if (body?.vehicles && typeof body.vehicles === "object") {
        console.log(
          `Engine API vehicles keys: ${JSON.stringify(Object.keys(body.vehicles))}`,
        );
        console.log(
          `Engine API vehicles sample: ${JSON.stringify(body.vehicles).slice(0, 3000)}`,
        );
      }
    } catch (error) {
      lastError = error;
      console.warn(`Engine API attempt failed: ${error.message}`);
    }
  }
  throw lastError ?? new Error("King of Cars API returned no vehicle rows.");
}

export function mapVehicle(vehicle) {
  const images = extractImages(vehicle);
  const stockNumber =
    clean(
      first(
        vehicle.stockNumber,
        vehicle.StockNumber,
        vehicle.stockNo,
        vehicle.StockNo,
        vehicle.stockCode,
        vehicle.StockCode,
        vehicle.stock,
        vehicle.Stock,
        vehicle.reference,
        vehicle.Reference,
        vehicle.stockId,
        vehicle.StockId,
      ),
    ) || null;
  const year = integerValue(
    first(
      vehicle.year,
      vehicle.Year,
      vehicle.modelYear,
      vehicle.ModelYear,
      vehicle.yearOfManufacture,
      vehicle.YearOfManufacture,
    ),
  );
  const make =
    clean(
      first(
        vehicle.make,
        vehicle.Make,
        vehicle.manufacturer,
        vehicle.Manufacturer,
        vehicle.brand,
        vehicle.Brand,
      ),
    ) || "Unknown";
  const model =
    clean(
      first(
        vehicle.model,
        vehicle.Model,
        vehicle.vehicleModel,
        vehicle.VehicleModel,
        vehicle.description,
        vehicle.Description,
      ),
    ) || `Vehicle ${stockNumber ?? ""}`.trim();
  const variant =
    clean(
      first(
        vehicle.variant,
        vehicle.Variant,
        vehicle.derivative,
        vehicle.Derivative,
        vehicle.trim,
        vehicle.Trim,
      ),
    ) || null;
  const name = clean(
    first(
      vehicle.title,
      vehicle.Title,
      vehicle.name,
      vehicle.Name,
      vehicle.displayName,
      vehicle.DisplayName,
      [year, make, model, variant].filter(Boolean).join(" "),
    ),
  );
  const sourceUrl =
    first(
      vehicle.sourceUrl,
      vehicle.SourceUrl,
      vehicle.url,
      vehicle.Url,
      vehicle.detailUrl,
      vehicle.DetailUrl,
      vehicle.vehicleUrl,
      vehicle.VehicleUrl,
      vehicle.link,
      vehicle.Link,
    ) || null;
  const price = numberValue(
    first(
      vehicle.price,
      vehicle.Price,
      vehicle.sellingPrice,
      vehicle.SellingPrice,
      vehicle.cashPrice,
      vehicle.CashPrice,
      vehicle.salePrice,
      vehicle.SalePrice,
    ),
  );
  const monthlyPayment = numberValue(
    first(
      vehicle.monthlyPayment,
      vehicle.MonthlyPayment,
      vehicle.monthly,
      vehicle.Monthly,
      vehicle.payment,
      vehicle.Payment,
    ),
  );
  const mileage = integerValue(
    first(
      vehicle.mileage,
      vehicle.Mileage,
      vehicle.odometer,
      vehicle.Odometer,
      vehicle.km,
      vehicle.Km,
      vehicle.kilometres,
      vehicle.Kilometres,
    ),
  );
  const powerKw = integerValue(
    first(
      vehicle.powerKw,
      vehicle.PowerKw,
      vehicle.powerKW,
      vehicle.PowerKW,
      vehicle.kw,
      vehicle.Kw,
    ),
  );
  const description =
    clean(
      first(
        vehicle.description,
        vehicle.Description,
        vehicle.comments,
        vehicle.Comments,
        vehicle.overview,
        vehicle.Overview,
        name,
      ),
    ) || null;
  const features = [
    ...new Set(
      [
        ...asArray(vehicle.features),
        ...asArray(vehicle.Features),
        ...asArray(vehicle.optionalExtras),
        ...asArray(vehicle.OptionalExtras),
        ...asArray(vehicle.equipment),
        ...asArray(vehicle.Equipment),
      ]
        .map(clean)
        .filter(Boolean),
    ),
  ];
  const identity = stockNumber || sourceUrl || name;
  const slug = clean(
    `${year ?? ""}-${make}-${model}-${variant ?? ""}-${identity}`,
  )
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    stock_number: stockNumber,
    slug,
    make,
    model,
    variant,
    year,
    mileage,
    price,
    monthly_payment: monthlyPayment,
    body_type:
      clean(
        first(vehicle.bodyType, vehicle.BodyType, vehicle.body, vehicle.Body),
      ) || null,
    transmission:
      clean(
        first(
          vehicle.transmission,
          vehicle.Transmission,
          vehicle.gearbox,
          vehicle.Gearbox,
        ),
      ) || null,
    fuel_type:
      clean(
        first(vehicle.fuelType, vehicle.FuelType, vehicle.fuel, vehicle.Fuel),
      ) || null,
    colour:
      clean(
        first(
          vehicle.colour,
          vehicle.Colour,
          vehicle.color,
          vehicle.Color,
          vehicle.exteriorColour,
          vehicle.ExteriorColour,
        ),
      ) || null,
    engine_size:
      clean(
        first(
          vehicle.engineSize,
          vehicle.EngineSize,
          vehicle.engine,
          vehicle.Engine,
          vehicle.engineCapacity,
          vehicle.EngineCapacity,
        ),
      ) || null,
    power_kw: powerKw,
    description,
    overview:
      clean(first(vehicle.overview, vehicle.Overview, description)) || null,
    features,
    health_check: vehicle.healthCheck ?? vehicle.HealthCheck ?? null,
    image_url: images[0] ?? null,
    gallery_urls: images,
    status: "available",
    featured: false,
    source_url: sourceUrl,
    source_updated_at: new Date().toISOString(),
  };
}

export { DEALER_ID, PAGE_SIZE, API_URL };
````

## File: turbo.json
````json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": [
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "REVALIDATION_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY",
    "KINGS_OF_CARS_DEALER_ID",
    "KINGS_OF_CARS_PAGE_SIZE",
    "KINGS_OF_CARS_MIN_EXPECTED",
    "KINGS_OF_CARS_MAX_EXPECTED",
    "KINGS_OF_CARS_UPSERT_BATCH_SIZE",
    "KINGS_OF_CARS_ENGINE_API_URL",
    "KINGS_OF_CARS_SHOWROOM_URL",
    "KINGS_OF_CARS_MAX_PAGES",
    "KINGS_OF_CARS_BATCH_SIZE",
    "KINGS_OF_CARS_BATCH_OFFSET",
    "KINGS_OF_CARS_DETAIL_CONCURRENCY"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "clean": { "cache": false },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] }
  }
}
````

## File: .github/workflows/sync-kings-of-cars.yml
````yaml
name: Sync King of Cars inventory and build

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '17 * * * *'

permissions:
  contents: read

jobs:
  sync-and-build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install --no-audit --no-fund

      - name: Sync full live King of Cars inventory through iX Engine API
        env:
          SUPABASE_URL: ${{ secrets.KINGS_OF_CARS_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.KINGS_OF_CARS_SUPABASE_SERVICE_ROLE_KEY }}
          KINGS_OF_CARS_DEALER_ID: 13400
          KINGS_OF_CARS_PAGE_SIZE: 500
          KINGS_OF_CARS_MIN_EXPECTED: 250
        run: npm run sync:inventory

      - name: Verify database inventory
        env:
          SUPABASE_URL: ${{ secrets.KINGS_OF_CARS_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.KINGS_OF_CARS_SUPABASE_SERVICE_ROLE_KEY }}
        run: node scripts/verify-kings-of-cars-inventory.mjs

      - name: Build application with synced inventory
        run: npm run build:web
````

## File: apps/client/app/cars/cars-page.css
````css
.koc-legacy-cars-page {
  background: #fff;
  color: #666;
  font-family: Arial, Helvetica, sans-serif;
  padding: 42px 0 58px;
  min-height: 600px;
}
.koc-legacy-inner {
  width: min(1170px, calc(100% - 30px));
  margin: 0 auto;
}
.koc-legacy-title h1 {
  font-size: 26px;
  font-weight: 400;
  color: #555;
  margin: 0;
}
.koc-legacy-title .divider {
  width: 72px;
  height: 1px;
  background: #666;
  margin: 13px 0 21px;
}
.koc-legacy-cars-page > .koc-legacy-inner > p {
  color: #777;
  font-size: 13px;
  line-height: 1.65;
  margin: 0 0 12px;
}
.koc-legacy-cars-page a {
  color: #720a06;
}
.koc-legacy-row {
  display: grid;
  grid-template-columns: 25% minmax(0, 75%);
  gap: 24px;
  margin-top: 31px;
}
.koc-legacy-sidebar {
  border: 1px solid #ddd;
  background: #f5f5f5;
  padding: 0 14px 16px;
}
.koc-legacy-stock-title {
  background: #282828;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 14px;
  margin: 0 -14px 3px;
}
.koc-legacy-clear {
  display: block;
  text-align: right;
  color: #777 !important;
  font-size: 10px;
  margin: 6px 0 10px;
  text-decoration: underline;
}
.koc-legacy-search {
  display: flex;
  height: 34px;
  margin-bottom: 12px;
}
.koc-legacy-search input {
  min-width: 0;
  flex: 1;
  border: 1px solid #d2d2d2;
  border-right: 0;
  background: #fff;
  padding: 0 9px;
  font-size: 11px;
}
.koc-legacy-search button {
  width: 36px;
  border: 0;
  background: #720a06;
  color: #fff;
  display: grid;
  place-items: center;
}
.koc-legacy-filters {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.koc-legacy-filters label {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.koc-legacy-filters label > span {
  display: flex;
  justify-content: space-between;
  color: #777;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}
.koc-legacy-filters select,
.koc-legacy-sort select {
  width: 100%;
  height: 32px;
  border: 1px solid #d4d4d4;
  background: #fff;
  color: #666;
  font-size: 11px;
  padding: 0 8px;
}
.koc-legacy-filter-spacer {
  visibility: hidden;
}
.koc-legacy-checkbox {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  margin: 12px 0 11px;
  color: #777;
  font-size: 10px;
}
.koc-legacy-search-button {
  width: 100%;
  height: 36px;
  border: 0;
  background: #720a06;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
}
.koc-legacy-results {
  min-width: 0;
}
.koc-legacy-results-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 9px;
}
.koc-legacy-count {
  font-size: 11px;
  color: #888;
}
.koc-legacy-time {
  color: #aaa;
  font-size: 9px;
}
.koc-legacy-pagination {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}
.koc-legacy-pagination a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 27px;
  height: 25px;
  padding: 0 7px;
  border: 1px solid #ddd;
  background: #fff;
  color: #777;
  font-size: 9px;
  text-transform: uppercase;
}
.koc-legacy-pagination a.active {
  background: #720a06;
  border-color: #720a06;
  color: #fff;
}
.koc-legacy-pagination a.disabled {
  opacity: 0.45;
  pointer-events: none;
}
.koc-legacy-sort {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
.koc-legacy-sort select {
  min-width: 145px;
}
.koc-legacy-vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.koc-legacy-vehicle-card {
  display: grid;
  grid-template-columns: 225px minmax(0, 1fr) 125px;
  border: 1px solid #ddd;
  background: #fff;
  min-height: 190px;
  overflow: hidden;
}
.koc-legacy-gallery {
  position: relative;
  background: #ededed;
  height: 190px;
  min-height: 190px;
  overflow: hidden;
  isolation: isolate;
}
.koc-legacy-gallery img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
  object-position: center;
  transition:
    transform 0.35s ease,
    filter 0.35s ease;
}
.koc-legacy-vehicle-card:hover .koc-legacy-gallery img {
  transform: scale(1.035);
  filter: saturate(1.04);
}
.koc-legacy-gallery-shade {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 42%);
  pointer-events: none;
}
.koc-gallery-click-target {
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: zoom-in;
}
.koc-legacy-gallery-count {
  position: absolute;
  left: 9px;
  bottom: 9px;
  z-index: 3;
  padding: 6px 9px;
  background: rgba(35, 35, 35, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.koc-legacy-no-image {
  width: 100%;
  height: 100%;
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #eee;
  font-size: 10px;
}
.koc-legacy-no-image:before {
  content: "IMAGE UNAVAILABLE";
  letter-spacing: 0.08em;
}
.koc-legacy-vehicle-main {
  padding: 12px 14px 11px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.koc-legacy-name {
  font-size: 13px;
  line-height: 1.35;
  color: #666;
  margin-bottom: 8px;
}
.koc-legacy-name strong {
  color: #720a06;
}
.koc-legacy-price-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.koc-legacy-price-row strong {
  font-size: 19px;
  color: #720a06;
}
.koc-legacy-price-row span {
  font-size: 10px;
  color: #999;
}
.koc-legacy-calc {
  margin-left: auto;
  border: 1px solid #888;
  background: #777;
  color: #fff;
  padding: 7px 10px;
}
.koc-legacy-spec-line {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  margin-top: 9px;
  padding-top: 8px;
  font-size: 10px;
}
.koc-legacy-location {
  font-size: 9px;
  color: #888;
  margin-top: 7px;
}
.koc-legacy-social {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
.koc-legacy-social > span,
.koc-legacy-social > a {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 2px;
  text-decoration: none;
}
.share-plus {
  background: transparent !important;
  color: #777 !important;
}
.share-whatsapp {
  background: #25d366;
}
.share-facebook {
  background: #1877f2;
}
.share-mail {
  background: #777;
}
.koc-legacy-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: auto;
  padding-top: 10px;
}
.koc-legacy-buttons a,
.koc-legacy-buttons button {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #888;
  background: #fff;
  color: #666;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
}
.koc-legacy-buttons .enquire,
.koc-legacy-buttons .finance,
.koc-legacy-buttons .compare {
  background: #777;
  color: #fff;
}
.koc-legacy-buttons .enquire {
  background: #720a06;
}
.koc-legacy-spec-panel {
  border-left: 1px solid #e1e1e1;
  border-top: 3px solid #282828;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  gap: 4px;
  font-size: 10px;
  text-align: center;
}
.koc-enquire-panel {
  grid-column: 1 / -1;
}
.koc-vs-empty {
  padding: 38px 18px;
  border: 1px solid #ddd;
  text-align: center;
}
.koc-legacy-footer {
  background: #282828;
  color: #fff;
  padding: 26px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  font-size: 9px;
}
.koc-legacy-footer a {
  color: #ddd;
}
.koc-gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(8, 8, 8, 0.98);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.koc-gallery-lightbox-content {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #080808;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.koc-gallery-lightbox-content > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.koc-legacy-gallery-nav {
  position: absolute;
  top: 50%;
  z-index: 6;
  transform: translateY(-50%);
  width: 52px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(35, 35, 35, 0.72);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.koc-legacy-gallery-nav:hover {
  background: #720a06;
}
.koc-legacy-gallery-nav.prev {
  left: 18px;
}
.koc-legacy-gallery-nav.next {
  right: 18px;
}
.koc-gallery-lightbox-counter {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 7;
  padding: 7px 11px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.koc-gallery-lightbox-close {
  position: fixed;
  right: 22px;
  top: 18px;
  z-index: 10001;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(20, 20, 20, 0.75);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.koc-gallery-lightbox-close:hover {
  background: #720a06;
}
@media (max-width: 1050px) {
  .koc-legacy-row {
    grid-template-columns: 240px minmax(0, 1fr);
  }
  .koc-legacy-vehicle-card {
    grid-template-columns: 205px minmax(0, 1fr);
  }
  .koc-legacy-spec-panel {
    display: none;
  }
}
@media (max-width: 800px) {
  .koc-legacy-row {
    display: flex;
    flex-direction: column;
  }
  .koc-legacy-sidebar,
  .koc-legacy-results {
    width: 100%;
  }
  .koc-legacy-vehicle-card {
    grid-template-columns: 175px minmax(0, 1fr);
  }
}
@media (max-width: 560px) {
  .koc-legacy-inner {
    width: calc(100% - 28px);
  }
  .koc-legacy-vehicle-card {
    display: block;
  }
  .koc-legacy-gallery {
    height: 210px;
    min-height: 210px;
  }
  .koc-legacy-gallery img,
  .koc-legacy-no-image {
    min-height: 210px;
  }
  .koc-legacy-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  .koc-legacy-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .koc-gallery-lightbox-close {
    right: 12px;
    top: 12px;
  }
  .koc-gallery-lightbox-content .koc-legacy-gallery-nav {
    width: 42px;
    height: 52px;
  }
  .koc-gallery-lightbox-counter {
    bottom: 18px;
  }
}
````

## File: apps/client/components/vehicle-gallery.tsx
````typescript
"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

type VehicleGalleryProps = {
  images?: string[] | null;
  fallback?: string | null;
  alt: string;
  variant?: "basic" | "square" | "full";
};

export function VehicleGallery({
  images,
  fallback,
  alt,
  variant = "basic",
}: VehicleGalleryProps) {
  const gallery = Array.from(
    new Set(
      [...(images ?? []), ...(fallback ? [fallback] : [])].filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0,
      ),
    ),
  );
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (gallery.length > 1 && event.key === "ArrowLeft")
        setIndex((value) => (value - 1 + gallery.length) % gallery.length);
      if (gallery.length > 1 && event.key === "ArrowRight")
        setIndex((value) => (value + 1) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, gallery.length]);

  if (!gallery.length)
    return (
      <div className="koc-legacy-gallery">
        <div className="koc-legacy-no-image">
          <span>No image available</span>
        </div>
      </div>
    );

  const current = gallery[index] ?? gallery[0];
  const previous = () =>
    setIndex((value) => (value - 1 + gallery.length) % gallery.length);
  const next = () => setIndex((value) => (value + 1) % gallery.length);
  const openAt = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  return (
    <>
      {variant === "full" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,minmax(0,1fr))",
            gridAutoRows: "minmax(180px,18vw)",
            gap: 10,
          }}
        >
          {gallery.map((image, imageIndex) => (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              onClick={() => openAt(imageIndex)}
              aria-label={`Open image ${imageIndex + 1} of ${gallery.length}`}
              style={{
                position: "relative",
                display: "block",
                width: "100%",
                height: "100%",
                padding: 0,
                border: 0,
                overflow: "hidden",
                background: "#171717",
                cursor: "zoom-in",
                gridColumn: imageIndex === 0 ? "span 2" : undefined,
                gridRow: imageIndex === 0 ? "span 2" : undefined,
              }}
            >
              <img
                src={image}
                alt={`${alt} — ${imageIndex + 1}`}
                loading={imageIndex < 4 ? "eager" : "lazy"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform .45s",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  padding: 14,
                  background:
                    "linear-gradient(transparent 55%,rgba(0,0,0,.72))",
                  color: "#fff",
                  opacity: 0.95,
                }}
              >
                <Maximize2 size={17} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: ".12em",
                  }}
                >
                  {imageIndex + 1}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open full gallery for ${alt}`}
          style={{
            display: "block",
            width: "100%",
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "zoom-in",
          }}
        >
          <div
            className="koc-legacy-gallery"
            style={
              variant === "square"
                ? { aspectRatio: "1 / 1", height: "auto", minHeight: 0 }
                : undefined
            }
          >
            <img
              src={current}
              alt={alt}
              loading="eager"
              style={
                variant === "square"
                  ? {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }
                  : undefined
              }
            />
            <div className="koc-legacy-gallery-shade" aria-hidden="true" />
            <span className="koc-legacy-gallery-count">
              {gallery.length} {gallery.length === 1 ? "IMAGE" : "IMAGES"}
            </span>
          </div>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo gallery`}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 60px",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
            style={{
              position: "fixed",
              top: 18,
              right: 18,
              zIndex: 3,
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,.25)",
              borderRadius: "50%",
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              width: "min(92vw,1400px)",
              height: "min(88vh,900px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={current}
              alt={`${alt} — ${index + 1} of ${gallery.length}`}
              loading="eager"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  aria-label="Previous vehicle image"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48,
                    height: 48,
                    border: "1px solid rgba(255,255,255,.22)",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,.58)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={30} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next vehicle image"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 48,
                    height: 48,
                    border: "1px solid rgba(255,255,255,.22)",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,.58)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={30} />
                </button>
              </>
            )}
            <span
              style={{
                position: "absolute",
                left: "50%",
                bottom: -34,
                transform: "translateX(-50%)",
                color: "rgba(255,255,255,.78)",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".14em",
              }}
            >
              {index + 1} / {gallery.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
````

## File: apps/client/app/cars/page.tsx
````typescript
import { ChevronDown, Gauge, Heart, Mail, Palette, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { CarsSort } from "../../components/cars-sort";
import { VehicleGallery } from "../../components/vehicle-gallery";
import { getCachedCars } from "../_lib/cached-public-data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Quality Used Cars | Boksburg | King of Cars",
  description:
    "Looking for quality used cars in Boksburg? Browse the King of Cars pre-owned vehicle stock.",
};
const money = (value: number | null | undefined) =>
  value == null ? "POA" : `R ${Math.round(value).toLocaleString("en-ZA")}`;
const priceSteps = [
  25000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000, 700000,
  1000000,
];
const pageSize = 12;
type CarSearchParams = {
  q?: string;
  make?: string;
  model?: string;
  priceFrom?: string;
  priceTo?: string;
  mileage?: string;
  transmission?: string;
  fuel?: string;
  year?: string;
  sort?: string;
  onlyPhotos?: string;
  page?: string;
};
function Pagination({
  page,
  pageCount,
  query,
}: {
  page: number;
  pageCount: number;
  query: URLSearchParams;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams(query);
    q.set("page", String(p));
    return `/cars?${q.toString()}`;
  };
  const nums = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="koc-legacy-pagination" aria-label="Vehicle pages">
      <Link href={href(1)} className={page === 1 ? "disabled" : ""}>
        First
      </Link>
      <Link
        href={href(Math.max(1, page - 1))}
        className={page === 1 ? "disabled" : ""}
      >
        Previous
      </Link>
      {nums
        .slice(
          Math.max(0, Math.min(page - 1, 3) - 1),
          Math.max(4, Math.min(page - 1, 3) + 3),
        )
        .map((n) => (
          <Link key={n} href={href(n)} className={n === page ? "active" : ""}>
            {n}
          </Link>
        ))}
      <Link
        href={href(Math.min(pageCount, page + 1))}
        className={page === pageCount ? "disabled" : ""}
      >
        Next
      </Link>
      <Link
        href={href(pageCount)}
        className={page === pageCount ? "disabled" : ""}
      >
        Last
      </Link>
    </nav>
  );
}
function SocialStrip({ car }: { car: any }) {
  const title =
    `${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""} ${car.variant ?? ""}`
      .replace(/\s+/g, " ")
      .trim();
  const shareUrl =
    typeof car.sourceUrl === "string" && car.sourceUrl
      ? car.sourceUrl
      : `/cars/${car.slug}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`I'm interested in the ${title} listed at ${money(car.price)}: ${shareUrl}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Vehicle enquiry: ${title}`)}&body=${encodeURIComponent(`I'm interested in the ${title} listed at ${money(car.price)}. ${shareUrl}`)}`;
  return (
    <section className="koc-legacy-social" aria-label="Share vehicle">
      <span className="share-plus" aria-hidden="true">
        +
      </span>
      <a
        className="share-whatsapp"
        aria-label="WhatsApp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp size={13} />
      </a>
      <a
        className="share-facebook"
        aria-label="Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
      >
        <FaFacebookF size={12} />
      </a>
      <a className="share-mail" aria-label="Email" href={emailUrl}>
        <Mail size={12} />
      </a>
    </section>
  );
}
function getTransmission(car: any) {
  if (car.transmission) return car.transmission;
  const v = `${car.variant ?? ""} ${car.vehicleName ?? ""}`.toLowerCase();
  if (/automatic|\bat\b|auto|\bdct\b|\bdsg\b|\bcvt\b|\bzf/.test(v))
    return "Automatic";
  if (/manual|\bmt\b|\bm\/t\b/.test(v)) return "Manual";
  return null;
}
function getFuel(car: any) {
  if (car.fuelType) return car.fuelType;
  const v = `${car.variant ?? ""} ${car.vehicleName ?? ""}`.toLowerCase();
  if (
    /diesel|gd-6|gd6|tdi|td|d-4d|d4d|hdi|dci|bi-turbo|biturbo|2\.8d|2\.5d|3\.0d|4\.5d/.test(
      v,
    )
  )
    return "Diesel";
  if (/petrol|fsi|tsi|t-gdi|tgdi|vti|mpi|gti|ecoboost/.test(v)) return "Petrol";
  if (/hybrid|hev|phev/.test(v)) return "Hybrid";
  if (/electric|\bev\b/.test(v)) return "Electric";
  return null;
}
function values(vehicles: any[], key: string) {
  return [
    ...new Set(
      vehicles
        .map((c) => c[key])
        .filter(
          (v) => v !== null && v !== undefined && String(v).trim() !== "",
        ),
    ),
  ]
    .map(String)
    .sort((a, b) => a.localeCompare(b));
}
function filterVehicles(vehicles: any[], params: CarSearchParams) {
  const q = (params.q || "").trim().toLowerCase();
  const make = params.make || "";
  const model = params.model || "";
  const pf = params.priceFrom ? Number(params.priceFrom) : null;
  const pt = params.priceTo ? Number(params.priceTo) : null;
  const mileage = params.mileage || "";
  const transmission = params.transmission || "";
  const fuel = params.fuel || "";
  const year = params.year || "";
  return vehicles.filter((car) => {
    if (
      q &&
      !`${car.make} ${car.model} ${car.variant} ${car.colour} ${car.bodyType}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (make && car.make !== make) return false;
    if (model && car.model !== model) return false;
    if (pf != null && (car.price == null || car.price < pf)) return false;
    if (pt != null && (car.price == null || car.price > pt)) return false;
    if (transmission && getTransmission(car) !== transmission) return false;
    if (fuel && getFuel(car) !== fuel) return false;
    if (year && String(car.year) !== year) return false;
    if (mileage) {
      const [low, high] = mileage.split("-").map(Number);
      if (
        car.mileage == null ||
        (Number.isFinite(low) && car.mileage < low) ||
        (Number.isFinite(high) && car.mileage > high)
      )
        return false;
    }
    if (params.onlyPhotos === "1" && !(car.galleryUrls?.length || car.imageUrl))
      return false;
    return true;
  });
}
function Select({
  name,
  label,
  value,
  options,
  disabled = false,
  empty = "Any",
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  empty?: string;
}) {
  return (
    <label>
      <span>
        {label}
        <ChevronDown size={10} />
      </span>
      <select name={name} defaultValue={value} disabled={disabled}>
        <option value="">{empty}</option>
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}
export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<CarSearchParams>;
}) {
  const params = await searchParams;
  const all: any[] = await getCachedCars();
  const make = params.make || "";
  const makeVehicles = make ? all.filter((c) => c.make === make) : all;
  const model = params.model || "";
  const makes = values(all, "make");
  const models = values(makeVehicles, "model");
  const transmissions = values(all, "transmission");
  const fuels = values(all, "fuelType");
  const years = values(all, "year").sort((a, b) => Number(b) - Number(a));
  const filtered = filterVehicles(all, params).sort((a, b) => {
    const s = params.sort || "featured";
    if (s === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
    if (s === "price-desc")
      return (b.price ?? -Infinity) - (a.price ?? -Infinity);
    if (s === "mileage-asc")
      return (a.mileage ?? Infinity) - (b.mileage ?? Infinity);
    if (s === "year-desc") return (b.year ?? 0) - (a.year ?? 0);
    return 0;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(Number(params.page || 1) || 1, 1), pageCount);
  const pageVehicles = filtered.slice((page - 1) * pageSize, page * pageSize);
  const query = new URLSearchParams();
  for (const key of [
    "q",
    "make",
    "model",
    "priceFrom",
    "priceTo",
    "mileage",
    "transmission",
    "fuel",
    "year",
    "onlyPhotos",
    "sort",
  ]) {
    const v = (params as any)[key];
    if (v && v !== "0") query.set(key, String(v));
  }
  return (
    <>
      <main className="koc-legacy-cars-page">
        <div className="koc-legacy-inner">
          <div className="koc-legacy-title title left">
            <h1>Trichardts Road, Boksburg Used Cars</h1>
            <div className="divider" />
          </div>
          <p>
            Our branch in Trichardts Road, Boksburg has a range of quality cars
            that are affordable and guaranteed to suit your budget. Our
            pre-owned cars have been taken through rigorous road tests to ensure
            that you are guaranteed quality and peace of mind when you purchase
            a vehicle from King of Cars.
          </p>
          <p>
            Should we not have the car that you are looking for in stock,{" "}
            <Link href="/contact">contact us</Link> and we will source the car
            of your dreams. We have financial solutions to assist you in the
            purchase of your vehicle.
          </p>
          <form method="get" id="vehicle_search_area_used" onChange={undefined}>
            <div className="koc-legacy-row">
              <aside className="koc-legacy-sidebar">
                <div className="koc-legacy-stock-title">
                  Search our vehicles in stock
                </div>
                <Link href="/cars" className="koc-legacy-clear">
                  Clear Filter
                </Link>
                <div className="koc-legacy-search">
                  <input
                    name="q"
                    defaultValue={params.q || ""}
                    placeholder="Search (EG. white demo 4x4)"
                    aria-label="Search vehicles"
                  />
                  <button type="submit" aria-label="Search">
                    <Search size={15} />
                  </button>
                </div>
                <div className="koc-legacy-filters">
                  <Select
                    name="make"
                    label="Makes"
                    value={make}
                    options={makes}
                    empty="All Makes"
                  />
                  <Select
                    name="model"
                    label="Models"
                    value={model}
                    options={models}
                    disabled={!make}
                    empty="All Models"
                  />
                  <Select
                    name="year"
                    label="Year"
                    value={params.year || ""}
                    options={years}
                    empty="Any Year"
                  />
                  <label>
                    <span>
                      Mileage
                      <ChevronDown size={10} />
                    </span>
                    <select name="mileage" defaultValue={params.mileage || ""}>
                      <option value="">Any Mileage</option>
                      <option value="0-50000">0 - 50 000 Km</option>
                      <option value="50000-100000">50 000 - 100 000 Km</option>
                      <option value="100000-200000">
                        100 000 - 200 000 Km
                      </option>
                      <option value="200000-9999999">200 000+ Km</option>
                    </select>
                  </label>
                  <label>
                    <span>
                      Price
                      <ChevronDown size={10} />
                    </span>
                    <select
                      name="priceFrom"
                      defaultValue={params.priceFrom || ""}
                    >
                      <option value="">Price From</option>
                      {priceSteps.map((v) => (
                        <option key={v} value={v}>
                          {money(v)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="koc-legacy-filter-spacer">Price</span>
                    <select name="priceTo" defaultValue={params.priceTo || ""}>
                      <option value="">Price To</option>
                      {priceSteps.map((v) => (
                        <option key={v} value={v}>
                          {money(v)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Select
                    name="transmission"
                    label="Transmission"
                    value={params.transmission || ""}
                    options={transmissions}
                    empty="Any"
                  />
                  <Select
                    name="fuel"
                    label="Fuel Type"
                    value={params.fuel || ""}
                    options={fuels}
                    empty="Any"
                  />
                </div>
                <label className="koc-legacy-checkbox">
                  <input
                    type="checkbox"
                    name="onlyPhotos"
                    value="1"
                    defaultChecked={params.onlyPhotos === "1"}
                  />{" "}
                  Only show vehicles with photos
                </label>
                <button type="submit" className="koc-legacy-search-button">
                  <Search size={13} /> SEARCH
                </button>
                <Link href="/cars" className="koc-legacy-clear bottom">
                  Clear Filter
                </Link>
              </aside>
              <section className="koc-legacy-results">
                <div className="koc-legacy-results-top">
                  <div className="koc-legacy-count">
                    Showing{" "}
                    {pageVehicles.length
                      ? `${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, filtered.length)}`
                      : 0}{" "}
                    of {filtered.length} vehicles{" "}
                    <span className="koc-legacy-time">(live)</span>
                  </div>
                  <Pagination page={page} pageCount={pageCount} query={query} />
                </div>
                <div className="koc-legacy-sort">
                  <CarsSort value={params.sort || "featured"} />
                </div>
                <div className="koc-legacy-vehicle-list">
                  {pageVehicles.length === 0 ? (
                    <div className="koc-vs-empty">
                      No vehicles match your search criteria.{" "}
                      <Link href="/cars">Clear Filters</Link>
                    </div>
                  ) : (
                    pageVehicles.map((car) => {
                      const tv = getTransmission(car);
                      const fv = getFuel(car);
                      return (
                        <article
                          key={car.id}
                          className="koc-legacy-vehicle-card"
                        >
                          <VehicleGallery
                            images={car.galleryUrls}
                            fallback={car.imageUrl}
                            alt={`${car.year || ""} ${car.make || ""} ${car.model || ""}`.trim()}
                          />
                          <div className="koc-legacy-vehicle-main">
                            <div className="koc-legacy-name">
                              <strong>{car.year || "—"}</strong> {car.make}{" "}
                              {car.model} {car.variant || ""}{" "}
                              {car.bodyType ? <>• {car.bodyType}</> : null}
                            </div>
                            <div className="koc-legacy-price-row">
                              <strong>{money(car.price)}</strong>
                              <span>
                                {car.monthlyPayment
                                  ? `R ${Number(car.monthlyPayment).toLocaleString("en-ZA")} pm`
                                  : ""}
                              </span>
                              <button type="button" className="koc-legacy-calc">
                                ▣ Calculator
                              </button>
                            </div>
                            <div className="koc-legacy-spec-line">
                              <span>
                                <Gauge size={11} />{" "}
                                {Number(car.mileage || 0).toLocaleString(
                                  "en-ZA",
                                )}{" "}
                                Km
                              </span>
                              <span>
                                <Palette size={11} /> {car.colour || "—"}
                              </span>
                            </div>
                            <div className="koc-legacy-location">
                              ● {car.location || "Boksburg"}
                            </div>
                            <SocialStrip car={car} />
                            <div className="koc-legacy-buttons">
                              <Link href={`/cars/${car.slug}`} className="more">
                                More Info
                              </Link>
                              <Link
                                href={`/finance?vehicle=${car.slug}&price=${car.price || ""}`}
                                className="finance"
                              >
                                Finance
                              </Link>
                              <button type="button" className="compare">
                                <Heart size={11} /> Compare
                              </button>
                            </div>
                          </div>
                          <div className="koc-legacy-spec-panel">
                            <span>{car.bodyType || "—"}</span>
                            <span>{tv || "—"}</span>
                            <span>{fv || "—"}</span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
                <Pagination page={page} pageCount={pageCount} query={query} />
              </section>
            </div>
          </form>
        </div>
      </main>
      <footer className="koc-legacy-footer">
        <div>2026 © King Of Cars Group</div>
        <nav>
          <Link href="/testimonials">Testimonials</Link>
          <Link href="/value-added-products">Value Added Products</Link>
          <Link href="/articles">Promotions and Events</Link>
          <Link href="/contact">Legal and Disclaimer</Link>
        </nav>
        <div className="koc-legacy-footer-buttons">
          <Link href="/contact">Personal Information</Link>
          <Link href="/contact">Terms &amp; Conditions</Link>
          <Link href="/">Sitemap</Link>
        </div>
      </footer>
    </>
  );
}
````

## File: scripts/lib/kingofcars-engine-api-v2.mjs
````javascript
const API_URL =
  process.env.KINGS_OF_CARS_ENGINE_API_URL ??
  "https://engineapi.e5.ix.co.za/api/v1.0/vehiclestocksearch/filter";
const DEALER_ID = Number(process.env.KINGS_OF_CARS_DEALER_ID ?? 13400);
const PAGE_SIZE = Math.min(
  Number(process.env.KINGS_OF_CARS_PAGE_SIZE ?? 100),
  100,
);
const MIN_SYNC_ROWS = Math.max(
  Number(process.env.KINGS_OF_CARS_MIN_SYNC_ROWS ?? 50),
  1,
);

const clean = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
const first = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");
const numberValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : null;
};
const integerValue = (value) => {
  const number = numberValue(value);
  return number === null ? null : Math.round(number);
};
const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value
      .split(/[,|\n]/)
      .map(clean)
      .filter(Boolean);
  return [];
};
const pickImageUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object")
    return first(
      value.url,
      value.imageUrl,
      value.imageURL,
      value.src,
      value.href,
      value.originalUrl,
      value.largeUrl,
      value.image,
      value.ImageUrl,
      value.ImageURL,
    );
  return null;
};

function unwrapVehicle(value, depth = 0) {
  if (depth > 6 || !value || typeof value !== "object" || Array.isArray(value))
    return value;
  for (const key of [
    "vehicle",
    "Vehicle",
    "vehicleStock",
    "VehicleStock",
    "vehicleData",
    "VehicleData",
    "vehicleDetails",
    "VehicleDetails",
    "item",
    "Item",
    "result",
    "Result",
  ]) {
    if (
      value[key] &&
      typeof value[key] === "object" &&
      !Array.isArray(value[key])
    )
      return unwrapVehicle(value[key], depth + 1);
  }
  return value;
}

function extractRows(payload) {
  if (payload && Array.isArray(payload.vehicles))
    return payload.vehicles.map(unwrapVehicle);
  if (Array.isArray(payload)) return payload.map(unwrapVehicle);
  throw new Error(
    `Could not locate vehicle array in Engine API response. topLevelKeys=${JSON.stringify(payload && typeof payload === "object" ? Object.keys(payload) : [])} type=${Array.isArray(payload) ? "array" : typeof payload}`,
  );
}

function extractCount(payload, rows) {
  return integerValue(
    first(
      payload?.finalCount,
      payload?.FinalCount,
      payload?.totalVehicleCount,
      payload?.TotalVehicleCount,
      payload?.searchCount,
      payload?.SearchCount,
      payload?.count,
      payload?.Count,
      rows.length,
    ),
  );
}

async function request(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      origin: "https://www.kingofcars.co.za",
      referer: "https://www.kingofcars.co.za/boksburg-used-cars",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!response.ok) {
    const detail =
      typeof body === "string"
        ? body.slice(0, 1000)
        : JSON.stringify(body).slice(0, 1000);
    throw new Error(`King of Cars API ${response.status}: ${detail}`);
  }
  return body;
}

function vehicleIdentity(vehicle) {
  return clean(
    first(
      vehicle.stockNumber,
      vehicle.StockNumber,
      vehicle.stockNo,
      vehicle.StockNo,
      vehicle.stockCode,
      vehicle.StockCode,
      vehicle.stock,
      vehicle.Stock,
      vehicle.reference,
      vehicle.Reference,
      vehicle.stockId,
      vehicle.StockId,
      vehicle.vehicleId,
      vehicle.VehicleId,
      vehicle.vin,
      vehicle.VIN,
      vehicle.vehicleStockId,
      vehicle.VehicleStockId,
      vehicle.id,
      vehicle.Id,
      vehicle.sourceUrl,
      vehicle.SourceUrl,
      vehicle.url,
      vehicle.Url,
    ),
  );
}

export async function fetchInventory() {
  const all = [];
  const seen = new Set();
  let finalCount = null;
  for (let page = 1; page <= 10; page += 1) {
    const payload = { LimitToDealer: [DEALER_ID], page, pageSize: PAGE_SIZE };
    const body = await request(payload);
    const rows = extractRows(body);
    const count = extractCount(body, rows);
    if (finalCount === null) finalCount = count;
    let added = 0;
    for (const row of rows) {
      const key = vehicleIdentity(row) || JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        all.push(row);
        added += 1;
      }
    }
    console.log(
      `Engine API v2: page=${page}; rows=${rows.length}; added=${added}; collected=${all.length}; finalCount=${count}; dealer=${DEALER_ID}`,
    );
    if (rows.length === 0 || added === 0) break;
    if (finalCount !== null && all.length >= finalCount) break;
  }
  if (finalCount === null) finalCount = all.length;
  const partial = all.length < finalCount;
  console.log(
    `Engine API v2 COMPLETE: rows=${all.length}; finalCount=${finalCount}; dealer=${DEALER_ID}; partial=${partial}`,
  );
  if (partial)
    console.warn(
      `Engine API v2 WARNING: source reports ${finalCount} vehicles but returned ${all.length}; importing returned rows without destructive stale-row deletion.`,
    );
  if (all.length < MIN_SYNC_ROWS)
    throw new Error(
      `Expected at least ${MIN_SYNC_ROWS} returned vehicle records, received ${all.length}. Refusing sync.`,
    );
  return {
    rows: all,
    finalCount,
    partial,
    payload: { LimitToDealer: [DEALER_ID], pageSize: PAGE_SIZE },
  };
}

function valuesByName(vehicle, names) {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  const found = [];
  const walk = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 3) return;
    for (const [key, value] of Object.entries(obj)) {
      if (wanted.has(key.toLowerCase())) found.push(value);
      if (value && typeof value === "object" && !Array.isArray(value))
        walk(value, depth + 1);
    }
  };
  walk(vehicle);
  return found;
}

function field(vehicle, names, fallback = null) {
  return first(...valuesByName(vehicle, names), fallback);
}

function diagnosticKeys(vehicle) {
  const keys = new Set();
  const walk = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 2) return;
    for (const [key, value] of Object.entries(obj)) {
      keys.add(key);
      if (value && typeof value === "object" && !Array.isArray(value))
        walk(value, depth + 1);
    }
  };
  walk(vehicle);
  return [...keys].sort();
}

export function mapVehicle(vehicle) {
  const images = [
    field(vehicle, [
      "imageUrl",
      "imageURL",
      "primaryImage",
      "primaryImageUrl",
      "mainImage",
      "thumbnail",
    ]),
    ...asArray(
      field(vehicle, [
        "images",
        "imageUrls",
        "galleryUrls",
        "gallery",
        "photos",
        "pictures",
        "media",
        "vehicleImages",
      ]),
    ),
  ]
    .map(pickImageUrl)
    .filter(Boolean);
  const uniqueImages = [...new Set(images)];

  const stockNumber =
    clean(
      first(
        field(vehicle, [
          "stockNumber",
          "stockNo",
          "stockCode",
          "stock",
          "reference",
          "stockId",
          "vehicleId",
          "vin",
          "vehicleStockId",
          "id",
        ]),
        null,
      ),
    ) || null;
  const year = integerValue(
    field(vehicle, [
      "year",
      "modelYear",
      "yearOfManufacture",
      "manufactureYear",
    ]),
  );
  const make =
    clean(
      first(
        field(vehicle, [
          "make",
          "manufacturer",
          "brand",
          "makeName",
          "manufacturerName",
          "makeDescription",
        ]),
        "Unknown",
      ),
    ) || "Unknown";
  const model =
    clean(
      first(
        field(vehicle, [
          "model",
          "vehicleModel",
          "modelName",
          "modelDescription",
        ]),
        null,
      ),
    ) ||
    clean(
      first(
        field(vehicle, ["description", "title", "name", "vehicleName"]),
        `Vehicle ${stockNumber ?? ""}`,
      ),
    ) ||
    `Vehicle ${stockNumber ?? ""}`.trim();
  const variant =
    clean(
      first(
        field(vehicle, [
          "variant",
          "derivative",
          "trim",
          "vehicleConfiguration",
          "variantName",
          "derivativeName",
          "vehicleVariant",
        ]),
        null,
      ),
    ) || null;
  const sourceUrl =
    first(
      field(vehicle, [
        "sourceUrl",
        "url",
        "detailUrl",
        "vehicleUrl",
        "link",
        "stockUrl",
      ]),
      null,
    ) || null;
  const price = numberValue(
    field(vehicle, [
      "price",
      "sellingPrice",
      "cashPrice",
      "salePrice",
      "retailPrice",
      "vehiclePrice",
    ]),
  );
  const monthlyPayment = numberValue(
    field(vehicle, [
      "monthlyPayment",
      "monthly",
      "payment",
      "instalment",
      "installment",
    ]),
  );
  const mileage = integerValue(
    field(vehicle, [
      "mileage",
      "odometer",
      "km",
      "kilometres",
      "kilometers",
      "odometerReading",
    ]),
  );
  const powerKw = integerValue(
    field(vehicle, ["powerKw", "powerKW", "kw", "kilowatts"]),
  );
  const bodyType =
    clean(
      first(
        field(vehicle, [
          "bodyType",
          "body",
          "bodyStyle",
          "shape",
          "shapeName",
          "vehicleShape",
          "vehicleType",
          "vehicleBodyType",
          "bodyDescription",
        ]),
        null,
      ),
    ) || null;
  const transmission =
    clean(
      first(
        field(vehicle, [
          "transmission",
          "gearbox",
          "gearboxType",
          "transmissionType",
          "gearType",
          "transmissionDescription",
        ]),
        null,
      ),
    ) || null;
  const fuelType =
    clean(
      first(
        field(vehicle, [
          "fuelType",
          "fuel",
          "fuelTypeName",
          "fuelName",
          "fuelDescription",
          "fuelTypeDescription",
        ]),
        null,
      ),
    ) || null;
  const colour =
    clean(
      first(
        field(vehicle, [
          "colour",
          "color",
          "exteriorColour",
          "exteriorColor",
          "colourName",
          "colorName",
          "exteriorColourName",
        ]),
        null,
      ),
    ) || null;
  const engineSize =
    clean(
      first(
        field(vehicle, [
          "engineSize",
          "engine",
          "engineCapacity",
          "engineCC",
          "capacity",
          "engineDescription",
        ]),
        null,
      ),
    ) || null;
  const description =
    clean(
      first(
        field(
          vehicle,
          ["description", "comments", "overview", "title", "name"],
          [year, make, model, variant].filter(Boolean).join(" "),
        ),
      ),
    ) || null;
  const features = [
    ...new Set(
      [
        ...asArray(
          field(vehicle, ["features", "optionalExtras", "equipment", "extras"]),
        ),
        ...valuesByName(vehicle, ["feature", "extra"]),
      ]
        .flatMap(asArray)
        .map(clean)
        .filter(Boolean),
    ),
  ];
  const healthCheck = field(
    vehicle,
    ["healthCheck", "vehicleHealthCheck", "healthCheckStatus"],
    null,
  );
  const identity = stockNumber || sourceUrl || `${year}-${make}-${model}`;
  const slug = clean(
    `${year ?? ""}-${make}-${model}-${variant ?? ""}-${identity}`,
  )
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const vehicleName =
    clean(
      first(
        field(vehicle, [
          "vehicleName",
          "displayName",
          "fullName",
          "title",
          "description",
        ]),
        [year, make, model, variant].filter(Boolean).join(" "),
      ),
    ) || model;

  return {
    vehicle_name: vehicleName,
    stock_number: stockNumber,
    slug,
    make,
    model,
    variant,
    year,
    mileage,
    price,
    monthly_payment: monthlyPayment,
    body_type: bodyType,
    transmission,
    fuel_type: fuelType,
    colour,
    engine_size: engineSize,
    power_kw: powerKw,
    description,
    overview: clean(first(field(vehicle, ["overview"]), description)) || null,
    features,
    health_check: healthCheck,
    image_url: uniqueImages[0] ?? null,
    gallery_urls: uniqueImages,
    status: "available",
    featured: false,
    source_url: sourceUrl,
    source_updated_at: new Date().toISOString(),
  };
}

export function getVehicleDiagnostic(vehicle) {
  return diagnosticKeys(vehicle);
}

export { DEALER_ID, PAGE_SIZE, API_URL, MIN_SYNC_ROWS };
````

## File: package.json
````json
{
  "name": "kings-of-cars",
  "version": "0.1.1",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "engines": {
    "node": "22.x"
  },
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build --concurrency=1",
    "clean": "turbo run clean",
    "start": "turbo run start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "turbo run typecheck",
    "gen:types": "pnpm --filter @kings-of-cars/supabase supabase:types",
    "dev:client": "pnpm --filter @kings-of-cars/client dev",
    "dev:admin": "pnpm --filter @kings-of-cars/admin dev",
    "build:client": "pnpm --filter @kings-of-cars/client build",
    "build:admin": "pnpm --filter @kings-of-cars/admin build",
    "lint:client": "pnpm --filter @kings-of-cars/client lint",
    "lint:admin": "pnpm --filter @kings-of-cars/admin lint",
    "typecheck:client": "pnpm --filter @kings-of-cars/client typecheck",
    "typecheck:admin": "pnpm --filter @kings-of-cars/admin typecheck",
    "sync:inventory": "node scripts/sync-kings-of-cars-v2.mjs",
    "sync:live-pages": "node scripts/sync-kings-of-cars-live-pages.mjs"
  },
  "devDependencies": {
    "@biomejs/biome": "catalog:",
    "@sparticuz/chromium": "catalog:",
    "@supabase/supabase-js": "catalog:",
    "playwright": "catalog:",
    "turbo": "catalog:"
  }
}
````

## File: apps/client/package.json
````json
{
  "name": "@kings-of-cars/client",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "pnpm --dir ../.. sync:inventory && next build",
    "start": "next start",
    "lint": "biome check .",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "@kings-of-cars/contracts": "workspace:*",
    "@kings-of-cars/supabase": "workspace:*",
    "next": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "lucide-react": "catalog:",
    "react-icons": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "typescript": "catalog:"
  }
}
````
