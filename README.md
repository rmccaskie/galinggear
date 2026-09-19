# Galing Gear — Main Site

Curated prepper and survivalist gear for Filipino families.  
Live at **[galinggear.com](https://galinggear.com)**.

Built with **Astro** and deployed to **Cloudflare Workers** via
`@astrojs/cloudflare`.

---

## Local development

```bash
git clone https://github.com/rmccaskie/galinggear.git
cd galinggear
npm install
npm run dev          # http://localhost:4321
```

`npm run build && npm run preview` for a production build preview.

---

## Deploying (git push → auto-rebuild)

The repo is connected to **Cloudflare Workers Builds**. A push to `main` triggers
a rebuild only if it touches files in the watch-paths include list.

### Watch-paths behaviour

Content paths (`src/content/articles/*.md`, `src/data/*.json`) are **excluded**
from the watch-paths — commits touching only those files do NOT trigger a build.
The CMS writes content changes with these paths and then, on "Publish to live
site", commits to `.deploy-trigger` (which IS in the include list) to fire a
single rebuild that picks up everything.

Layout, component, config and style changes (`src/pages/**`, `src/components/**`,
`src/layouts/**`, `src/styles/**`, `astro.config.*`, `wrangler.jsonc`) DO trigger
a build on push.

---

## Project structure

```
src/
  content/
    articles/          Markdown articles (frontmatter + body)
    config.ts          Astro content-collection schema
  data/
    featured.json      Ordered list of featured article slugs (single source of truth)
    scenarios.json     Scenario definitions (category, sort order, primary flag)
  components/          Astro components (ArticleCard, Header, Footer, etc.)
  layouts/
    BaseLayout.astro   Shared page shell (head, header, footer)
  pages/
    index.astro        Landing page (hero + featured + recent)
    articles/[slug].astro   Article detail page
    archive.astro      Archive listing
    [scenario].astro   Scenario landing pages
  styles/
    global.css         Global styles
    tokens.css         Design tokens (colours, spacing, type scale)
public/                Static assets (favicon, manifest)
astro.config.ts        Astro config (Cloudflare adapter, sitemap)
wrangler.jsonc         Cloudflare Worker config
```

## Content model

- **Articles**: Markdown in `src/content/articles/`. Frontmatter fields include
  `title`, `scenario`, `publishedAt`, `status` (active/archived), `featured`,
  `heroImage`, `heroGallery`, `tldr`, etc.
- **Featured list**: `src/data/featured.json` — an ordered array of slugs.
  Membership AND display order on the landing page are derived from this file
  (the per-article `featured` frontmatter flag is no longer consulted).
- **Scenarios**: `src/data/scenarios.json` — category definitions shown in the
  scenario-nav bar and used to filter articles.

## Notes

- The `[CF-Pages-Skip]` marker in CMS commit messages is a legacy artefact.
  Build gating is handled entirely by the watch-paths config.
- The CMS lives in a separate repo: `rmccaskie/galinggear-admin`.
