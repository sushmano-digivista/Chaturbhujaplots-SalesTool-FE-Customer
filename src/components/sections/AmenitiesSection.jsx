import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Sections.module.css'

const TABS       = ['INFRA', 'LIFESTYLE', 'UTILITIES']
const TAB_LABELS = { INFRA: 'Infrastructure', LIFESTYLE: 'Lifestyle', UTILITIES: 'Utilities' }

/**
 * FeaturedAmenity — full-width card for a highlighted amenity item.
 */
function FeaturedAmenity({ item, delay }) {
  return (
    <motion.div
      className={styles.featCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ borderColor: 'var(--gold)', boxShadow: 'var(--shadow)' }}
    >
      <div className={styles.featIcon}>{item.icon}</div>
      <div>
        <div className={styles.featTitle}>{item.label}</div>
        <div className={styles.featDesc}>{item.featuredDesc}</div>
      </div>
      <span className={styles.featBadge}>Nearby</span>
    </motion.div>
  )
}

/**
 * AmenitiesSection — tabbed grid of infrastructure, lifestyle and utility amenities.
 * Props:
 *   content  { amenities: Array<{ tab, icon, label, sortOrder, featured, featuredDesc? }> }
 */
export default function AmenitiesSection({ content }) {
  const [tab, setTab] = useState('INFRA')
  const all   = content?.amenities || []
  const items = all.filter((a) => a.tab === tab).sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section className="section section-cream" id="amenities">
      <div className="sec-hdr">
        <div className="sec-tag">What We Offer</div>
        <h2 className="sec-title">World-Class <em>Amenities</em></h2>
        <p className="sec-sub">Every detail crafted for a refined, future-ready lifestyle.</p>
      </div>

      <div className={styles.amTabs}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`${styles.amTab} ${tab === t ? styles.amTabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className={styles.amGrid}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {items.map((item, i) =>
            item.featured ? (
              <FeaturedAmenity key={item.label} item={item} delay={i * 0.05} />
            ) : (
              <motion.div
                key={item.label}
                className={styles.amItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ borderColor: 'var(--gold)', boxShadow: 'var(--shadow)' }}
              >
                <div className={styles.amIcon}>{item.icon}</div>
                <span>{item.label}</span>
              </motion.div>
            ),
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
