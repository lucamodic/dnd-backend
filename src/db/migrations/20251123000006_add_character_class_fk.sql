alter table public.character
  add column if not exists class_id uuid
    references public."class"(id);

insert into public.class (id, name, color, image, created_at) values
  (gen_random_uuid(), 'Artificer', '#B48E2C', '/classes/Artificer.svg', timezone('utc', now())),
  (gen_random_uuid(), 'Blood Hunter', '#7D1E1E', '/classes/Blood-Hunter.svg', timezone('utc', now()));
