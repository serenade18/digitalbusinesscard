import { describe, expect, it } from 'vitest'
import { extractErrorMessage } from '@/lib/errors'

describe('extractErrorMessage', () => {
  it('reads a plain detail string', () => {
    const error = { status: 400, data: { detail: 'Card limit reached for the current plan.' } }
    expect(extractErrorMessage(error)).toBe('Card limit reached for the current plan.')
  })

  it('flattens field-level validation errors', () => {
    const error = { status: 400, data: { email: ['An account with this email already exists.'] } }
    expect(extractErrorMessage(error)).toContain('already exists')
  })

  it('reports a network failure distinctly', () => {
    const error = { status: 'FETCH_ERROR' }
    expect(extractErrorMessage(error)).toMatch(/connection/i)
  })

  it('falls back for unrecognized shapes', () => {
    expect(extractErrorMessage(undefined, 'fallback message')).toBe('fallback message')
  })
})
