-- Run this in the Supabase SQL editor (once per project).

create table if not exists public.drafts (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null,
  status text,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_updated on public.drafts (user_id, updated_at desc);

alter table public.drafts enable row level security;

drop policy if exists "own drafts select" on public.drafts;
drop policy if exists "own drafts insert" on public.drafts;
drop policy if exists "own drafts update" on public.drafts;
drop policy if exists "own drafts delete" on public.drafts;

create policy "own drafts select" on public.drafts
  for select using (auth.uid() = user_id);

create policy "own drafts insert" on public.drafts
  for insert with check (auth.uid() = user_id);

create policy "own drafts update" on public.drafts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own drafts delete" on public.drafts
  for delete using (auth.uid() = user_id);
