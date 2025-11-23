create table if not exists public.class_spell (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.class(id) on delete cascade,
  spell_id uuid not null references public.spell(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.class_spell enable row level security;

create policy "public read class_spell"
on public.class_spell
for select
to authenticated
using (true);

create policy "service full class_spell"
on public.class_spell
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

alter table public.class add column index text;
