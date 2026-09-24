/**
 * Locale definitions, fallback chain, and resolution for the site i18n.
 *
 * ONE module — every consumer imports from here. No locale constants anywhere
 * else. Built to the i18n plan spec (see docs/).
 * and governed by /home/ubuntu/Uploads/internationalization.md §7.
 *
 * ⚠ SERVER ONLY — the catalogue statically imports every locale, so importing
 *   this into a client component ships ALL locales to every visitor (invisible
 *   bundle weight on the slowest devices). Resolve on the server; pass
 *   translated strings to client components as props. (§7.5)
 */

// ---------------------------------------------------------------------------
// Locale set
// ---------------------------------------------------------------------------

/**
 * Internal locale identifiers.
 * 'taglish' is an invented id for the Taglish register (§2 of the plan).
 * NEVER use 'tl' — that means Tagalog, a different product.
 */
export const LOCALES = ['taglish', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** The locale content is authored in. Every item exists in English first. */
export const BASE_LOCALE: Locale = 'en'

/** The locale served when no signal is available (bare tree). */
export const DEFAULT_LOCALE: Locale = 'taglish'

// ---------------------------------------------------------------------------
// Fallback chain
// ---------------------------------------------------------------------------

/**
 * If a string/item is missing in the requested locale, walk this chain.
 * Taglish falls back to English (the authoring base). English has no fallback
 * — it IS the base; a missing English string is a bug, not a fallback case.
 *
 * Declared once, exported, used by every consumer (§15 of the standard).
 */
export const FALLBACK_CHAIN: Record<Locale, Locale | null> = {
  taglish: 'en',
  en: null,
}

/**
 * Walk the fallback chain for a given locale, returning the ordered list of
 * locales to try (inclusive of the requested locale).
 */
export function fallbackOrder(locale: Locale): Locale[] {
  const order: Locale[] = [locale]
  let next = FALLBACK_CHAIN[locale]
  while (next) {
    order.push(next)
    next = FALLBACK_CHAIN[next]
  }
  return order
}

// ---------------------------------------------------------------------------
// HTML lang & OG tags (D-lang-tags)
// ---------------------------------------------------------------------------

/** Maps internal locale id → the nearest real `<html lang>` tag. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en-PH',
  taglish: 'fil-PH',
}

/** Maps internal locale id → the `og:locale` value (underscore form). */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_PH',
  taglish: 'fil_PH',
}

// ---------------------------------------------------------------------------
// Language switcher endonyms (§7.4)
// ---------------------------------------------------------------------------

/**
 * Endonym labels for the language switcher. NOT in the catalogue — they are
 * always rendered in their own language so a reader in the wrong locale can
 * still find the switch. Each carries its own `lang` attribute for screen
 * readers (§7.4).
 */
export const SWITCHER_LABELS: Record<Locale, { label: string; lang: string }> = {
  taglish: { label: 'Taglish', lang: 'fil-PH' },
  en: { label: 'English', lang: 'en-PH' },
}

// ---------------------------------------------------------------------------
// URL prefix mapping
// ---------------------------------------------------------------------------

/** Path prefix for each locale. DEFAULT_LOCALE is bare (empty string). */
export const URL_PREFIX: Record<Locale, string> = {
  taglish: '',
  en: '/en',
}

/**
 * Given a URL pathname, extract the locale from the leading prefix.
 * Returns the locale and the remaining path (without the prefix).
 */
export function localeFromPath(pathname: string): { locale: Locale; rest: string } {
  // Check non-default prefixes first (longest match wins if there were more).
  for (const loc of LOCALES) {
    const prefix = URL_PREFIX[loc]
    if (!prefix) continue
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return { locale: loc, rest: pathname.slice(prefix.length) || '/' }
    }
  }
  return { locale: DEFAULT_LOCALE, rest: pathname }
}

// ---------------------------------------------------------------------------
// Cookie (§7.4)
// ---------------------------------------------------------------------------

/**
 * The `__Host-` cookie that remembers the reader's locale preference.
 * - `__Host-` prefix: browser enforces Secure, Path=/, no Domain (§7.4).
 * - `SameSite=Lax` not Strict: Strict withholds on cross-site nav, so a
 *   visitor arriving from an external link lands in the wrong language.
 * - One year unless data-retention policy says otherwise.
 */
export const LOCALE_COOKIE = {
  name: '__Host-gg-locale',
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  sameSite: 'Lax' as const,
  secure: true,
  path: '/',
  httpOnly: false, // readable by client-side switcher
}

// ---------------------------------------------------------------------------
// Country → locale mapping (for geo resolution)
// ---------------------------------------------------------------------------

/**
 * Countries where Taglish is the preferred default.
 * PH is the primary target; expand if the Philippine diaspora in a specific
 * country is large enough to warrant it.
 */
