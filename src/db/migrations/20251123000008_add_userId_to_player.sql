alter table public.player
  add column if not exists user_id uuid references public."user"(id) on delete set null;
