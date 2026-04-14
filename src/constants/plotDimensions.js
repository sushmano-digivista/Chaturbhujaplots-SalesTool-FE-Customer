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
 * NOTE: Anjana Paradise data is from "Paritala Plan-22" PDF.
 * Unknown plots default to standard 33'×50' = 183.36 sq.yd.
 * Update this file when refined layout plans become available.
 */

// Helper: most plots in Anjana are standard 33'×50'
const STD = { sqyd: 183.36, dimension: "33'×50'" }

// Anjana Paradise — 242 plots per Paritala Plan-22
const anjana = {
  // Entrance corner / premium plots
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
  // All other plots default to STD (33'×50' / 183.36 sq.yd)
}

// Fill in standard dimension for any plot not explicitly listed (1-242)
for (let i = 1; i <= 242; i++) {
  if (!anjana[i]) anjana[i] = STD
}

export const PLOT_DIMENSIONS = {
  anjana,
  // trimbak, aparna, varaha — will be added after Anjana preview approval
}

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
