-- Enable UUID generation for primary keys.
create extension if not exists "pgcrypto";

-- Core user table used by the API.
create table if not exists public.user (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  refresh_token text,
  created_at timestamptz not null default timezone('utc', now()),
  role text not null default 'user'
);

-- Lock the table down and allow access only to the service role key.
alter table public.user enable row level security;

create policy "Service role full access on user"
on public.user
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
