/**
 * Locale-aware article resolution.
 *
 * Loads the Taglish article overrides and provides helpers to overlay
 * Taglish title / description / rail-item copy onto the English base.
 * Falls back to English when no Taglish version exists — never blank,
 * per §4/§6 of the i18n standard.
 *
 * Usage:
 *   const tlMap = await getTaglishMap()
 *   const data = localiseArticleData(article, locale, tlMap)
 *   // data.title, data.description are now in the resolved locale.
 */
import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from './i18n'

export type ArticleEntry = CollectionEntry<'articles'>
export type TaglishEntry = CollectionEntry<'articles-taglish'>

/** Memoised Taglish override map (slug → entry). Loaded once per build. */
let _cache: Map<string, TaglishEntry> | null = null

export async function getTaglishMap(): Promise<Map<string, TaglishEntry>> {
  if (!_cache) {
    const entries = await getCollection('articles-taglish')
    _cache = new Map(entries.map((e) => [e.id, e]))
  }
  return _cache
}

/**
 * Return the article's frontmatter data in the resolved locale.
 *
 * When locale is Taglish and a Taglish override exists, title, description,
 * railItems and heroGallery (captions/alt) are replaced. Every other field
 * (scenario, publishedAt, status, heroImage, etc.) comes from the English
 * base — these are structural/metadata, not reader-facing copy.
 *
 * When no Taglish version exists, the English data is returned unchanged.
 */
export function localiseArticleData(
  article: ArticleEntry,
  locale: Locale,
  taglishMap: Map<string, TaglishEntry>
): ArticleEntry['data'] {
  if (locale === 'en') return article.data
  const tl = taglishMap.get(article.id)
  if (!tl) return article.data // no Taglish → fall back to English
  return {
    ...article.data,
    title: tl.data.title,
    description: tl.data.description,
    // Rail items: overlay Taglish copy if present, else keep English.
    railItems: tl.data.railItems ?? article.data.railItems,
    // Hero gallery: overlay Taglish captions/alt if present.
    heroGallery: tl.data.heroGallery ?? article.data.heroGallery,
  }
}

/**
 * Whether a Taglish body exists for this article.
 * Used by the detail page to decide which body to render.
 */
export function hasTaglishBody(
  articleId: string,
  taglishMap: Map<string, TaglishEntry>
): boolean {
  return taglishMap.has(articleId)
}

/**
 * Get the Taglish collection entry for an article (for body rendering).
 * Returns undefined if no Taglish version exists.
 */
export function getTaglishEntry(
  articleId: string,
  taglishMap: Map<string, TaglishEntry>
): TaglishEntry | undefined {
  return taglishMap.get(articleId)
}
