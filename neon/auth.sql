-- Fal Köşesi authentication hardening
-- Run once in the Neon SQL editor.

alter table public.profiles
  add column if not exists password_hash text;

create index if not exists profiles_email_idx on public.profiles (email);
