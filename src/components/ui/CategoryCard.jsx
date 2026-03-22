import { motion, AnimatePresence } from 'framer-motion'
import styles from '../sections/PlotGrid.module.css'

export default function CategoryCard({ meta, data, isOpen, onToggle, onEnquire, hoveredPlot, setHoveredPlot }) {
  return (
    <motion.div
      className={`${styles.catCard} ${isOpen ? styles.catCardOpen : ''}`}
      layout
      style={{ borderColor: isOpen ? meta.color : 'rgba(30,77,43,0.1)' }}
    >
      {/* Header row */}
      <div className={styles.catHeader}>
        <div className={styles.catIconWrap} style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </div>
        <div className={styles.catInfo}>
          <div className={styles.catLabel}>{data.label}</div>
          <div className={styles.catDesc}>{data.description}</div>
        </div>
        <div className={styles.catRight}>
          <div className={styles.catCount} style={{ color: meta.color }}>{data.count}</div>
          <div className={styles.catCountLabel}>PLOTS</div>
          {data.priceFrom !== '—' && (
            <div className={styles.catPrice}>from {data.priceFrom}</div>
          )}
        </div>

        {/* Arrow toggle button */}
        <motion.button
          className={styles.chevronBtn}
          onClick={onToggle}
          animate={{ rotate: isOpen ? 180 : 0 }}
          whileHover={{ scale: 1.15, backgroundColor: isOpen ? meta.color : 'rgba(30,77,43,0.08)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            background: isOpen ? meta.color : 'rgba(30,77,43,0.05)',
            color: isOpen ? '#fff' : meta.color,
          }}
          aria-label={isOpen ? 'Collapse' : 'Expand plot list'}
        >
          ▾
        </motion.button>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.catExpanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.plotNumsWrap}>
              <p className={styles.plotNumsTitle}>{data.count} plots in this category:</p>
              <div className={styles.plotNums}>
                {data.plotNumbers?.map((num) => (
                  <motion.span
                    key={num}
                    className={styles.plotChip}
                    style={hoveredPlot === num ? { background: meta.color, color: '#fff', borderColor: meta.color } : {}}
                    onMouseEnter={() => setHoveredPlot(num)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {num}
                  </motion.span>
                ))}
              </div>
            </div>

            <button
              className="btn btn-green"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => onEnquire({
                source: 'CATEGORY_ENQUIRY', label: 'Enquire About Plot',
                type: 'PLOT_ENQUIRY', category: data.label,
                plotSize: data.label, venture: data.venture,
              })}
            >
              Enquire for {data.label}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
