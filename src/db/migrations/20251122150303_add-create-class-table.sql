create extension if not exists "pgcrypto";

create table if not exists public.class (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text,
  image text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.class enable row level security;

create policy "public read on class"
on public.class
for select
to authenticated
using (true);

create policy "service full access class"
on public.class
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
