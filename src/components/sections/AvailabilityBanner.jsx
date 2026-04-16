import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { getAvailableCount, VENTURE_TOTALS } from '@/constants/plotStatus'
import { trackEvent, trackVentureSwitched } from '@/utils/analytics'

/**
 * AvailabilityBanner — urgency-driven strip that sits between Hero
 * and Portfolio, showing live plot availability per venture.
 *
 * Why this exists:
 *   Google Analytics showed 0 key events + 7s engagement on the
 *   homepage. Many visitors bounce before reaching the Explore
 *   Available Plots section. This banner surfaces scarcity ("Only
 *   33 plots left in Anjana") immediately below the Hero, giving
 *   early visitors a reason to act.
 *
 * How it works:
 *   - Computes available/total counts from plotStatus.js at render.
 *   - Each card is clickable — dispatches the existing
 *     `cbp:selectVenture` event to switch PlotGrid, then scrolls
 *     to #plots (same UX as PricingBanner venture cards).
 *   - Cards use each venture's brand color so users can mentally
 *     map them to the Explore section switcher.
 *   - Low-availability ventures (<20% remaining) get a stronger
 *     urgency label ("Almost Sold Out — N plots left").
 */

const VENTURES = [
  { key: 'anjana',  name: 'Anjana Paradise',  loc: 'Paritala',     color: '#1E4D2B' },
  { key: 'trimbak', name: 'Trimbak Oaks',     loc: 'Penamaluru',   color: '#C0522A' },
  { key: 'aparna',  name: 'Aparna Legacy',    loc: 'Chevitikallu', color: '#C9A84C' },
  { key: 'varaha',  name: 'Varaha Virtue',    loc: 'Pamarru',      color: '#1976D2' },
]

const TE = {
  name: {
    'Anjana Paradise': 'అంజన పారడైజ్',
    'Trimbak Oaks':    'ట్రింబక్ ఓక్స్',
    'Aparna Legacy':   'అపర్ణ లెగసీ',
    'Varaha Virtue':   'వరాహ వర్చ్యూ',
  },
  loc: {
    Paritala:     'పరిటాల',
    Penamaluru:   'పెనమలూరు',
    Chevitikallu: 'చెవిటికల్లు',
    Pamarru:      'పామర్రు',
  },
}

export default function AvailabilityBanner() {
  const { language } = useLanguage()
  const isTe = language === 'te'

  const cards = VENTURES.map(v => {
    const available = getAvailableCount(v.key)
    const total     = VENTURE_TOTALS[v.key] || 0
    const pctAvail  = total > 0 ? Math.round((available / total) * 100) : 100
    const isHot     = pctAvail < 20 && available > 0
    return { ...v, available, total, pctAvail, isHot }
  })

  const totalAvailable = cards.reduce((a, c) => a + c.available, 0)

  const handleClick = (v) => {
    // GA4 — track which venture card drove the click
    trackEvent('availability_card_click', {
      venture:         v.key,
      available_count: v.available,
    })
    trackVentureSwitched(v.key, 'AVAILABILITY_BANNER')
    // Reuse the existing PlotGrid listener
    window.dispatchEvent(new CustomEvent('cbp:selectVenture', { detail: { ventureKey: v.key } }))
    // Scroll to #plots (same reliable smooth scroll PricingBanner uses)
    requestAnimationFrame(() => {
      const el = document.getElementById('plots')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section
      aria-label="Plot availability summary"
      style={{
        background: 'linear-gradient(180deg, #FDFAF4 0%, #F6EED8 100%)',
        padding: '28px 16px 32px',
        borderTop:    '1px solid rgba(201,168,76,0.25)',
        borderBottom: '1px solid rgba(201,168,76,0.25)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(192,57,43,0.1)',
            color:      '#C0392B',
            border:     '1px solid rgba(192,57,43,0.3)',
            padding: '4px 12px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            🔥 {isTe ? 'పరిమిత లభ్యత' : 'Limited Availability'}
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize:   'clamp(22px, 3vw, 30px)',
            fontWeight: 600, margin: 0, color: 'var(--green)',
          }}>
            {isTe
              ? <>మొత్తం <strong style={{ color: '#C0392B' }}>{totalAvailable}</strong> ప్లాట్లు మాత్రమే అందుబాటులో ఉన్నాయి</>
              : <>Only <strong style={{ color: '#C0392B' }}>{totalAvailable}</strong> plots available across our 4 ventures</>}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 6 }}>
            {isTe ? 'మీ ప్లాట్‌ను బుక్ చేసుకోవడానికి క్లిక్ చేయండి' : 'Tap any venture to see its plot numbers'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {cards.map(v => {
            const name = isTe ? (TE.name[v.name] || v.name) : v.name
            const loc  = isTe ? (TE.loc[v.loc]   || v.loc)  : v.loc
            return (
              <motion.button
                key={v.key}
                type="button"
                onClick={() => handleClick(v)}
                whileHover={{ y: -3, boxShadow: `0 8px 20px ${v.color}33` }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  position: 'relative',
                  background: '#fff',
                  border: `1.5px solid ${v.color}44`,
                  borderLeft: `4px solid ${v.color}`,
                  borderRadius: 12,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                {v.isHot && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    background: '#C0392B', color: '#fff',
                    fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                    padding: '2px 6px', borderRadius: 3,
                  }}>
                    {isTe ? 'దాదాపు అమ్ముడుపోయింది' : 'ALMOST SOLD'}
                  </span>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: v.color, lineHeight: 1.2 }}>
                  {name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>📍 {loc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <strong style={{ fontSize: 22, color: v.isHot ? '#C0392B' : 'var(--text-dark)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {v.available}
                  </strong>
                  <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
                    / {v.total} {isTe ? 'అందుబాటులో' : 'available'}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 4,
                  overflow: 'hidden', marginTop: 2,
                }}>
                  <div style={{
                    width: `${v.pctAvail}%`, height: '100%',
                    background: v.isHot ? '#C0392B' : v.color,
                    transition: 'width 0.4s',
                  }} />
                </div>
                <div style={{
                  fontSize: 11, color: v.color, fontWeight: 600,
                  marginTop: 4, display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {isTe ? 'ప్లాట్లు చూడండి' : 'View plots'} →
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
