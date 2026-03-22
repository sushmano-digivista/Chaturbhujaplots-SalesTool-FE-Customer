import { useState } from 'react'
import { motion }   from 'framer-motion'
import { Sun, Sunset, ArrowUp, ArrowDown, Maximize2 } from 'lucide-react'

import { usePlotSummary }  from '@/hooks/useData'
import CategoryCard        from '@/components/ui/CategoryCard'
import PlotVisualGrid      from '@/components/ui/PlotVisualGrid'
import styles              from './PlotGrid.module.css'

/**
 * Metadata (icon, colour, bg tint) for each plot category key.
 * Kept here so PlotGrid owns the visual identity of its categories.
 */
const CATEGORY_META = {
  eastFacing:  { icon: <Sun       size={18} />, label: 'East-Facing',  color: '#C9A84C', bg: 'rgba(201,168,76,0.12)'  },
  westFacing:  { icon: <Sunset    size={18} />, label: 'West-Facing',  color: '#4A90D9', bg: 'rgba(74,144,217,0.12)'  },
  northFacing: { icon: <ArrowUp   size={18} />, label: 'North-Facing', color: '#4CAF74', bg: 'rgba(76,175,116,0.12)'  },
  southFacing: { icon: <ArrowDown size={18} />, label: 'South-Facing', color: '#E24B4A', bg: 'rgba(226,75,74,0.12)'   },
  cornerPlots: { icon: <Maximize2 size={18} />, label: 'Corner Plots', color: '#9B7B2E', bg: 'rgba(155,123,46,0.12)'  },
}

/**
 * PlotGrid — full "Explore Available Plots" section.
 * Orchestrates:
 *   - CategoryCard (src/components/ui/CategoryCard.jsx)
 *   - PlotVisualGrid (src/components/ui/PlotVisualGrid.jsx)
 *
 * Props:
 *   onEnquire  (ctx) => void
 */
export default function PlotGrid({ onEnquire }) {
  const { data: summary, isLoading } = usePlotSummary()
  const [activeCategory, setActiveCategory] = useState(null)
  const [hoveredPlot,    setHoveredPlot]    = useState(null)

  if (isLoading) return <PlotGridSkeleton />

  const categories = summary
    ? [
        { key: 'eastFacing',  data: summary.eastFacing  },
        { key: 'westFacing',  data: summary.westFacing  },
        { key: 'northFacing', data: summary.northFacing },
        { key: 'southFacing', data: summary.southFacing },
        { key: 'cornerPlots', data: summary.cornerPlots },
      ]
    : []

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

      {/* Category cards — each one is a reusable <CategoryCard /> */}
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
            {summary.byDimension.map((d) => (
              <motion.div
                key={d.dimension}
                className={styles.dimCard}
                whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(30,77,43,0.12)' }}
              >
                <div className={styles.dimNum}>{d.count}</div>
                <div className={styles.dimLabel}>{d.dimension} ft</div>
                <div className={styles.dimArea}>{d.areaLabel}</div>
                <div className={styles.dimPrice}>From {d.priceFrom}</div>
                <button
                  className={`btn btn-green btn-sm ${styles.dimBtn}`}
                  onClick={() => onEnquire({ category: d.dimension, source: 'CATEGORY_ENQUIRY' })}
                >
                  Enquire
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SVG layout map — reusable <PlotVisualGrid /> */}
      <PlotVisualGrid summary={summary} onEnquire={onEnquire} />
    </section>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function PlotGridSkeleton() {
  return (
    <section className="section section-cream" id="plots">
      <div className="sec-hdr">
        <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 320, height: 36, marginBottom: 14 }} />
        <div className="skeleton" style={{ width: 480, height: 20 }} />
      </div>
      <div className={styles.categoryGrid}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
        ))}
      </div>
    </section>
  )
}
