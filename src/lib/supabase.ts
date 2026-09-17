import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase anon client factory.
 *
 * Phase one uses the anon key only. The `subscribers` table has an RLS
 * insert-only policy, so no server secret (service-role key) is needed or
 * present. See supabase/migrations/0001_subscribers.sql.
 *
 * Startup guard: if either variable is missing we throw with the *name* of the
 * missing variable, never a generic message — a missing configuration value
 * should be obvious the moment it is read.
 */

type SupabaseEnv = {
  SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
}

function resolve(runtimeEnv?: SupabaseEnv): { url: string; anonKey: string } {
  // On Cloudflare Pages, secrets arrive on the runtime env at request time.
  // At build time (and in dev) they come from import.meta.env / .env.
  const url = runtimeEnv?.SUPABASE_URL ?? import.meta.env.SUPABASE_URL
  const anonKey = runtimeEnv?.SUPABASE_ANON_KEY ?? import.meta.env.SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('Missing required environment variable: SUPABASE_URL')
  }
  if (!anonKey) {
    throw new Error('Missing required environment variable: SUPABASE_ANON_KEY')
  }
  return { url, anonKey }
}

export function createSupabaseClient(runtimeEnv?: SupabaseEnv): SupabaseClient {
  const { url, anonKey } = resolve(runtimeEnv)
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
