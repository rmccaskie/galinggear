import type { APIRoute } from 'astro'
import { siteProfile } from '../lib/site-profile'

export const prerender = true

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('/sitemap-index.xml', site ?? siteProfile.brand.siteUrl).toString()
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, ''].join('\n')
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
