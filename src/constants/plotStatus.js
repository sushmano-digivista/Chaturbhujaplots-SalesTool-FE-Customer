/**
 * Per-plot availability status.
 *
 * Shape:
 *   PLOT_STATUS[ventureKey] = {
 *     available: [ ...plot numbers ],   // Yellow in layout PDFs
 *     // Every other plot in the venture is treated as 'sold'.
 *   }
 *
 * Rationale: Chaturbhuja projects have the majority of plots sold;
 * the available list is the minority. Maintaining only the
 * available list keeps the data tight and easy to update as plots
 * get booked.
 *
 * Update this file whenever owner shares a refreshed layout
 * showing current Vacant (yellow) vs Sold (white) status.
 */

export const PLOT_STATUS = {
  // ── Anjana Paradise — Paritala Plan-22 ──────────────────────────────────
  // 33 plots available out of 242 total (owner update, April 2026)
  anjana: {
    available: [
      180, 181,
      206, 207, 208,
      212, 213, 214, 215, 216, 217, 218, 219, 220,
      221, 222, 223, 224, 225, 226, 227,
      231, 232, 233, 234, 235, 236, 237, 238, 239,
      240, 241, 242,
    ],
  },

  // ── Trimbak Oaks — Penamaluru (Phase I + Phase II) ──────────────────────
  // Phase II plot numbers use block prefixes: A1, B4, C10, D15 etc.
  trimbak: {
    available: [],
  },

  // ── Aparna Legacy — Chevitikallu ────────────────────────────────────────
  aparna: {
    available: [],
  },

  // ── Varaha Virtue — Pamarru ─────────────────────────────────────────────
  varaha: {
    available: [],
  },
}

/**
 * Returns 'available' if the plot is in the available list, else 'sold'.
 * Falls back to 'available' if the venture has no entries yet (so the
 * page still renders during data-entry transitions).
 *
 * @param {string} ventureKey — 'anjana' | 'trimbak' | 'aparna' | 'varaha'
 * @param {number|string} plotNumber
 * @returns {'available'|'sold'}
 */
export function getPlotStatus(ventureKey, plotNumber) {
  const status = PLOT_STATUS[ventureKey]
  if (!status) return 'available'
  const list = status.available || []
  // If the available list is empty, treat as 'available' (no data yet).
  if (list.length === 0) return 'available'
  const key = String(plotNumber)
  return list.includes(plotNumber) || list.includes(key) ? 'available' : 'sold'
}

/**
 * Returns { available: N, sold: N } counts for a given category's plot list.
 * Used by the legend above the chips.
 */
export function getStatusCounts(ventureKey, plotNumbers) {
  let available = 0
  let sold = 0
  for (const num of plotNumbers || []) {
    if (getPlotStatus(ventureKey, num) === 'available') available++
    else sold++
  }
  return { available, sold }
}
