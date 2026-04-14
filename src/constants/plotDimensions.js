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
// Table layout: 4 columns × ~69 rows.
//   Col 1 → Plots 1–69   | Col 2 → Plots 70–138
//   Col 3 → Plots 139–207 | Col 4 → Plots 208–273
// ═══════════════════════════════════════════════════════════════════════════

const APARNA_STD = { sqyd: 183.36, dimension: "33'×50'" }

const aparna = {
  // ── Column 1 (plots 1–69) ─────────────────────────────────────────────────
  1:   { sqyd: 1427.57, dimension: "Premium Corner" },
  2:   { sqyd: 1861.20, dimension: "Premium Corner" },
  3:   { sqyd: 237.97,  dimension: "42'×51'" },
  4:   { sqyd: 337.36,  dimension: "50'×61'" },
  5:   { sqyd: 293.57,  dimension: "55'×48'" },
  6:   { sqyd: 293.89,  dimension: "55'×48'" },
  7:   { sqyd: 284.18,  dimension: "55'×46'" },
  8:   { sqyd: 311.20,  dimension: "55'×51'" },
  9:   { sqyd: 203.31,  dimension: "33'×55'" },
  10:  { sqyd: 217.40,  dimension: "35'×56'" },
  11:  { sqyd: 229.85,  dimension: "35'×59'" },
  12:  { sqyd: 293.57,  dimension: "55'×48'" },
  13:  { sqyd: 284.18,  dimension: "55'×46'" },
  14:  { sqyd: 294.14,  dimension: "55'×48'" },
  15:  { sqyd: 294.14,  dimension: "55'×48'" },
  16:  { sqyd: 343.99,  dimension: "61'×51'" },
  17:  { sqyd: 290.74,  dimension: "55'×48'" },
  18:  { sqyd: 270.13,  dimension: "50'×49'" },
  19:  { sqyd: 300.96,  dimension: "55'×50'" },
  20:  { sqyd: 254.37,  dimension: "50'×46'" },
  21:  { sqyd: 290.57,  dimension: "55'×48'" },
  22:  { sqyd: 278.14,  dimension: "50'×50'" },
  23:  { sqyd: 285.79,  dimension: "55'×47'" },
  24:  { sqyd: 296.81,  dimension: "55'×50'" },
  25:  { sqyd: 230.80,  dimension: "42'×50'" },
  26:  { sqyd: 276.93,  dimension: "50'×50'" },
  27:  { sqyd: 299.05,  dimension: "55'×50'" },
  28:  { sqyd: 255.67,  dimension: "50'×46'" },
  29:  { sqyd: 260.11,  dimension: "50'×47'" },
  35:  { sqyd: 236.29,  dimension: "35'×61'" },
  36:  { sqyd: 293.57,  dimension: "55'×48'" },
  41:  { sqyd: 210.93,  dimension: "35'×55'" },
  42:  { sqyd: 210.96,  dimension: "35'×55'" },
  43:  { sqyd: 218.64,  dimension: "35'×56'" },
  44:  { sqyd: 218.64,  dimension: "35'×56'" },
  45:  { sqyd: 293.57,  dimension: "55'×48'" },
  46:  { sqyd: 293.57,  dimension: "55'×48'" },
  47:  { sqyd: 293.57,  dimension: "55'×48'" },
  48:  { sqyd: 293.57,  dimension: "55'×48'" },
  49:  { sqyd: 293.57,  dimension: "55'×48'" },
  50:  { sqyd: 293.57,  dimension: "55'×48'" },
  52:  { sqyd: 293.57,  dimension: "55'×48'" },
  53:  { sqyd: 293.57,  dimension: "55'×48'" },

  // ── Column 2 (plots 70–138) ────────────────────────────────────────────────
  70:  { sqyd: 218.64,  dimension: "35'×56'" },
  71:  { sqyd: 294.55,  dimension: "55'×48'" },

  // ── Column 3 (plots 139–207) ───────────────────────────────────────────────
  141: { sqyd: 294.55,  dimension: "55'×48'" },  // fixed: was wrongly 366.16

  // ── Column 4 (plots 208–273) ───────────────────────────────────────────────
  // Exact values from PDF sq.y column:
  211: { sqyd: 277.78,  dimension: "50'×50'" },
  212: { sqyd: 339.02,  dimension: "55'×56'" },
  213: { sqyd: 203.50,  dimension: "33'×55'" },
  214: { sqyd: 203.50,  dimension: "33'×55'" },
  215: { sqyd: 339.02,  dimension: "55'×56'" },
  216: { sqyd: 277.78,  dimension: "50'×50'" },
  227: { sqyd: 194.48,  dimension: "32'×55'" },
  228: { sqyd: 194.48,  dimension: "32'×55'" },
  229: { sqyd: 205.04,  dimension: "34'×55'" },
  230: { sqyd: 267.44,  dimension: "48'×50'" },
  239: { sqyd: 277.78,  dimension: "50'×50'" },
  240: { sqyd: 362.16,  dimension: "55'×59'" },
  241: { sqyd: 217.38,  dimension: "35'×56'" },
  242: { sqyd: 219.79,  dimension: "35'×57'" },
  243: { sqyd: 366.16,  dimension: "55'×60'" },
  244: { sqyd: 366.16,  dimension: "55'×60'" },
  245: { sqyd: 219.79,  dimension: "35'×57'" },
  246: { sqyd: 220.46,  dimension: "35'×57'" },
  247: { sqyd: 366.16,  dimension: "55'×60'" },
  248: { sqyd: 222.37,  dimension: "35'×57'" },
  252: { sqyd: 176.40,  dimension: "33'×48'" },
  253: { sqyd: 178.37,  dimension: "33'×49'" },
  257: { sqyd: 222.37,  dimension: "35'×57'" },
  258: { sqyd: 305.66,  dimension: "50'×55'" },
  259: { sqyd: 207.16,  dimension: "35'×53'" },
  260: { sqyd: 210.70,  dimension: "35'×54'" },
  261: { sqyd: 305.66,  dimension: "50'×55'" },
  262: { sqyd: 222.37,  dimension: "35'×57'" },
  266: { sqyd: 175.95,  dimension: "50'×31'" },
  267: { sqyd: 169.70,  dimension: "50'×30'" },
  268: { sqyd: 180.03,  dimension: "50'×32'" },
  269: { sqyd: 178.75,  dimension: "50'×32'" },
  270: { sqyd: 178.19,  dimension: "50'×32'" },
  271: { sqyd: 217.20,  dimension: "50'×39'" },
  272: { sqyd: 302.76,  dimension: "50'×54'" },
  273: { sqyd: 216.87,  dimension: "50'×39'" },
}
for (let i = 1; i <= 273; i++) { if (!aparna[i]) aparna[i] = APARNA_STD }

