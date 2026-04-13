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

  const ventures = ACTIVE_PROJECTS.filter(p => p.pricing).map(p => {
    const loc = p.loc?.split(',')[0]?.trim()
    return {
      id: p.id,
      name: isTe ? (NAME_TE[p.name] || p.name) : p.name,
      loc: isTe ? (LOC_TE[loc] || loc) : loc,
      east: p.pricing.east.base,
      west: p.pricing.west.base,
    }
  })

  const minPrice = Math.min(...ventures.map(v => Math.min(v.east, v.west)))

  const scrollToPlots = (e) => {
    e.stopPropagation()
    const el = document.getElementById('plots')
    if (el) {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72
      window.scrollTo({ top: el.offsetTop - navH - 40, behavior: 'smooth' })
    }
    setExpanded(false)
  }

  return (
    <>
      {/* Single fixed container with bar + dropdown */}
      <div className={styles.wrapper}>
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
              <div key={v.id} className={styles.card} onClick={scrollToPlots}>
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
