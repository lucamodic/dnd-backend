alter table public.character
add column if not exists class_id uuid references public.class(id);
