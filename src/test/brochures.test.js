/**
 * tests for src/constants/brochures.js
 * Achieves 100% coverage on BROCHURES map and getBrochureUrl().
 */
import { describe, it, expect } from 'vitest'
import { BROCHURES, getBrochureUrl } from '../constants/brochures'

describe('BROCHURES', () => {
  it('is a plain object', () => {
    expect(typeof BROCHURES).toBe('object')
    expect(BROCHURES).not.toBeNull()
  })

  it('contains all expected project keys', () => {
    expect(BROCHURES).toHaveProperty('anjana')
    expect(BROCHURES).toHaveProperty('aparna')
    expect(BROCHURES).toHaveProperty('varaha')
    expect(BROCHURES).toHaveProperty('trimbak')
    expect(BROCHURES).toHaveProperty('general')
  })

  it('each entry is either a non-empty string path or null (unavailable)', () => {
    Object.entries(BROCHURES).forEach(([key, url]) => {
      if (url === null) return // null = brochure not yet available (e.g. trimbak)
      expect(typeof url).toBe('string')
      expect(url.length).toBeGreaterThan(0)
    })
  })

  it('anjana brochure path ends with .pdf', () => {
    expect(BROCHURES.anjana.endsWith('.pdf')).toBe(true)
  })
})

describe('getBrochureUrl', () => {
  it('returns the correct URL for a known project ID', () => {
    expect(getBrochureUrl('anjana')).toBe(BROCHURES.anjana)
    expect(getBrochureUrl('aparna')).toBe(BROCHURES.aparna)
    expect(getBrochureUrl('varaha')).toBe(BROCHURES.varaha)
    expect(getBrochureUrl('trimbak')).toBe(BROCHURES.trimbak)
  })

  it('returns the general brochure URL for an unknown project ID', () => {
    expect(getBrochureUrl('unknown_project')).toBe(BROCHURES.general)
  })

  it('returns the general brochure URL for undefined input', () => {
    expect(getBrochureUrl(undefined)).toBe(BROCHURES.general)
  })

  it('returns the general brochure URL for null input', () => {
    expect(getBrochureUrl(null)).toBe(BROCHURES.general)
  })

  it('returns the general brochure for empty string', () => {
    expect(getBrochureUrl('')).toBe(BROCHURES.general)
  })

  it('returns null if both projectId and general are missing (branch coverage)', () => {
    // Temporarily remove general to hit the || null branch
    const originalGeneral = BROCHURES.general
    delete BROCHURES.general
    expect(getBrochureUrl('nonexistent')).toBeNull()
    BROCHURES.general = originalGeneral
  })
})
