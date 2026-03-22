import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ACTIVE_PROJECTS, COMPLETED_PROJECTS } from '@/constants/projects'
import styles from './PortfolioSection.module.css'

const STATS = [
  { value: '10+',   label: 'Projects Delivered', icon: '🏗️' },
  { value: '1000+', label: 'Happy Families',      icon: '🏠' },
  { value: '15+',   label: 'Years of Trust',      icon: '🏆' },
  { value: '100%',  label: 'CRDA / RERA',         icon: '✅' },
]

const ACCENT = {
  accentGold:   { color: '#C9A84C', glow: 'rgba(201,168,76,0.25)',  bar: 'linear-gradient(90deg,#C9A84C,#E8D5A3)' },
  accentGreen:  { color: '#4CAF74', glow: 'rgba(76,175,116,0.25)',  bar: 'linear-gradient(90deg,#4CAF74,#2D8C4E)' },
  accentBlue:   { color: '#64B5F6', glow: 'rgba(100,181,246,0.25)', bar: 'linear-gradient(90deg,#64B5F6,#1976D2)' },
  accentOrange: { color: '#FFB74D', glow: 'rgba(255,183,77,0.25)',  bar: 'linear-gradient(90deg,#FFB74D,#F57C00)' },
}

// ── Animated availability ring ────────────────────────────────────────────────
function AvailRing({ available, total, color }) {
  const r = 28, circ = 2 * Math.PI * r
  const dash = (available / total) * circ
  return (
    <div className={styles.ring}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="34" cy="34" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round" />
      </svg>
      <div className={styles.ringInner}>
        <div className={styles.ringNum} style={{ color }}>{available}</div>
        <div className={styles.ringLabel}>left</div>
      </div>
    </div>
  )
}

// ── Facing breakdown pills ────────────────────────────────────────────────────
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

// ── Active project card ───────────────────────────────────────────────────────
function ActiveCard({ proj, index, isSelected, onSelect }) {
  const navigate = useNavigate()
  const ac = ACCENT[proj.accentClass] || ACCENT.accentGold

  return (
    <motion.div
      layout
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      style={{ '--ac': ac.color, '--ag': ac.glow, '--ab': ac.bar }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(proj.id)}
    >
      {/* Top colour bar */}
      <div className={styles.cardBar} />

      {/* Header row */}
      <div className={styles.cardHead}>
        <div className={styles.cardTagWrap}>
          <span className={styles.cardTag}>{proj.tag}</span>
        </div>
        <AvailRing available={proj.available} total={proj.total} color={ac.color} />
      </div>

      {/* Identity */}
      <div className={styles.cardIdentity}>
        <h3 className={styles.cardName}>{proj.name}</h3>
        <p className={styles.cardLoc}>📍 {proj.loc}</p>
      </div>

      {/* Facing pills */}
      <FacingPills facings={proj.facings} />

      {/* Approval tags */}
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
        <button
          className={styles.viewBtn}
          onClick={(e) => { e.stopPropagation(); navigate(`/project/${proj.id}`) }}
        >
          View Details <span className={styles.arrow}>→</span>
        </button>
      </div>

      {/* Selected highlight ring */}
      {isSelected && <div className={styles.selectedRing} />}
    </motion.div>
  )
}

