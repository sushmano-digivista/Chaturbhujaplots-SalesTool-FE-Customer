import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import styles from './PricingBanner.module.css'

const NAME_TE = {
  'Anjana Paradise': 'అంజన పారడైజ్',
  'Trimbak Oaks': 'ట్రింబక్ ఓక్స్',
  'Aparna Legacy': 'అపర్ణ లెగసీ',
  'Varaha Virtue': 'వరాహ వర్చ్యూ',
}

const LOC_TE = {
  'Paritala': 'పరిటాల',
  'Penamaluru': 'పెనమలూరు',
  'Chevitikallu': 'చెవిటికల్లు',
  'Pamarru': 'పామర్రు',
}

export default function PricingBanner() {
  const { language } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const isTe = language === 'te'

  // Map project id → PlotGrid venture key
  const VENTURE_KEY = { anjana: 'anjana', trimbak: 'trimbak', aparna: 'aparna', varaha: 'varaha' }
  // Preserve the canonical order used in PlotGrid
  const ORDER = ['anjana', 'trimbak', 'aparna', 'varaha']

  const ventures = ACTIVE_PROJECTS.filter(p => p.pricing)
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
    .map(p => {
      const loc = p.loc?.split(',')[0]?.trim()
      return {
        id: p.id,
        ventureKey: VENTURE_KEY[p.id] || p.id,
        name: isTe ? (NAME_TE[p.name] || p.name) : p.name,
        loc: isTe ? (LOC_TE[loc] || loc) : loc,
        east: p.pricing.east.base,
        west: p.pricing.west.base,
      }
    })

  const minPrice = Math.min(...ventures.map(v => Math.min(v.east, v.west)))

  const scrollToPlots = (e, ventureKey = null) => {
    e.stopPropagation()
    setExpanded(false)
    // If a specific venture card was clicked, tell PlotGrid to switch to it.
    if (ventureKey) {
      window.dispatchEvent(new CustomEvent('cbp:selectVenture', { detail: { ventureKey } }))
    }

    // Robust scroll that handles:
    //  1. Banner collapse animation (height change during scroll)
    //  2. Lazy-loaded images above #plots that shift layout
    //  3. Sticky pricing banner height changes
    //
    // Strategy:
    //   a) Wait 2 animation frames for the `setExpanded(false)` collapse
    //      + React re-render to settle.
    //   b) First smooth scroll with scrollIntoView (animates).
    //   c) After the smooth scroll would complete (~600ms), re-measure
    //      and do a final precise window.scrollTo if we landed off target.
    //      Uses 'auto' behavior so the correction is instant.
    const scrollTarget = () => {
      const el = document.getElementById('plots')
      if (!el) return
      // getBoundingClientRect re-reads position at THIS moment
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
      const margin = 50
      const absTop = el.getBoundingClientRect().top + window.scrollY
      return Math.max(0, absTop - navH - margin)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById('plots')
        if (!el) return
        // Phase 1: smooth scroll (animates, ~300–500ms)
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Phase 2: after smooth scroll should be done, verify + correct.
        // If images/banner shifted layout mid-scroll, we recompute and
        // snap to the right pixel precisely (no visible jump if we
        // already landed correctly).
        setTimeout(() => {
          const target = scrollTarget()
          if (target == null) return
          const diff = Math.abs(window.scrollY - target)
          if (diff > 2) window.scrollTo({ top: target, behavior: 'auto' })
        }, 650)
      })
    })
  }

  return (
    <>
      {/* Single fixed container with bar + dropdown */}
      <div className={styles.wrapper} data-pricing-banner>
        {/* Header bar — always visible */}
        <div className={styles.bar} onClick={() => setExpanded(e => !e)}>
          <span className={styles.label}>{isTe ? 'ప్లాట్లు ప్రారంభ ధర' : 'PLOTS STARTING FROM'}</span>
          <span className={styles.price}>₹{minPrice.toLocaleString('en-IN')}/{isTe ? 'చ.గ.' : 'sq.yd'}</span>
          <button className={styles.cta} onClick={scrollToPlots}>
            {isTe ? 'అన్ని ప్రాజెక్టులు చూడండి' : 'View All Projects'}
          </button>
          <span className={styles.arrow}>{expanded ? '▲' : '▼'}</span>
        </div>

        {/* Expanded venture cards */}
        {expanded && (
          <div className={styles.grid}>
            {ventures.map(v => (
              <div key={v.id} className={styles.card} onClick={(e) => scrollToPlots(e, v.ventureKey)}>
                <div className={styles.cardName}>{v.name}</div>
                <div className={styles.cardLoc}>📍 {v.loc}</div>
                <div className={styles.cardPrices}>
                  <span>☀ {isTe ? 'తూర్పు' : 'East'}: <strong>₹{v.east.toLocaleString('en-IN')}</strong></span>
                  <span>🌙 {isTe ? 'పడమర' : 'West'}: <strong>₹{v.west.toLocaleString('en-IN')}</strong></span>
                </div>
                <div className={styles.unit}>/{isTe ? 'చ.గ.' : 'sq.yd'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {expanded && <div className={styles.backdrop} onClick={() => setExpanded(false)} />}
    </>
  )
}
