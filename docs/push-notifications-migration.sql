-- Миграция: добавляет недостающие колонки, если таблица была создана
-- по старой версии SQL. Безопасно запускать повторно.
-- Выполни в Supabase → SQL Editor.

alter table public.push_subscriptions
  add column if not exists last_sent_key text;

alter table public.push_subscriptions
  add column if not exists updated_at timestamptz not null default now();

alter table public.push_subscriptions
  add column if not exists created_at timestamptz not null default now();

-- Обновляем схему-кэш PostgREST, чтобы новые колонки сразу стали видны API.
notify pgrst, 'reload schema';
