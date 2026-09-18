import { getCollection } from 'astro:content'
import scenariosData from '../data/scenarios.json'

export interface ScenarioConfig {
  slug: string
  label: string
  blurb: string
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

export function scenarioLabel(scenario: string): string {
  return SCENARIO_LABELS[scenario] ?? scenario
}

export function scenarioBlurb(scenario: string): string {
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
