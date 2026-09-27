import { PUSH_SUBSCRIPTIONS_TABLE, createAdminClient } from '@/lib/supabase';

interface SubscribeBody {
  deviceId?: string;
  timezone?: string;
  reminders?: string[];
  subscription?: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };
}

/** Stores (or refreshes) a browser push subscription for a device. */
export async function POST(req: Request) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return Response.json({ error: 'Некоректний запит.' }, { status: 400 });
  }

  const { deviceId, subscription, timezone, reminders } = body;
  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;

  if (!deviceId || !endpoint || !p256dh || !auth) {
    return Response.json({ error: 'Неповні дані підписки.' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from(PUSH_SUBSCRIPTIONS_TABLE).upsert(
      {
        device_id: deviceId,
        endpoint,
        p256dh,
        auth,
        timezone: timezone ?? 'UTC',
        reminders: reminders ?? [],
      },
      { onConflict: 'endpoint' },
    );

    if (error) {
      console.error('[push/subscribe] Supabase error:', error);
      return Response.json(
        { error: `Не вдалося зберегти підписку: ${error.message}` },
        { status: 500 },
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[push/subscribe] Unexpected error:', err);
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return Response.json({ error: `Не вдалося зберегти підписку: ${message}` }, { status: 500 });
  }
}

/** Removes a subscription when the user disables notifications. */
export async function DELETE(req: Request) {
  let body: { endpoint?: string };
  try {
    body = (await req.json()) as { endpoint?: string };
  } catch {
    return Response.json({ error: 'Некоректний запит.' }, { status: 400 });
  }

  if (!body.endpoint) {
    return Response.json({ error: 'Не вказано endpoint.' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(PUSH_SUBSCRIPTIONS_TABLE)
      .delete()
      .eq('endpoint', body.endpoint);

    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Не вдалося видалити підписку.' }, { status: 500 });
  }
}
