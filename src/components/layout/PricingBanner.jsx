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
        eastBase: p.pricing.east.base, eastDev: p.pricing.east.dev || 0,
        westBase: p.pricing.west.base, westDev: p.pricing.west.dev || 0,
      }
    })

  const minBasePrice = Math.min(...ventures.map(v => v.eastBase))
  const minDev = ventures.find(v => v.eastBase === minBasePrice)?.eastDev || 0

  const scrollToPlots = (e, ventureKey = null) => {
    e.stopPropagation()
    setExpanded(false)
    if (ventureKey) {
      window.dispatchEvent(new CustomEvent('cbp:selectVenture', { detail: { ventureKey } }))
    }

    const scrollTarget = () => {
      const el = document.getElementById('plots')
      if (!el) return
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
      const margin = 50
      const absTop = el.getBoundingClientRect().top + window.scrollY
      return Math.max(0, absTop - navH - margin)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById('plots')
        if (!el) return
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
          <span className={styles.price}>
            ₹{minBasePrice.toLocaleString('en-IN')}/{isTe ? 'చ.గ.' : 'sq.yd'}
            {minDev > 0 && (
              <span style={{ fontSize: 15, color: '#FFD966', marginLeft: 10, fontWeight: 700, letterSpacing: 0.3, textShadow: '0 0 8px rgba(255,217,102,0.4)' }}>
                + ₹{minDev.toLocaleString('en-IN')} {isTe ? 'డెవ్. చార్జీలు' : 'Dev. Charges'}
              </span>
            )}
          </span>
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
                  <span>☀ {isTe ? 'తూర్పు' : 'East'}: <strong>₹{v.eastBase.toLocaleString('en-IN')}</strong>{v.eastDev > 0 && <span style={{ fontSize: 11, opacity: 0.75, marginLeft: 6, fontWeight: 400 }}>+ ₹1,000 {isTe ? 'డెవ్. చార్జీలు' : 'Dev. Charges'}</span>}</span>
                  <span>🌙 {isTe ? 'పడమర' : 'West'}: <strong>₹{v.westBase.toLocaleString('en-IN')}</strong>{v.westDev > 0 && <span style={{ fontSize: 11, opacity: 0.75, marginLeft: 6, fontWeight: 400 }}>+ ₹1,000 {isTe ? 'డెవ్. చార్జీలు' : 'Dev. Charges'}</span>}</span>
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

