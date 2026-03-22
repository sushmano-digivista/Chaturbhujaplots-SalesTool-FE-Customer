import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { createPortal }  from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ACTIVE_PROJECTS, COMPLETED_PROJECTS } from '@/constants/projects'
import styles from './PortfolioSection.module.css'

const STATS = [
  { value: '10+',   label: 'Projects Delivered', icon: '🏗️' },
  { value: '1000+', label: 'Happy Families',      icon: '🏠' },
  { value: '15+',   label: 'Years of Trust',      icon: '🏆' },
  { value: '100%',  label: 'CRDA / RERA',         icon: '✅' },
]

const ACCENT = {
  accentGold:   { color: '#C9A84C', bar: 'linear-gradient(90deg,#C9A84C,#E8D5A3)' },
  accentGreen:  { color: '#4CAF74', bar: 'linear-gradient(90deg,#4CAF74,#2D8C4E)' },
  accentBlue:   { color: '#64B5F6', bar: 'linear-gradient(90deg,#64B5F6,#1976D2)' },
  accentOrange: { color: '#FFB74D', bar: 'linear-gradient(90deg,#FFB74D,#F57C00)' },
}

// ── Availability status badge (count not disclosed) ──────────────────────────
function AvailBadge({ available, total, color, large = false }) {
  const pct  = available / total
  const tier = pct <= 0.15
    ? { label: 'Almost Full',  dot: '#E24B4A' }
    : pct <= 0.40
    ? { label: 'Filling Fast', dot: '#FFB74D' }
    : { label: 'Available',    dot: '#4CAF74' }
  return (
    <div className={`${styles.availBadge} ${large ? styles.availBadgeLg : ''}`}
      style={{ '--ac': color }}>
      <span className={styles.availDot} style={{ background: tier.dot }} />
      <span className={styles.availLabel}>{tier.label}</span>
    </div>
  )
}

