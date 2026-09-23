import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../../lib/supabase'

// Runtime data route — opt out of prerendering. The public site is static, so
// downloadable documents are fetched from Supabase at runtime by the article
// page's client script. Only rows the admin has marked status='ready' AND that
// carry a rendered PDF are ever exposed (anon RLS also enforces status='ready').
export const prerender = false

interface PublicDocument {
  id: string
  docType: string
  title: string
  description: string
  pdfUrl: string
  /** Taglish PDF URL when a Taglish variant exists; null otherwise (reader
   *  falls back to the English pdfUrl). */
  pdfUrlTl: string | null
  sort: number
  createdAt: string
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Short edge cache: documents change rarely, but a freshly published one
      // should appear within a minute.
      'cache-control': 'public, max-age=60, s-maxage=60',
    },
  })
}

export const GET: APIRoute = async ({ params }) => {
  const slug = (params.slug ?? '').trim()
  if (!slug) return json({ ok: false, documents: [] }, 400)

  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('article_documents')
      .select('id, doc_type, title, description, pdf_url, pdf_url_tl, sort, created_at')
      .eq('article_slug', slug)
      .eq('status', 'ready')
      .not('pdf_url', 'is', null)
      .order('sort', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.log(JSON.stringify({ event: 'documents_query_error', at: new Date().toISOString() }))
      return json({ ok: false, documents: [] }, 500)
    }

    const documents: PublicDocument[] = (data ?? [])
      .filter((r) => typeof r.pdf_url === 'string' && r.pdf_url)
      .map((r) => ({
        id: String(r.id),
        docType: String(r.doc_type ?? 'summary'),
        title: String(r.title ?? 'Download'),
        description: String(r.description ?? ''),
        pdfUrl: String(r.pdf_url),
        pdfUrlTl: typeof r.pdf_url_tl === 'string' && r.pdf_url_tl ? r.pdf_url_tl : null,
        sort: typeof r.sort === 'number' ? r.sort : 0,
        createdAt: String(r.created_at ?? ''),
      }))

    return json({ ok: true, documents }, 200)
  } catch {
    console.log(JSON.stringify({ event: 'documents_exception', at: new Date().toISOString() }))
    return json({ ok: false, documents: [] }, 500)
  }
}

const methodNotAllowed: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, code: 'method_not_allowed' }), {
    status: 405,
    headers: { 'content-type': 'application/json; charset=utf-8', Allow: 'GET' },
  })

export const POST = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
