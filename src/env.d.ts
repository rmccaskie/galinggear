/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Cloudflare Workers runtime bindings — accessed at runtime via
// `import { env } from 'cloudflare:workers'`.
// Generate with `wrangler types` or declare manually here.
declare namespace Cloudflare {
  interface Env {
    SUPABASE_URL: string
    SUPABASE_ANON_KEY: string
  }
}
