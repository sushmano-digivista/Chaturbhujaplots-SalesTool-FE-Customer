import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PortfolioSection.module.css'

// ── Project data ──────────────────────────────────────────────────────────────
const ACTIVE_PROJECTS = [
  {
    id: 'anjana', name: 'Anjana Paradise', loc: 'Paritala, Near Amaravati',
    accentClass: 'accentGold',
    available: 14, total: 242, starting: 'Rs.23.9L',
    tag: 'Featured',
    approvals: ['CRDA Proposed', 'AP RERA', 'Clear Title', 'Vaasthu'],
    highlights: ['Adjacent to NH-16', '8 km from Amaravati', 'Ready to Build', 'Avenue Lined Roads'],
    description: 'Premium plots in AP\'s fastest-growing capital corridor — avenue-lined roads, 24/7 utilities, ready for immediate construction.',
  },
  {
    id: 'trimbak', name: 'Trimbak Oaks', loc: 'Penamaluru, Near Vijayawada',
    accentClass: 'accentGreen',
    available: 18, total: 48, starting: 'Rs.28L',
    tag: 'New Launch',
    approvals: ['CRDA Approved', 'RERA Registered', 'Clear Title'],
    highlights: ['5 km from Vijayawada', 'NH-16 Access', 'Gated Security', 'Water & Electricity'],
    description: 'Gated community plots offering excellent connectivity to Vijayawada city with all modern amenities.',
  },
  {
    id: 'aparna', name: 'Aparna Legacy', loc: 'Chevitikallu',
    accentClass: 'accentBlue',
    available: 16, total: 28, starting: 'Rs.26L',
    tag: 'Limited',
    approvals: ['CRDA Approved', 'Vaastu Compliant', 'East-Facing'],
    highlights: ['East-Facing Plots', 'Park Facing Options', 'Corner Plots Available', 'Water & Electricity'],
    description: 'Vastu-compliant east-facing plots with park-facing options — perfect for families seeking a serene lifestyle.',
  },
  {
    id: 'varaha', name: 'Varaha Virtue', loc: 'Pamarru, Near NH-16',
    accentClass: 'accentOrange',
    available: 20, total: 32, starting: 'Rs.25L',
    tag: 'Hot',
    approvals: ['CRDA Approved', 'NH-16 Access', 'Industrial Corridor'],
    highlights: ['Direct NH-16 Access', 'Industrial Corridor Zone', 'Gated Security 24/7', 'Jogging Track'],
    description: 'Strategic investment opportunity on the NH-16 industrial corridor — high appreciation potential.',
  },
]

const COMPLETED_PROJECTS = [
  { name: 'Nandana Vihar', loc: 'Kanumuru',   year: '2022', plots: 64  },
  { name: 'County',        loc: 'Edupugallu',  year: '2021', plots: 48  },
  { name: 'Pearl',         loc: 'Kankipadu',   year: '2020', plots: 36  },
  { name: 'Empire',        loc: 'Penamaluru',  year: '2019', plots: 72  },
  { name: 'Pride',         loc: 'Nepalli',     year: '2018', plots: 42  },
  { name: 'Prime',         loc: 'Kankipadu',   year: '2017', plots: 55  },
]

const STATS = [
  { value: '10+',   label: 'Projects Delivered' },
  { value: '1000+', label: 'Happy Families'      },
  { value: '15+',   label: 'Years of Trust'      },
  { value: '100%',  label: 'CRDA / RERA'         },
]

// ── Availability progress ring ────────────────────────────────────────────────
function AvailRing({ available, total }) {
  const pct  = Math.round((available / total) * 100)
  const sold = total - available
  const r = 26, circ = 2 * Math.PI * r
  const dash = (available / total) * circ

  return (
    <div className={styles.ring}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        {/* Track */}
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        {/* Available arc */}
        <circle cx="32" cy="32" r={r} fill="none"
          stroke="#4CAF74" strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
      </svg>
      <div className={styles.ringInner}>
        <div className={styles.ringNum}>{available}</div>
        <div className={styles.ringLabel}>left</div>
      </div>
    </div>
  )
}

