import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

export const SCENARIOS = [
  'typhoon-season',
  'earthquake-ready',
  'power-outage',
  'go-bag',
  'off-grid',
  'first-aid',
  'edc',
] as const

export type Scenario = (typeof SCENARIOS)[number]

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    scenario: z.enum(SCENARIOS),
    publishedAt: z.string(), // ISO date string
    updatedAt: z.string().optional(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    editorNote: z.string().optional(),
  }),
})

export const collections = { articles }
