alter table public.profiles
  add column if not exists credits integer not null default 50;

create table if not exists public.credit_orders (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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

alter table public.credit_orders enable row level security;
alter table public.credit_transactions enable row level security;

revoke all on public.credit_orders from anon, authenticated;
revoke all on public.credit_transactions from anon, authenticated;

grant all on public.credit_orders to service_role;
grant all on public.credit_transactions to service_role;

create or replace function public.ensure_credit_profile(p_email text, p_name text default null, p_phone text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_credits integer;
begin
  insert into public.profiles (id, email, full_name, phone, credits, plan, status, member_since)
  values (
    uuid_generate_v4(),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_name, '')), ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    50,
    'Normal Üye',
    'Üye',
    to_char(now(), 'DD Mon YYYY')
  )
  on conflict (email) do nothing;

  select credits into current_credits
  from public.profiles
  where email = lower(trim(p_email));

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
security definer
set search_path = public
as $$
declare
  current_credits integer;
  next_credits integer;
begin
  if p_amount <= 0 then raise exception 'Invalid credit amount'; end if;

  perform pg_advisory_xact_lock(hashtext(lower(trim(p_email))));

  if exists (
    select 1 from public.credit_transactions
    where type = 'purchase' and reference_id = p_payment_id
  ) then
    select credits into current_credits from public.profiles where email = lower(trim(p_email));
    return coalesce(current_credits, 0);
  end if;

  insert into public.profiles (id, email, credits, plan, status, member_since)
  values (uuid_generate_v4(), lower(trim(p_email)), 50, 'Normal Üye', 'Üye', to_char(now(), 'DD Mon YYYY'))
  on conflict (email) do nothing;

  select credits into current_credits
  from public.profiles
  where email = lower(trim(p_email))
  for update;

  next_credits := coalesce(current_credits, 0) + p_amount;

  update public.profiles
  set credits = next_credits, updated_at = now()
  where email = lower(trim(p_email));

  insert into public.credit_transactions (email, amount, balance_after, type, reference_id, description)
  values (lower(trim(p_email)), p_amount, next_credits, 'purchase', p_payment_id, p_description);

  update public.credit_orders
  set status = 'paid', iyzico_payment_id = p_payment_id, paid_at = now()
  where id = p_order_id;

  return next_credits;
end;
$$;

revoke all on function public.ensure_credit_profile(text, text, text) from public, anon, authenticated;
revoke all on function public.grant_credit_purchase(text, integer, text, uuid, text) from public, anon, authenticated;
grant execute on function public.ensure_credit_profile(text, text, text) to service_role;
grant execute on function public.grant_credit_purchase(text, integer, text, uuid, text) to service_role;
