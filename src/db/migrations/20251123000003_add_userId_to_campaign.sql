alter table public.campaign
  drop constraint if exists campaign_user_id_fkey;

alter table public.campaign
  add constraint campaign_user_id_fkey
    foreign key (user_id)
    references public.user(id)
    on delete cascade;

update public.class
set index = lower(name);
