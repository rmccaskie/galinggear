// ---------------------------------------------------------------------------
// Site profile schema (Stage 1 de-niche foundation)
// ---------------------------------------------------------------------------
// Single source of truth for the shape of `src/data/site-profile.json`.
//
// A copy of this file lives in the admin repo at `lib/site-profile-schema.ts`.
// Keep the two in sync: any field added here must be added there too. Stage 2
// (Imprint) will lift this schema into a shared package; until then it is
// deliberately duplicated rather than imported across repos.
//
// Path-valued fields (voice.rules, voice.author, images.heroStyle, taxonomy.*,
// research.criteria, authorities.source, brand.theme.stylesheet, language
// styleGuide) are validated as strings only — not for file existence. They are
// resolved by whichever consumer needs them (admin prompt code, build tooling).
// ---------------------------------------------------------------------------
import { z } from 'zod'

const logoSchema = z.object({
  light: z.string(),
  dark: z.string(),
  mark: z.string(),
  favicon: z.string(),
})

const languageSchema = z.object({
  label: z.string(),
  styleGuide: z.string().optional(),
  uiCatalogue: z.string(),
})

const seasonalHookSchema = z.object({
  months: z.array(z.number().int()),
  hook: z.string(),
})

export const siteProfileSchema = z.object({
  id: z.string().min(1),
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string(),
    description: z.string(),
    domain: z.string().min(1),
    siteUrl: z.string().url(),
    mediaDomain: z.string().min(1),
    logo: logoSchema,
    theme: z.object({ stylesheet: z.string() }),
    // Brand's own social-account handles (identity, not per-article share text).
    social: z.object({
      handles: z.object({
        x: z.string(),
        instagram: z.string(),
        facebook: z.string(),
      }),
    }),
  }),
  audience: z.object({
    country: z.string().min(1),
    demonym: z.string(),
    regionNotes: z.string(),
    readerPersona: z.string(),
    currency: z.object({ code: z.string().min(1), symbol: z.string().min(1) }),
    units: z.string(),
    retailers: z.array(z.string()),
  }),
  locales: z.object({
    default: z.string().min(1),
    available: z.array(z.string()).min(1),
    prefixes: z.record(z.string(), z.string()),
    languages: z.record(z.string(), languageSchema),
  }),
  voice: z.object({
    spelling: z.string(),
    persona: z.string(),
    rules: z.string(),
    author: z.string(),
    bannedPhrases: z.array(z.string()),
  }),
  taxonomy: z.object({
    source: z.string(),
    order: z.string(),
    termSingular: z.string(),
  }),
  research: z.object({
    criteria: z.string(),
    seasonalCalendar: z.array(seasonalHookSchema),
    exclusions: z.array(z.string()),
  }),
  authorities: z.object({ source: z.string() }),
  review: z.object({ safetyBrief: z.string() }),
  images: z.object({ heroStyle: z.string(), avoid: z.array(z.string()) }),
  monetisation: z.object({
    affiliate: z.object({ enabled: z.boolean(), disclosure: z.string() }),
    // Business-specific selling model. Prompt wording ("where to buy") reads
    // these in Step 6: today the site sends readers to its own dropship store
    // (buyUrl empty until live) and forbids external retailer links.
    store: z.object({
      type: z.string(),
      live: z.boolean(),
      noExternalRetailerLinks: z.boolean(),
    }),
  }),
  social: z.object({
    platforms: z.array(z.string()),
    hashtags: z.array(z.string()),
  }),
})

export type SiteProfile = z.infer<typeof siteProfileSchema>
