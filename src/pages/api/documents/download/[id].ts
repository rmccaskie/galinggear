import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../../lib/supabase'

// Same-origin download proxy for document PDFs.
//
// The rendered PDFs live on a different host (the media domain / R2), so a
// cross-origin `<a download>` is IGNORED by browsers and the file just opens
// inline. This route runs on the site origin, fetches the PDF server-side and
// re-streams it with `Content-Disposition: attachment`, so the browser saves it
// to disk. Works for every existing PDF with no re-render.
//
// Only rows the admin marked status='ready' with a rendered PDF are exposed
// (anon RLS also enforces status='ready'), and the upstream URL is looked up
// from the row — never taken from the request — so this is not an open proxy.
export const prerender = false

/** Build a safe download filename from the document title. */
function filenameFor(title: string): string {
  const base = (title || 'document')
    .normalize('NFKD')
    // strip characters that are illegal or awkward in filenames
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'document'
  return `${base}.pdf`
}

/** ASCII fallback for the legacy `filename=` param (older/edge cases). */
function asciiFilename(name: string): string {
  return name.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, "'")
}

export const GET: APIRoute = async ({ params, url }) => {
  const id = (params.id ?? '').trim()
  if (!id) return new Response('Not found', { status: 404 })

  // ?tl=1 requests the Taglish variant; falls back to English when absent.
  const wantTl = url.searchParams.get('tl') === '1'

  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('article_documents')
      .select('id, title, title_tl, pdf_url, pdf_url_tl, status')
      .eq('id', id)
      .eq('status', 'ready')
      .maybeSingle()

    if (error || !data) return new Response('Not found', { status: 404 })

    const enUrl = typeof data.pdf_url === 'string' && data.pdf_url ? data.pdf_url : ''
    const tlUrl = typeof data.pdf_url_tl === 'string' && data.pdf_url_tl ? data.pdf_url_tl : ''
    const servingTl = wantTl && !!tlUrl
    const target = servingTl ? tlUrl : enUrl
    if (!target) return new Response('Not found', { status: 404 })

    const upstream = await fetch(target)
    if (!upstream.ok || !upstream.body) {
      // If the proxy fetch fails, fall back to the raw URL so the user still
      // gets the file (viewed inline) rather than an error page.
      return Response.redirect(target, 302)
    }

    // Name the file after the Taglish title when the Taglish PDF is served.
    const titleTl = typeof data.title_tl === 'string' && data.title_tl ? data.title_tl : ''
    const name = filenameFor(String((servingTl && titleTl ? titleTl : data.title) ?? 'document'))
    const headers = new Headers()
    headers.set('content-type', 'application/pdf')
    headers.set(
      'content-disposition',
      `attachment; filename="${asciiFilename(name)}"; filename*=UTF-8''${encodeURIComponent(name)}`,
    )
    const len = upstream.headers.get('content-length')
    if (len) headers.set('content-length', len)
    headers.set('cache-control', 'public, max-age=300, s-maxage=300')

    return new Response(upstream.body, { status: 200, headers })
  } catch {
    console.log(JSON.stringify({ event: 'document_download_exception', at: new Date().toISOString() }))
    return new Response('Not found', { status: 404 })
  }
}

const methodNotAllowed: APIRoute = () =>
  new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'GET' },
  })

export const POST = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
