/**
 * facingMap.js — Reusable plot-facing categorisation
 * ────────────────────────────────────────────────────────────────────────────
 * FACING_MAP:  raw value → canonical key
 * FACING_META: canonical key → display label + colour
 *
 * Usage (in any project):
 *   import { computeFacings } from '@/constants/facingMap'
 *   const facings = computeFacings(rawFacingValuesArray)
 *   // { east: 112, westSouth: 2, ... } — only non-zero keys
 */

// ── Every raw value maps to exactly ONE canonical key ─────────────────────
export const FACING_MAP = {
  // Pure East
  'East':                  'east',
  'East corner':           'east',
  // East–North
  'East/North':            'eastNorth',
  'East/North corner':     'eastNorth',
  'North/East corner':     'eastNorth',
  // East–South
  'East/South':            'eastSouth',
  'East/South corner':     'eastSouth',
  // East–West (double frontage)
  'East/West':             'eastWest',
  'East/West corner':      'eastWest',
  'West/East':             'eastWest',
  'West/East corner':      'eastWest',
  // Pure West
  'West':                  'west',
  'West corner':           'west',
  // West–North
  'West/North':            'westNorth',
  'West/North corner':     'westNorth',
  'North/West corner':     'westNorth',
  // West–South
  'West/South':            'westSouth',
  'West/South corner':     'westSouth',
  // Pure North
  'North':                 'north',
  'North corner':          'north',
  // North–East
  'North/East':            'northEast',
  'North/East corner':     'northEast',
  // North–West
  'North/West':            'northWest',
  'North/West corner':     'northWest',
  // Pure South
  'South':                 'south',
  'South corner':          'south',
  // South–East
  'South/East':            'southEast',
  'South/East corner':     'southEast',
  // South–West
  'South/West':            'southWest',
  'South/West corner':     'southWest',
}

// ── Display metadata per canonical key ────────────────────────────────────
export const FACING_META = {
  east:      { label: 'East Facing',       icon: '☀',  color: '#C9A84C' },
  eastNorth: { label: 'East-North Facing', icon: '↗',  color: '#64B5F6' },
  eastSouth: { label: 'East-South Facing', icon: '↘',  color: '#FFB74D' },
  eastWest:  { label: 'Double Frontage',   icon: '↔',  color: '#9C27B0' },
  west:      { label: 'West Facing',       icon: '🌙', color: '#64B5F6' },
  westNorth: { label: 'West-North Facing', icon: '↖',  color: '#4CAF74' },
  westSouth: { label: 'West-South Facing', icon: '↙',  color: '#FF7043' },
  north:     { label: 'North Facing',      icon: '▲',  color: '#4CAF74' },
  northEast: { label: 'North-East Facing', icon: '↗',  color: '#26C6DA' },
  northWest: { label: 'North-West Facing', icon: '↖',  color: '#66BB6A' },
  south:     { label: 'South Facing',      icon: '▼',  color: '#E24B4A' },
  southEast: { label: 'South-East Facing', icon: '↘',  color: '#FFA726' },
  southWest: { label: 'South-West Facing', icon: '↙',  color: '#EF5350' },
  unverified:{ label: 'To Be Verified',    icon: '?',  color: '#9E9E9E' },
}

/**
 * computeFacings(rawValues: string[]) → { [canonicalKey]: count }
 * Only returns keys with count > 0.
 * Useful when building project data from raw layout data.
 */
export function computeFacings(rawValues) {
  const counts = {}
  rawValues.forEach((raw) => {
    const key = FACING_MAP[raw?.trim()]
    if (key) counts[key] = (counts[key] || 0) + 1
  })
  return counts
}

/**
 * getFacingRows(facings: object) → Array<{ label, color, icon, value }>
 * Converts a facings object to display-ready rows, omitting zeros.
 */
export function getFacingRows(facings = {}) {
  return Object.entries(facings)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      key,
      value,
      ...FACING_META[key],
    }))
    .sort((a, b) => b.value - a.value) // descending by count
}
