
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  timezone text default 'UTC',
  reminders jsonb not null default '[]'::jsonb,
  last_sent_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- На случай, если таблица уже существовала без этих колонок.
alter table public.push_subscriptions
  add column if not exists last_sent_key text;
alter table public.push_subscriptions
  add column if not exists created_at timestamptz not null default now();
alter table public.push_subscriptions
  add column if not exists updated_at timestamptz not null default now();

create index if not exists push_subscriptions_device_id_idx
  on public.push_subscriptions (device_id);

alter table public.push_subscriptions enable row level security;

-- Обновляем схему-кэш PostgREST.
notify pgrst, 'reload schema';
