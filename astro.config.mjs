import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

// Build-time shim: some build-only deps (fdir, via the content-layer glob
// loader) call `createRequire(import.meta.url)` at module top level. In the
// Cloudflare Workers runtime `import.meta.url` is undefined, so merely LOADING
// the SSR chunk throws — breaking every server-rendered page (e.g. /subscribe).
// The require is never actually invoked at runtime, so replacing the base with
// a harmless literal lets the module evaluate. See docs/DECISIONS.md.
function shimCreateRequire() {
  const NEEDLE = 'createRequire(import.meta.url)'
  const REPLACEMENT = 'createRequire("file:///noop.js")'
  return {
    name: 'galinggear:shim-createrequire-import-meta-url',
    renderChunk(code) {
      if (!code.includes(NEEDLE)) return null
      return { code: code.split(NEEDLE).join(REPLACEMENT), map: null }
    },
  }
}

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
  vite: { plugins: [shimCreateRequire()] },

  // i18n — path-prefix routing.
  // Bare tree = Taglish (default); /en/ = English.
  // See docs/I18N-REGISTERS.md and src/lib/i18n.ts.
  i18n: {
    defaultLocale: 'taglish',
    locales: ['taglish', 'en'],
    routing: {
      prefixDefaultLocale: false,
      // Taglish → English fallback is handled at the content level in page
      // code (not Astro’s routing fallback) because the default locale cannot
      // be a fallback key. See src/lib/i18n.ts fallbackOrder().
    },
  },
})
