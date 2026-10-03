-- Run this whole file once in Supabase: SQL Editor > New query > paste > Run.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.letters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text not null default 'Untitled letter',
  content     text not null default '',
  design      jsonb not null default '{}',
  share_token text not null unique default encode(extensions.gen_random_bytes(5), 'hex'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists letters_user_idx on public.letters(user_id, updated_at desc);

-- Each user can only see and change their own letters.
alter table public.letters enable row level security;
drop policy if exists "own letters" on public.letters;
create policy "own letters" on public.letters for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Anyone with a share code can read that one letter (no login needed).
create or replace function public.get_public_letter(code text)
returns table(title text, content text, design jsonb, author text)
language sql security definer set search_path = public as $$
  select l.title, l.content, l.design, coalesce(u.raw_user_meta_data->>'name', 'Someone')
  from public.letters l join auth.users u on u.id = l.user_id
  where l.share_token = code
$$;
grant execute on function public.get_public_letter(text) to anon, authenticated;

-- Media bucket: public to read, 25 MB per file, images/audio/video only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 26214400, array['image/*', 'audio/*', 'video/*'])
on conflict (id) do nothing;

-- Users can upload and delete only inside their own folder (media/<user id>/...).
drop policy if exists "upload own media" on storage.objects;
create policy "upload own media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "delete own media" on storage.objects;
create policy "delete own media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
