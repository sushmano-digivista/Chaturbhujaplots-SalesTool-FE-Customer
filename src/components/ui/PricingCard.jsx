import styles from './PricingCard.module.css'
import { useLanguage } from '@/context/LanguageContext'

export default function PricingCard({ pricing, compact = false, dark = false }) {
  const { t, language } = useLanguage()
  const isTe = language === 'te'
  if (!pricing) return null

  const tv = (key, fallback) => { const v = t(key); return (v && v !== key) ? v : fallback }

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''} ${dark ? styles.dark : ''}`}>
      <div className={styles.header}>
        <span className={styles.tag}>{tv('project.plotPricing', 'PLOT PRICING')}</span>
        <span className={styles.unit}>{tv('project.perSqYard', 'per sq. yard')}</span>
      </div>

      <div className={styles.rows}>
        {/* East */}
        <div className={styles.row}>
          <span className={styles.dir}>
            <span className={styles.dirIcon}>☀</span> {tv('facings.east', 'East Facing')}
          </span>
          <span className={styles.rate}>
            <strong>Rs.{pricing.east.base.toLocaleString('en-IN')}</strong>
            <span className={styles.dev}> + Rs.{pricing.east.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')}</span>
          </span>
        </div>

        {/* West */}
        <div className={styles.row}>
          <span className={styles.dir}>
            <span className={styles.dirIcon}>🌙</span> {tv('facings.west', 'West Facing')}
          </span>
          <span className={styles.rate}>
            <strong>Rs.{pricing.west.base.toLocaleString('en-IN')}</strong>
            <span className={styles.dev}> + Rs.{pricing.west.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')}</span>
          </span>
        </div>
      </div>

      {/* Corner charges */}
      <div className={styles.cornerSection}>
        <div className={styles.cornerTitle}>{tv('project.cornerCharges', 'Corner Charges (Extra)')}</div>
        {pricing.corners.map((c, i) => {
          const CORNER_MAP = {
            'North-East Corner': tv('project.cornerNE', 'North-East Corner'),
            'Other Corners':     tv('project.cornerOther', 'Other Corners'),
          }
          return (
            <div key={i} className={styles.cornerRow}>
              <span className={styles.cornerType}>{CORNER_MAP[c.type] || c.type}</span>
              <span className={styles.cornerExtra}>{c.label}</span>
            </div>
          )
        })}
        {pricing.corpus && (
          <div className={styles.cornerRow}>
            <span className={styles.cornerType}>{tv('project.corpusFund', 'Corpus Fund')}</span>
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
