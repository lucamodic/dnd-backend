create extension if not exists "pgcrypto";

create table if not exists public.campaign (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.campaign enable row level security;

create policy "public read on campaign"
on public.campaign
for select
to authenticated
using (true);

create policy "service full access campaign"
on public.campaign
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.player (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.player enable row level security;

create policy "public read on player"
on public.player
for select
to authenticated
using (true);

create policy "service full access player"
on public.player
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.character (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  player text,
  pdf text,
  ac int,
  hp int,
  pp int,
  level int,
  notes text,
  campaign_id uuid references public.campaign(id) on delete cascade,
  player_id uuid references public.player(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.character enable row level security;

create policy "public read on character"
on public.character
for select
to authenticated
using (true);

create policy "service full access character"
on public.character
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.monster (
  id uuid primary key default gen_random_uuid(),
  index text not null,
  name text not null,
  size text,
  type text,
  alignment text,
  armor_class int,
  hit_points int,
  hit_dice text,
  speed jsonb,
  strength int,
  dexterity int,
  constitution int,
  intelligence int,
  wisdom int,
  charisma int,
  proficiencies jsonb,
  damage_vulnerabilities jsonb,
  damage_resistances jsonb,
  damage_immunities jsonb,
  condition_immunities jsonb,
  senses jsonb,
  languages text,
  challenge_rating numeric,
  proficiency_bonus int,
  xp int,
  special_abilities jsonb,
  actions jsonb,
  legendary_actions jsonb,
  reactions jsonb,
  image text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.monster enable row level security;

create policy "public read on monster"
on public.monster
for select
to authenticated
using (true);

create policy "service full access monster"
on public.monster
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.campaign_monster (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaign(id) on delete cascade,
  monster_id uuid not null references public.monster(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.campaign_monster enable row level security;

create policy "public read on campaign_monster"
on public.campaign_monster
for select
to authenticated
using (true);

create policy "service full access campaign_monster"
on public.campaign_monster
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
