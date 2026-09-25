// ---------------------------------------------------------------------------
// Web App Manifest (profile-driven)
// ---------------------------------------------------------------------------
// Replaces the former static public/site.webmanifest so the brand name, short
// name and theme colours come from the site profile rather than being baked
// into a niche-specific static file. The emitted body is BYTE-IDENTICAL to the
// previous static file for the current profile (same key order, spacing and
// trailing newline); only the profile-supplied values are interpolated, so a
// profile swap changes the manifest without any engine edit. (Stage 1, Step 9.)
//
// Prerendered to dist/client/site.webmanifest at build time, matching how the
// manifest was served before (a static asset), and referenced by BaseLayout via
// <link rel="manifest" href="/site.webmanifest" />.
// ---------------------------------------------------------------------------
import type { APIRoute } from 'astro'
import { siteProfile } from '../lib/site-profile'

export const prerender = true

export const GET: APIRoute = () => {
  const { brand } = siteProfile
  const name = brand.name
  const shortName = brand.shortName ?? brand.name
  const themeColor = brand.theme.themeColor
  const backgroundColor = brand.theme.backgroundColor

  // Built as a literal template (not JSON.stringify with indent) so the icons
  // array and overall formatting stay exactly as the old static file. Values are
  // JSON-encoded individually so quoting/escaping is correct.
  const body =
    '{\n' +
    `  "name": ${JSON.stringify(name)},\n` +
    `  "short_name": ${JSON.stringify(shortName)},\n` +
    '  "icons": [\n' +
    '    { "src": "/brand/icon-192.png", "sizes": "192x192", "type": "image/png" },\n' +
    '    { "src": "/brand/icon-512.png", "sizes": "512x512", "type": "image/png" }\n' +
    '  ],\n' +
    `  "theme_color": ${JSON.stringify(themeColor)},\n` +
    `  "background_color": ${JSON.stringify(backgroundColor)},\n` +
    '  "display": "standalone"\n' +
    '}\n'

  return new Response(body, {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  })
}