// ── Facing pills (card) ───────────────────────────────────────────────────────
function FacingPills({ facings }) {
  if (!facings) return null
  const pills = [
    { label: '☀️ East',   value: facings.east,   color: '#C9A84C' },
    { label: '🌙 West',   value: facings.west,   color: '#64B5F6' },
    { label: '◣ Corner', value: facings.corner, color: '#9B7B2E' },
  ].filter((p) => p.value > 0)
  return (
    <div className={styles.facingRow}>
      {pills.map((p) => (
        <div key={p.label} className={styles.facingPill} style={{ '--fc': p.color }}>
          <span className={styles.fpLabel}>{p.label}</span>
          <span className={styles.fpVal}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Project card (2×2 grid) ───────────────────────────────────────────────────
function ProjectCard({ proj, index, onClick }) {
  const ac = ACCENT[proj.accentClass] || ACCENT.accentGold
  return (
    <motion.div
      className={styles.card}
      style={{ '--ac': ac.color, '--ab': ac.bar }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(proj)}
    >
      {/* Accent top bar */}
      <div className={styles.cardBar} />

      {/* Tag + ring */}
      <div className={styles.cardHead}>
        <span className={styles.cardTag}>{proj.tag}</span>
        <AvailBadge available={proj.available} total={proj.total} color={ac.color} />
      </div>

      {/* Name + location */}
      <div className={styles.cardIdentity}>
        <h3 className={styles.cardName}>{proj.name}</h3>
        <p className={styles.cardLoc}>📍 {proj.loc}</p>
      </div>

      {/* Facing pills */}
      <FacingPills facings={proj.facings} />

      {/* Approvals */}
      <div className={styles.cardApprovals}>
        {proj.approvals.slice(0, 3).map((a) => (
          <span key={a} className={styles.approval}>{a}</span>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.cardFoot}>
        <div>
          <div className={styles.priceLabel}>Starting from</div>
          <div className={styles.price}>{proj.starting}</div>
        </div>
        <div className={styles.viewHint}>Tap for details →</div>
      </div>
    </motion.div>
  )
}

// ── Project detail popup (portal) ─────────────────────────────────────────────
function ProjectPopup({ proj, onClose, onNavigate }) {
  const ac = ACCENT[proj.accentClass] || ACCENT.accentGold

  const facings = proj.facings || {}
  const facingRows = [
    { label: 'East Facing',  value: facings.east,   color: '#C9A84C' },
    { label: 'West Facing',  value: facings.west,   color: '#64B5F6' },
    { label: 'North Facing', value: facings.north,  color: '#4CAF74' },
    { label: 'South Facing', value: facings.south,  color: '#E24B4A' },
    { label: 'Corner Plots', value: facings.corner, color: '#9B7B2E' },
  ].filter((r) => r.value > 0)
  const totalFacing = facingRows.reduce((s, r) => s + r.value, 0)

  return createPortal(
    <motion.div
      className={styles.popupOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className={styles.popup}
        style={{ '--ac': ac.color, '--ab': ac.bar }}
        initial={{ opacity: 0, scale: 0.92, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      >
        {/* Accent top bar */}
        <div className={styles.popupBar} />

        {/* Close button */}
        <button className={styles.popupClose} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className={styles.popupHead}>
          <div className={styles.popupLeft}>
            <div className={styles.popupTag}>{proj.tag}</div>
            <h2 className={styles.popupName}>{proj.name}</h2>
            <p className={styles.popupLoc}>📍 {proj.loc}</p>
          </div>
          <AvailBadge available={proj.available} total={proj.total} color={ac.color} large />
        </div>

        {/* Description */}
        <p className={styles.popupDesc}>{proj.description}</p>

        {/* Stats row */}
        <div className={styles.popupStats}>
          {[
            { val: proj.total,     lab: 'Total Plots'  },
            { val: proj.starting,  lab: 'Starting From' },
          ].map((s, i) => (
            <div key={i} className={styles.pStat}>
              <div className={styles.pStatVal} style={{ color: ac.color }}>{s.val}</div>
              <div className={styles.pStatLab}>{s.lab}</div>
            </div>
          ))}
        </div>

        {/* Body — two columns */}
        <div className={styles.popupBody}>

          {/* Plot distribution */}
          <div className={styles.popupSection}>
            <div className={styles.popupSectionLabel}>Plot Distribution</div>
            <div className={styles.popupFacings}>
              {facingRows.map((row) => (
                <div key={row.label} className={styles.pfRow}>
                  <div className={styles.pfLabel}>
                    <div className={styles.pfDot} style={{ background: row.color }} />
                    {row.label}
                  </div>
                  <div className={styles.pfBar}>
                    <motion.div
                      className={styles.pfFill}
                      style={{ background: row.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.value / totalFacing) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={styles.pfCount}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className={styles.popupSection}>
            <div className={styles.popupSectionLabel}>Key Highlights</div>
            <div className={styles.popupHls}>
              {proj.highlights.map((h) => (
                <div key={h} className={styles.popupHl}>
                  <span className={styles.popupHlCheck} style={{ color: ac.color }}>✓</span>
                  {h}
                </div>
              ))}
            </div>

            <div className={styles.popupSectionLabel} style={{ marginTop: 20 }}>Approvals</div>
            <div className={styles.popupApprovals}>
              {proj.approvals.map((a) => (
                <span key={a} className={styles.popupApproval}>{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.popupActions}>
          <button
            className={styles.popupCta}
            style={{ background: ac.color }}
            onClick={onNavigate}
          >
            Explore Full Project →
          </button>
          <button
            className={styles.popupWa}
            onClick={() => window.open(
              `https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I'm interested in ${proj.name} at ${proj.loc}. Please share details.`)}`,
              '_blank'
            )}
          >
            💬 WhatsApp
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ── Completed card ────────────────────────────────────────────────────────────
function CompletedCard({ proj, index }) {
  return (
    <motion.div
      className={styles.compCard}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
    >
      <div className={styles.compCheck}>✓</div>
      <div className={styles.compName}>{proj.name}</div>
      <div className={styles.compLoc}>📍 {proj.loc}</div>
      <div className={styles.compMeta}>{proj.plots} plots · {proj.year}</div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PortfolioSection({ content }) {
  const navigate = useNavigate()
  const [activeProj, setActiveProj] = useState(null)

  const portfolioStats = content?.portfolio?.stats || STATS
  const active    = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed = content?.portfolio?.completed
    ? content.portfolio.completed.map((p, i) => ({ year: '2022', plots: 48 - i * 6, ...p }))
    : COMPLETED_PROJECTS

  return (
    <section className={styles.portSec} id="portfolio">
      <div className={styles.inner}>

        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div className={styles.secHead}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className={styles.secTag}>Our Portfolio</div>
          <h2 className={styles.secTitle}>A Legacy of <em>Excellence</em></h2>
          <p className={styles.secSub}>
            10+ projects across the Krishna–Guntur corridor — 1000+ families settled,
            100% CRDA &amp; RERA approved.
          </p>
        </motion.div>

        {/* ── Stats bar ───────────────────────────────────────────── */}
        <div className={styles.statsBar}>
          {portfolioStats.map((s, i) => (
            <motion.div key={s.label} className={styles.statItem}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              {s.icon && <div className={styles.statIcon}>{s.icon}</div>}
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statLab}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Open for Booking — 2×2 grid ─────────────────────────── */}
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div className={styles.blockPulse} />
            <h3 className={styles.blockTitle}>Open for Booking</h3>
            <span className={styles.blockPill}>{active.length} projects available</span>
          </div>

          <div className={styles.cardsGrid}>
            {active.map((proj, i) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                index={i}
                onClick={setActiveProj}
              />
            ))}
          </div>
        </div>

        {/* ── Completed ───────────────────────────────────────────── */}
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div className={styles.blockCheckDot} />
            <h3 className={styles.blockTitle}>Completed &amp; Delivered</h3>
            <span className={styles.blockPill}>
              {completed.length} projects · {completed.reduce((a, p) => a + (p.plots || 48), 0)}+ plots
            </span>
          </div>
          <div className={styles.compGrid}>
            {completed.map((p, i) => (
              <CompletedCard key={p.name} proj={p} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Project detail popup ─────────────────────────────────── */}
      <AnimatePresence>
        {activeProj && (
          <ProjectPopup
            key={activeProj.id}
            proj={activeProj}
            onClose={() => setActiveProj(null)}
            onNavigate={() => { navigate(`/project/${activeProj.id}`); setActiveProj(null) }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
