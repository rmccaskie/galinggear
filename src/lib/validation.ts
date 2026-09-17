/**
 * Field validation — layer one.
 *
 * Per form-validation.md: field rules ask only whether a value can be stored at
 * all. They are fixed in code, never admin-editable, and run on BOTH sides from
 * this one module — but the endpoint is the enforcement; the browser pass is
 * feedback. The validator returns CODES, never sentences. Human wording lives in
 * the string catalogue (src/lib/strings.ts).
 */

// The register: a field's limits are written down once, here, and everything
// else (input maxlength, counter, endpoint) derives from this — nothing
// re-declares it.
export const FIELD_RULES = {
  name: { min: 1, max: 80 },
} as const

export type FieldName = 'name' | 'email'

export type ValidationCode =
  | 'name_required'
  | 'name_too_long'
  | 'email_required'
  | 'email_invalid'

// Pragmatic, storage-level email shape. Deliberately permissive: the question is
// "can this be stored and later delivered to", not "is this address perfect".
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateName(raw: string): ValidationCode | null {
  const value = (raw ?? '').trim()
  if (value.length < FIELD_RULES.name.min) return 'name_required'
  if (value.length > FIELD_RULES.name.max) return 'name_too_long'
  return null
}

export function validateEmail(raw: string): ValidationCode | null {
  const value = (raw ?? '').trim()
  if (value.length === 0) return 'email_required'
  if (!EMAIL_RE.test(value)) return 'email_invalid'
  return null
}

export type SubscribeErrors = Partial<Record<FieldName, ValidationCode>>

/** Returns ALL field errors at once (never stops at the first). */
export function validateSubscribe(input: { name: string; email: string }): SubscribeErrors {
  const errors: SubscribeErrors = {}
  const nameError = validateName(input.name)
  if (nameError) errors.name = nameError
  const emailError = validateEmail(input.email)
  if (emailError) errors.email = emailError
  return errors
}
