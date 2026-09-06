-- Fal Köşesi - Neon PostgreSQL schema
-- Run this file once in the Neon SQL Editor before enabling production credits.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  phone text,
  location text default 'Türkiye',
  plan text default 'Normal Üye',
  status text default 'Üye',
  member_since text,
  renewal_date text,
  readings integer default 0,
  favorites integer default 0,
  streak integer default 0,
  last_reading text default 'Henüz fal bakılmadı',
  credits integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  package_id text not null,
  credits integer not null,
  price_try numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  iyzico_token text,
  iyzico_payment_id text,
  conversation_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create unique index if not exists credit_orders_iyzico_payment_id_idx
  on public.credit_orders (iyzico_payment_id)
  where iyzico_payment_id is not null;

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  amount integer not null,
  balance_after integer not null,
  type text not null check (type in ('welcome','purchase','ad_reward','reading','refund','adjustment')),
  reference_id text,
  description text,
  created_at timestamptz not null default now()
);

create unique index if not exists credit_transactions_purchase_reference_idx
  on public.credit_transactions (reference_id)
  where type = 'purchase' and reference_id is not null;

create unique index if not exists credit_transactions_reading_reference_idx
  on public.credit_transactions (reference_id)
  where type = 'reading' and reference_id is not null;

create unique index if not exists credit_transactions_refund_reference_idx
  on public.credit_transactions (reference_id)
  where type = 'refund' and reference_id is not null;

create index if not exists credit_orders_email_idx on public.credit_orders (email);
create index if not exists credit_transactions_email_idx on public.credit_transactions (email);

create or replace function public.ensure_credit_profile(
  p_email text,
  p_name text default null,
  p_phone text default null
)
returns integer
language plpgsql
as $$
declare
  normalized_email text := lower(trim(p_email));
  current_credits integer;
begin
  if normalized_email is null or normalized_email = '' then
    raise exception 'Geçerli e-posta gerekli';
  end if;

  insert into public.profiles (email, full_name, phone, credits, plan, status, member_since)
  values (
    normalized_email,
    nullif(trim(coalesce(p_name, '')), ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    50,
    'Normal Üye',
    'Üye',
    to_char(now(), 'DD Mon YYYY')
  )
  on conflict (email) do update set
    full_name = coalesce(nullif(trim(excluded.full_name), ''), profiles.full_name),
    phone = coalesce(nullif(trim(excluded.phone), ''), profiles.phone),
    updated_at = now();

  select credits into current_credits
  from public.profiles
  where email = normalized_email;

  return coalesce(current_credits, 0);
end;
$$;

create or replace function public.grant_credit_purchase(
  p_email text,
  p_amount integer,
  p_payment_id text,
  p_order_id uuid,
  p_description text
)
returns integer
language plpgsql
as $$
declare
  normalized_email text := lower(trim(p_email));
  current_credits integer;
  next_credits integer;
begin
  if p_amount <= 0 then raise exception 'Invalid credit amount'; end if;
  if coalesce(trim(p_payment_id), '') = '' then raise exception 'Payment ID gerekli'; end if;

  perform pg_advisory_xact_lock(hashtext(normalized_email));

  if exists (
    select 1 from public.credit_transactions
    where type = 'purchase' and reference_id = p_payment_id
  ) then
    select credits into current_credits from public.profiles where email = normalized_email;
    return coalesce(current_credits, 0);
  end if;

  perform public.ensure_credit_profile(normalized_email);

  select credits into current_credits
  from public.profiles
  where email = normalized_email
  for update;

  next_credits := coalesce(current_credits, 0) + p_amount;

  update public.profiles
  set credits = next_credits, updated_at = now()
  where email = normalized_email;

  insert into public.credit_transactions (email, amount, balance_after, type, reference_id, description)
  values (normalized_email, p_amount, next_credits, 'purchase', p_payment_id, p_description);

  update public.credit_orders
  set status = 'paid', iyzico_payment_id = p_payment_id, paid_at = now()
  where id = p_order_id;

  return next_credits;
end;
$$;

create or replace function public.consume_credits(
  p_email text,
  p_amount integer,
  p_reference_id text,
  p_description text
)
returns integer
language plpgsql
as $$
declare
  normalized_email text := lower(trim(p_email));
  current_credits integer;
  next_credits integer;
begin
  if p_amount <= 0 then raise exception 'Invalid credit amount'; end if;

  perform pg_advisory_xact_lock(hashtext(normalized_email));

  if exists (
    select 1 from public.credit_transactions
    where type = 'reading' and reference_id = p_reference_id
  ) then
    select credits into current_credits from public.profiles where email = normalized_email;
    return coalesce(current_credits, 0);
  end if;

  select credits into current_credits
  from public.profiles
  where email = normalized_email
  for update;

  if not found then raise exception 'Kredi hesabı bulunamadı'; end if;
  if coalesce(current_credits, 0) < p_amount then raise exception 'Yetersiz kredi'; end if;

  next_credits := current_credits - p_amount;

  update public.profiles
  set credits = next_credits,
      readings = coalesce(readings, 0) + 1,
      updated_at = now()
  where email = normalized_email;

  insert into public.credit_transactions (email, amount, balance_after, type, reference_id, description)
  values (normalized_email, -p_amount, next_credits, 'reading', p_reference_id, p_description);

  return next_credits;
end;
$$;

create or replace function public.refund_credits(
  p_email text,
  p_amount integer,
  p_reference_id text,
  p_description text
)
returns integer
language plpgsql
as $$
declare
  normalized_email text := lower(trim(p_email));
  current_credits integer;
  next_credits integer;
begin
  if p_amount <= 0 then raise exception 'Invalid credit amount'; end if;

  perform pg_advisory_xact_lock(hashtext(normalized_email));

  if exists (
    select 1 from public.credit_transactions
    where type = 'refund' and reference_id = p_reference_id
  ) then
    select credits into current_credits from public.profiles where email = normalized_email;
    return coalesce(current_credits, 0);
  end if;

  select credits into current_credits
  from public.profiles
  where email = normalized_email
  for update;

  if not found then raise exception 'Kredi hesabı bulunamadı'; end if;

  next_credits := coalesce(current_credits, 0) + p_amount;

  update public.profiles
  set credits = next_credits,
      readings = greatest(0, coalesce(readings, 0) - 1),
      updated_at = now()
  where email = normalized_email;

  insert into public.credit_transactions (email, amount, balance_after, type, reference_id, description)
  values (normalized_email, p_amount, next_credits, 'refund', p_reference_id, p_description);

  return next_credits;
end;
$$;
