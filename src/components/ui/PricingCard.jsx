import styles from './PricingCard.module.css'

/**
 * PricingCard — reusable pricing breakdown for any project.
 * Props: pricing { east, west, corners[], corpus?, note }
 */
export default function PricingCard({ pricing, compact = false }) {
  if (!pricing) return null

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.header}>
        <span className={styles.tag}>PLOT PRICING</span>
        <span className={styles.unit}>per sq. yard</span>
      </div>

      <div className={styles.rows}>
        {/* East */}
        <div className={styles.row}>
          <span className={styles.dir}>
            <span className={styles.dirIcon}>☀</span> East Facing
          </span>
          <span className={styles.rate}>
            <strong>Rs.{pricing.east.base.toLocaleString('en-IN')}</strong>
            <span className={styles.dev}> + Rs.{pricing.east.dev.toLocaleString('en-IN')} Dev.</span>
          </span>
        </div>

        {/* West */}
        <div className={styles.row}>
          <span className={styles.dir}>
            <span className={styles.dirIcon}>🌙</span> West Facing
          </span>
          <span className={styles.rate}>
            <strong>Rs.{pricing.west.base.toLocaleString('en-IN')}</strong>
            <span className={styles.dev}> + Rs.{pricing.west.dev.toLocaleString('en-IN')} Dev.</span>
          </span>
        </div>
      </div>

      {/* Corner charges */}
      <div className={styles.cornerSection}>
        <div className={styles.cornerTitle}>Corner Charges (Extra)</div>
        {pricing.corners.map((c, i) => (
          <div key={i} className={styles.cornerRow}>
            <span className={styles.cornerType}>{c.type}</span>
            <span className={styles.cornerExtra}>{c.label}</span>
          </div>
        ))}
        {pricing.corpus && (
          <div className={styles.cornerRow}>
            <span className={styles.cornerType}>Corpus Fund</span>
            <span className={styles.cornerExtra}>{pricing.corpus.label}</span>
          </div>
        )}
      </div>

      {pricing.note && (
        <p className={styles.note}>* {pricing.note}</p>
      )}
    </div>
  )
}
