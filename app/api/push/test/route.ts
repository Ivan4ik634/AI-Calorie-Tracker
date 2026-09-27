import { PUSH_SUBSCRIPTIONS_TABLE, createAdminClient } from '@/lib/supabase';
import webpush from 'web-push';

export const dynamic = 'force-dynamic';

interface SubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Sends an immediate test notification to a single device.
 * Used by the "Тестове сповіщення" button in settings.
 */
export async function POST(req: Request) {
  let body: { deviceId?: string };
  try {
    body = (await req.json()) as { deviceId?: string };
  } catch {
    return Response.json({ error: 'Некоректний запит.' }, { status: 400 });
  }

  if (!body.deviceId) {
    return Response.json({ error: 'Не вказано пристрій.' }, { status: 400 });
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
    .select('endpoint, p256dh, auth')
    .eq('device_id', body.deviceId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[push/test] Supabase error:', error);
    return Response.json(
      { error: `Не вдалося отримати підписку: ${error.message}` },
      { status: 500 },
    );
  }

  const row = data as SubscriptionRow | null;
  if (!row) {
    return Response.json(
      { error: 'Підписку не знайдено. Увімкніть сповіщення та спробуйте ще раз.' },
      { status: 404 },
    );
  }

  try {
    await webpush.sendNotification(
      { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
      JSON.stringify({
        title: 'Тестове сповіщення 🍽️',
        body: 'Все працює! Ви отримаєте нагадування про прийоми їжі.',
        icon: '/icon-192.png',
        tag: 'test-notification',
        url: '/',
      }),
    );
    return Response.json({ ok: true });
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      await supabase.from(PUSH_SUBSCRIPTIONS_TABLE).delete().eq('endpoint', row.endpoint);
      return Response.json(
        { error: 'Підписка застаріла. Увімкніть сповіщення заново.' },
        { status: 410 },
      );
    }
    console.error('[push/test] sendNotification error:', err);
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return Response.json({ error: `Не вдалося надіслати сповіщення: ${message}` }, { status: 500 });
  }
}