// ═══════════════════════════════════════════════════════════════════════════
// VARAHA VIRTUE — Pamarru (132 plots)
// Data extracted from Varaha Virtue layout PDF table.
// Standard plot: 33'×50' · 183.36 sq.yd. All non-standard plots listed below.
// ═══════════════════════════════════════════════════════════════════════════

const VARAHA_STD = { sqyd: 183.36, dimension: "33'×50'" }

const varaha = {
  // Plots 1–6: Large entrance/frontage premium
  1:   { sqyd: 854.27, dimension: "Premium Corner" },
  2:   { sqyd: 635.20, dimension: "Premium Corner" },
  3:   { sqyd: 650.91, dimension: "Premium Corner" },
  4:   { sqyd: 666.60, dimension: "Premium Corner" },
  5:   { sqyd: 682.30, dimension: "Premium Corner" },
  6:   { sqyd: 773.16, dimension: "Premium Corner" },
  // Plots 7–17: Reduced-size entrance row
  7:   { sqyd: 225.09, dimension: "35'×58'" },
  8:   { sqyd: 139.00, dimension: "33'×38'" },
  9:   { sqyd: 143.71, dimension: "33'×39'" },
  10:  { sqyd: 148.42, dimension: "33'×40'" },
  11:  { sqyd: 153.13, dimension: "33'×42'" },
  12:  { sqyd: 157.85, dimension: "33'×43'" },
  13:  { sqyd: 146.78, dimension: "33'×40'" },
  14:  { sqyd: 146.78, dimension: "33'×40'" },
  15:  { sqyd: 146.78, dimension: "33'×40'" },
  16:  { sqyd: 146.78, dimension: "33'×40'" },
  17:  { sqyd: 146.78, dimension: "33'×40'" },
  // Plots 18–19: Block corners
  18:  { sqyd: 249.06, dimension: "50'×45'" },
  19:  { sqyd: 312.78, dimension: "50'×56'" },
  // Plots 31–37: Corner + reduced row
  31:  { sqyd: 250.07, dimension: "50'×45'" },
  32:  { sqyd: 249.06, dimension: "50'×45'" },
  33:  { sqyd: 146.78, dimension: "33'×40'" },
  34:  { sqyd: 146.78, dimension: "33'×40'" },
  35:  { sqyd: 146.78, dimension: "33'×40'" },
  36:  { sqyd: 146.78, dimension: "33'×40'" },
  37:  { sqyd: 146.78, dimension: "33'×40'" },
  // Plots 43–44: Corner
  43:  { sqyd: 311.14, dimension: "50'×56'" },
  44:  { sqyd: 250.07, dimension: "50'×45'" },
  // Plots 56–57: Corner
  56:  { sqyd: 312.78, dimension: "50'×56'" },
  57:  { sqyd: 222.37, dimension: "35'×57'" },
  // Plots 68–69: Large entrance corners
  68:  { sqyd: 504.10, dimension: "Premium Corner" },
  69:  { sqyd: 580.25, dimension: "Premium Corner" },
  // Plots 80–81: Corner
  80:  { sqyd: 222.37, dimension: "35'×57'" },
  81:  { sqyd: 312.78, dimension: "50'×56'" },
  // Plots 93–94: Corner
  93:  { sqyd: 250.07, dimension: "50'×45'" },
  94:  { sqyd: 311.14, dimension: "50'×56'" },
  // Plots 100–106: Premium block
  100: { sqyd: 179.27, dimension: "33'×49'" },
  101: { sqyd: 185.59, dimension: "33'×51'" },
  102: { sqyd: 191.62, dimension: "33'×52'" },
  103: { sqyd: 191.71, dimension: "33'×52'" },
  104: { sqyd: 189.36, dimension: "33'×52'" },
  105: { sqyd: 315.94, dimension: "50'×57'" },
  106: { sqyd: 250.07, dimension: "50'×45'" },
  // Plots 118–119: Corner
  118: { sqyd: 312.78, dimension: "50'×56'" },
  119: { sqyd: 222.37, dimension: "35'×57'" },
  // Plot 132: End corner
  132: { sqyd: 349.12, dimension: "Premium Corner" },
}
for (let i = 1; i <= 132; i++) { if (!varaha[i]) varaha[i] = VARAHA_STD }

