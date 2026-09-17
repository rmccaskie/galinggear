import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from 'cloudflare:workers'

/**
 * Supabase anon client factory.
 *
 * Phase one uses the anon key only. The `subscribers` table has an RLS
 * insert-only policy, so no server secret (service-role key) is needed or
 * present. See supabase/migrations/0001_subscribers.sql.
 *
 * Environment variables are read from the Cloudflare Workers runtime via
 * `import { env } from 'cloudflare:workers'` (the only supported method
 * since @astrojs/cloudflare v14 — `Astro.locals.runtime` was removed).
 *
 * Startup guard: if either variable is missing we throw with the *name* of the
 * missing variable, never a generic message — a missing configuration value
 * should be obvious the moment it is read.
 */

function resolve(): { url: string; anonKey: string } {
  const url = (env as Record<string, unknown>).SUPABASE_URL as string | undefined
  const anonKey = (env as Record<string, unknown>).SUPABASE_ANON_KEY as string | undefined

  if (!url) {
    throw new Error('Missing required environment variable: SUPABASE_URL')
  }
  if (!anonKey) {
    throw new Error('Missing required environment variable: SUPABASE_ANON_KEY')
  }
  return { url, anonKey }
}

export function createSupabaseClient(): SupabaseClient {
  const { url, anonKey } = resolve()
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
