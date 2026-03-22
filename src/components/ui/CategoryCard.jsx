import { motion, AnimatePresence } from 'framer-motion'
import styles from './PlotGrid.module.css'

/**
 * CategoryCard — expandable card showing a plot category count.
 * Clicking the card toggles a list of individual plot numbers and an enquire CTA.
 *
 * Props:
 *   meta          { icon, label, color, bg }
 *   data          { label, description, count, priceFrom, plotNumbers }
 *   isOpen        boolean
 *   onToggle      () => void
 *   onEnquire     (ctx) => void
 *   hoveredPlot   string | null
 *   setHoveredPlot (num) => void
 */
export default function CategoryCard({
  meta,
  data,
  isOpen,
  onToggle,
  onEnquire,
  hoveredPlot,
  setHoveredPlot,
}) {
  return (
    <motion.div
      className={`${styles.catCard} ${isOpen ? styles.catCardOpen : ''}`}
      layout
      style={{ borderColor: isOpen ? meta.color : 'rgba(30,77,43,0.1)' }}
    >
      {/* Header — always visible */}
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
        <motion.div className={styles.chevron} animate={{ rotate: isOpen ? 180 : 0 }}>
          ▾
        </motion.div>
      </div>

      {/* Expanded panel — plot number chips + enquire button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.catExpanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.plotNumsWrap}>
              <p className={styles.plotNumsTitle}>{data.count} plots in this category:</p>
              <div className={styles.plotNums}>
                {data.plotNumbers?.map((num) => (
                  <motion.span
                    key={num}
                    className={`${styles.plotChip} ${hoveredPlot === num ? styles.plotChipHover : ''}`}
                    style={
                      hoveredPlot === num
                        ? { background: meta.color, color: '#fff', borderColor: meta.color }
                        : {}
                    }
                    onMouseEnter={() => setHoveredPlot(num)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {num}
                  </motion.span>
                ))}
              </div>
            </div>

            <button
              className="btn btn-green"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => onEnquire({ category: data.label, source: 'CATEGORY_ENQUIRY' })}
            >
              Enquire for {data.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
