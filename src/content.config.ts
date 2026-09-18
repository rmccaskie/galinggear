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
  }),
})

export const collections = { articles }
