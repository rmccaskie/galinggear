/**
 * String catalogue — the one place human-facing wording lives.
 *
 * The validator and the endpoint deal in codes; this maps a code to a sentence.
 * British spelling throughout. Keeping copy here (not in the validator) means
 * wording can change without touching the rules, and a future translation layer
 * has a single table to translate.
 */

import type { ValidationCode, FieldName } from './validation'

export const FIELD_ERROR_MESSAGES: Record<ValidationCode, string> = {
  name_required: 'Please tell us your name.',
  name_too_long: 'That name is a little long — please keep it under 80 characters.',
  email_required: 'Please enter your email address.',
  email_invalid: 'That does not look like a valid email address.',
}

// Endpoint-level outcomes that are not field rules.
export const RESULT_MESSAGES: Record<string, string> = {
  already_subscribed: "You're already on the list — no need to sign up again.",
  invalid_request: 'Please check the form and try again.',
  method_not_allowed: 'That request is not allowed here.',
  server_error: 'Something went wrong at our end. Please try again in a moment.',
}

export function messageForCode(code: string): string {
  if (code in FIELD_ERROR_MESSAGES) {
    return FIELD_ERROR_MESSAGES[code as ValidationCode]
  }
  return RESULT_MESSAGES[code] ?? RESULT_MESSAGES.server_error
}

/** Which field a code belongs to, for attaching to the right input. */
export function fieldForCode(code: string): FieldName | null {
  if (code.startsWith('name_')) return 'name'
  if (code.startsWith('email_')) return 'email'
  return null
}

export const SUBSCRIBE_COPY = {
  supporting: 'Preparedness guides and the gear that makes the difference — often and regular. No spam. Unsubscribe any time.',
  success: "You're on the list. We'll be in touch.",
  submit: 'Join the list',
} as const
