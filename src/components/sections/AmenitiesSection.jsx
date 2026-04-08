import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Sections.module.css'

const TABS = ['INFRA', 'LIFESTYLE', 'UTILITIES']

// Amenity label → translation key
const AMENITY_KEY_MAP = {
  'Grand Entrance Arch':         'grandEntranceArch',
  '60ft & 40ft CC Roads':        'roads60ft40ft',
  'BT Roads':                    'btRoads',
  'Compound Wall':               'compoundWall',
  'Security Arch':               'securityArch2',
  'Name & Number Display Board': 'nameBoard2',
  'Drainage System':             'drainageSystem',
  'Underground Electricity':     'undergroundElec',
  'Designed LED Street Lights':  'designedLED',
  'Avenue Plantation':           'avenuePlain',
  'Visitor Parking':             'visitorParking',
  'CRDA Proposed Layout':        'crdaProposedSimple',
  'Modern Park':                 'modernPark',
  'Walking Track':               'walkingTrack',
  "Children's Play Area":        'childrensPlayArea',
  '100% Vastu Compliance':       'complianceVastu',
  'Green Landscaping':           'greenLandscaping',
  'Pure Drinking Water':         'pureWater',
  'Water Tank':                  'waterTank2',
  'Water Pipeline':              'waterPipeline',
  'Electricity':                 'electricity',
  'Gated Security':              'gatedSecurity',
  'Underground Cabling':         'undergroundCabling',
}
function translateAmenity(label, t) {
  const key = AMENITY_KEY_MAP[label]
  if (!key) return label
  const v = t('amenityLabels.' + key)
  return (v && v !== 'amenityLabels.' + key) ? v : label
}

// ── Static fallback amenities (used when API returns nothing) ─────────────────
// Sourced from Layout Amenities attachments (Anjana Paradise / Aparna Legacy)
const FALLBACK_AMENITIES = [
  // ── INFRASTRUCTURE ─────────────────────────────────────────────────────────
  { tab: 'INFRA', icon: '🏛️',  label: 'Grand Entrance Arch',        sortOrder:  1, featured: false },
  { tab: 'INFRA', icon: '🛣️',  label: '60ft & 40ft CC Roads',        sortOrder:  2, featured: false },
  { tab: 'INFRA', icon: '🚧',  label: 'BT Roads',                    sortOrder:  3, featured: false },
  { tab: 'INFRA', icon: '🔒',  label: 'Compound Wall',               sortOrder:  4, featured: false },
  { tab: 'INFRA', icon: '🔐',  label: 'Security Arch',               sortOrder:  5, featured: false },
  { tab: 'INFRA', icon: '🔢',  label: 'Name & Number Display Board', sortOrder:  6, featured: false },
  { tab: 'INFRA', icon: '🌊',  label: 'Drainage System',             sortOrder:  7, featured: false },
  { tab: 'INFRA', icon: '💡',  label: 'Underground Electricity',     sortOrder:  8, featured: false },
  { tab: 'INFRA', icon: '🌙',  label: 'Designed LED Street Lights',  sortOrder:  9, featured: false },
  { tab: 'INFRA', icon: '🌳',  label: 'Avenue Plantation',           sortOrder: 10, featured: false },
  { tab: 'INFRA', icon: '🅿️',  label: 'Visitor Parking',             sortOrder: 11, featured: false },
  { tab: 'INFRA', icon: '✅',  label: 'CRDA Proposed Layout',        sortOrder: 12, featured: false },

  // ── LIFESTYLE ──────────────────────────────────────────────────────────────
  { tab: 'LIFESTYLE', icon: '🏞️',  label: 'Modern Park',             sortOrder:  1, featured: false },
  { tab: 'LIFESTYLE', icon: '🚶',  label: 'Walking Track',            sortOrder:  2, featured: false },
  { tab: 'LIFESTYLE', icon: '🛝',  label: "Children's Play Area",     sortOrder:  3, featured: false },
  { tab: 'LIFESTYLE', icon: '🕉️',  label: '100% Vastu Compliance',   sortOrder:  4, featured: false },
  { tab: 'LIFESTYLE', icon: '🌿',  label: 'Green Landscaping',        sortOrder:  5, featured: false },

  // ── UTILITIES ──────────────────────────────────────────────────────────────
  { tab: 'UTILITIES', icon: '💧',  label: 'Pure Drinking Water',      sortOrder:  1, featured: false },
  { tab: 'UTILITIES', icon: '🚰',  label: 'Water Tank',               sortOrder:  2, featured: false },
  { tab: 'UTILITIES', icon: '🚿',  label: 'Water Pipeline',           sortOrder:  3, featured: false },
  { tab: 'UTILITIES', icon: '⚡',  label: 'Electricity',              sortOrder:  4, featured: false },
  { tab: 'UTILITIES', icon: '🔐',  label: 'Gated Security',           sortOrder:  5, featured: false },
  { tab: 'UTILITIES', icon: '🌐',  label: 'Underground Cabling',      sortOrder:  6, featured: false },
]

/**
 * FeaturedAmenity — full-width highlighted card.
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
 *
 * Falls back to FALLBACK_AMENITIES when API returns nothing.
 */
export default function AmenitiesSection({ content }) {
  const [tab, setTab] = useState('INFRA')
  const { t } = useLanguage()

  const TAB_LABELS = {
    INFRA:     t('amenities.infra'),
    LIFESTYLE: t('amenities.lifestyle'),
    UTILITIES: t('amenities.utilities'),
  }

  // Always use static fallback — API amenities data is overridden by curated list
  const all   = FALLBACK_AMENITIES
  const items = all.filter((a) => a.tab === tab).sort((a, b) => a.sortOrder - b.sortOrder)

  // Count per tab for the badge
  const countByTab = TABS.reduce((acc, tabKey) => {
    acc[tabKey] = all.filter((a) => a.tab === tabKey).length
    return acc
  }, {})

  return (
    <section className="section section-cream" id="amenities">
      <div className="sec-hdr">
        <div className="sec-tag">{t('sections.whatWeOffer') || 'What We Offer'}</div>
        <h2 className="sec-title">{t('sections.amenities').split(' ').slice(0, -1).join(' ')} <em>{t('sections.amenities').split(' ').slice(-1)}</em></h2>
        <p className="sec-sub">{t('sections.amenitiesSub') || 'Every detail crafted for a refined, future-ready lifestyle.'}</p>
      </div>

      {/* ── Tab selector ────────────────────────────────────────────────── */}
      <div className={styles.amTabs}>
        {TABS.map((tabKey) => (
          <button
            key={tabKey}
            className={`${styles.amTab} ${tab === tabKey ? styles.amTabActive : ''}`}
            onClick={() => setTab(tabKey)}
          >
            {TAB_LABELS[tabKey]}
            <span className={`${styles.amTabCount} ${tab === tabKey ? styles.amTabCountActive : ''}`}>
              {countByTab[tabKey]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Amenity grid ────────────────────────────────────────────────── */}
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
                <span>{translateAmenity(item.label, t)}</span>
              </motion.div>
            ),
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
