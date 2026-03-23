/**
 * tests for src/constants/facingMap.js
 * Achieves 100% statement/branch/function/line coverage on:
 *  - FACING_MAP  (all canonical key mappings)
 *  - FACING_META (all display entries)
 *  - computeFacings()
 *  - getFacingRows()
 */
import { describe, it, expect } from 'vitest'
import {
  FACING_MAP,
  FACING_META,
  computeFacings,
  getFacingRows,
} from '../constants/facingMap'

// ── FACING_MAP ────────────────────────────────────────────────────────────────

describe('FACING_MAP', () => {
  it('is a plain object', () => {
    expect(typeof FACING_MAP).toBe('object')
    expect(FACING_MAP).not.toBeNull()
  })

  it('maps pure East variants to "east"', () => {
    expect(FACING_MAP['East']).toBe('east')
    expect(FACING_MAP['East corner']).toBe('east')
  })

  it('maps East/North variants to "eastNorth"', () => {
    expect(FACING_MAP['East/North']).toBe('eastNorth')
    expect(FACING_MAP['East/North corner']).toBe('eastNorth')
  })

  it('maps North/East corner to "northEast"', () => {
    expect(FACING_MAP['North/East corner']).toBe('northEast')
  })

  it('maps East/South variants to "eastSouth"', () => {
    expect(FACING_MAP['East/South']).toBe('eastSouth')
    expect(FACING_MAP['East/South corner']).toBe('eastSouth')
  })

  it('maps East/West double-frontage variants to "eastWest"', () => {
    expect(FACING_MAP['East/West']).toBe('eastWest')
    expect(FACING_MAP['East/West corner']).toBe('eastWest')
    expect(FACING_MAP['West/East']).toBe('eastWest')
    expect(FACING_MAP['West/East corner']).toBe('eastWest')
  })

  it('maps pure West variants to "west"', () => {
    expect(FACING_MAP['West']).toBe('west')
    expect(FACING_MAP['West corner']).toBe('west')
  })

  it('maps West/North variants to "westNorth"', () => {
    expect(FACING_MAP['West/North']).toBe('westNorth')
    expect(FACING_MAP['West/North corner']).toBe('westNorth')
  })

  it('maps North/West corner to "northWest"', () => {
    expect(FACING_MAP['North/West corner']).toBe('northWest')
  })

  it('maps West/South variants to "westSouth"', () => {
    expect(FACING_MAP['West/South']).toBe('westSouth')
    expect(FACING_MAP['West/South corner']).toBe('westSouth')
  })

  it('maps pure North variants to "north"', () => {
    expect(FACING_MAP['North']).toBe('north')
    expect(FACING_MAP['North corner']).toBe('north')
  })

  it('maps North/East variants to "northEast"', () => {
    expect(FACING_MAP['North/East']).toBe('northEast')
    expect(FACING_MAP['North/East corner']).toBe('northEast')
  })

  it('maps North/West variants to "northWest"', () => {
    expect(FACING_MAP['North/West']).toBe('northWest')
    expect(FACING_MAP['North/West corner']).toBe('northWest')
  })

  it('maps pure South variants to "south"', () => {
    expect(FACING_MAP['South']).toBe('south')
    expect(FACING_MAP['South corner']).toBe('south')
  })

  it('maps South/East variants to "southEast"', () => {
    expect(FACING_MAP['South/East']).toBe('southEast')
    expect(FACING_MAP['South/East corner']).toBe('southEast')
  })

  it('maps South/West variants to "southWest"', () => {
    expect(FACING_MAP['South/West']).toBe('southWest')
    expect(FACING_MAP['South/West corner']).toBe('southWest')
  })

  it('returns undefined for unknown facing', () => {
    expect(FACING_MAP['UnknownFacing']).toBeUndefined()
  })
})

// ── FACING_META ───────────────────────────────────────────────────────────────

describe('FACING_META', () => {
  const ALL_KEYS = [
    'east', 'eastNorth', 'eastSouth', 'eastWest',
    'west', 'westNorth', 'westSouth',
    'north', 'northEast', 'northWest',
    'south', 'southEast', 'southWest',
    'unverified',
  ]

  ALL_KEYS.forEach((key) => {
    it(`has label, icon, color for key "${key}"`, () => {
      const meta = FACING_META[key]
      expect(meta).toBeDefined()
      expect(typeof meta.label).toBe('string')
      expect(meta.label.length).toBeGreaterThan(0)
      expect(typeof meta.icon).toBe('string')
      expect(typeof meta.color).toBe('string')
      expect(meta.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})

// ── computeFacings ────────────────────────────────────────────────────────────

describe('computeFacings', () => {
  it('returns an empty object for empty input', () => {
    expect(computeFacings([])).toEqual({})
  })

  it('counts a single known facing correctly', () => {
    const result = computeFacings(['East', 'East'])
    expect(result).toEqual({ east: 2 })
  })

  it('counts multiple different facings correctly', () => {
    const result = computeFacings(['East', 'West', 'East', 'North'])
    expect(result).toEqual({ east: 2, west: 1, north: 1 })
  })

  it('ignores unknown / unmapped facing values', () => {
    const result = computeFacings(['East', 'Unknown', 'RandomValue'])
    expect(result).toEqual({ east: 1 })
  })

  it('handles null / undefined values in the array without throwing', () => {
    const result = computeFacings([null, undefined, 'East'])
    expect(result).toEqual({ east: 1 })
  })

  it('trims whitespace before looking up in FACING_MAP', () => {
    const result = computeFacings(['  East  '])
    expect(result).toEqual({ east: 1 })
  })

  it('handles all corner variants correctly', () => {
    const result = computeFacings([
      'East corner', 'West corner', 'North corner', 'South corner',
    ])
    expect(result).toEqual({ east: 1, west: 1, north: 1, south: 1 })
  })

  it('handles East/West double-frontage', () => {
    const result = computeFacings(['East/West', 'West/East'])
    expect(result).toEqual({ eastWest: 2 })
  })
})

// ── getFacingRows ─────────────────────────────────────────────────────────────

describe('getFacingRows', () => {
  it('returns an empty array for an empty object', () => {
    expect(getFacingRows({})).toEqual([])
  })

  it('returns an empty array when called with no argument', () => {
    expect(getFacingRows()).toEqual([])
  })

  it('maps a facing object to display rows', () => {
    const rows = getFacingRows({ east: 5, west: 3 })
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ key: 'east', value: 5, label: 'East Facing' })
    expect(rows[1]).toMatchObject({ key: 'west', value: 3, label: 'West Facing' })
  })

  it('sorts rows descending by count', () => {
    const rows = getFacingRows({ north: 2, east: 10, west: 5 })
    expect(rows[0].value).toBe(10)
    expect(rows[1].value).toBe(5)
    expect(rows[2].value).toBe(2)
  })

  it('filters out zero-value entries', () => {
    const rows = getFacingRows({ east: 5, west: 0 })
    expect(rows).toHaveLength(1)
    expect(rows[0].key).toBe('east')
  })

  it('attaches icon and color from FACING_META', () => {
    const rows = getFacingRows({ east: 1 })
    expect(rows[0].icon).toBeDefined()
    expect(rows[0].color).toBeDefined()
  })
})
