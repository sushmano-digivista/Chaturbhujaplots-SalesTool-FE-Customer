/**
 * Per-plot dimension & area data extracted from layout plan PDFs.
 *
 * Data shape:
 *   PLOT_DIMENSIONS[ventureKey][plotNumber] = {
 *     sqyd:      area in square yards (number),
 *     dimension: width × depth label (string, e.g. "33'×50'"),
 *   }
 *
 * The facing (East/West/Corner/etc.) comes from PlotGrid's category
 * membership — not stored here to avoid duplication.
 *
 * Unknown/unlisted plots fall back to the venture's STD default.
 * Update specific plot numbers as refined layout plans become available.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ANJANA PARADISE — Paritala Plan-22 (242 plots)
// ═══════════════════════════════════════════════════════════════════════════

const ANJANA_STD = { sqyd: 183.36, dimension: "33'×50'" }

const anjana = {
  1:   { sqyd: 283.63, dimension: "50'×52'" },
  2:   { sqyd: 201.78, dimension: "33'×54'" },
  3:   { sqyd: 201.78, dimension: "33'×54'" },
  4:   { sqyd: 135.92, dimension: "30'×41'" },
  5:   { sqyd: 176.09, dimension: "33'×48'" },
  6:   { sqyd: 163.81, dimension: "33'×45'" },
  9:   { sqyd: 185.12, dimension: "33'×51'" },
  13:  { sqyd: 257.94, dimension: "33'×70'" },
  14:  { sqyd: 257.94, dimension: "33'×70'" },
  24:  { sqyd: 550.10, dimension: "50'×100'" },
  25:  { sqyd: 550.10, dimension: "50'×100'" },
  26:  { sqyd: 269.29, dimension: "50'×55'" },
  27:  { sqyd: 277.79, dimension: "50'×52'" },
  37:  { sqyd: 257.94, dimension: "33'×70'" },
  38:  { sqyd: 257.94, dimension: "33'×70'" },
  61:  { sqyd: 330.31, dimension: "50'×60'" },
  62:  { sqyd: 243.42, dimension: "50'×45'" },
  63:  { sqyd: 243.42, dimension: "50'×45'" },
  64:  { sqyd: 190.71, dimension: "33'×52'" },
  65:  { sqyd: 190.71, dimension: "33'×52'" },
  66:  { sqyd: 190.71, dimension: "33'×52'" },
  67:  { sqyd: 190.71, dimension: "33'×52'" },
  68:  { sqyd: 190.71, dimension: "33'×52'" },
  69:  { sqyd: 190.71, dimension: "33'×52'" },
  70:  { sqyd: 190.71, dimension: "33'×52'" },
  71:  { sqyd: 190.71, dimension: "33'×52'" },
  72:  { sqyd: 288.90, dimension: "50'×52'" },
  73:  { sqyd: 288.90, dimension: "50'×52'" },
  74:  { sqyd: 173.46, dimension: "33'×47'" },
  75:  { sqyd: 173.46, dimension: "33'×47'" },
  76:  { sqyd: 187.15, dimension: "33'×51'" },
  77:  { sqyd: 1459.79, dimension: "Premium Corner" },
  80:  { sqyd: 277.79, dimension: "50'×52'" },
  91:  { sqyd: 224.10, dimension: "33'×58'" },
  92:  { sqyd: 219.87, dimension: "33'×58'" },
  106: { sqyd: 232.71, dimension: "50'×42'" },
  107: { sqyd: 258.74, dimension: "50'×52'" },
  108: { sqyd: 184.84, dimension: "33'×50'" },
  124: { sqyd: 197.41, dimension: "33'×54'" },
  125: { sqyd: 185.31, dimension: "33'×50'" },
  141: { sqyd: 185.31, dimension: "33'×50'" },
  142: { sqyd: 197.41, dimension: "33'×54'" },
  157: { sqyd: 185.31, dimension: "33'×50'" },
  158: { sqyd: 197.41, dimension: "33'×54'" },
  164: { sqyd: 198.05, dimension: "33'×54'" },
  165: { sqyd: 198.05, dimension: "33'×54'" },
  166: { sqyd: 198.05, dimension: "33'×54'" },
  167: { sqyd: 198.05, dimension: "33'×54'" },
  168: { sqyd: 198.05, dimension: "33'×54'" },
  169: { sqyd: 198.05, dimension: "33'×54'" },
  170: { sqyd: 198.05, dimension: "33'×54'" },
  171: { sqyd: 198.05, dimension: "33'×54'" },
  172: { sqyd: 212.73, dimension: "33'×58'" },
  173: { sqyd: 212.73, dimension: "33'×58'" },
  174: { sqyd: 269.92, dimension: "50'×55'" },
  187: { sqyd: 212.73, dimension: "33'×58'" },
  188: { sqyd: 212.73, dimension: "33'×58'" },
  189: { sqyd: 287.58, dimension: "50'×52'" },
  190: { sqyd: 277.79, dimension: "50'×52'" },
  206: { sqyd: 232.71, dimension: "50'×42'" },
}
for (let i = 1; i <= 242; i++) { if (!anjana[i]) anjana[i] = ANJANA_STD }

// ═══════════════════════════════════════════════════════════════════════════
// APARNA LEGACY — Chevitikallu Plan-5 (273 plots)
// Data extracted from "Chevitikallu-Plan-5 With Out L.P.M.Nos" PDF.
// ═══════════════════════════════════════════════════════════════════════════

const APARNA_STD = { sqyd: 183.36, dimension: "33'×50'" }

const aparna = {
  // Plots 1–2: Large entrance/premium plots
  1:   { sqyd: 1427.57, dimension: "Premium Corner" },
  2:   { sqyd: 1861.20, dimension: "Premium Corner" },
  // Plots 3–10: Premium front row
  3:   { sqyd: 237.97, dimension: "42'×51'" },
  4:   { sqyd: 337.36, dimension: "50'×61'" },
  5:   { sqyd: 293.57, dimension: "55'×48'" },
  6:   { sqyd: 293.89, dimension: "55'×48'" },
  7:   { sqyd: 284.18, dimension: "55'×46'" },
  8:   { sqyd: 311.20, dimension: "55'×51'" },
  9:   { sqyd: 203.31, dimension: "33'×55'" },
  10:  { sqyd: 217.40, dimension: "35'×56'" },
  11:  { sqyd: 229.85, dimension: "35'×59'" },
  12:  { sqyd: 293.57, dimension: "55'×48'" },
  13:  { sqyd: 284.18, dimension: "55'×46'" },
  // Plots 14–16: Block edges
  14:  { sqyd: 294.14, dimension: "55'×48'" },
  15:  { sqyd: 294.14, dimension: "55'×48'" },
  16:  { sqyd: 343.99, dimension: "61'×51'" },
  17:  { sqyd: 290.74, dimension: "55'×48'" },
  18:  { sqyd: 270.13, dimension: "50'×49'" },
  19:  { sqyd: 300.96, dimension: "55'×50'" },
  20:  { sqyd: 254.37, dimension: "50'×46'" },
  21:  { sqyd: 290.57, dimension: "55'×48'" },
  22:  { sqyd: 278.14, dimension: "50'×50'" },
  23:  { sqyd: 285.79, dimension: "55'×47'" },
  24:  { sqyd: 296.81, dimension: "55'×50'" },
  25:  { sqyd: 230.80, dimension: "42'×50'" },
  26:  { sqyd: 276.93, dimension: "50'×50'" },
  27:  { sqyd: 299.05, dimension: "55'×50'" },
  28:  { sqyd: 255.67, dimension: "50'×46'" },
  29:  { sqyd: 260.11, dimension: "50'×47'" },
  // Plots 30-53: Corner/premium plots
  35:  { sqyd: 236.29, dimension: "35'×61'" },
  36:  { sqyd: 293.57, dimension: "55'×48'" },
  41:  { sqyd: 210.93, dimension: "35'×55'" },
  42:  { sqyd: 210.96, dimension: "35'×55'" },
  43:  { sqyd: 218.64, dimension: "35'×56'" },
  44:  { sqyd: 218.64, dimension: "35'×56'" },
  45:  { sqyd: 293.57, dimension: "55'×48'" },
  46:  { sqyd: 293.57, dimension: "55'×48'" },
  47:  { sqyd: 293.57, dimension: "55'×48'" },
  48:  { sqyd: 293.57, dimension: "55'×48'" },
  49:  { sqyd: 293.57, dimension: "55'×48'" },
  50:  { sqyd: 293.57, dimension: "55'×48'" },
  52:  { sqyd: 293.57, dimension: "55'×48'" },
  53:  { sqyd: 293.57, dimension: "55'×48'" },
  // Phase corners from sq.y visible values (larger plots)
  70:  { sqyd: 218.64, dimension: "35'×56'" },
  71:  { sqyd: 294.55, dimension: "55'×48'" },
  // Upper-right cluster (premium block)
  124: { sqyd: 277.78, dimension: "50'×50'" },
  125: { sqyd: 362.16, dimension: "55'×59'" },
  141: { sqyd: 366.16, dimension: "55'×60'" },
  // Specific premium flags by plan area
  230: { sqyd: 175.95, dimension: "50'×31'" },
  231: { sqyd: 169.70, dimension: "50'×30'" },
  232: { sqyd: 180.03, dimension: "50'×32'" },
  233: { sqyd: 178.75, dimension: "50'×32'" },
  234: { sqyd: 178.19, dimension: "50'×32'" },
  235: { sqyd: 217.20, dimension: "50'×39'" },
  236: { sqyd: 302.76, dimension: "50'×54'" },
  237: { sqyd: 216.87, dimension: "50'×39'" },
  // Standard 30'×55' (183.33) & 33'×50' (183.36) mostly interchangeable
}
for (let i = 1; i <= 273; i++) { if (!aparna[i]) aparna[i] = APARNA_STD }

// ═══════════════════════════════════════════════════════════════════════════
// VARAHA VIRTUE — Pamarru (132 plots)
// byDimension: 40×56 × 83 (std), 50×33 × 38, Irregular × 11
// ═══════════════════════════════════════════════════════════════════════════

const VARAHA_STD = { sqyd: 248.88, dimension: "40'×56'" }

const varaha = {
  // West-facing row typically 50×33 (183 sq.yd)
  2:   { sqyd: 183.33, dimension: "50'×33'" },
  4:   { sqyd: 183.33, dimension: "50'×33'" },
  6:   { sqyd: 183.33, dimension: "50'×33'" },
  8:   { sqyd: 183.33, dimension: "50'×33'" },
  12:  { sqyd: 183.33, dimension: "50'×33'" },
  14:  { sqyd: 183.33, dimension: "50'×33'" },
  16:  { sqyd: 183.33, dimension: "50'×33'" },
  18:  { sqyd: 183.33, dimension: "50'×33'" },
  22:  { sqyd: 183.33, dimension: "50'×33'" },
  24:  { sqyd: 183.33, dimension: "50'×33'" },
  26:  { sqyd: 183.33, dimension: "50'×33'" },
  28:  { sqyd: 183.33, dimension: "50'×33'" },
  32:  { sqyd: 183.33, dimension: "50'×33'" },
  34:  { sqyd: 183.33, dimension: "50'×33'" },
  36:  { sqyd: 183.33, dimension: "50'×33'" },
  38:  { sqyd: 183.33, dimension: "50'×33'" },
  42:  { sqyd: 183.33, dimension: "50'×33'" },
  44:  { sqyd: 183.33, dimension: "50'×33'" },
  46:  { sqyd: 183.33, dimension: "50'×33'" },
  48:  { sqyd: 183.33, dimension: "50'×33'" },
  52:  { sqyd: 183.33, dimension: "50'×33'" },
  54:  { sqyd: 183.33, dimension: "50'×33'" },
  56:  { sqyd: 183.33, dimension: "50'×33'" },
  58:  { sqyd: 183.33, dimension: "50'×33'" },
  62:  { sqyd: 183.33, dimension: "50'×33'" },
  64:  { sqyd: 183.33, dimension: "50'×33'" },
  66:  { sqyd: 183.33, dimension: "50'×33'" },
  68:  { sqyd: 183.33, dimension: "50'×33'" },
  72:  { sqyd: 183.33, dimension: "50'×33'" },
  74:  { sqyd: 183.33, dimension: "50'×33'" },
  76:  { sqyd: 183.33, dimension: "50'×33'" },
  78:  { sqyd: 183.33, dimension: "50'×33'" },
  82:  { sqyd: 183.33, dimension: "50'×33'" },
  84:  { sqyd: 183.33, dimension: "50'×33'" },
  86:  { sqyd: 183.33, dimension: "50'×33'" },
  88:  { sqyd: 183.33, dimension: "50'×33'" },
  92:  { sqyd: 183.33, dimension: "50'×33'" },
  94:  { sqyd: 183.33, dimension: "50'×33'" },
}
for (let i = 1; i <= 132; i++) { if (!varaha[i]) varaha[i] = VARAHA_STD }

// ═══════════════════════════════════════════════════════════════════════════
// TRIMBAK OAKS — Penamaluru (324 plots: Phase I = 138, Phase II = 186)
// byDimension: 50×33 × 74 (std), 47×33 × 43, 36×46 × 24, 50×45 × 20, Irregular × 25
// Phase II uses block prefixes: A, B, C, D
// ═══════════════════════════════════════════════════════════════════════════

const TRIMBAK_STD = { sqyd: 183.33, dimension: "50'×33'" }

const trimbak = {}
// Phase I: plots 1–138
for (let i = 1; i <= 138; i++) { trimbak[i] = TRIMBAK_STD }
// Phase II: A1–A41, B1–B54, C1–C54, D1–D37 (~186 plots)
const P2_BLOCKS = {
  A: 41,
  B: 54,
  C: 54,
  D: 37,
}
for (const [block, count] of Object.entries(P2_BLOCKS)) {
  for (let i = 1; i <= count; i++) {
    trimbak[`${block}${i}`] = TRIMBAK_STD
  }
}

// ═══════════════════════════════════════════════════════════════════════════

export const PLOT_DIMENSIONS = { anjana, trimbak, aparna, varaha }

/**
 * Lookup helper — returns dimension/area info for a plot, or null if unknown.
 * @param {string} ventureKey — 'anjana' | 'trimbak' | 'aparna' | 'varaha'
 * @param {number|string} plotNumber
 * @returns {{ sqyd:number, dimension:string } | null}
 */
export function getPlotDimension(ventureKey, plotNumber) {
  const map = PLOT_DIMENSIONS[ventureKey]
  if (!map) return null
  return map[plotNumber] || map[String(plotNumber)] || null
}
