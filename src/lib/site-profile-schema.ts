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
  // i18n metadata (SITE): the <html lang> and og:locale tags for this language.
  htmlLang: z.string().optional(),
  ogLocale: z.string().optional(),
  // Generation-side style guide sidecar for a non-base (translated) language —
  // the copywriter rules the admin's translation prompts read.
  genStyleGuide: z.string().optional(),
  // Per-language UI copy override file merged over the catalogue defaults (SITE).
  copyOverride: z.string().optional(),
  // Countries (ISO 3166-1 alpha-2) where this language is the geo default (SITE).
  geoCountries: z.array(z.string()).optional(),
  // Accept-Language primary subtags that map to this language (SITE).
  acceptLanguage: z.array(z.string()).optional(),
  // Human-review gate for a non-base catalogue: reviewer name + date. Until both
  // are set the translated catalogue is not served (SITE catalogue.ts).
  reviewGate: z.object({ reviewer: z.string(), date: z.string() }).optional(),
  // Secondary-language social-post generation descriptors (ADMIN): how to
  // write social posts in this language — code-switch style, language-mix
  // hint, hashtag hint, and what to exclude from the base-language variant.
  social: z
    .object({
      codeSwitch: z.string(),
      mixHint: z.string(),
      hashtagHint: z.string(),
      excludeHint: z.string(),
    })
    .optional(),
})

const seasonalHookSchema = z.object({
  months: z.array(z.number().int()),
  hook: z.string(),
})

export const siteProfileSchema = z.object({
  id: z.string().min(1),
  brand: z.object({
    name: z.string().min(1),
    // Short name for the web-app manifest (falls back to name when unset).
    shortName: z.string().optional(),
    tagline: z.string(),
    description: z.string(),
    // Site topic/domain names (niche) — full adjectival form
    // ("emergency-preparedness") and the short compound ("emergency-prep").
    topic: z.object({ full: z.string(), short: z.string() }).optional(),
    domain: z.string().min(1),
    siteUrl: z.string().url(),
    mediaDomain: z.string().min(1),
    logo: logoSchema,
    // Theme: the brand stylesheet plus the two theme colours emitted into
    // HTML/manifest (site.webmanifest endpoint + <meta name="theme-color">).
    theme: z.object({
      stylesheet: z.string(),
      themeColor: z.string(),
      backgroundColor: z.string(),
    }),
    // Brand's own social-account handles (identity, not per-article share text).
    social: z.object({
      handles: z.object({
        x: z.string(),
        instagram: z.string(),
        facebook: z.string(),
      }),
    }),
    // Footer tagline on generated PDF documents (admin document-pdf.ts).
    documentFooter: z.string(),
    // Homepage <meta description> — one fixed string rendered on all locales.
    homeDescription: z.string(),
  }),
  audience: z.object({
    country: z.string().min(1),
    // Country adjective used in prompt copy (e.g. "Philippine").
    countryAdjective: z.string().optional(),
    demonym: z.string(),
    regionNotes: z.string(),
    // Short hazard list surfaced in the editor voice (e.g. typhoons, floods).
    hazards: z.array(z.string()).optional(),
    readerPersona: z.string(),
    currency: z.object({ code: z.string().min(1), symbol: z.string().min(1) }),
    units: z.string(),
    retailers: z.array(z.string()),
  }),
  locales: z.object({
    default: z.string().min(1),
    // The authoring/content base locale. Every item exists in this locale first;
    // a "secondary language" is any available locale other than the base.
    base: z.string().min(1),
    available: z.array(z.string()).min(1),
    prefixes: z.record(z.string(), z.string()),
    // The __Host- cookie that remembers the reader's locale preference (SITE).
    cookieName: z.string().optional(),
    languages: z.record(z.string(), languageSchema),
  }),
  voice: z.object({
    spelling: z.string(),
    // Human-readable name of the writing language/register
    // (e.g. "Philippine English").
    primaryLanguage: z.string().optional(),
    // House-style spelling note naming the spelling convention reviewers must
    // treat as correct (e.g. "American-style spelling (color, center, liter,
    // meter, realize, defense)"). Dropped from prompts when absent.
    spellingNote: z.string().optional(),
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
    proposalExample: z.string(),
    seasonalCalendar: z.array(seasonalHookSchema),
    exclusions: z.array(z.string()),
    contentPillars: z.string(),
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
  // Editor-only example/placeholder copy (ADMIN UI). Kept in the profile so a
  // different publication shows its own examples instead of typhoon/Manila ones.
  adminExamples: z.object({
    articleTitle: z.string(),
    articleSlug: z.string(),
    heroImageQuery: z.string(),
    imagePrompt: z.string(),
    reviewBrief: z.string(),
    guideBrief: z.string(),
    agentRequest: z.string(),
    agentRequestAlt: z.string(),
    shareImageQuery: z.string(),
  }),
})

export type SiteProfile = z.infer<typeof siteProfileSchema>