const TAGLISH_COUNTRIES = new Set(['PH'])

/**
 * Given a country code (ISO 3166-1 alpha-2, as provided by Cloudflare's
 * `cf-ipcountry` header), return the geo-inferred locale.
 * Returns `null` for unknown countries (`XX`, empty, or missing) — the caller
 * must fall through to the next signal (§7.3: unknown country → header, never
 * to the base locale).
 */
export function localeForCountry(country: string | null | undefined): Locale | null {
  if (!country || country === 'XX') return null // unknown → fall through
  return TAGLISH_COUNTRIES.has(country.toUpperCase()) ? 'taglish' : 'en'
}

// ---------------------------------------------------------------------------
// Accept-Language → locale (below geo in precedence)
// ---------------------------------------------------------------------------

/**
 * Parse the Accept-Language header and return the best-matching locale.
 * Returns `null` if no usable signal (absent header, no matching tag).
 *
 * Matching rules:
 * - `fil`, `tl`, `fil-PH`, `tl-PH` → taglish (Filipino/Tagalog variants)
 * - `en`, `en-*` → en
 * - Anything else → no match
 *
 * Quality weights are respected: highest-quality match wins.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null

  const entries = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1.0
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q }
    })
    .filter((e) => e.q > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of entries) {
    const primary = tag.split('-')[0]
    if (primary === 'fil' || primary === 'tl') return 'taglish'
    if (primary === 'en') return 'en'
  }
  return null
}

// ---------------------------------------------------------------------------
// Full resolution chain (§7.1)
// ---------------------------------------------------------------------------

export interface ResolveInput {
  /** URL pathname (e.g. '/en/articles/my-slug'). */
  pathname: string
  /** Value of the __Host-gg-locale cookie, if present. */
  cookie?: string | null
  /** Account-level locale preference, if the user is signed in. */
  accountLocale?: Locale | null
  /**
   * Country code from the edge (Cloudflare `cf-ipcountry` header).
   * 'XX' or absent = unknown.
   */
  country?: string | null
  /** Accept-Language header value. */
  acceptLanguage?: string | null
}

export interface ResolveResult {
  /** The resolved locale for this request. */
  locale: Locale
  /** Which signal determined the locale. */
  source:
    | 'url'
    | 'cookie'
    | 'account'
    | 'country'
    | 'accept-language'
    | 'default'
  /** The URL path with the locale prefix stripped. */
  rest: string
}

/**
 * Full locale resolution — §7.1 precedence.
 *
 * ```
 * URL path prefix → cookie → account preference → country (edge geo)
 *                 → Accept-Language → default locale
 * ```
 *
 * ⚠ Geo outranks Accept-Language (§7.2).
 * ⚠ Unknown country falls through to header, never to base locale (§7.3).
 * ⚠ Never IP-redirect on the strength of this (§7.3).
 * ⚠ The URL wins for the current view and does NOT overwrite account
 *   preference (§7.4).
 *
 * This is a **pure function** — no side effects, no cookie writes, no
 * redirects. The caller (Cloudflare Function, Astro middleware, or test)
 * decides what to do with the result.
 */
export function resolveLocale(input: ResolveInput): ResolveResult {
  // 1. URL prefix — highest priority, always honoured.
  const { locale: urlLocale, rest } = localeFromPath(input.pathname)
  if (URL_PREFIX[urlLocale] !== '') {
    // An explicit prefix was present → that's the locale.
    return { locale: urlLocale, rest, source: 'url' }
  }
  // Bare tree (no prefix) → the URL does not constrain; fall through.

  // 2. Cookie
  if (input.cookie && LOCALES.includes(input.cookie as Locale)) {
    return { locale: input.cookie as Locale, rest, source: 'cookie' }
  }

  // 3. Account preference
  if (input.accountLocale && LOCALES.includes(input.accountLocale)) {
    return { locale: input.accountLocale, rest, source: 'account' }
  }

  // 4. Country (geo) — outranks Accept-Language (§7.2)
  const geoLocale = localeForCountry(input.country)
  if (geoLocale) {
    return { locale: geoLocale, rest, source: 'country' }
  }
  // §7.3: unknown country (null) falls through to header, never to default.

  // 5. Accept-Language
  const headerLocale = localeFromAcceptLanguage(input.acceptLanguage)
  if (headerLocale) {
    return { locale: headerLocale, rest, source: 'accept-language' }
  }

  // 6. Default
  return { locale: DEFAULT_LOCALE, rest, source: 'default' }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Type guard: is a string a valid Locale? */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Build a localised path from a locale and a bare path. */
export function localisedPath(locale: Locale, path: string): string {
  const prefix = URL_PREFIX[locale]
  const clean = path.startsWith('/') ? path : `/${path}`
  return prefix ? `${prefix}${clean}` : clean
}
