import { DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

type SqlClient = ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown[]>) & {
  query?: (query: string, params?: unknown[]) => Promise<unknown[]>;
};

export async function ensureFortuneQueueSchema(sql: SqlClient) {
  if (typeof sql.query !== "function") return false;
  const statements = [
    `alter table public.readings add column if not exists status text not null default 'ready'`,
    `alter table public.readings add column if not exists available_at timestamptz`,
    `alter table public.readings add column if not exists queued_at timestamptz`,
    `alter table public.readings add column if not exists started_at timestamptz`,
    `alter table public.readings add column if not exists completed_at timestamptz`,
    `alter table public.readings add column if not exists delivery_mode text not null default 'instant'`,
    `alter table public.readings add column if not exists commentator_id text`,
    `alter table public.readings add column if not exists commentator_name text`,
    `alter table public.readings add column if not exists price_credits integer`,
    `alter table public.readings add column if not exists input jsonb not null default '{}'::jsonb`,
    `alter table public.readings add column if not exists error_message text`,
    `create index if not exists readings_status_available_idx on public.readings (status, available_at) where status in ('queued','processing')`,
    `create table if not exists public.commentators (id text primary key, display_name text not null, title text not null, bio text, avatar_url text, specialties text[] not null default '{}', commentator_type text not null default 'ai' check (commentator_type in ('human','ai')), rating numeric(2,1) not null default 5.0 check (rating between 0 and 5), reading_count integer not null default 0, avg_minutes integer not null default 5, price_credits integer not null default 10, voice_price_credits integer not null default 5, status text not null default 'offline' check (status in ('online','busy','offline')), verified boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now())`,
    `create index if not exists commentators_status_rating_idx on public.commentators (status, rating desc, reading_count desc)`,
  ];

  for (const statement of statements) await sql.query(statement);

  // AI roster is deterministic and safe to refresh. Any future real-human profiles are preserved.
  await sql.query(`delete from public.commentators where commentator_type = 'ai'`);
  for (const item of DIGITAL_COMMENTATORS) {
    await sql.query(
      `insert into public.commentators (id, display_name, title, bio, avatar_url, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified)
       values ($1,$2,$3,$4,$5,$6,'ai',$7,$8,$9,$10,$11,$12,true)
       on conflict (id) do update set display_name=excluded.display_name, title=excluded.title, bio=excluded.bio, avatar_url=excluded.avatar_url, specialties=excluded.specialties, rating=excluded.rating, reading_count=excluded.reading_count, avg_minutes=excluded.avg_minutes, price_credits=excluded.price_credits, voice_price_credits=excluded.voice_price_credits, status=excluded.status, verified=true, updated_at=now()`,
      [item.id, item.name, item.title, item.description, item.avatarUrl, item.specialties, item.rating, item.readingCount, item.etaMinutes, item.priceCredits, item.voiceCredits, item.availability],
    );
  }
  return true;
}
