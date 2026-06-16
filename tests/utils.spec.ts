import { describe, expect, it } from 'vitest'

import { isNumber } from '../packages/utils'

describe('isNumber', () => {
  it('returns true for valid numbers', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(12.5)).toBe(true)
  })

  it('returns false for NaN and non-number values', () => {
    expect(isNumber(Number.NaN)).toBe(false)
    expect(isNumber('1')).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
  })
})
