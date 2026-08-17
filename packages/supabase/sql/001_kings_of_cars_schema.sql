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
