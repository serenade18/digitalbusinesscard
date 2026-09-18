import { describe, expect, it } from 'vitest'
import { formatMoney, titleCase } from '@/lib/format'

describe('formatMoney', () => {
  it('formats a numeric string as currency', () => {
    expect(formatMoney('19.99', 'USD')).toContain('19.99')
  })

  it('falls back gracefully for non-numeric input', () => {
    expect(formatMoney('not-a-number', 'USD')).toBe('not-a-number')
  })
})

describe('titleCase', () => {
  it('converts snake_case to Title Case', () => {
    expect(titleCase('pending_payment')).toBe('Pending Payment')
  })

  it('handles a single word', () => {
    expect(titleCase('published')).toBe('Published')
  })
})