// ═══════════════════════════════════════════════════════════════════════════
// TRIMBAK OAKS — Penamaluru (324 plots: Phase I = 138, Phase II Blocks A–D)
// Phase II data provided by owner, block by block.
// Phase II blocks use prefixes: A1–A41, B1–B54, C1–C54, D1–D37.
// ═══════════════════════════════════════════════════════════════════════════

const TRIMBAK_STD = { sqyd: 183.33, dimension: "50'×33'" }

const trimbak = {}

// ── Phase I: plots 1–138 (all standard 50'×33' · 183.33 sq.yd) ────────────
for (let i = 1; i <= 138; i++) { trimbak[i] = TRIMBAK_STD }

// ── Phase II — Block A (41 plots) ─────────────────────────────────────────
const blockA = {
  A1:  { sqyd: 325.21, dimension: "55'×53'" },
  A2:  { sqyd: 325.21, dimension: "55'×53'" },
  A3:  { sqyd: 325.21, dimension: "55'×53'" },
  A4:  { sqyd: 325.21, dimension: "55'×53'" },
  A5:  { sqyd: 328.90, dimension: "55'×54'" },
  A6:  { sqyd: 192.79, dimension: "33'×53'" },
  A7:  { sqyd: 159.29, dimension: "33'×43'" },
  A8:  { sqyd: 159.29, dimension: "33'×43'" },
  A9:  { sqyd: 159.29, dimension: "33'×43'" },
  A10: { sqyd: 159.29, dimension: "33'×43'" },
  A11: { sqyd: 211.08, dimension: "35'×54'" },
  A12: { sqyd: 163.81, dimension: "33'×45'" },
  A13: { sqyd: 228.46, dimension: "42'×49'" },
  A14: { sqyd: 172.41, dimension: "33'×47'" },
  A15: { sqyd: 172.41, dimension: "33'×47'" },
  A16: { sqyd: 172.41, dimension: "33'×47'" },
  A17: { sqyd: 172.41, dimension: "33'×47'" },
  A18: { sqyd: 201.85, dimension: "35'×52'" },
  A19: { sqyd: 183.36, dimension: "33'×50'" },
  A20: { sqyd: 183.36, dimension: "33'×50'" },
  A21: { sqyd: 183.36, dimension: "33'×50'" },
  A22: { sqyd: 183.36, dimension: "33'×50'" },
  A23: { sqyd: 280.84, dimension: "50'×50'" },
  A24: { sqyd: 264.07, dimension: "48'×50'" },
  A25: { sqyd: 172.41, dimension: "33'×47'" },
  A26: { sqyd: 172.41, dimension: "33'×47'" },
  A27: { sqyd: 172.41, dimension: "33'×47'" },
  A28: { sqyd: 172.41, dimension: "33'×47'" },
  A29: { sqyd: 199.22, dimension: "35'×51'" },
  A30: { sqyd: 225.83, dimension: "42'×48'" },
  A31: { sqyd: 183.36, dimension: "33'×50'" },
  A32: { sqyd: 183.36, dimension: "33'×50'" },
  A33: { sqyd: 183.36, dimension: "33'×50'" },
  A34: { sqyd: 183.36, dimension: "33'×50'" },
  A35: { sqyd: 257.80, dimension: "48'×48'" },
  A36: { sqyd: 239.16, dimension: "45'×48'" },
  A37: { sqyd: 166.73, dimension: "33'×46'" },
  A38: { sqyd: 165.74, dimension: "33'×45'" },
  A39: { sqyd: 164.86, dimension: "33'×45'" },
  A40: { sqyd: 164.15, dimension: "33'×45'" },
  A41: { sqyd: 213.13, dimension: "38'×50'" },
}

