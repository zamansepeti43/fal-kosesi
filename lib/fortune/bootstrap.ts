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
  await sql.query(`
    insert into public.commentators (id, display_name, title, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified)
    values
      ('ada','Ada','Sembol & Kahve Uzmanı',array['coffee','love','future','general'],'ai',4.9,12840,3,10,5,'online',true),
      ('mira','Mira','Aşk & İlişki Yorumcusu',array['love','tarot','katina','future'],'ai',4.9,10426,4,15,6,'online',true),
      ('lale','Lale','Tarot & Yol Haritası',array['tarot','career','money','future'],'ai',4.8,9650,5,15,6,'online',true),
      ('selin','Selin','Rüya & Bilinçaltı',array['dream','general','future'],'ai',4.8,7821,4,8,5,'busy',true),
      ('derin','Derin','Numeroloji & Yıldızname',array['numerology','astrology','future'],'ai',4.7,6432,6,12,6,'online',true)
    on conflict (id) do update set updated_at=now();
  `);
  return true;
}
