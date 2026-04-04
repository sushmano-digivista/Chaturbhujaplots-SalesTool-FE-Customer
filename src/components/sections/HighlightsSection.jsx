import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Sections.module.css'

export default function HighlightsSection({ content }) {
  const { t } = useLanguage()
  const highlights = (content?.highlights || []).sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section className={`section ${styles.hlSec}`} id="highlights">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-light)' }}>Why Chaturbhuja</div>
        <h2 className="sec-title" style={{ color: '#fff' }}>
          {t('sections.highlights').split(' ').slice(0, -1).join(' ')} <em>{t('sections.highlights').split(' ').slice(-1)}</em>
        </h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Four premium ventures across the Krishna–NTR–Guntur corridor — each APCRDA approved, RERA registered, 100% clear title.
        </p>
      </div>

      <div className={styles.hlGrid}>
        {highlights.map((h, i) => (
          <motion.div
            key={h.title}
            className={styles.hlCard}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.hlIcon}>{h.icon}</div>
            <h4 className={styles.hlTitle}>{h.title}</h4>
            <p className={styles.hlDesc}>{h.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