// ── Phase II — Block B (54 plots) ─────────────────────────────────────────
const blockB = {
  B1:  { sqyd: 163.07, dimension: "33'×44'" },
  B2:  { sqyd: 136.34, dimension: "30'×41'" },
  B3:  { sqyd: 145.64, dimension: "33'×40'" },
  B4:  { sqyd: 154.92, dimension: "33'×42'" },
  B5:  { sqyd: 164.21, dimension: "33'×45'" },
  B6:  { sqyd: 173.49, dimension: "33'×47'" },
  B7:  { sqyd: 181.87, dimension: "33'×50'" },
  B8:  { sqyd: 183.19, dimension: "33'×50'" },
  B9:  { sqyd: 183.00, dimension: "33'×50'" },
  B10: { sqyd: 271.60, dimension: "50'×49'" },
  B11: { sqyd: 225.91, dimension: "42'×48'" },
  B12: { sqyd: 314.22, dimension: "55'×51'" },
  B13: { sqyd: 292.53, dimension: "50'×53'" },
  B14: { sqyd: 277.55, dimension: "50'×50'" },
  B15: { sqyd: 199.68, dimension: "35'×51'" },
  B16: { sqyd: 164.21, dimension: "33'×45'" },
  B17: { sqyd: 324.56, dimension: "55'×53'" },
  B18: { sqyd: 183.36, dimension: "33'×50'" },
  B19: { sqyd: 256.49, dimension: "48'×48'" },
  B20: { sqyd: 416.01, dimension: "Premium Corner" },
  B21: { sqyd: 183.36, dimension: "33'×50'" },
  B22: { sqyd: 222.37, dimension: "35'×57'" },
  B23: { sqyd: 183.36, dimension: "33'×50'" },
  B24: { sqyd: 183.36, dimension: "33'×50'" },
  B25: { sqyd: 183.36, dimension: "33'×50'" },
  B26: { sqyd: 183.36, dimension: "33'×50'" },
  B27: { sqyd: 183.36, dimension: "33'×50'" },
  B28: { sqyd: 183.36, dimension: "33'×50'" },
  B29: { sqyd: 183.36, dimension: "33'×50'" },
  B30: { sqyd: 183.36, dimension: "33'×50'" },
  B31: { sqyd: 183.36, dimension: "33'×50'" },
  B32: { sqyd: 237.93, dimension: "45'×48'" },
  B33: { sqyd: 237.93, dimension: "45'×48'" },
  B34: { sqyd: 183.36, dimension: "33'×50'" },
  B35: { sqyd: 183.36, dimension: "33'×50'" },
  B36: { sqyd: 183.36, dimension: "33'×50'" },
  B37: { sqyd: 183.36, dimension: "33'×50'" },
  B38: { sqyd: 183.36, dimension: "33'×50'" },
  B39: { sqyd: 183.36, dimension: "33'×50'" },
  B40: { sqyd: 183.36, dimension: "33'×50'" },
  B41: { sqyd: 183.36, dimension: "33'×50'" },
  B42: { sqyd: 183.36, dimension: "33'×50'" },
  B43: { sqyd: 222.37, dimension: "35'×57'" },
  B44: { sqyd: 183.36, dimension: "33'×50'" },
  B45: { sqyd: 351.35, dimension: "55'×57'" },
  B46: { sqyd: 1671.11, dimension: "Premium Corner" },
  B47: { sqyd: 151.68, dimension: "33'×41'" },
  B48: { sqyd: 161.09, dimension: "33'×44'" },
  B49: { sqyd: 137.19, dimension: "30'×41'" },
  B50: { sqyd: 146.52, dimension: "33'×40'" },
  B51: { sqyd: 155.85, dimension: "33'×43'" },
  B52: { sqyd: 165.17, dimension: "33'×45'" },
  B53: { sqyd: 174.49, dimension: "33'×47'" },
  B54: { sqyd: 264.66, dimension: "48'×50'" },
}

