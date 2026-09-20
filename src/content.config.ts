import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import scenariosData from './data/scenarios.json'

// The scenario list is admin-managed: it is committed to src/data/scenarios.json
// by the CMS and read here at build time. Slug alone drives the route (/{slug}/).
export const SCENARIOS = (scenariosData as { slug: string }[]).map((s) => s.slug)

export type Scenario = string

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Validate against the admin-managed slug list (non-empty tuple at runtime).
    scenario: z.enum(SCENARIOS as [string, ...string[]]),
    publishedAt: z.string(), // ISO date string
    updatedAt: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'archived']).default('active'),
    // review | guide — drives the type-aware card link ("Read the review/guide").
    articleType: z.enum(['review', 'guide']).optional(),
    heroImage: z.string().optional(),
    heroGallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        })
      )
      .optional(),
    editorNote: z.string().optional(),
    // Per-section rail items: each card binds to a section via `anchor` (the
    // section heading's slug). Rendered beside that section on desktop; stacked
    // below it on mobile. Sections without a matching item stay full width.
    railItems: z
      .array(
        z.object({
          type: z.enum(['product', 'image', 'article', 'ad']),
          anchor: z.string().optional(),
          label: z.string().optional(),
          // product / ad
          kicker: z.string().optional(),
          title: z.string().optional(),
          spec: z.string().optional(),
          price: z.string().optional(),
          href: z.string().optional(),
          cta: z.string().optional(),
          // image / product / ad
          image: z.string().optional(),
          alt: z.string().optional(),
          caption: z.string().optional(),
          // article (reference by slug; resolved at build time)
          slug: z.string().optional(),
          // article override copy (optional): AI-written headline (title, above)
          // + teaser (description) shown on the card, over the target article's
          // own hero. When absent the card falls back to the target's own copy.
          description: z.string().optional(),
        })
      )
      .optional(),
  }),
})

/**
 * Taglish article overrides — parallel collection.
 *
 * Each file mirrors a slug from the `articles` collection. Frontmatter carries
 * only the fields that differ in Taglish (title, description, rail-item copy);
 * the markdown body is the Taglish article body. A `sourceHash` tracks the
 * English content the Taglish was generated from (drift detection).
 *
 * If no matching file exists here, the reader falls back to the English article
 * for that slug — never blank, per §4/§6 of the i18n standard.
 */
const railItemTaglishSchema = z.object({
  type: z.enum(['product', 'image', 'article', 'ad']),
  anchor: z.string().optional(),
  label: z.string().optional(),
  kicker: z.string().optional(),
  title: z.string().optional(),
  spec: z.string().optional(),
  price: z.string().optional(),
  href: z.string().optional(),
  cta: z.string().optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
})

const articlesTaglish = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles-taglish' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // SHA-256 of the English (title+description+body) at generation time.
    // When this differs from the live English hash → "Taglish needs refresh".
    sourceHash: z.string().optional(),
    // Rail items override — same shape, carries Taglish copy of each card.
    railItems: z.array(railItemTaglishSchema).optional(),
    // Hero gallery Taglish captions/alt (if applicable).
    heroGallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        })
      )
      .optional(),
  }),
})

export const collections = { articles, 'articles-taglish': articlesTaglish }
