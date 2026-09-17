import type { APIRoute } from 'astro'
import { createSupabaseClient } from '../../lib/supabase'
import { validateSubscribe } from '../../lib/validation'

// Runtime data route — opt out of prerendering.
export const prerender = false

/**
 * Subscribe endpoint.
 *
 * - POST only (405 otherwise).
 * - Accepts application/json or application/x-www-form-urlencoded.
 * - Validates on the server (the enforcement); returns CODES, not sentences.
 * - Inserts via the Supabase anon client (RLS insert-only).
 * - Unique-violation (23505) -> 409 already_subscribed.
 * - Never logs field values: only an event type and a timestamp.
 * - Progressive enhancement: a plain browser form post (Accept: text/html) gets
 *   a redirect back to /subscribe; a fetch/JSON caller gets a JSON body.
 */

function logEvent(event: string): void {
  // Deliberately values-free: event type + timestamp only.
  console.log(JSON.stringify({ event, at: new Date().toISOString() }))
}

function wantsHtml(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('text/html')
}

function redirectResult(status: 'success' | 'error', code?: string): Response {
  const params = new URLSearchParams({ status })
  if (code) params.set('code', code)
  return new Response(null, {
    status: 303,
    headers: { Location: `/subscribe?${params.toString()}` },
  })
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

async function readInput(request: Request): Promise<{ name: string; email: string }> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const data = (await request.json().catch(() => ({}))) as Record<string, unknown>
    return {
      name: typeof data.name === 'string' ? data.name : '',
      email: typeof data.email === 'string' ? data.email : '',
    }
  }
  const form = await request.formData()
  return {
    name: String(form.get('name') ?? ''),
    email: String(form.get('email') ?? ''),
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const html = wantsHtml(request)

  let input: { name: string; email: string }
  try {
    input = await readInput(request)
  } catch {
    logEvent('subscribe_bad_body')
    return html ? redirectResult('error', 'invalid_request') : json({ ok: false, code: 'invalid_request' }, 400)
  }

  const errors = validateSubscribe(input)
  const errorCodes = Object.values(errors)
  if (errorCodes.length > 0) {
    logEvent('subscribe_validation_failed')
    return html
      ? redirectResult('error', errorCodes[0])
      : json({ ok: false, errors }, 400)
  }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()

  try {
    const supabase = createSupabaseClient(locals.runtime?.env)
    const { error } = await supabase.from('subscribers').insert({ name, email })

    if (error) {
      // Unique-violation -> already subscribed.
      if (error.code === '23505') {
        logEvent('subscribe_duplicate')
        return html ? redirectResult('error', 'already_subscribed') : json({ ok: false, code: 'already_subscribed' }, 409)
      }
      // Any other failure returns the same generic response, regardless of cause.
      logEvent('subscribe_insert_error')
      return html ? redirectResult('error', 'server_error') : json({ ok: false, code: 'server_error' }, 500)
    }
  } catch {
    // Includes the startup guard (missing env). Same generic response.
    logEvent('subscribe_exception')
    return html ? redirectResult('error', 'server_error') : json({ ok: false, code: 'server_error' }, 500)
  }

  logEvent('subscribe_success')
  return html ? redirectResult('success') : json({ ok: true }, 200)
}

// Anything that is not a POST gets 405.
const methodNotAllowed: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, code: 'method_not_allowed' }), {
    status: 405,
    headers: { 'content-type': 'application/json; charset=utf-8', Allow: 'POST' },
  })

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
