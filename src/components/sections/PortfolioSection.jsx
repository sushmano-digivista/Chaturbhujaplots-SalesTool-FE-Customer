import { useNavigate }  from 'react-router-dom'
import { motion }        from 'framer-motion'
import { ACTIVE_PROJECTS, COMPLETED_PROJECTS } from '@/constants/projects'
import styles from './PortfolioSection.module.css'

const STATS = [
  { value: '10+',   label: 'Projects Delivered' },
  { value: '1000+', label: 'Happy Families'      },
  { value: '15+',   label: 'Years of Trust'      },
  { value: '100%',  label: 'CRDA / RERA'         },
]

// ── Availability ring ─────────────────────────────────────────────────────────
function AvailRing({ available, total }) {
  const r = 26, circ = 2 * Math.PI * r
  const dash = (available / total) * circ
  return (
    <div className={styles.ring}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none"
          stroke="#4CAF74" strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round" />
      </svg>
      <div className={styles.ringInner}>
        <div className={styles.ringNum}>{available}</div>
        <div className={styles.ringLabel}>left</div>
      </div>
    </div>
  )
}

// ── Facing mini-pills ─────────────────────────────────────────────────────────
function FacingPills({ facings }) {
  if (!facings) return null
  const pills = [
    { label: 'East',   value: facings.east,   color: '#C9A84C' },
    { label: 'West',   value: facings.west,   color: '#4A90D9' },
    { label: 'Corner', value: facings.corner, color: '#9B7B2E' },
  ].filter((p) => p.value > 0)
  return (
    <div className={styles.facingPills}>
      {pills.map((p) => (
        <span key={p.label} className={styles.facingPill}
          style={{ borderColor: p.color, color: p.color }}>
          {p.value} {p.label}
        </span>
      ))}
    </div>
  )
}

// ── Active project card ───────────────────────────────────────────────────────
function ActiveCard({ proj, index }) {
  const navigate = useNavigate()
  return (
    <motion.div
      className={`${styles.activeCard} ${styles[proj.accentClass]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.accentBar} />
      <div className={styles.cardTopRow}>
        <span className={`${styles.cardTag} ${styles[`tag_${proj.accentClass}`]}`}>{proj.tag}</span>
        <AvailRing available={proj.available} total={proj.total} />
      </div>
      <div className={styles.cardName}>{proj.name}</div>
      <div className={styles.cardLoc}>📍 {proj.loc}</div>
      <FacingPills facings={proj.facings} />
      <div className={styles.cardChips}>
        {proj.approvals.slice(0, 3).map((a) => (
          <span key={a} className={styles.cardChip}>{a}</span>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <div>
          <div className={styles.cardPriceLabel}>Starting from</div>
          <div className={styles.cardPrice}>{proj.starting}</div>
        </div>
        <button className={styles.cardCta} onClick={() => navigate(`/project/${proj.id}`)}>
          View Details →
        </button>
      </div>
    </motion.div>
  )
}

// ── Completed project card ────────────────────────────────────────────────────
function CompletedCard({ proj, index }) {
  return (
    <motion.div className={styles.compCard}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2 }}>
      <div className={styles.compStamp}>SOLD OUT</div>
      <div className={styles.compName}>{proj.name}</div>
      <div className={styles.compLoc}>📍 {proj.loc}</div>
      <div className={styles.compMeta}>
        <span>{proj.plots} plots</span><span>·</span><span>Delivered {proj.year}</span>
      </div>
      <div className={styles.compBadge}>✓ Completed · Fully Sold</div>
    </motion.div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function PortfolioSection({ content }) {
  const portfolioStats = content?.portfolio?.stats || STATS
  const active    = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed = content?.portfolio?.completed
    ? content.portfolio.completed.map((p, i) => ({ year: '2022', plots: 48 - i * 6, ...p }))
    : COMPLETED_PROJECTS

  return (
    <section className={styles.portSec} id="portfolio">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Our Portfolio</div>
        <h2 className="sec-title light">A Legacy of <em>Excellence</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.6)' }}>
          10+ projects delivered across the Krishna–Guntur corridor — 1000+ families settled, 100% CRDA &amp; RERA approved.
        </p>
      </div>
      <div className={styles.statsBar}>
        {portfolioStats.map((s, i) => (
          <motion.div key={s.label} className={styles.statItem}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <div className={styles.statVal}>{s.value}</div>
            <div className={styles.statLab}>{s.label}</div>
          </motion.div>
        ))}
      </div>
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <div className={styles.blockDot} style={{ background: '#F6C347' }} />
          <h3 className={styles.blockTitle}>Open for Booking</h3>
          <span className={styles.blockCount}>{active.length} projects</span>
        </div>
        <div className={styles.activeGrid}>
          {active.map((proj, i) => <ActiveCard key={proj.id} proj={proj} index={i} />)}
        </div>
      </div>
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <div className={styles.blockDot} style={{ background: '#4CAF74' }} />
          <h3 className={styles.blockTitle}>Completed &amp; Delivered</h3>
          <span className={styles.blockCount}>{completed.length} projects · {completed.reduce((a, p) => a + (p.plots || 48), 0)}+ plots</span>
        </div>
        <div className={styles.compGrid}>
          {completed.map((p, i) => <CompletedCard key={p.name} proj={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