// ── Selected project detail panel ─────────────────────────────────────────────
function DetailPanel({ proj, onNavigate }) {
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

  return (
    <motion.div
      className={styles.detailPanel}
      style={{ '--ac': ac.color }}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <div className={styles.detailAccentLine} />

      <div className={styles.detailHeader}>
        <div>
          <div className={styles.detailTag}>{proj.tag}</div>
          <h3 className={styles.detailName}>{proj.name}</h3>
          <p className={styles.detailLoc}>📍 {proj.loc}</p>
        </div>
        <AvailRing available={proj.available} total={proj.total} color={ac.color} />
      </div>

      <p className={styles.detailDesc}>{proj.description}</p>

      {/* Stats row */}
      <div className={styles.detailStats}>
        <div className={styles.dStat}>
          <div className={styles.dStatVal} style={{ color: ac.color }}>{proj.available}</div>
          <div className={styles.dStatLab}>Available</div>
        </div>
        <div className={styles.dStatDiv} />
        <div className={styles.dStat}>
          <div className={styles.dStatVal} style={{ color: ac.color }}>{proj.total}</div>
          <div className={styles.dStatLab}>Total</div>
        </div>
        <div className={styles.dStatDiv} />
        <div className={styles.dStat}>
          <div className={styles.dStatVal} style={{ color: ac.color }}>{proj.starting}</div>
          <div className={styles.dStatLab}>From</div>
        </div>
      </div>

      {/* Facing breakdown */}
      <div className={styles.detailSection}>
        <div className={styles.detailSectionLabel}>Plot Distribution</div>
        <div className={styles.detailFacings}>
          {facingRows.map((row) => (
            <div key={row.label} className={styles.dFacingRow}>
              <div className={styles.dFacingLabel}>
                <div className={styles.dFacingDot} style={{ background: row.color }} />
                {row.label}
              </div>
              <div className={styles.dFacingBar}>
                <motion.div
                  className={styles.dFacingFill}
                  style={{ background: row.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(row.value / totalFacing) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.dFacingCount}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className={styles.detailSection}>
        <div className={styles.detailSectionLabel}>Highlights</div>
        <div className={styles.detailHls}>
          {proj.highlights.map((h) => (
            <div key={h} className={styles.detailHl}>
              <span style={{ color: ac.color }}>✓</span> {h}
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className={styles.detailActions}>
        <button className={styles.detailCta} style={{ background: ac.color }}
          onClick={onNavigate}>
          Explore Full Details →
        </button>
        <button className={styles.detailWa}
          onClick={() => window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I'm interested in ${proj.name} at ${proj.loc}.`)}`, '_blank')}>
          💬 WhatsApp
        </button>
      </div>
    </motion.div>
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
  const navigate        = useNavigate()
  const [selectedId, setSelectedId] = useState(null)

  const portfolioStats = content?.portfolio?.stats || STATS
  const active    = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed = content?.portfolio?.completed
    ? content.portfolio.completed.map((p, i) => ({ year: '2022', plots: 48 - i * 6, ...p }))
    : COMPLETED_PROJECTS

  const selectedProj = active.find((p) => p.id === selectedId) || null
  const handleSelect = (id) => setSelectedId((prev) => (prev === id ? null : id))

  return (
    <section className={styles.portSec} id="portfolio">
      <div className={styles.inner}>

        {/* ── Section header ─────────────────────────────────────── */}
        <div className={styles.secHead}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className={styles.secTag}>Our Portfolio</div>
            <h2 className={styles.secTitle}>A Legacy of <em>Excellence</em></h2>
            <p className={styles.secSub}>
              10+ projects across the Krishna–Guntur corridor — 1000+ families settled,
              100% CRDA &amp; RERA approved.
            </p>
          </motion.div>
        </div>

        {/* ── Stats bar ──────────────────────────────────────────── */}
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

        {/* ── Open for Booking ───────────────────────────────────── */}
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div className={styles.blockPulse} />
            <h3 className={styles.blockTitle}>Open for Booking</h3>
            <span className={styles.blockPill}>{active.length} projects available</span>
          </div>

          {/* Two-column layout: cards left, detail right */}
          <div className={styles.bookingLayout}>
            <div className={styles.cardsCol}>
              {active.map((proj, i) => (
                <ActiveCard
                  key={proj.id}
                  proj={proj}
                  index={i}
                  isSelected={selectedId === proj.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            {/* Detail panel (animates in when a card is selected) */}
            <div className={styles.detailCol}>
              <AnimatePresence mode="wait">
                {selectedProj ? (
                  <DetailPanel
                    key={selectedProj.id}
                    proj={selectedProj}
                    onNavigate={() => navigate(`/project/${selectedProj.id}`)}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    className={styles.detailPlaceholder}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className={styles.phIcon}>🏘️</div>
                    <div className={styles.phText}>Select a project to see details</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Completed ──────────────────────────────────────────── */}
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
    </section>
  )
}
