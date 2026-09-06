-- Fal Köşesi account feature migration
-- Adds persistent reading history, favorites and notifications.

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null,
  focus text,
  question text,
  result jsonb not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists readings_email_created_at_idx
  on public.readings (email, created_at desc);

create index if not exists readings_email_favorite_idx
  on public.readings (email, is_favorite, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  title text not null,
  body text not null,
  type text not null default 'system',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_email_created_at_idx
  on public.notifications (email, created_at desc);

create index if not exists notifications_email_unread_idx
  on public.notifications (email, read_at, created_at desc);
