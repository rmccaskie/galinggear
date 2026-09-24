/**
 * Series helpers — reads the series definition from src/data/series.json and
 * resolves each part against the articles collection.
 *
 * One article can appear in multiple series. Order is array-position in the
 * series definition. Parts that haven't been published yet (or don't exist in
 * the articles collection) are treated as "coming soon" when a `plannedDate`
 * is present.
 */

import seriesData from '../data/series.json'
import type { CollectionEntry } from 'astro:content'
import { DEFAULT_LOCALE, type Locale } from './i18n'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SeriesPartDef {
  slug: string
  /** ISO date string — when the part is expected to go live. */
  plannedDate?: string
}

export interface SocialCopy {
  facebook?: string
  x?: string
  instagram?: string
  facebookTl?: string
  xTl?: string
  instagramTl?: string
}

export interface SeriesDef {
  title: string
  /** Short blurb shown on the landing page. */
  blurb: string
  /** Taglish title for the default (Tagalog) locale. Falls back to `title`. */
  titleTl?: string
  /** Taglish blurb for the default (Tagalog) locale. Falls back to `blurb`. */
  blurbTl?: string
  /** The slug of the anchor article (must also appear in `parts`). */
  anchorSlug: string
  parts: SeriesPartDef[]
  /** Baked social copy for public-site share buttons (EN + Taglish). */
  social?: SocialCopy
}

export interface ResolvedPart {
  order: number // 1-based
  slug: string
  title: string
  description: string
  heroImage?: string
  scenario: string
  publishedAt?: string
  plannedDate?: string
  isAnchor: boolean
  isLive: boolean
}

export interface ResolvedSeries {
  slug: string
  title: string
  blurb: string
  /** Taglish title for the default (Tagalog) locale. Falls back to `title`. */
  titleTl?: string
  /** Taglish blurb for the default (Tagalog) locale. Falls back to `blurb`. */
  blurbTl?: string
  anchorSlug: string
  parts: ResolvedPart[]
  liveCount: number
  totalCount: number
  /** Baked social copy for public-site share buttons (EN + Taglish). */
  social?: SocialCopy
}

// ---------------------------------------------------------------------------
// Raw data
// ---------------------------------------------------------------------------

/** All series definitions keyed by series slug. */
const raw = seriesData as Record<string, SeriesDef>

export function allSeriesSlugs(): string[] {
  return Object.keys(raw)
}

export function getSeriesDef(slug: string): SeriesDef | undefined {
  return raw[slug]
}

// ---------------------------------------------------------------------------
// Resolve against the articles collection
// ---------------------------------------------------------------------------

/**
 * Resolve a single series, matching each part slug against the articles
 * collection. Parts whose slug is not found AND that have no `plannedDate`
 * are silently dropped (dead references). Parts with a `plannedDate` but no
 * matching article are kept as "coming soon".
 */
export function resolveSeries(
  seriesSlug: string,
  articles: CollectionEntry<'articles'>[],
): ResolvedSeries | null {
  const def = raw[seriesSlug]
  if (!def) return null

  const bySlug = new Map(articles.map((a) => [a.id, a]))

  const parts: ResolvedPart[] = []
  for (let i = 0; i < def.parts.length; i++) {
    const p = def.parts[i]
    const article = bySlug.get(p.slug)
    const isLive = !!article && article.data.status !== 'archived'

    if (!article && !p.plannedDate) continue // dead reference, skip

    parts.push({
      order: i + 1,
      slug: p.slug,
      title: article?.data.title ?? p.slug.replace(/-/g, ' '),
      description: article?.data.description ?? '',
      heroImage: article?.data.heroImage ?? article?.data.heroGallery?.[0]?.src,
      scenario: article?.data.scenario ?? '',
      publishedAt: article?.data.publishedAt,
      plannedDate: p.plannedDate,
      isAnchor: p.slug === def.anchorSlug,
      isLive,
    })
  }

  return {
    slug: seriesSlug,
    title: def.title,
    blurb: def.blurb,
    titleTl: def.titleTl,
    blurbTl: def.blurbTl,
    anchorSlug: def.anchorSlug,
    parts,
    liveCount: parts.filter((p) => p.isLive).length,
    totalCount: parts.length,
    social: def.social,
  }
}

/**
 * Pick the locale-appropriate series title + blurb. The site defaults to
 * Tagalog, so for the default locale we prefer the Taglish fields and fall back
 * to English when they are absent; English (`/en`) always shows the English
 * fields.
 */
export function localiseSeriesMeta(
  series: Pick<ResolvedSeries, 'title' | 'blurb' | 'titleTl' | 'blurbTl'>,
  locale: Locale,
): { title: string; blurb: string } {
  if (locale === DEFAULT_LOCALE) {
    return {
      title: series.titleTl?.trim() || series.title,
      blurb: series.blurbTl?.trim() || series.blurb,
    }
  }
  return { title: series.title, blurb: series.blurb }
}

/**
 * Find all series that contain a given article slug.
 * Returns resolved series with the article's position marked.
 */
export function seriesForArticle(
  articleSlug: string,
  articles: CollectionEntry<'articles'>[],
): ResolvedSeries[] {
  const results: ResolvedSeries[] = []
  for (const sSlug of Object.keys(raw)) {
    const def = raw[sSlug]
    if (!def.parts.some((p) => p.slug === articleSlug)) continue
    const resolved = resolveSeries(sSlug, articles)
    if (resolved) results.push(resolved)
  }
  return results
}

/**
 * Resolve ALL series (for an index/overview page or sitemap).
 */
export function resolveAllSeries(
  articles: CollectionEntry<'articles'>[],
): ResolvedSeries[] {
  return Object.keys(raw)
    .map((slug) => resolveSeries(slug, articles))
    .filter((s): s is ResolvedSeries => s !== null)
}
