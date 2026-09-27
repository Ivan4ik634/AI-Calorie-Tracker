import { PUSH_SUBSCRIPTIONS_TABLE, createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint. Open /api/push/diagnose in the browser to see
 * whether the push setup is configured correctly.
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      VAPID_PRIVATE_KEY: Boolean(process.env.VAPID_PRIVATE_KEY),
      CRON_SECRET: Boolean(process.env.CRON_SECRET),
    },
  };

  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from(PUSH_SUBSCRIPTIONS_TABLE)
      .select('*', { count: 'exact', head: true });

    if (error) {
      checks.table = { ok: false, error: error.message, code: error.code };
    } else {
      checks.table = { ok: true, rows: count };
    }
  } catch (err) {
    checks.table = {
      ok: false,
      error: err instanceof Error ? err.message : 'Невідома помилка',
    };
  }

  return Response.json(checks);
}
