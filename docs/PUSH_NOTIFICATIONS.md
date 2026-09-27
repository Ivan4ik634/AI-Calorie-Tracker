# Push-уведомления (Web Push + Supabase + GitHub Actions)

Уведомления приходят **даже когда сайт закрыт**. Работает через Web Push:
браузер подписывается, подписка хранится в Supabase, а GitHub Actions раз в час
запускает рассылку.

> **Почему не Vercel Cron?** На бесплатном (Hobby) плане Vercel разрешает cron
> только раз в день. GitHub Actions бесплатен и умеет запускать задачу каждый час.

## Как это работает

```
Onboarding пройден
   ↓
Браузер спрашивает разрешение на уведомления
   ↓
Подписка сохраняется в Supabase (deviceId + endpoint + timezone)
   ↓
GitHub Actions каждый час → GET /api/push/send
   ↓
Сервер смотрит локальное время каждого устройства
   ↓
Шлёт web-push → уведомление приходит с закрытым сайтом
```

## Файлы

| Файл                                      | Назначение                                             |
| ----------------------------------------- | ------------------------------------------------------ |
| `public/sw.js`                            | Service worker: принимает пуш и показывает уведомление |
| `app/manifest.ts`                         | PWA-манифест (установка на телефон)                    |
| `lib/supabase.ts`                         | Серверный Supabase-клиент (secret key)                 |
| `services/notifications/mealReminders.ts` | Расписание приёмов пищи                                |
| `services/notifications/webPush.ts`       | Подписка/отписка браузера                              |
| `hooks/usePushNotifications.ts`           | Синхронизация подписки с настройками                   |
| `app/api/push/subscribe/route.ts`         | Сохранение/удаление подписки                           |
| `app/api/push/send/route.ts`              | Рассылка (вызывается по расписанию)                    |
| `app/api/push/test/route.ts`              | Тестовое сповіщення (кнопка в настройках)              |
| `.github/workflows/push-cron.yml`         | Расписание рассылки (каждый час)                       |
| `docs/push-notifications.sql`             | SQL для таблицы подписок                               |

## Настройка

### 1. Supabase

1. Открой **SQL Editor** и выполни `docs/push-notifications.sql`.
2. Возьми **secret key**: Project Settings → API Keys → `secret key` (`sb_secret_...`).
3. Положи его в `.env.local` в `SUPABASE_SECRET_KEY` (и добавь в Vercel).

### 2. Vercel

Добавь в **Environment Variables** (Production + Preview):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
CRON_SECRET
```

`CRON_SECRET` — любая случайная строка. Она защищает эндпоинт рассылки:
запрос без правильного заголовка `Authorization: Bearer <CRON_SECRET>`
будет отклонён.

### 3. GitHub Actions (расписание)

1. Залей проект на GitHub (репозиторий может быть приватным).
2. Открой **Settings → Secrets and variables → Actions → New repository secret**.
3. Добавь два секрета:
   - `SITE_URL` — адрес сайта, например `https://твой-проект.vercel.app`
   - `CRON_SECRET` — та же строка, что в Vercel
4. Готово. Workflow `.github/workflows/push-cron.yml` будет запускаться каждый час.

Проверить вручную: **Actions → Meal reminder push → Run workflow**.

### 4. Проверка

- Локально: `npm run dev`, пройди onboarding, разреши уведомления.
- Кнопка **«Тестове сповіщення»** в настройках — приходит мгновенно.
- Вручную дёрнуть рассылку:
  `curl -H "Authorization: Bearer <CRON_SECRET>" https://<домен>/api/push/send`

## Важно

- **iOS**: пуши работают только если сайт **добавлен на домашний экран**
  (iOS 16.4+). В Safari-вкладке — нет.
- **HTTPS обязателен** (кроме localhost).
- Расписание в GitHub Actions — UTC. Время приёма пищи задаётся в
  `services/notifications/mealReminders.ts` и сравнивается с локальным
  временем устройства.
- GitHub Actions может запускаться с задержкой в несколько минут — для
  напоминаний это не критично.
