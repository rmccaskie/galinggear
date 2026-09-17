# Architecture Decisions — Galing Gear

Status tags: `[SETTLED]` · `[OPEN]` · `[SUPERSEDED]`

---

## ADR-001 — Astro + Cloudflare Pages `[SETTLED]`

**Decision:** Build the site with Astro (static output, hybrid mode) deployed to Cloudflare Pages.

**Rationale:**
- Phase 1 is editorial-only: articles, a subscribe form, no accounts, no dynamic per-user content.
- Astro's island architecture ships zero JS by default; the site is fast on mobile networks.
- Cloudflare Pages hosts both `galinggear.com` and `galinggear.ph` with a single project.
- The `@astrojs/cloudflare` adapter supports edge functions for the subscribe API without a separate backend.

**Trade-offs:** If phase 2 needs server-rendered, per-user content at scale, a Next.js rebuild or a separate API service may be simpler. That decision is deferred to phase 2.

---

## ADR-002 — Supabase for subscriber storage `[SETTLED]`

**Decision:** Use Supabase (PostgreSQL) via the anon client with RLS for the subscribers table.

**Rationale:**
- The anon key is safe on the client when RLS restricts anon to INSERT only.
- Supabase's free tier handles the expected subscriber volume for phase 1.
- No service-role key is needed, which simplifies the Cloudflare Pages environment.

**Table:**
```sql
subscribers (id uuid, name text, email text UNIQUE, created_at timestamptz)
```

**Policy:** anon INSERT only. No anon SELECT, UPDATE, or DELETE.

---

## ADR-003 — Scenario-first navigation `[SETTLED]`

**Decision:** The primary navigation is 7 scenario slugs, not a traditional category tree.

**Scenarios:** typhoon-season · earthquake-ready · power-outage · go-bag · off-grid · first-aid · edc

**Rationale:** Philippine readers come with a specific situation in mind (typhoon, brownout, earthquake). Organising by scenario rather than product category matches that mental model.

---

## ADR-004 — Phase 1 is editorial only `[SETTLED]`

**Decision:** No shop, no user accounts, no affiliate links in phase 1.

**Rationale:** Establishes trust before monetisation. Editorial independence (we buy our own gear) is a brand commitment, not just a preference. Phase 2 scope is TBD.

---

## ADR-005 — CSS custom properties, no utility frameworks `[SETTLED]`

**Decision:** Plain CSS with a two-layer custom-property token system. No Tailwind, UnoCSS, or similar.

**Rationale:** The design system is small and stable. Utility frameworks add build complexity and make the token constraints harder to enforce (e.g. the `orange-600` fill-only rule). Logical properties are enforced at the stylesheet level.

---

## ADR-006 — `output: 'static'` (not `'hybrid'`) `[SETTLED]`

**Decision:** `astro.config.mjs` uses `output: 'static'`. The `hybrid` output mode was removed in Astro 5; `static` with `export const prerender = false` on individual routes achieves the same result.

**Affected route:** `src/pages/api/subscribe.ts` opts out with `export const prerender = false`.

---

## ADR-007 — British spelling throughout `[SETTLED]`

**Decision:** All user-visible text, documentation, and code comments use British English spelling.

**Rationale:** Galing Gear is a Philippine publication. British English is the dominant standard in Philippine formal writing. Consistent spelling across all copy reduces cognitive load for editors.


---

## ADR-008 — Supabase env vars committed in `wrangler.jsonc` `[SETTLED]`

**Decision:** `SUPABASE_URL` and `SUPABASE_ANON_KEY` live in the committed root `wrangler.jsonc` `vars` block, not only in the Cloudflare dashboard.

**Rationale:** Cloudflare's `wrangler deploy` treats its config as the source of truth and **removes** any variables not listed in it. When these values were set only in the dashboard, every git-triggered deployment wiped them and the subscribe API returned 500. The anon (publishable) key is RLS-protected — the `anon` role can only INSERT into `subscribers` (see `supabase/migrations/0001_subscribers.sql`) — so committing it is safe. The `@astrojs/cloudflare` adapter merges the root config into the generated `dist/server/wrangler.json` at build time. `keep_vars: true` is also set as a safety net.

---

## ADR-009 — `createRequire(import.meta.url)` build-time shim `[SETTLED]`

**Decision:** A small Vite `renderChunk` plugin in `astro.config.mjs` rewrites `createRequire(import.meta.url)` → `createRequire("file:///noop.js")` in the build output.

**Rationale:** The content-layer `glob()` loader (`src/content.config.ts`) transitively bundles `fdir`, which calls `createRequire(import.meta.url)` at module top level. In the Cloudflare Workers runtime `import.meta.url` is `undefined`, so simply *loading* a server-rendered chunk (e.g. `/subscribe`) threw a `TypeError` — every SSR page 500'd, while static pages (prerendered in Node) and the API route (which does not render page content) were unaffected. The `require` is never actually invoked at runtime, so giving it a harmless literal base URL lets the module evaluate. Verified with `wrangler dev`: `/subscribe` returns 200 and renders the success/error banner.
