import { getCollection } from 'astro:content'
import scenariosData from '../data/scenarios.json'
import type { Locale } from './i18n'

export interface ScenarioConfig {
  slug: string
  label: string
  blurb: string
  /** Optional Taglish label, authored in the admin scenario tool. */
  labelTaglish?: string
  /** Optional Taglish blurb, authored in the admin scenario tool. */
  blurbTaglish?: string
  isPrimary: boolean
  sortOrder: number
}

// Admin-managed list, ordered by the sort order set in the CMS.
export const ALL_SCENARIOS: ScenarioConfig[] = (scenariosData as ScenarioConfig[])
  .slice()
  .sort((a, b) => a.sortOrder - b.sortOrder)

export type Scenario = string

export const SCENARIOS = ALL_SCENARIOS.map((s) => s.slug)

export const PRIMARY_SCENARIOS = ALL_SCENARIOS.filter((s) => s.isPrimary).map((s) => s.slug)
export const SECONDARY_SCENARIOS = ALL_SCENARIOS.filter((s) => !s.isPrimary).map((s) => s.slug)

export const SCENARIO_LABELS: Record<string, string> = Object.fromEntries(
  ALL_SCENARIOS.map((s) => [s.slug, s.label])
)

export const SCENARIO_BLURBS: Record<string, string> = Object.fromEntries(
  ALL_SCENARIOS.map((s) => [s.slug, s.blurb])
)

// Taglish overlays — only slugs that actually carry a Taglish value appear here,
// so a blank admin field cleanly falls back to the English wording below.
export const SCENARIO_LABELS_TAGLISH: Record<string, string> = Object.fromEntries(
  ALL_SCENARIOS.filter((s) => (s.labelTaglish ?? '').trim()).map((s) => [s.slug, s.labelTaglish!.trim()])
)

export const SCENARIO_BLURBS_TAGLISH: Record<string, string> = Object.fromEntries(
  ALL_SCENARIOS.filter((s) => (s.blurbTaglish ?? '').trim()).map((s) => [s.slug, s.blurbTaglish!.trim()])
)

/**
 * Resolve a scenario's display label for a locale. Scenario wording is managed
 * in the admin scenario tool (keyed by the stable slug, so a rename/reword/
 * reorder never breaks the mapping). On the Taglish tree the Taglish label is
 * used when present, otherwise it falls back to the English label.
 */
export function scenarioLabel(scenario: string, locale?: Locale): string {
  if (locale === 'taglish' && SCENARIO_LABELS_TAGLISH[scenario]) {
    return SCENARIO_LABELS_TAGLISH[scenario]
  }
  return SCENARIO_LABELS[scenario] ?? scenario
}

export function scenarioBlurb(scenario: string, locale?: Locale): string {
  if (locale === 'taglish' && SCENARIO_BLURBS_TAGLISH[scenario]) {
    return SCENARIO_BLURBS_TAGLISH[scenario]
  }
  return SCENARIO_BLURBS[scenario] ?? ''
}

const MAX_INLINE = 6

/**
 * Content-gated navigation lists. A scenario only appears in the nav once it has
 * at least one active (non-archived) article. Empty scenarios still generate a
 * static listing page but are not linked from the nav until they have content.
 *
 * After content-gating, if fewer than 6 scenarios remain in the inline (primary)
 * bar, secondary scenarios are promoted (in their admin sort order) to fill the
 * bar up to 6. Any remaining secondaries stay in the "More" dropdown.
 */
export async function getNavScenarios(): Promise<{ primary: string[]; secondary: string[] }> {
  const articles = await getCollection('articles')
  const activeSlugs = new Set(
    articles.filter((a) => a.data.status !== 'archived').map((a) => a.data.scenario)
  )

  const visiblePrimary = PRIMARY_SCENARIOS.filter((slug) => activeSlugs.has(slug))
  const visibleSecondary = SECONDARY_SCENARIOS.filter((slug) => activeSlugs.has(slug))

  // Top up the inline bar to MAX_INLINE by promoting from secondary
  const gap = Math.max(0, MAX_INLINE - visiblePrimary.length)
  const promoted = visibleSecondary.slice(0, gap)
  const remaining = visibleSecondary.slice(gap)

  return {
    primary: [...visiblePrimary, ...promoted],
    secondary: remaining,
  }
}
