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
  //
  // Phase II extracted from owner-provided trimbak_oaks_blocks_ABCD_register.xlsx
  // (yellow = sold, white = available).
  //   Block A: 15 available, 26 sold (41 total)
  //   Block B: 24 available, 30 sold (54 total)
  //   Block C: 19 available, 35 sold (54 total)
  //   Block D: 23 available, 14 sold (37 total)
  //   Phase II total: 81 available, 105 sold (186 total)
  //
  // Phase I (plots 1–138): status data not yet received from owner.
  // Currently defaulting every Phase I plot to 'available' below.
  trimbak: {
    available: [
      // ── Phase I (1–138) — placeholder: all available until owner data arrives
      ...Array.from({ length: 138 }, (_, i) => i + 1),

      // ── Phase II — Block A (15 available)
      'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
      'A12', 'A17', 'A18', 'A24', 'A25', 'A28', 'A29', 'A30',

      // ── Phase II — Block B (24 available)
      'B3', 'B9', 'B10', 'B11', 'B12', 'B13', 'B16', 'B17', 'B18', 'B19',
      'B20', 'B22', 'B23', 'B28', 'B29', 'B45', 'B47', 'B48', 'B49', 'B50',
      'B51', 'B52', 'B53', 'B54',

      // ── Phase II — Block C (19 available)
      'C1', 'C17', 'C18', 'C20', 'C21', 'C22', 'C23', 'C27', 'C28', 'C29',
      'C30', 'C38', 'C39', 'C49', 'C50', 'C51', 'C52', 'C53', 'C54',

      // ── Phase II — Block D (23 available)
      'D1', 'D2', 'D3', 'D8', 'D9', 'D10', 'D11', 'D12', 'D19', 'D20',
      'D21', 'D22', 'D23', 'D24', 'D25', 'D26', 'D31', 'D32', 'D33', 'D34',
      'D35', 'D36', 'D37',
    ],
  },

  // ── Aparna Legacy — Chevitikallu ────────────────────────────────────────
  // 206 plots available out of 273 total
  // Extracted from owner-provided plot register (chevitikallu_option_b_plot_register.xlsx)
  // Yellow-highlighted plots = sold; white plots = available.
  aparna: {
    available: [
      1, 2, 6, 7, 10, 13, 14, 15, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      30, 31, 32, 33, 34, 35, 36, 41, 42, 44, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64,
      65, 66, 67, 68, 69, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 97,
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
      121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 142, 143,
      148, 150, 152, 159, 160, 161, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177,
      178, 179, 180, 181, 182, 186, 187, 188, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206,
      207, 208, 209, 210, 211, 212, 213, 214, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227,
      228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
      248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267,
      268, 269, 270, 271, 272, 273,
    ],
  },

  // ── Varaha Virtue — Pamarru ─────────────────────────────────────────────
  // 47 plots available out of 132 total
  // Extracted from owner-provided consolidated_plots.xlsx (yellow=sold, white=available)
  varaha: {
    available: [
      1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21, 23, 26, 28,
      33, 34, 35, 36, 37, 38, 39, 40, 41,
      83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
      100, 101, 102, 103, 107,
    ],
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
