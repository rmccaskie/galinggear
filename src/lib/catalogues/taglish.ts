/**
 * Taglish catalogue — Track 1 site chrome.
 *
 * ⚠ REVIEW GATE (§10.4): this catalogue is NOT servable until the reviewer
 *   marker below has a name and date. Until then, `catalogue.ts` skips it
 *   and falls through to the English base — so unreviewed Taglish chrome
 *   never reaches the reader.
 *
 * To mark as reviewed: fill in reviewer + date, then deploy.
 * The review must be done by someone fluent in English, Tagalog and Taglish
 * (D-review-chrome).
 */
export const TAGLISH_REVIEW = {
  reviewer: null as string | null,
  date: null as string | null,
}

/**
 * Partial catalogue — only keys that differ from English need entries here.
 * Missing keys fall back to the English base via the fallback chain.
 *
 * Strings below are PLACEHOLDER drafts. They must be reviewed by a fluent
 * speaker before the review gate is opened.
 */
export const taglishCatalogue: Record<string, string> = {
  // Intentionally empty until Taglish translations are written and reviewed.
  // Add entries as: 'namespace.key': 'Taglish translation',
}
