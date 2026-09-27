import { PUSH_SUBSCRIPTIONS_TABLE, createAdminClient } from '@/lib/supabase';
import { MEAL_REMINDERS } from '@/services/notifications/mealReminders';
import webpush from 'web-push';

export const dynamic = 'force-dynamic';

interface SubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  timezone: string | null;
  reminders: string[] | null;
  last_sent_key: string | null;
}

/** Returns the local hour (0-23) and date key (YYYY-MM-DD) for a timezone. */
function getLocalParts(timezone: string): { hour: number; dateKey: string } {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
    const hour = Number(get('hour')) % 24;
    const dateKey = `${get('year')}-${get('month')}-${get('day')}`;
    return { hour, dateKey };
  } catch {
    return { hour: now.getUTCHours(), dateKey: now.toISOString().slice(0, 10) };
  }
}

/**
 * Cron endpoint: sends due meal reminders to every stored subscription.
 * Triggered hourly by GitHub Actions (see .github/workflows/push-cron.yml),
 * which passes the CRON_SECRET in the Authorization header.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@example.com';

  if (!publicKey || !privateKey) {
    return Response.json({ error: 'VAPID keys are not configured.' }, { status: 500 });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(PUSH_SUBSCRIPTIONS_TABLE)
    .select('id, endpoint, p256dh, auth, timezone, reminders, last_sent_key');

  if (error) {
    return Response.json({ error: 'Не вдалося отримати підписки.' }, { status: 500 });
  }

  const rows = (data ?? []) as SubscriptionRow[];
  let sent = 0;
  let removed = 0;

  for (const row of rows) {
    const { hour, dateKey } = getLocalParts(row.timezone ?? 'UTC');
    const enabled = row.reminders ?? [];
    const due = MEAL_REMINDERS.filter(
      (reminder) => enabled.includes(reminder.id) && reminder.hour === hour,
    );

    for (const reminder of due) {
      const key = `${dateKey}-${reminder.id}`;
      if (row.last_sent_key === key) continue;

      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint,
            keys: { p256dh: row.p256dh, auth: row.auth },
          },
          JSON.stringify({
            title: reminder.title,
            body: reminder.body,
            icon: '/icon-192.png',
            tag: `meal-${reminder.id}`,
            url: '/',
          }),
        );
        sent += 1;
        await supabase
          .from(PUSH_SUBSCRIPTIONS_TABLE)
          .update({ last_sent_key: key })
          .eq('id', row.id);
      } catch (err) {
        // 404/410 means the subscription is gone — clean it up.
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await supabase.from(PUSH_SUBSCRIPTIONS_TABLE).delete().eq('id', row.id);
          removed += 1;
        }
      }
    }
  }

  return Response.json({ ok: true, sent, removed, checked: rows.length });
}
