import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Sections.module.css'

const DEFAULT_STATS = [
  { value: '10×',  label: 'Expected Return' },
  { value: '5–7',  label: 'Years Horizon'   },
  { value: 'Safe', label: 'CRDA + RERA'     },
]

/**
 * QuoteSection — investment-opportunity banner with headline and stat pills.
 * Props:
 *   content   { quote: { investLine1, investLine2, quote, stats } }
 *   onEnquire (ctx) => void
 */
export default function QuoteSection({ content, onEnquire }) {
  const { t } = useLanguage()
  const q = content?.quote || {}

  return (
    <section className={`section ${styles.quoteSec}`}>
      <motion.div
        className={styles.quoteInner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.quoteTag}>{t('sections.investmentOpportunity') || 'Investment Opportunity'}</span>

        <h2 className={styles.quoteH}>{q.investLine1 || 'Invest ₹2 Today —'}</h2>
        <h2 className={styles.quoteH}>{q.investLine2 || 'Receive ₹20 Tomorrow'}</h2>

        <div className={styles.quoteDivider} />

        <p className={styles.quoteText}>
          &ldquo;{q.quote || 'If you invest 2 rupees now, in a few years it will be 10 times your investment.'}&rdquo;
        </p>

        <div className={styles.quoteStats}>
          {(q.stats || DEFAULT_STATS).map((s) => {
            const STAT_KEYS = {
              'Expected Return': 'quote.expectedReturn',
              'Years Horizon':   'quote.yearsHorizon',
              'CRDA + RERA':     'quote.crdaRera',
            }
            const k = STAT_KEYS[s.label]; const v = t(k || '')
            return (
            <div key={s.label} className={styles.quoteStat}>
              <div className={styles.quoteStatNum}>{s.value}</div>
              <div className={styles.quoteStatLabel}>{(v && v !== k) ? v : s.label}</div>
            </div>
            )
          })}
        </div>

        <button
          className="btn btn-gold"
          onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Secure Plot' })}
        >
          {t('quote.ctaBook')} →
        </button>
      </motion.div>
    </section>
  )
}
