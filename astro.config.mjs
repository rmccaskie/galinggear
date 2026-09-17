import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

// Static by default. Individual routes opt into server rendering with
// `export const prerender = false` (the subscribe API route only).
// NOTE: `output: 'hybrid'` was removed upstream; `output: 'static'` now
// behaves the same way. See docs/DECISIONS.md.
export default defineConfig({
  output: 'static',
  // Prerender static routes with Node (they use no Cloudflare bindings at build
  // time). Avoids a workerd/miniflare prerender crash; see docs/DECISIONS.md.
  adapter: cloudflare({ platformProxy: { enabled: true }, prerenderEnvironment: 'node' }),
  integrations: [sitemap()],
  site: 'https://galinggear.com',
  server: { allowedHosts: true },
})
