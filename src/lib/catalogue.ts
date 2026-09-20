/**
 * i18n string catalogue — Track 1 (site chrome).
 *
 * ⚠ SERVER ONLY — the catalogue statically imports every locale, so importing
 *   it into a client component ships ALL locales to every visitor. Resolve on
 *   the server; pass translated strings to client components as props. (§7.5)
 *
 * Structure:
 *   - One flat object per locale, keyed by dotted namespace.key strings.
 *   - Base catalogue (English) must be 100 % complete — a missing key there
 *     is a bug, not a fallback case.
 *   - Non-base catalogues (Taglish) fall back to the base for any missing key
 *     via the fallback chain in i18n.ts.
 *   - The non-base catalogue must carry a REVIEW GATE (§10.4): it is not
 *     servable until a reviewer name + date marker is present. The gate is
 *     armed in code — see `isReviewed()`.
 */

import { type Locale, BASE_LOCALE, fallbackOrder } from './i18n'
import { enCatalogue } from './catalogues/en'
import { taglishCatalogue, TAGLISH_REVIEW } from './catalogues/taglish'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Every key in the base (English) catalogue. */
export type CatalogueKey = keyof typeof enCatalogue

/** A catalogue is a partial record of the base keys → translated strings. */
export type Catalogue = Partial<Record<CatalogueKey, string>>

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const catalogues: Record<Locale, Catalogue> = {
  en: enCatalogue,
  taglish: taglishCatalogue,
}

// ---------------------------------------------------------------------------
// Review gate (§10.4)
// ---------------------------------------------------------------------------

export interface ReviewMarker {
  reviewer: string | null
  date: string | null
}

/**
 * Returns true if the given locale's catalogue has been human-reviewed.
 * The base locale is always considered reviewed (it IS the source of truth).
 * A non-base locale requires a reviewer name AND a date.
 */
export function isReviewed(locale: Locale): boolean {
  if (locale === BASE_LOCALE) return true
  if (locale === 'taglish') {
    return !!(TAGLISH_REVIEW.reviewer && TAGLISH_REVIEW.date)
  }
  return false
}

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

/**
 * Look up a catalogue string for the given locale, walking the fallback chain.
 *
 * If the non-base catalogue is NOT reviewed (review gate), the lookup skips it
 * entirely and falls straight through to the base — so unreviewed Taglish
 * chrome never reaches the reader.
 *
 * Returns the string, or the key itself as a last resort (never blank).
 */
export function t(locale: Locale, key: CatalogueKey): string {
  const chain = fallbackOrder(locale)
  for (const loc of chain) {
    // Skip unreviewed non-base catalogues — §10.4 gate.
    if (loc !== BASE_LOCALE && !isReviewed(loc)) continue
    const cat = catalogues[loc]
    const value = cat?.[key]
    if (value !== undefined && value !== '') return value
  }
  // Last resort: return the key so the page is never blank.
  return key
}

/**
 * Convenience: get the full catalogue for a locale (with fallback applied).
 * Returns a frozen object so consumers can't accidentally mutate it.
 */
export function resolvedCatalogue(locale: Locale): Readonly<Record<CatalogueKey, string>> {
  const result = {} as Record<CatalogueKey, string>
  for (const key of Object.keys(enCatalogue) as CatalogueKey[]) {
    result[key] = t(locale, key)
  }
  return Object.freeze(result)
}

// ---------------------------------------------------------------------------
// Interpolation
// ---------------------------------------------------------------------------

/**
 * Simple template interpolation: replaces `{key}` placeholders with values.
 *
 * Usage:
 *   fmt(t(locale, 'article.more_in'), { scenario: 'Typhoon season' })
 *   // → 'More in Typhoon season'
 *
 * No ICU message format, no complex plurals — the site uses plain English/
 * Taglish plurals handled by the caller (pick the right noun form before
 * interpolating). Keep it simple; if we ever need ICU, swap this out.
 */
export function fmt(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const v = values[key]
    return v !== undefined ? String(v) : match
  })
}

/**
 * Pick a singular/plural noun form. English-only for now; Taglish will use
 * the same rule (Taglish plurals follow English grammar for count nouns).
 */
export function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm
}
