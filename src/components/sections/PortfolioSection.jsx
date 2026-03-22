import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Sections.module.css'

const ACTIVE_PROJECTS = [
  {
    id: 'anjana', name: 'Anjana Paradise', loc: 'Paritala, Near Amaravati',
    color: 'c1', available: 14, total: 242, starting: 'Rs.23.9L',
    approvals: ['CRDA Proposed', 'AP RERA', 'Clear Title', 'Vaasthu'],
    highlights: ['Adjacent to NH-16', '8km from Amaravati', 'Ready to Build', 'Avenue Lined Roads'],
  },
  {
    id: 'trimbak', name: 'Trimbak Oaks', loc: 'Penamaluru, Near Vijayawada',
    color: 'c2', available: 18, total: 48, starting: 'Rs.28L',
    approvals: ['CRDA Approved', 'RERA Registered', 'Clear Title'],
    highlights: ['5km from Vijayawada', 'NH-16 Access', 'Gated Security', 'Water & Electricity'],
  },
  {
    id: 'aparna', name: 'Aparna Legacy', loc: 'Chevitikallu',
    color: 'c3', available: 16, total: 28, starting: 'Rs.26L',
    approvals: ['CRDA Approved', 'Vaastu Compliant', 'East-Facing'],
    highlights: ['East-Facing Plots', 'Park Facing Options', 'Corner Plots Available', 'Water & Electricity'],
  },
  {
    id: 'varaha', name: 'Varaha Virtue', loc: 'Pamarru, Near NH-16',
    color: 'c4', available: 20, total: 32, starting: 'Rs.25L',
    approvals: ['CRDA Approved', 'NH-16 Access', 'Industrial Corridor'],
    highlights: ['Direct NH-16 Access', 'Industrial Corridor Zone', 'Gated Security 24/7', 'Jogging Track'],
  },
]

const COMPLETED_PROJECTS = [
  { name: 'Nandana Vihar', loc: 'Kanumuru'  },
  { name: 'County',        loc: 'Edupugallu' },
  { name: 'Pearl',         loc: 'Kankipadu'  },
  { name: 'Empire',        loc: 'Penamaluru' },
  { name: 'Pride',         loc: 'Nepalli'    },
  { name: 'Prime',         loc: 'Kankipadu'  },
]

/**
 * ProjectCard — individual project card inside the Portfolio section.
 */
function ProjectCard({ proj, delay, onEnquire }) {
  return (
    <motion.div
      className={`${styles.portCard} ${styles[proj.color]}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ translateY: -4 }}
    >
      <div className={styles.pcHeader}>
        <div>
          <div className={styles.pcName}>{proj.name}</div>
          <div className={styles.pcLoc}>📍 {proj.loc}</div>
        </div>
        <div className={styles.pcBadge}>
          <span className={styles.pcDot} /> {proj.available} Available
        </div>
      </div>
      <div className={styles.pcApprovals}>
        {proj.approvals.map((a) => <span key={a} className={styles.pcTag}>{a}</span>)}
      </div>
      <div className={styles.pcHighlights}>
        {proj.highlights.map((h) => <div key={h} className={styles.pcHl}>{h}</div>)}
      </div>
      <div className={styles.pcPrice}>Starting from <strong>{proj.starting}</strong></div>
      <button
        className={styles.pcViewBtn}
        onClick={() => onEnquire({ source: 'PORTFOLIO_CARD', label: `Enquire — ${proj.name}`, category: proj.name })}
      >
        View Project & Enquire →
      </button>
    </motion.div>
  )
}

/**
 * PortfolioSection — tabbed overview of active + completed projects.
 * Props:
 *   content   { portfolio: { stats, active, completed } }
 *   onEnquire (ctx) => void
 */
export default function PortfolioSection({ content, onEnquire }) {
  const [tab, setTab] = useState('booking')

  const portfolioStats = content?.portfolio?.stats || [
    { value: '10+',   label: 'Projects' },
    { value: '1000+', label: 'Families' },
    { value: '15+',   label: 'Years'    },
    { value: '100%',  label: 'Approved' },
  ]
  const active    = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed = content?.portfolio?.completed || COMPLETED_PROJECTS

  return (
    <section className={`section ${styles.portSec}`} id="portfolio">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Our Projects</div>
        <h2 className="sec-title light">A Legacy of <em>Excellence</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.65)' }}>
          10+ projects delivered across the Krishna–Guntur corridor, with 1000+ families settled and 100% CRDA/RERA approved.
        </p>
      </div>

      {/* Stats bar */}
      <div className={styles.portStats}>
        {portfolioStats.map((s) => (
          <div key={s.label} className={styles.ps}>
            <div className={styles.psNum}>{s.value}</div>
            <div className={styles.psLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.portTabs}>
        <button
          className={`${styles.portTab} ${tab === 'booking' ? styles.portTabActive : ''}`}
          onClick={() => setTab('booking')}
        >
          🟡 Open for Booking ({active.length})
        </button>
        <button
          className={`${styles.portTab} ${tab === 'done' ? styles.portTabActive : ''}`}
          onClick={() => setTab('done')}
        >
          ✅ Completed ({completed.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'booking' ? (
          <motion.div
            key="booking"
            className={styles.portGrid}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {active.map((proj, i) => (
              <ProjectCard key={proj.id} proj={proj} delay={i * 0.07} onEnquire={onEnquire} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            className={styles.compGrid}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {completed.map((p) => (
              <div key={p.name} className={styles.compCard}>
                <div className={styles.compName}>{p.name}</div>
                <div className={styles.compLoc}>📍 {p.loc}</div>
                <span className={styles.compBadge}>✓ Completed · Fully Sold</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
