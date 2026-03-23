import { useState, useMemo } from 'react'
import styles from '../sections/PlotGrid.module.css'

/**
 * Plot colour palette keyed by API category name.
 * Centralised here so legend and cell colours are always in sync.
 */
const CATEGORY_COLORS = {
  eastFacing:  '#C9A84C',
  westFacing:  '#4A90D9',
  northFacing: '#4CAF74',
  southFacing: '#E24B4A',
  cornerPlots: '#9B7B2E',
}

const CATEGORY_META_LABELS = {
  eastFacing:  'East-Facing',
  westFacing:  'West-Facing',
  northFacing: 'North-Facing',
  southFacing: 'South-Facing',
  cornerPlots: 'Corner Plots',
}

const COLS = 6
const CELL_W = 118
const CELL_H = 80
const GAP_X = 8
const GAP_Y = 8
const ORIGIN_X = 30
const ORIGIN_Y = 28
const ROAD_Y = 210
const ROAD_H = 52
const MAX_PLOTS = 24

/**
 * Builds a map of plot-number (uppercase string) → fill colour.
 * Pure function — safe to unit-test in isolation.
 * @param {object} summary
 * @returns {Record<string, string>}
 */
function buildColorMap(summary) {
  const map = {}
  Object.keys(CATEGORY_COLORS).forEach((key) => {
    const cat = summary?.[key]
    if (cat?.plotNumbers) {
      cat.plotNumbers.forEach((n) => {
        map[String(n).trim().toUpperCase()] = CATEGORY_COLORS[key]
      })
    }
  })
  return map
}

/**
 * Returns de-duplicated plot numbers across all categories in order.
 * @param {object} summary
 * @returns {string[]}
 */
function collectPlotNumbers(summary) {
  const all = []
  Object.keys(CATEGORY_COLORS).forEach((key) => {
    const cat = summary?.[key]
    if (cat?.plotNumbers) cat.plotNumbers.forEach((n) => all.push(String(n).trim()))
  })
  return [...new Set(all)]
}

/**
 * Returns the category label for a plot number, or empty string.
 * @param {string} plotNum
 * @param {object} summary
 * @returns {string}
 */
function getCategoryLabel(plotNum, summary) {
  const upper = plotNum.toUpperCase()
  for (const key of Object.keys(CATEGORY_COLORS)) {
    const found = summary?.[key]?.plotNumbers
      ?.map((n) => String(n).trim().toUpperCase())
      .includes(upper)
    if (found) return CATEGORY_META_LABELS[key] ?? ''
  }
  return ''
}

/**
 * Computes SVG y-position for row r, skipping past the road strip.
 * @param {number} r
 * @returns {number}
 */
function cellY(r) {
  return r < 2
    ? ORIGIN_Y + r * (CELL_H + GAP_Y)
    : ORIGIN_Y + r * (CELL_H + GAP_Y) + ROAD_H
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PlotVisualGrid — declarative React SVG layout map.
 *
 * Security fix (Checkmarx CWE-79 / Sonar S5024):
 *   Previously set `svg.innerHTML = html` where plot numbers came from an API
 *   response.  Replaced with JSX — React escapes every dynamic value, so
 *   injected content can never execute as markup.
 *
 * Props
 *   summary   – API plot-summary object
 *   onEnquire – (ctx: object) => void
 */
export default function PlotVisualGrid({ summary, onEnquire }) {
  const [tip, setTip] = useState(null)

  const { colorMap, uniquePlots } = useMemo(() => ({
    colorMap:    buildColorMap(summary),
    uniquePlots: collectPlotNumbers(summary),
  }), [summary])

  const total = Math.min(uniquePlots.length || summary?.totalPlots || 24, MAX_PLOTS)

  if (!summary) return null

  const cells = Array.from({ length: total }, (_, i) => {
    const col  = i % COLS
    const row  = Math.floor(i / COLS)
    const x    = ORIGIN_X + col * (CELL_W + GAP_X)
    const y    = cellY(row)
    const num  = uniquePlots[i] ?? `P-${String(i + 1).padStart(3, '0')}`
    const fill = colorMap[num.toUpperCase()] ?? 'rgba(30,77,43,0.25)'
    return { x, y, num, fill }
  })

  const handleMouseEnter = (e, num) => {
    const r = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (!r) return
    setTip({ x: e.clientX - r.left + 12, y: e.clientY - r.top - 20, num, catLabel: getCategoryLabel(num, summary) })
  }

  const handleMouseMove = (e) => {
    if (!tip) return
    const r = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (!r) return
    setTip((t) => t ? { ...t, x: e.clientX - r.left + 12, y: e.clientY - r.top - 20 } : null)
  }

  return (
    <div className={styles.gridSection}>
      <h3 className={styles.dimTitle}>Interactive Layout Map</h3>
      <p className={styles.gridSubtitle}>Hover any plot to see its category. Click to enquire.</p>

      <div className={styles.gridWrap} style={{ position: 'relative' }}>
        <div style={{ overflowX: 'auto' }}>
          <svg viewBox="0 0 900 500" style={{ display: 'block', width: '100%', minWidth: 600 }} aria-label="Interactive plot layout map">
            <rect width="900" height="500" fill="#EAF3DE" rx="8" />
            <rect x="20" y={ROAD_Y} width="860" height={ROAD_H} fill="#D4C5A9" opacity="0.5" rx="4" />
            <text x="450" y={ROAD_Y + 31} textAnchor="middle" fill="#8a7a5a" fontSize="11" fontFamily="DM Sans,sans-serif" fontWeight="500">
              Main Road — 60ft Wide
            </text>

            {cells.map(({ x, y, num, fill }) => (
              <g
                key={num}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => handleMouseEnter(e, num)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTip(null)}
                onClick={() => onEnquire({ plotNumber: num, category: getCategoryLabel(num, summary), source: 'CATEGORY_ENQUIRY' })}
                role="button"
                aria-label={`Plot ${num}`}
              >
                <rect x={x} y={y} width={CELL_W} height={CELL_H} fill={fill} opacity="0.85" rx="6" stroke="white" strokeWidth="1.5" />
                <text x={x + CELL_W / 2} y={y + CELL_H / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="DM Sans,sans-serif">
                  {num}
                </text>
              </g>
            ))}

            <rect x="350" y="455" width="200" height="32" fill="#1E4D2B" rx="4" />
            <text x="450" y="476" textAnchor="middle" fill="#C9A84C" fontSize="13" fontWeight="700" fontFamily="Cormorant Garamond,serif" letterSpacing="2">
              ENTRANCE
            </text>
          </svg>
        </div>

        {tip && (
          <div className={styles.tooltip} style={{ left: tip.x, top: tip.y }}>
            <strong>{tip.num}</strong>
            {tip.catLabel && <span>{tip.catLabel}</span>}
          </div>
        )}

        <div className={styles.gridLegend}>
          {Object.entries(CATEGORY_META_LABELS).map(([key, label]) => (
            <div key={key} className={styles.legItem}>
              <div className={styles.legDot} style={{ background: CATEGORY_COLORS[key] }} />
              <span>{label}</span>
            </div>
          ))}
          <div className={styles.legItem}>
            <div className={styles.legDot} style={{ background: 'rgba(30,77,43,0.25)' }} />
            <span>Unassigned</span>
          </div>
        </div>
      </div>
    </div>
  )
}
