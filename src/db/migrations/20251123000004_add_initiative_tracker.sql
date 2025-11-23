create table if not exists public.initiative_track (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaign(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.initiative_track enable row level security;

create policy "public read initiative_track"
on public.initiative_track
for select
to authenticated
using (true);

create policy "service full initiative_track"
on public.initiative_track
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.encounter (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.initiative_track(id) on delete cascade,
  name text not null,
  round int not null default 1,
  status text not null default 'draft',
  notes text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.encounter enable row level security;

create policy "public read encounter"
on public.encounter
for select
to authenticated
using (true);

create policy "service full encounter"
on public.encounter
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

do $$
begin
  create type encounter_participant_type as enum ('character', 'monster', 'custom');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.encounter_participant (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references public.encounter(id) on delete cascade,
  participant_type encounter_participant_type not null,
  name text not null,
  character_id uuid references public.character(id) on delete set null,
  monster_id uuid references public.monster(id) on delete set null,
  campaign_monster_id uuid references public.campaign_monster(id) on delete set null,
  initiative int not null default 0,
  hp_current int,
  hp_max int,
  armor_class int,
  is_active boolean not null default true,
  sort_order int,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.encounter_participant enable row level security;

create policy "public read encounter_participant"
on public.encounter_participant
for select
to authenticated
using (true);

create policy "service full encounter_participant"
on public.encounter_participant
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
