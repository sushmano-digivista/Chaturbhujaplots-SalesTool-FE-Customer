import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { createPortal }  from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ACTIVE_PROJECTS, COMPLETED_PROJECTS } from '@/constants/projects'
import { useProjects } from '@/hooks/useData'
import { getFacingRows } from '@/constants/facingMap'
import PricingCard     from '@/components/ui/PricingCard'
import { openWhatsApp }  from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import styles from './PortfolioSection.module.css'

const STATS = [
  { value: '10+',   label: 'Projects Delivered', icon: '🏗️' },
  { value: '1200+', label: 'Happy Families',      icon: '🏠' },
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
function FacingPills({ facings, t }) {
  if (!facings) return null
  const safet = t || ((k) => k)
  const pills = [
    { label: safet('facings.east'),   value: facings.east,   color: '#C9A84C' },
    { label: safet('facings.west'),   value: facings.west,   color: '#64B5F6' },
    { label: safet('facings.corner'), value: facings.corner, color: '#9B7B2E' },
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

// Map common approval strings to translation keys
const APPROVAL_KEY_MAP = {
  'CRDA Proposed Layout':   'approvals.crdaProposed',
  'AP RERA Registered':     'approvals.apReraRegistered',
  '100% Clear Title':       'approvals.clearTitle',
  'Clear Title':            'approvals.clearTitle',
  '100% Vastu Compliant':   'approvals.vastuCompliant',
  '100% Vaastu':            'approvals.vastuCompliant',
  'NH-16 Frontage':         'approvals.nh16Frontage',
  'CRDA Approved':          'approvals.crdaApproved',
  'RERA Registered':        'approvals.reraRegistered',
  'APCRDA Proposed Layout': 'approvals.apcrda',
}

function translateApproval(label, t) {
  const key = APPROVAL_KEY_MAP[label]
  if (!key) return label
  const translated = t(key)
  // If t() returns the key itself (not found), fall back to original label
  return (translated && translated !== key) ? translated : label
}

// ── Project card (2×2 grid) ───────────────────────────────────────────────────
function ProjectCard({ proj, index, onClick, t, language }) {
  const safet = t || ((k) => k)
  const tProj = (field) => { const k = 'projects.' + proj.id + '.' + field; const v = safet(k); if (field === 'name' && language !== 'te') return null; return (v && v !== k) ? v : null }
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

      {/* Tag */}
      <div className={styles.cardHead}>
        <span className={styles.cardTag}>
          {(() => { const k = 'tags.' + (proj.tag || '').toLowerCase(); const v = safet(k); return v !== k ? v : proj.tag })()} 
        </span>
      </div>

      {/* Name + location */}
      <div className={styles.cardIdentity}>
        <h3 className={styles.cardName}>{tProj('name') || proj.name}</h3>
        <p className={styles.cardLoc}>📍 {tProj('loc') || proj.loc}</p>
      </div>

      {/* Facing pills */}
      <FacingPills facings={proj.facings} t={t} />

      {/* Approvals */}
      <div className={styles.cardApprovals}>
        {proj.approvals.slice(0, 3).map((a) => (
          <span key={a} className={styles.approval}>{translateApproval(a, safet)}</span>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.cardFoot}>
        <div>
          <div className={styles.priceLabel}>{safet('portfolio.startingFrom')}</div>
          <div className={styles.price}>{proj.starting}</div>
        </div>
        <div className={styles.viewHint}>{safet('portfolio.tapForDetails')}</div>
      </div>
    </motion.div>
  )
}

// ── Project detail popup (portal) ─────────────────────────────────────────────
function ProjectPopup({ proj, onClose, onNavigate, pricing, t, language }) {
  // Fallback t if not provided (e.g. during testing)
  const safet = t || ((k) => k)
  const tProj = (field) => { const k = 'projects.' + proj.id + '.' + field; const v = safet(k); if (field === 'name' && language !== 'te') return null; return (v && v !== k) ? v : null }
  const ac = ACCENT[proj.accentClass] || ACCENT.accentGold

  const facingRows = getFacingRows(proj.facings || {})
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
        <div className={styles.popupScroll}>
        {/* Accent top bar */}
        <div className={styles.popupBar} />

        {/* Close button */}
        <button className={styles.popupClose} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className={styles.popupHead}>
          <div className={styles.popupLeft}>
            <div className={styles.popupTag}>
              {(() => { const k = 'tags.' + (proj.tag || '').toLowerCase(); const v = safet(k); return v !== k ? v : proj.tag })()}
            </div>
            <h2 className={styles.popupName}>{tProj('name') || proj.name}</h2>
            <p className={styles.popupLoc}>📍 {tProj('loc') || proj.loc}</p>
          </div>
          
        </div>

        {/* Description */}
        <p className={styles.popupDesc}>{tProj('description') || proj.description}</p>

        {/* Stats row */}
        <div className={styles.popupStats}>
          {[
            { val: proj.upcoming ? safet('portfolio.comingSoon') : proj.starting, lab: safet('portfolio.startingFrom') },
            { val: proj.upcoming ? safet('portfolio.comingSoon') : proj.total,    lab: safet('portfolio.totalPlots')   },
            { val: proj.upcoming ? safet('portfolio.comingSoon') : proj.starting, lab: safet('portfolio.startingFrom') },
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
            <div className={styles.popupSectionLabel}>{safet('portfolio.plotDistribution')}</div>
            <div className={styles.popupFacings}>
              {facingRows.map((row) => (
                <div key={row.label} className={styles.pfRow}>
                  <div className={styles.pfLabel}>
                    <div className={styles.pfDot} style={{ background: row.color }} />
                    {(() => { const k = 'facings.' + row.key; const v = safet(k); return v !== k ? v : row.label })()} 
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
            <div className={styles.popupSectionLabel}>{safet('portfolio.keyHighlights')}</div>
            <div className={styles.popupHls}>
              {(Array.isArray(tProj('highlights')) ? tProj('highlights') : proj.highlights).map((h) => (
                <div key={h} className={styles.popupHl}>
                  <span className={styles.popupHlCheck} style={{ color: ac.color }}>✓</span>
                  {h}
                </div>
              ))}
            </div>

            <div className={styles.popupSectionLabel} style={{ marginTop: 20 }}>{safet('portfolio.approvals')}</div>
            <div className={styles.popupApprovals}>
              {proj.approvals.map((a) => (
                <span key={a} className={styles.popupApproval}>{translateApproval(a, safet)}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        {(pricing || proj.pricing) && <div style={{padding:'0 20px 4px'}}><PricingCard pricing={pricing || proj.pricing} compact dark /></div>}

        {/* CTAs */}
        <div className={styles.popupActions}>
          <button
            className={styles.popupCta}
            style={{ background: ac.color }}
            onClick={onNavigate}
          >
            {safet('portfolio.viewProject')} →
          </button>
          <button
            className={styles.popupWa}
            onClick={() => openWhatsApp(
              proj.contact?.whatsapp || DEFAULT_WA_NUMBER,
              proj.contact?.whatsappMessage || 'Hi! I am interested in ' + proj.name + '. Can I book a free site visit? 🏡',
            )}
          >
            💬 WhatsApp
          </button>
        </div>
        </div>{/* /popupScroll */}
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ── Completed card ────────────────────────────────────────────────────────────
function CompletedCard({ proj, index, language, t }) {
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
      <div className={styles.compName}>{(() => {
        if (language !== 'te') return proj.name
        const names = {'Nandana Vihar': 'నందన విహార్', 'County': 'కౌంటీ', 'Pearl': 'పర్ల్', 'Empire': 'ఎంపైర్', 'Pride': 'ప్రైడ్', 'Prime': 'ప్రైమ్'}
        return names[proj.name] || proj.name
      })()}</div>
      <div className={styles.compLoc}>📍 {proj.loc}</div>
      <div className={styles.compMeta}>{proj.plots} plots · {proj.year}</div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PortfolioSection({ content, onEnquire, pricingMap }) {
  const navigate = useNavigate()
  const [activeProj, setActiveProj] = useState(null)
  const { t, language } = useLanguage()

  // Reactive stats — labels switch when language toggles
  const STATS_I18N = [
    { value: '10+',   label: t('portfolio.projectsDelivered'), icon: '\ud83c\udfd7\ufe0f' },
    { value: '1200+', label: t('portfolio.happyCustomers'),    icon: '\ud83c\udfe0' },
    { value: '15+',   label: t('portfolio.yearsIndustry'),     icon: '\ud83c\udfc6' },
    { value: '100%',  label: t('portfolio.apcrdaRera'),        icon: '\u2705' },
  ]

  const { data: dbProjects } = useProjects()
  const portfolioStats = content?.portfolio?.stats || STATS_I18N
  const active    = content?.portfolio?.active    || dbProjects || ACTIVE_PROJECTS
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
          <div className={styles.secTag}>{t('sections.portfolio')}</div>
          <h2 className={styles.secTitle}>
            {t('portfolio.sectionTitle').split(' ').slice(0, -1).join(' ')} <em>{t('portfolio.sectionTitle').split(' ').slice(-1)}</em>
          </h2>
          <p className={styles.secSub}>{t('portfolio.sectionSub')}</p>
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
            <h3 className={styles.blockTitle}>{t('nav.openForBooking')}</h3>
            <span className={styles.blockPill}>{active.length} projects</span>
          </div>

          <div className={styles.cardsGrid}>
            {active.map((proj, i) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                index={i}
                onClick={setActiveProj}
                t={t}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* ── Completed ───────────────────────────────────────────── */}
        <div className={styles.block}>
          <div className={styles.blockHead}>
            <div className={styles.blockCheckDot} />
            <h3 className={styles.blockTitle}>{t('nav.completedSoldOut')}</h3>
            <span className={styles.blockPill}>
              {completed.length} projects · {completed.reduce((a, p) => a + (p.plots || 48), 0)}+ plots
            </span>
          </div>
          <div className={styles.compGrid}>
            {completed.map((p, i) => (
              <CompletedCard key={p.name} proj={p} index={i} language={language} t={t} />
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
            pricing={pricingMap?.[activeProj?.id]}
            onNavigate={() => { navigate(`/project/${activeProj.id}`); setActiveProj(null) }}
            t={t}
            language={language}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
