-- Travel Planner schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- trips
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'planning'
    check (status in ('planning', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  travelers text[] not null default '{}',
  color text not null default '#6366f1',
  notes text default '',
  share_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_dates_valid check (end_date >= start_date)
);

create index if not exists trips_start_date_idx on trips (start_date);
create index if not exists trips_share_token_idx on trips (share_token);

-- ─────────────────────────────────────────────────────────────────────────
-- bookings (flights, hotels, cars, trains, activities, etc.)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  type text not null default 'other'
    check (type in ('flight', 'hotel', 'car', 'train', 'activity', 'other')),
  title text not null,
  provider text default '',
  confirmation_number text default '',
  start_at timestamptz,
  end_at timestamptz,
  location text default '',
  cost numeric(10, 2),
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists bookings_trip_id_idx on bookings (trip_id);

-- ─────────────────────────────────────────────────────────────────────────
-- documents (metadata for files stored in the `trip-documents` storage bucket)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text default 'application/pdf',
  uploaded_at timestamptz not null default now()
);

create index if not exists documents_trip_id_idx on documents (trip_id);

-- ─────────────────────────────────────────────────────────────────────────
-- tasks (trip checklist)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists tasks_trip_id_idx on tasks (trip_id);

-- ─────────────────────────────────────────────────────────────────────────
-- updated_at trigger for trips
-- ─────────────────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trips_set_updated_at on trips;
create trigger trips_set_updated_at
  before update on trips
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- storage bucket for PDF documents
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('trip-documents', 'trip-documents', false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- This is a single-user personal-assistant app: the app's anon key is used
-- only from a trusted server context (server actions / route handlers), so
-- policies are permissive but RLS is still enabled defensively. Tighten
-- these if the app ever gets multiple authenticated users.
-- ─────────────────────────────────────────────────────────────────────────
alter table trips enable row level security;
alter table bookings enable row level security;
alter table documents enable row level security;
alter table tasks enable row level security;

drop policy if exists "trips_all" on trips;
create policy "trips_all" on trips for all using (true) with check (true);

drop policy if exists "bookings_all" on bookings;
create policy "bookings_all" on bookings for all using (true) with check (true);

drop policy if exists "documents_all" on documents;
create policy "documents_all" on documents for all using (true) with check (true);

drop policy if exists "tasks_all" on tasks;
create policy "tasks_all" on tasks for all using (true) with check (true);

drop policy if exists "trip_documents_storage_all" on storage.objects;
create policy "trip_documents_storage_all" on storage.objects for all
  using (bucket_id = 'trip-documents')
  with check (bucket_id = 'trip-documents');
