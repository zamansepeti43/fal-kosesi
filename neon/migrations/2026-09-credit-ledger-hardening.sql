-- Apply once to an existing production database.
-- Keeps welcome-credit transactions idempotent when account creation is retried.

create unique index if not exists credit_transactions_welcome_reference_idx
  on public.credit_transactions (reference_id)
  where type = 'welcome' and reference_id is not null;
