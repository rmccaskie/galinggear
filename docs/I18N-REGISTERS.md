# i18n Registers — Galing Gear

Mirrors of the §16 registers from the governing standard. Updated as the build
progresses. Source of truth: `/home/ubuntu/output/galinggear-i18n-plan.md`.

---

## 1. Interview answers (§16.1)

| # | Decision | Status |
|---|----------|--------|
| D-locales | Two locales: **Taglish** (default/primary) and **English** (secondary). | `[SETTLED]` |
| D-base | **English is the authoring/completeness base.** Every item exists in English first; Taglish is derived. | `[SETTLED]` |
| D-taglish-register | **Taglish is a code-switched register, not Tagalog.** Separate locale; never tagged `tl`. | `[SETTLED]` |
| D-url-model | **Unmarked = Taglish (default); marked = English.** No locale in URL → Taglish; `/en/` prefix → English. | `[SETTLED]` |
| D-url-mechanism | **Path prefix**, not subdomain. SEO authority consolidation; `__Host-` cookie safety; single origin. | `[SETTLED]` |
| D-lang-tags | English: `lang="en-PH"`, `og:locale="en_PH"`. Taglish: `lang="fil-PH"`, `og:locale="fil_PH"`. | `[SETTLED]` |
| D-scope | Translate everything the reader sees: chrome, articles, rail cards, image captions, alt text. | `[SETTLED]` |
| D-review-chrome | Site chrome is human-reviewed before shipping. | `[SETTLED]` |
| D-review-content | Articles/rail cards/captions are NOT human-reviewed (AI direct). Owner-accepted risk. | `[SETTLED]` |
| D-seo | `hreflang`, canonicals, per-locale `og:` in scope. | `[SETTLED]` |
| D-admin | Admin/CMS is English only — no translation. | `[SETTLED]` |
| D-taglish-trigger | Publish triggers Taglish generation. Phase 1: manual per-publish tick. Phase 2: admin auto-flag. | `[SETTLED]` |
| D-reader-repo | Public site: `rmccaskie/galinggear` → Cloudflare → www.galinggear.com. Admin: `galinggear-admin`. | `[SETTLED]` |

---

## 2. Build-state register (§16.2)

| Piece | State |
|-------|-------|
| Locale set, fallback chain, resolver | ✅ `src/lib/i18n.ts` |
| Astro i18n config | ✅ `astro.config.mjs` |
| Catalogue + namespace table | ✅ `src/lib/catalogue.ts` + `catalogues/en.ts` |
| Formatting subset (interpolation, plurals) | ✅ `fmt()` + `plural()` in `catalogue.ts` |
| Track 2 dual-copy storage + drift hash | ✅ `articles-taglish` collection + `sourceHash` in frontmatter |
| AI Taglish generation pipeline + glossary/style guide | ✅ `generate-taglish.ts` (admin) + publish-time generation |
| Empty=fallback behaviour + fallback-path tests | ✅ `article-locale.ts` falls back to English when Taglish absent |
| Review gate armed in code (chrome) | ✅ `catalogues/taglish.ts` + `isReviewed()` |
| Language switcher (signed-out, endonyms) | ✅ `LocaleSwitcher.astro` in Header + mobile drawer |
| `<html lang>` dynamic per locale | ✅ `BaseLayout.astro` (derives from `HTML_LANG[locale]`) |
| `og:locale`, translation suppression | ✅ `SEO.astro` (`og:locale` + `og:locale:alternate` per locale) |
| URL prefix routing + `hreflang` + canonicals | ✅ `/en/` page tree + `hreflang` (fil/en/x-default) + canonical in `SEO.astro` |
| Named reviewer + cadence (chrome) | ⚠ NOT BUILT |
| Style guide (safeguard 1) | ✅ `docs/TAGLISH-STYLE-GUIDE.md` |
| Edge locale resolver (Cloudflare Function) | ◐ Resolver logic built (`resolveLocale()` in `i18n.ts`); edge auto-redirect **deferred to phase 2** — see ADR-010 |
| Chrome catalogue wired to all components | ✅ Header, Footer, SubscribeForm, ArticleCard, RailItem, ScenarioNav |
| Chrome catalogue wired to all pages | ✅ index, subscribe, 404, archive, [scenario], articles/[slug] |
| Client-side strings via data-strings | ✅ SubscribeForm (error/success messages) |
| Admin English-only (unchanged) | ✅ already the case |
