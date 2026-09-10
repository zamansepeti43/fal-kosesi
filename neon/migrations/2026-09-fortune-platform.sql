-- Fal Köşesi next-generation fortune queue + commentator marketplace foundation.
-- Safe to run after neon/account-features.sql.

alter table public.readings add column if not exists status text not null default 'ready';
alter table public.readings add column if not exists available_at timestamptz;
alter table public.readings add column if not exists queued_at timestamptz;
alter table public.readings add column if not exists started_at timestamptz;
alter table public.readings add column if not exists completed_at timestamptz;
alter table public.readings add column if not exists delivery_mode text not null default 'instant';
alter table public.readings add column if not exists commentator_id text;
alter table public.readings add column if not exists commentator_name text;
alter table public.readings add column if not exists price_credits integer;
alter table public.readings add column if not exists input jsonb not null default '{}'::jsonb;
alter table public.readings add column if not exists error_message text;

create index if not exists readings_status_available_idx
  on public.readings (status, available_at)
  where status in ('queued','processing');

create table if not exists public.commentators (
  id text primary key,
  display_name text not null,
  title text not null,
  bio text,
  avatar_url text,
  specialties text[] not null default '{}',
  commentator_type text not null default 'human' check (commentator_type in ('human','ai')),
  rating numeric(2,1) not null default 5.0 check (rating >= 0 and rating <= 5),
  reading_count integer not null default 0,
  avg_minutes integer not null default 5,
  price_credits integer not null default 10,
  voice_price_credits integer not null default 5,
  status text not null default 'offline' check (status in ('online','busy','offline')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists commentators_status_rating_idx
  on public.commentators (status, rating desc, reading_count desc);

create table if not exists public.commentator_reviews (
  id uuid primary key default gen_random_uuid(),
  commentator_id text not null references public.commentators(id) on delete cascade,
  email text not null,
  reading_id uuid references public.readings(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now()
);

create unique index if not exists commentator_reviews_one_per_reading_idx
  on public.commentator_reviews (email, reading_id)
  where reading_id is not null;

create table if not exists public.commentator_favorites (
  email text not null,
  commentator_id text not null references public.commentators(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (email, commentator_id)
);

insert into public.commentators (id, display_name, title, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified)
values
  ('ada','Ada','Sembol & Kahve Uzmanı',array['coffee','love','future','general'],'ai',4.9,12840,3,10,5,'online',true),
  ('mira','Mira','Aşk & İlişki Yorumcusu',array['love','tarot','katina','future'],'ai',4.9,10426,4,15,6,'online',true),
  ('lale','Lale','Tarot & Yol Haritası',array['tarot','career','money','future'],'ai',4.8,9650,5,15,6,'online',true),
  ('selin','Selin','Rüya & Bilinçaltı',array['dream','general','future'],'ai',4.8,7821,4,8,5,'busy',true),
  ('derin','Derin','Numeroloji & Yıldızname',array['numerology','astrology','future'],'ai',4.7,6432,6,12,6,'online',true)
on conflict (id) do update set
  display_name=excluded.display_name,
  title=excluded.title,
  specialties=excluded.specialties,
  commentator_type=excluded.commentator_type,
  rating=excluded.rating,
  reading_count=excluded.reading_count,
  avg_minutes=excluded.avg_minutes,
  price_credits=excluded.price_credits,
  voice_price_credits=excluded.voice_price_credits,
  status=excluded.status,
  verified=excluded.verified,
  updated_at=now();