// ── Expanded project detail panel ─────────────────────────────────────────────
function ProjectDetail({ proj, onEnquire, onClose }) {
  return (
    <motion.div
      className={styles.detailOverlay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className={`${styles.detailPanel} ${styles[proj.accentClass]}`}
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      >
        {/* Top bar */}
        <div className={styles.detailTop}>
          <div>
            <div className={styles.detailTag}>{proj.tag}</div>
            <h3 className={styles.detailName}>{proj.name}</h3>
            <div className={styles.detailLoc}>📍 {proj.loc}</div>
          </div>
          <button className={styles.detailClose} onClick={onClose}>✕</button>
        </div>

        {/* Stats row */}
        <div className={styles.detailStats}>
          <div className={styles.detailStat}>
            <AvailRing available={proj.available} total={proj.total} />
          </div>
          <div className={styles.detailStatCol}>
            <div className={styles.dStatVal}>{proj.available} / {proj.total}</div>
            <div className={styles.dStatLab}>Plots Available</div>
          </div>
          <div className={styles.detailStatDivider} />
          <div className={styles.detailStatCol}>
            <div className={styles.dStatVal}>{proj.starting}</div>
            <div className={styles.dStatLab}>Starting Price</div>
          </div>
        </div>

        {/* Description */}
        <p className={styles.detailDesc}>{proj.description}</p>

        {/* Approvals */}
        <div className={styles.detailSection}>
          <div className={styles.detailSectionLabel}>Approvals</div>
          <div className={styles.detailChips}>
            {proj.approvals.map((a) => (
              <span key={a} className={styles.detailChip}>{a}</span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className={styles.detailSection}>
          <div className={styles.detailSectionLabel}>Highlights</div>
          <div className={styles.detailHlGrid}>
            {proj.highlights.map((h) => (
              <div key={h} className={styles.detailHl}>
                <span className={styles.detailHlCheck}>✓</span>{h}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.detailActions}>
          <button className="btn btn-gold"
            onClick={() => onEnquire({ source: 'PORTFOLIO_DETAIL', label: `Enquire — ${proj.name}`, category: proj.name })}>
            Enquire for This Project →
          </button>
          <button className={styles.detailWa}
            onClick={() => window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I am interested in ${proj.name} at ${proj.loc}. Please share details.`)}`, '_blank')}>
            💬 Chat on WhatsApp
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Active project card ───────────────────────────────────────────────────────
function ActiveCard({ proj, index, onSelect }) {
  const soldPct = Math.round(((proj.total - proj.available) / proj.total) * 100)

  return (
    <motion.div
      className={`${styles.activeCard} ${styles[proj.accentClass]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{ y: -5 }}
      onClick={() => onSelect(proj)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(proj)}
    >
      {/* Accent bar */}
      <div className={styles.accentBar} />

      {/* Tag + Ring */}
      <div className={styles.cardTopRow}>
        <span className={`${styles.cardTag} ${styles[`tag_${proj.accentClass}`]}`}>{proj.tag}</span>
        <AvailRing available={proj.available} total={proj.total} />
      </div>

      {/* Name & location */}
      <div className={styles.cardName}>{proj.name}</div>
      <div className={styles.cardLoc}>📍 {proj.loc}</div>

      {/* Progress bar */}
      <div className={styles.progWrap}>
        <div className={styles.progBar}>
          <motion.div
            className={styles.progFill}
            initial={{ width: 0 }}
            whileInView={{ width: `${soldPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className={styles.progLabels}>
          <span>{proj.total - proj.available} sold</span>
          <span>{proj.available} left of {proj.total}</span>
        </div>
      </div>

      {/* Approval chips */}
      <div className={styles.cardChips}>
        {proj.approvals.slice(0, 3).map((a) => (
          <span key={a} className={styles.cardChip}>{a}</span>
        ))}
      </div>

      {/* Price + CTA */}
      <div className={styles.cardFooter}>
        <div>
          <div className={styles.cardPriceLabel}>Starting from</div>
          <div className={styles.cardPrice}>{proj.starting}</div>
        </div>
        <div className={styles.cardCta}>View Details →</div>
      </div>
    </motion.div>
  )
}

// ── Completed project card ────────────────────────────────────────────────────
function CompletedCard({ proj, index }) {
  return (
    <motion.div
      className={styles.compCard}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2 }}
    >
      <div className={styles.compStamp}>SOLD OUT</div>
      <div className={styles.compName}>{proj.name}</div>
      <div className={styles.compLoc}>📍 {proj.loc}</div>
      <div className={styles.compMeta}>
        <span>{proj.plots} plots</span>
        <span>·</span>
        <span>Delivered {proj.year}</span>
      </div>
      <div className={styles.compBadge}>✓ Completed · Fully Sold</div>
    </motion.div>
  )
}

// ── Main PortfolioSection ─────────────────────────────────────────────────────
export default function PortfolioSection({ content, onEnquire }) {
  const [selected, setSelected] = useState(null)

  const portfolioStats = content?.portfolio?.stats || STATS
  const active         = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed      = content?.portfolio?.completed
    ? content.portfolio.completed.map((p, i) => ({ ...p, year: '2022', plots: 48 - i * 6, ...p }))
    : COMPLETED_PROJECTS

  return (
    <section className={styles.portSec} id="portfolio">
      {/* Header */}
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Our Portfolio</div>
        <h2 className="sec-title light">A Legacy of <em>Excellence</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.6)' }}>
          10+ projects delivered across the Krishna–Guntur corridor — 1000+ families settled, 100% CRDA &amp; RERA approved.
        </p>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {portfolioStats.map((s, i) => (
          <motion.div key={s.label} className={styles.statItem}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <div className={styles.statVal}>{s.value}</div>
            <div className={styles.statLab}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Open for Booking ──────────────────────────────────── */}
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <div className={styles.blockDot} style={{ background: '#F6C347' }} />
          <h3 className={styles.blockTitle}>Open for Booking</h3>
          <span className={styles.blockCount}>{active.length} projects</span>
        </div>

        <div className={styles.activeGrid}>
          {active.map((proj, i) => (
            <ActiveCard key={proj.id} proj={proj} index={i} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* ── Completed ─────────────────────────────────────────── */}
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <div className={styles.blockDot} style={{ background: '#4CAF74' }} />
          <h3 className={styles.blockTitle}>Completed &amp; Delivered</h3>
          <span className={styles.blockCount}>{completed.length} projects · {completed.reduce((a, p) => a + (p.plots || 48), 0)}+ plots</span>
        </div>

        <div className={styles.compGrid}>
          {completed.map((p, i) => (
            <CompletedCard key={p.name} proj={p} index={i} />
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectDetail
            proj={selected}
            onEnquire={(ctx) => { onEnquire(ctx); setSelected(null) }}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
