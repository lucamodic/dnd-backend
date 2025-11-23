create table if not exists public.spell (
  id uuid primary key default gen_random_uuid(),
  index text not null,
  name text not null,
  level int not null,
  school text not null,
  casting_time text not null,
  range text not null,
  duration text not null,
  components jsonb not null,
  material text,
  concentration boolean,
  ritual boolean,
  description jsonb not null,
  higher_level jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.spell enable row level security;

create policy "public read spell"
on public.spell
for select
to authenticated
using (true);

create policy "service full spell"
on public.spell
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
