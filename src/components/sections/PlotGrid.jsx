import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlotSummary } from '@/hooks/useData'
import { MapPin, Sun, Sunset, ArrowUp, ArrowDown, Maximize2 } from 'lucide-react'
import styles from './PlotGrid.module.css'

const CATEGORY_META = {
  eastFacing:  { icon: <Sun    size={18}/>, label:'East-Facing',  color:'#C9A84C', bg:'rgba(201,168,76,0.12)'  },
  westFacing:  { icon: <Sunset size={18}/>, label:'West-Facing',  color:'#4A90D9', bg:'rgba(74,144,217,0.12)' },
  northFacing: { icon: <ArrowUp size={18}/>, label:'North-Facing', color:'#4CAF74', bg:'rgba(76,175,116,0.12)' },
  southFacing: { icon: <ArrowDown size={18}/>, label:'South-Facing',color:'#E24B4A', bg:'rgba(226,75,74,0.12)'  },
  cornerPlots: { icon: <Maximize2 size={18}/>, label:'Corner Plots', color:'#9B7B2E', bg:'rgba(155,123,46,0.12)' },
}

export default function PlotGrid({ onEnquire }) {
  const { data: summary, isLoading } = usePlotSummary()
  const [activeCategory, setActiveCategory] = useState(null)  // which category is expanded
  const [hoveredPlot, setHoveredPlot]       = useState(null)

  if (isLoading) return <PlotGridSkeleton />

  const categories = summary ? [
    { key:'eastFacing',  data: summary.eastFacing  },
    { key:'westFacing',  data: summary.westFacing  },
    { key:'northFacing', data: summary.northFacing },
    { key:'southFacing', data: summary.southFacing },
    { key:'cornerPlots', data: summary.cornerPlots },
  ] : []

  return (
    <section className="section section-cream" id="plots">
      <div className="sec-hdr">
        <div className="sec-tag">Plot Categories</div>
        <h2 className="sec-title">Explore <em>Available Plots</em></h2>
        <p className="sec-sub">
          {summary?.totalPlots} plots across 5 categories. Click any category to see plot numbers
          and enquire directly.
        </p>
      </div>

      {/* Price range banner */}
      {summary?.priceRangeLabel && (
        <div className={styles.priceBanner}>
          <span className={styles.priceBannerLabel}>Price Range</span>
          <span className={styles.priceBannerValue}>{summary.priceRangeLabel}</span>
          <span className={styles.priceBannerNote}>Contact us for exact plot pricing</span>
        </div>
      )}

      {/* Category count cards */}
      <div className={styles.categoryGrid}>
        {categories.map(({ key, data }) => {
          if (!data) return null
          const meta   = CATEGORY_META[key]
          const isOpen = activeCategory === key
          return (
            <motion.div key={key} layout>
              <CategoryCard
                meta={meta}
                data={data}
                isOpen={isOpen}
                onToggle={() => setActiveCategory(isOpen ? null : key)}
                onEnquire={onEnquire}
                hoveredPlot={hoveredPlot}
                setHoveredPlot={setHoveredPlot}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Dimension breakdown */}
      {summary?.byDimension?.length > 0 && (
        <div className={styles.dimSection}>
          <h3 className={styles.dimTitle}>By Plot Size</h3>
          <div className={styles.dimGrid}>
            {summary.byDimension.map(d => (
              <motion.div key={d.dimension} className={styles.dimCard}
                whileHover={{ y:-2, boxShadow:'0 8px 28px rgba(30,77,43,0.12)' }}>
                <div className={styles.dimNum}>{d.count}</div>
                <div className={styles.dimLabel}>{d.dimension} ft</div>
                <div className={styles.dimArea}>{d.areaLabel}</div>
                <div className={styles.dimPrice}>From {d.priceFrom}</div>
                <button className={`btn btn-green btn-sm ${styles.dimBtn}`}
                  onClick={() => onEnquire({ category: d.dimension, source: 'CATEGORY_ENQUIRY' })}>
                  Enquire
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Visual SVG grid */}
      <PlotVisualGrid summary={summary} onEnquire={onEnquire} />
    </section>
  )
}

// ── Category Card (expandable) ────────────────────────────────────────────────
function CategoryCard({ meta, data, isOpen, onToggle, onEnquire, hoveredPlot, setHoveredPlot }) {
  return (
    <motion.div
      className={`${styles.catCard} ${isOpen ? styles.catCardOpen : ''}`}
      layout
      style={{ borderColor: isOpen ? meta.color : 'rgba(30,77,43,0.1)' }}>

      {/* Card header — always visible */}
      <div className={styles.catHeader} onClick={onToggle}>
        <div className={styles.catIconWrap} style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </div>
        <div className={styles.catInfo}>
          <div className={styles.catLabel}>{data.label}</div>
          <div className={styles.catDesc}>{data.description}</div>
        </div>
        <div className={styles.catRight}>
          <div className={styles.catCount} style={{ color: meta.color }}>{data.count}</div>
          <div className={styles.catCountLabel}>plots</div>
          {data.priceFrom !== '—' && (
            <div className={styles.catPrice}>from {data.priceFrom}</div>
          )}
        </div>
        <motion.div
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}>
          ▾
        </motion.div>
      </div>

      {/* Expanded: plot numbers + enquire */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.catExpanded}
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:0.25 }}>

            <div className={styles.plotNumsWrap}>
              <p className={styles.plotNumsTitle}>
                {data.count} plots in this category:
              </p>
              <div className={styles.plotNums}>
                {data.plotNumbers?.map(num => (
                  <motion.span
                    key={num}
                    className={`${styles.plotChip} ${hoveredPlot === num ? styles.plotChipHover : ''}`}
                    style={hoveredPlot === num ? { background: meta.color, color:'#fff', borderColor: meta.color } : {}}
                    onMouseEnter={() => setHoveredPlot(num)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    whileHover={{ scale:1.05 }}>
                    {num}
                  </motion.span>
                ))}
              </div>
            </div>

            <button
              className="btn btn-green"
              style={{ marginTop:16, width:'100%' }}
              onClick={() => onEnquire({ category: data.label, source:'CATEGORY_ENQUIRY' })}>
              Enquire for {data.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Visual SVG Grid ───────────────────────────────────────────────────────────
function PlotVisualGrid({ summary, onEnquire }) {
  const svgRef = useRef(null)
  const [tip, setTip] = useState(null) // { x, y, label }

  useEffect(() => {
    if (!summary || !svgRef.current) return
    const svg  = svgRef.current
    // Build a flat map of plotNumber → category color
    const colorMap = {}
    const meta = {
      eastFacing:  '#C9A84C',
      westFacing:  '#4A90D9',
      northFacing: '#4CAF74',
      southFacing: '#E24B4A',
      cornerPlots: '#9B7B2E',
    }
    ;['eastFacing','westFacing','northFacing','southFacing','cornerPlots'].forEach(key => {
      const cat = summary[key]
      if (cat?.plotNumbers) cat.plotNumbers.forEach(num => { colorMap[num] = meta[key] })
    })

    const cols=6, pw=118, ph=80, gx=8, gy=8, ox=30, oy=28
    let html = '<rect width="900" height="500" fill="#EAF3DE" rx="8"/>'
    html += '<rect x="20" y="210" width="860" height="52" fill="#D4C5A9" opacity="0.5" rx="4"/>'
    html += '<text x="450" y="241" text-anchor="middle" fill="#8a7a5a" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">Main Road — 60ft Wide</text>'

    const total = summary.totalPlots || 24
    for (let i = 0; i < Math.min(total, 24); i++) {
      const c = i % cols, r = Math.floor(i / cols)
      const x = ox + c * (pw + gx)
      const y = r < 2 ? oy + r * (ph + gy) : oy + r * (ph + gy) + 54
      const num  = `P-${String(i + 1).padStart(3,'0')}`
      const fill = colorMap[num] || 'rgba(30,77,43,0.25)'
      html += `<g class="vp" data-num="${num}" style="cursor:pointer">
        <rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="${fill}" opacity="0.85" rx="6" stroke="white" stroke-width="1.5"/>
        <text x="${x+pw/2}" y="${y+ph/2}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="11" font-weight="600" font-family="DM Sans,sans-serif">${num}</text>
      </g>`
    }
    html += '<rect x="350" y="455" width="200" height="32" fill="#1E4D2B" rx="4"/>'
    html += '<text x="450" y="476" text-anchor="middle" fill="#C9A84C" font-size="13" font-weight="700" font-family="Cormorant Garamond,serif" letter-spacing="2">ENTRANCE</text>'
    svg.innerHTML = html

    svg.querySelectorAll('.vp').forEach(el => {
      const num = el.dataset.num
      el.addEventListener('mouseenter', e => {
        // find which category this plot belongs to
        let catLabel = ''
        ;['eastFacing','westFacing','northFacing','southFacing','cornerPlots'].forEach(k => {
          if (summary[k]?.plotNumbers?.includes(num)) catLabel = summary[k].label
        })
        const r = svg.getBoundingClientRect()
        setTip({ x: e.clientX - r.left + 12, y: e.clientY - r.top - 20, num, catLabel })
      })
      el.addEventListener('mousemove', e => {
        const r = svg.getBoundingClientRect()
        setTip(t => t ? { ...t, x: e.clientX - r.left + 12, y: e.clientY - r.top - 20 } : null)
      })
      el.addEventListener('mouseleave', () => setTip(null))
      el.addEventListener('click', () => {
        let catLabel = ''
        ;['eastFacing','westFacing','northFacing','southFacing','cornerPlots'].forEach(k => {
          if (summary[k]?.plotNumbers?.includes(num)) catLabel = summary[k].label
        })
        onEnquire({ plotNumber: num, category: catLabel, source:'CATEGORY_ENQUIRY' })
      })
    })
  }, [summary])

  return (
    <div className={styles.gridSection}>
      <h3 className={styles.dimTitle}>Interactive Layout Map</h3>
      <p className={styles.gridSubtitle}>Hover any plot to see its category. Click to enquire.</p>
      <div className={styles.gridWrap} style={{ position:'relative' }}>
        <div style={{ overflowX:'auto' }}>
          <svg ref={svgRef} viewBox="0 0 900 500" style={{ display:'block', width:'100%', minWidth:600 }} />
        </div>
        {tip && (
          <div className={styles.tooltip} style={{ left:tip.x, top:tip.y }}>
            <strong>{tip.num}</strong>
            {tip.catLabel && <span>{tip.catLabel}</span>}
          </div>
        )}
        {/* Color legend */}
        <div className={styles.gridLegend}>
          {Object.entries(CATEGORY_META).map(([key, m]) => (
            <div key={key} className={styles.legItem}>
              <div className={styles.legDot} style={{ background: m.color }} />
              <span>{m.label}</span>
            </div>
          ))}
          <div className={styles.legItem}>
            <div className={styles.legDot} style={{ background:'rgba(30,77,43,0.25)' }} />
            <span>Unassigned</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlotGridSkeleton() {
  return (
    <section className="section section-cream" id="plots">
      <div className="sec-hdr">
        <div className="skeleton" style={{ width:120, height:14, marginBottom:10 }} />
        <div className="skeleton" style={{ width:320, height:36, marginBottom:14 }} />
        <div className="skeleton" style={{ width:480, height:20 }} />
      </div>
      <div className={styles.categoryGrid}>
        {[...Array(5)].map((_,i) => (
          <div key={i} className="skeleton" style={{ height:100, borderRadius:16 }} />
        ))}
      </div>
    </section>
  )
}
