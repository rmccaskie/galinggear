/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly PUBLIC_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Cloudflare runtime bindings available on Astro.locals.
type CloudflareRuntimeEnv = {
  SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  PUBLIC_SITE_URL?: string
}

declare namespace App {
  interface Locals {
    runtime?: {
      env?: CloudflareRuntimeEnv
    }
  }
}
