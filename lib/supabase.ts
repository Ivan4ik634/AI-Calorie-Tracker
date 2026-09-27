import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the secret key.
 * It bypasses RLS, so it must NEVER be imported into client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error('Supabase server env vars are missing (URL / SUPABASE_SECRET_KEY).');
  }

  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const PUSH_SUBSCRIPTIONS_TABLE = 'push_subscriptions';