// ── Phase II — Block C (54 plots) ─────────────────────────────────────────
// NOTE: Block C image was low-resolution; values below are best-effort.
// Please verify with Block-C specific data table when available.
const blockC = {}
for (let i = 1; i <= 54; i++) {
  blockC[`C${i}`] = TRIMBAK_STD
}

// ── Phase II — Block D (37 plots) ─────────────────────────────────────────
const BLOCK_D_STD = { sqyd: 183.50, dimension: "33'×50'" }
const blockD = {
  D25: { sqyd: 214.66, dimension: "38'×50'" },
  D26: { sqyd: 202.88, dimension: "36'×50'" },
  D27: { sqyd: 191.11, dimension: "33'×52'" },
  D28: { sqyd: 179.34, dimension: "33'×49'" },
  D29: { sqyd: 167.56, dimension: "33'×46'" },
  D30: { sqyd: 155.79, dimension: "33'×43'" },
  D31: { sqyd: 206.98, dimension: "35'×53'" },
  D32: { sqyd: 122.41, dimension: "30'×37'" },
  D33: { sqyd: 139.28, dimension: "30'×42'" },
  D34: { sqyd: 140.72, dimension: "30'×42'" },
  D35: { sqyd: 132.65, dimension: "30'×40'" },
  D36: { sqyd: 163.97, dimension: "33'×45'" },
  D37: { sqyd: 167.22, dimension: "33'×46'" },
}
for (let i = 1; i <= 24; i++) { blockD[`D${i}`] = BLOCK_D_STD }

// Merge all Phase II blocks into trimbak
Object.assign(trimbak, blockA, blockB, blockC, blockD)

// ═══════════════════════════════════════════════════════════════════════════

export const PLOT_DIMENSIONS = { anjana, trimbak, aparna, varaha }

/**
 * Trimbak Phase-II block colours — matches block header accents on
 * the owner-provided block tables. Used to colour the plot chip
 * per-block in Phase II categories (East/West/Corner mix plots
 * from all 4 blocks in a single category).
 */
export const TRIMBAK_BLOCK_COLORS = {
  A: '#C9A84C', // Gold — matches Block A header
  B: '#C0392B', // Red  — matches Block B header
  C: '#1E4D2B', // Green — matches Block C header
  D: '#8B4513', // Brown — matches Block D header
}

/**
 * Returns the block colour for a Trimbak Phase-II plot number,
 * or null for Phase I or other ventures.
 * Phase-II plot numbers start with A/B/C/D prefix.
 */
export function getTrimbakBlockColor(ventureKey, plotNumber) {
  if (ventureKey !== 'trimbak') return null
  const str = String(plotNumber)
  const prefix = str[0]?.toUpperCase()
  return TRIMBAK_BLOCK_COLORS[prefix] || null
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
