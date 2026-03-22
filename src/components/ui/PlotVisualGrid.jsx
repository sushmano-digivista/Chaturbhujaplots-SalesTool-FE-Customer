import { useState, useRef, useEffect } from 'react'
import styles from '../sections/PlotGrid.module.css'

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

/**
 * PlotVisualGrid — SVG layout map drawn from the plot-summary API response.
 * Each coloured cell represents a real plot number; hovering shows a tooltip,
 * clicking opens the lead-enquiry modal.
 *
 * Props:
 *   summary    Plot summary object from the API
 *   onEnquire  (ctx) => void
 */
export default function PlotVisualGrid({ summary, onEnquire }) {
  const svgRef = useRef(null)
  const [tip, setTip] = useState(null) // { x, y, num, catLabel }

  useEffect(() => {
    if (!summary || !svgRef.current) return
    const svg = svgRef.current

    // Build plot-number → category colour map
    const colorMap = {}
    Object.keys(CATEGORY_COLORS).forEach((key) => {
      const cat = summary[key]
      if (cat?.plotNumbers) {
        cat.plotNumbers.forEach((num) => {
          colorMap[String(num).trim().toUpperCase()] = CATEGORY_COLORS[key]
        })
      }
    })

    // Collect unique plot numbers in order
    const allPlots = []
    Object.keys(CATEGORY_COLORS).forEach((key) => {
      const cat = summary[key]
      if (cat?.plotNumbers) cat.plotNumbers.forEach((n) => allPlots.push(String(n).trim()))
    })
    const uniquePlots = [...new Set(allPlots)]
    const total       = uniquePlots.length || summary.totalPlots || 24

    // Build SVG HTML
    const cols = 6, pw = 118, ph = 80, gx = 8, gy = 8, ox = 30, oy = 28
    let html = '<rect width="900" height="500" fill="#EAF3DE" rx="8"/>'
    html += '<rect x="20" y="210" width="860" height="52" fill="#D4C5A9" opacity="0.5" rx="4"/>'
    html += '<text x="450" y="241" text-anchor="middle" fill="#8a7a5a" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">Main Road — 60ft Wide</text>'

    for (let i = 0; i < Math.min(total, 24); i++) {
      const c   = i % cols
      const r   = Math.floor(i / cols)
      const x   = ox + c * (pw + gx)
      const y   = r < 2 ? oy + r * (ph + gy) : oy + r * (ph + gy) + 54
      const num  = uniquePlots[i] || `P-${String(i + 1).padStart(3, '0')}`
      const fill = colorMap[num.toUpperCase()] || 'rgba(30,77,43,0.25)'
      html += `<g class="vp" data-num="${num}" style="cursor:pointer">
        <rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="${fill}" opacity="0.85" rx="6" stroke="white" stroke-width="1.5"/>
        <text x="${x + pw / 2}" y="${y + ph / 2}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="11" font-weight="600" font-family="DM Sans,sans-serif">${num}</text>
      </g>`
    }

    html += '<rect x="350" y="455" width="200" height="32" fill="#1E4D2B" rx="4"/>'
    html += '<text x="450" y="476" text-anchor="middle" fill="#C9A84C" font-size="13" font-weight="700" font-family="Cormorant Garamond,serif" letter-spacing="2">ENTRANCE</text>'

    svg.innerHTML = html

    // Attach tooltip + click handlers
    svg.querySelectorAll('.vp').forEach((el) => {
      const num = el.dataset.num

      const getCatLabel = () => {
        let label = ''
        Object.keys(CATEGORY_COLORS).forEach((k) => {
          if (
            summary[k]?.plotNumbers
              ?.map((n) => String(n).trim().toUpperCase())
              .includes(num.toUpperCase())
          )
            label = CATEGORY_META_LABELS[k]
        })
        return label
      }

      el.addEventListener('mouseenter', (e) => {
        const r = svg.getBoundingClientRect()
        setTip({ x: e.clientX - r.left + 12, y: e.clientY - r.top - 20, num, catLabel: getCatLabel() })
      })
      el.addEventListener('mousemove', (e) => {
        const r = svg.getBoundingClientRect()
        setTip((t) => (t ? { ...t, x: e.clientX - r.left + 12, y: e.clientY - r.top - 20 } : null))
      })
      el.addEventListener('mouseleave', () => setTip(null))
      el.addEventListener('click', () =>
        onEnquire({ plotNumber: num, category: getCatLabel(), source: 'CATEGORY_ENQUIRY' }),
      )
    })
  }, [summary])

  return (
    <div className={styles.gridSection}>
      <h3 className={styles.dimTitle}>Interactive Layout Map</h3>
      <p className={styles.gridSubtitle}>Hover any plot to see its category. Click to enquire.</p>

      <div className={styles.gridWrap} style={{ position: 'relative' }}>
        <div style={{ overflowX: 'auto' }}>
          <svg
            ref={svgRef}
            viewBox="0 0 900 500"
            style={{ display: 'block', width: '100%', minWidth: 600 }}
          />
        </div>

        {tip && (
          <div className={styles.tooltip} style={{ left: tip.x, top: tip.y }}>
            <strong>{tip.num}</strong>
            {tip.catLabel && <span>{tip.catLabel}</span>}
          </div>
        )}

        {/* Colour legend */}
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
