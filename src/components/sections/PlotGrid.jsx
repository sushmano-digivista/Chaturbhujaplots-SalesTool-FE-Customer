import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Sunset, ArrowUp, ArrowDown, Maximize2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import CategoryCard   from '@/components/ui/CategoryCard'
import PlotVisualGrid from '@/components/ui/PlotVisualGrid'
import styles         from './PlotGrid.module.css'

// ── Per-category visual metadata ──────────────────────────────────────────────
const CATEGORY_META = {
  eastFacing:  { icon: <Sun       size={18} />, label: 'East-Facing',  color: '#C9A84C', bg: 'rgba(201,168,76,0.12)'  },
  westFacing:  { icon: <Sunset    size={18} />, label: 'West-Facing',  color: '#4A90D9', bg: 'rgba(74,144,217,0.12)'  },
  northFacing: { icon: <ArrowUp   size={18} />, label: 'North-Facing', color: '#4CAF74', bg: 'rgba(76,175,116,0.12)'  },
  southFacing: { icon: <ArrowDown size={18} />, label: 'South-Facing', color: '#E24B4A', bg: 'rgba(226,75,74,0.12)'   },
  cornerPlots: { icon: <Maximize2 size={18} />, label: 'Corner Plots', color: '#9B7B2E', bg: 'rgba(155,123,46,0.12)'  },
}

// ── Local pricing fallback (used when API is unavailable) ───────────────────
const LOCAL_PRICING = {
  anjana: {
    east:    { base: 13000, dev: 1000 },
    west:    { base: 12500, dev: 1000 },
    corners: [
      { type: 'North-East Corner', extra: 1000 },
      { type: 'Other Corners',     extra: 500  },
    ],
  },
  aparna: {
    east:    { base: 12000, dev: 1000 },
    west:    { base: 11500, dev: 1000 },
    corners: [
      { type: 'North-East Corner', extra: 1000 },
      { type: 'Other Corners',     extra: 500  },
    ],
  },
  varaha: {
    east:    { base: 15000, dev: 1000 },
    west:    { base: 14500, dev: 1000 },
    corners: [
      { type: 'North-East Corner', extra: 1000 },
      { type: 'Other Corners',     extra: 500  },
    ],
    corpus:  { amount: 100 },
  },
  trimbak: {
    east:    { base: 28999, dev: 1000 },
    west:    { base: 28499, dev: 1000 },
    corners: [
      { type: 'North-East Corner', extra: 1500 },
      { type: 'Other Corners',     extra: 1000 },
    ],
    corpus:  { amount: 100 },
  },
}

// ── Static plot data per venture (from Excel registers) ───────────────────────
const VENTURE_PLOTS = {
  anjana: {
    label:         'Anjana Paradise',
    short:         'Paritala',
    color:         '#1E4D2B',
    totalPlots:    242,
    priceRangeLabel: '₹Contact us for pricing',
    categories: {
      eastFacing: {
        label: 'East-Facing', description: 'Morning sunlight — ideal for Vaastu and wellness.',
        count: 112, priceFrom: 'Contact us',
        plotNumbers: [5,6,7,8,9,10,11,12,13,28,29,30,31,32,33,34,35,36,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,221,222,223,224,225,226,227,228,229,230,231,232,233,234],
      },
      westFacing: {
        label: 'West-Facing', description: 'Evening sunlight with open western views.',
        count: 122, priceFrom: 'Contact us',
        plotNumbers: [2,3,15,16,17,18,19,20,21,22,23,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,235,236,237,238,239,240,241,242],
      },
      cornerPlots: {
        label: 'Corner Plots', description: 'Premium corner plots with maximum road frontage.',
        count: 8, priceFrom: 'Contact us',
        plotNumbers: [1,4,14,24,25,26,27,37],
      },
    },
    byDimension: [
      { dimension: "33'×50'",  areaLabel: '183 Sq Yd', count: 101, priceFrom: 'Contact us' },
      { dimension: "33'×52'",  areaLabel: '191 Sq Yd', count: 33,  priceFrom: 'Contact us' },
      { dimension: "33'×58'",  areaLabel: '213 Sq Yd', count: 24,  priceFrom: 'Contact us' },
      { dimension: "50'×50'",  areaLabel: '278 Sq Yd', count: 13,  priceFrom: 'Contact us' },
      { dimension: "33'×54'",  areaLabel: '198 Sq Yd', count: 13,  priceFrom: 'Contact us' },
    ],
  },
  aparna: {
    label:         'Aparna Legacy',
    short:         'Chevitikallu',
    color:         '#C9A84C',
    totalPlots:    273,
    priceRangeLabel: '₹Contact us for pricing',
    categories: {
      eastFacing: {
        label: 'East-Facing', description: 'Morning sunlight — ideal for Vaastu and wellness.',
        count: 119, priceFrom: 'Contact us',
        plotNumbers: [3,4,5,6,10,11,12,13,19,20,21,22,23,24,25,26,27,28,42,43,44,45,46,47,48,49,50,51,52,53,54,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,216,217,218,219,220,221,222,223,224,225,226,227,228,229,248,249,250,251,252,262,263,264,265,266],
      },
      westFacing: {
        label: 'West-Facing', description: 'Evening sunlight with open western views.',
        count: 138, priceFrom: 'Contact us',
        plotNumbers: [1,2,7,8,9,14,15,16,17,18,29,30,31,32,33,34,35,36,37,38,39,40,41,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,198,199,200,201,202,203,204,205,206,207,208,209,210,211,230,231,232,233,234,235,236,237,238,239,253,254,255,256,257,267,268,269,270,271,272,273],
      },
      northFacing: {
        label: 'North-Facing', description: 'North-facing plots — premium Vaastu orientation.',
        count: 16, priceFrom: 'Contact us',
        plotNumbers: [212,213,214,215,240,241,242,243,244,245,246,247,258,259,260,261],
      },
    },
    byDimension: [
      { dimension: "30'×55'",  areaLabel: '183 Sq Yd', count: 148, priceFrom: 'Contact us' },
      { dimension: "32'×55'",  areaLabel: '196 Sq Yd', count: 11,  priceFrom: 'Contact us' },
      { dimension: "48'×55'",  areaLabel: '293 Sq Yd', count: 7,   priceFrom: 'Contact us' },
      { dimension: "38'×69'",  areaLabel: '292 Sq Yd', count: 6,   priceFrom: 'Contact us' },
      { dimension: "42'×64'",  areaLabel: '298 Sq Yd', count: 5,   priceFrom: 'Contact us' },
    ],
  },
  varaha: {
    label:           'Varaha Virtue',
    short:           'Pamarru',
    color:           '#1976D2',
    totalPlots:      132,
    priceRangeLabel: '₹Contact us for pricing',
    categories: {
      eastFacing: {
        label: 'East-Facing', description: 'Morning sunlight — ideal for Vaastu and wellness.',
        count: 79, priceFrom: 'Contact us',
        plotNumbers: [1,3,5,7,9,10,11,13,15,17,19,20,21,23,25,27,29,30,31,33,35,37,39,40,41,43,45,47,49,50,51,53,55,57,59,60,61,63,65,67,69,70,71,73,75,77,79,80,81,83,85,87,89,90,91,93,95,97,99,100,101,103,105,107,109,110,111,113,115,117,119,120,121,123,125,127,129,130,131],
      },
      westFacing: {
        label: 'West-Facing', description: 'Evening sunlight with open western views.',
        count: 53, priceFrom: 'Contact us',
        plotNumbers: [2,4,6,8,12,14,16,18,22,24,26,28,32,34,36,38,42,44,46,48,52,54,56,58,62,64,66,68,72,74,76,78,82,84,86,88,92,94,96,98,102,104,106,108,112,114,116,118,122,124,126,128,132],
      },
    },
    byDimension: [
      { dimension: "40'×56'", areaLabel: '249 Sq Yd', count: 83, priceFrom: 'Contact us' },
      { dimension: "50'×33'", areaLabel: '183 Sq Yd', count: 38, priceFrom: 'Contact us' },
      { dimension: 'Irregular', areaLabel: 'Varies',  count: 11, priceFrom: 'Contact us' },
    ],
  },
  trimbak: {
    label:    'Trimbak Oaks',
    short:    'Penamaluru',
    color:    '#C0522A',
    totalPlots: 324,
    upcoming: true,
    categories: {
      eastFacing: {
        label: 'East-Facing', description: 'Morning sunlight — ideal for Vaastu and wellness.',
        count: 138, priceFrom: 'Rs.28,999/sq.yd',
        plotNumbers: [17,18,19,20,21,22,34,35,36,37,39,40,41,52,53,54,55,57,58,59,71,72,73,74,76,77,78,91,92,93,94,95,96,97,98,99,112,113,114,115,116,117,118,119,120,132,133,134,135,136,137,138],
      },
      westFacing: {
        label: 'West-Facing', description: 'Evening sunlight with open western views.',
        count: 105, priceFrom: 'Rs.28,499/sq.yd',
        plotNumbers: [24,25,26,28,29,30,31,42,43,44,47,48,49,60,61,62,64,65,66,67,68,79,80,81,82,83,84,85,86,87,100,101,102,103,104,105,106,107,108,109,121,122,123,124,125,126,127,128],
      },
      cornerPlots: {
        label: 'Corner Plots', description: 'Premium corner plots with maximum road frontage.',
        count: 52, priceFrom: 'Rs.1,500/sq.yd extra',
        plotNumbers: [],
      },
    },
    byDimension: [
      { dimension: "50'×33'", areaLabel: '183 Sq Yd', count: 74, priceFrom: 'Contact us' },
      { dimension: "47'×33'", areaLabel: '172 Sq Yd', count: 43, priceFrom: 'Contact us' },
      { dimension: "36'×46'", areaLabel: '184 Sq Yd', count: 24, priceFrom: 'Contact us' },
      { dimension: "50'×45'", areaLabel: '250 Sq Yd', count: 20, priceFrom: 'Contact us' },
      { dimension: 'Irregular', areaLabel: 'Varies', count: 25, priceFrom: 'Contact us' },
    ],
  },
}

const VENTURE_KEYS   = ['anjana', 'aparna', 'varaha', 'trimbak']
const VENTURE_COLORS = { anjana: '#1E4D2B', aparna: '#C9A84C', varaha: '#1976D2', trimbak: '#C0522A' }

/**
 * PlotGrid — "Explore Available Plots" section with venture switcher.
 * Uses static data from Excel registers when API is unavailable.
 */
export default function PlotGrid({ onEnquire, pricingMap }) {
  const [ventureKey,     setVentureKey]     = useState('anjana')
  const [activeCategory, setActiveCategory] = useState(null)
  const [hoveredPlot,    setHoveredPlot]    = useState(null)
  const [priceOpen,      setPriceOpen]      = useState(false)
  const { t } = useLanguage()
  const tv = (key, fallback) => { const v = t(key); return (v && v !== key) ? v : fallback }
  const VENTURE_PRICING = pricingMap || LOCAL_PRICING

  const venture    = VENTURE_PLOTS[ventureKey]
  const color      = VENTURE_COLORS[ventureKey]
  const categories = venture.upcoming ? [] : Object.entries(venture.categories).map(([key, data]) => ({ key, data }))

  return (
    <section className="section section-cream" id="plots">
      <div className="sec-hdr">
        <div className="sec-tag">{tv('sections.plotCategories', 'Plot Categories')}</div>
        <h2 className="sec-title">{tv('sections.explorePlots', 'Explore')} <em>{tv('sections.availablePlots', 'Available Plots')}</em></h2>
        <p className="sec-sub">
          {venture.upcoming
            ? tv('sections.plotsComingSoon', 'Details coming soon — register your interest to be notified first.')
            : `${venture.totalPlots} ${tv('sections.plotsAcross', 'plots across')} ${categories.length} ${tv('sections.plotCategories2', 'categories. Click any category to see plot numbers and enquire directly.')}`}
        </p>
      </div>

      {/* ── Venture switcher ─────────────────────────────────────────────── */}
      <div className={styles.ventureSwitcher}>
        {VENTURE_KEYS.map(k => {
          const v = VENTURE_PLOTS[k]
          const isActive = ventureKey === k
          return (
            <button
              key={k}
              className={`${styles.ventureBtn} ${isActive ? styles.ventureBtnActive : ''}`}
              style={isActive ? { background: VENTURE_COLORS[k], borderColor: VENTURE_COLORS[k] } : { '--vbtn-color': VENTURE_COLORS[k] }}
              onClick={() => { setVentureKey(k); setActiveCategory(null); setPriceOpen(false) }}
            >
              <span className={styles.ventureBtnName} style={{ color: isActive ? '#fff' : VENTURE_COLORS[k] }}>{(() => { const nk = 'projects.' + k + '.name'; const nv = t(nk); return (nv && nv !== nk) ? nv : v.label })()}</span>
              <span className={styles.ventureBtnSub}  style={{ color: isActive ? 'rgba(255,255,255,.75)' : 'var(--text-light)' }}>{(() => { const locKey = 'projects.' + k + '.locShort'; const locV = t(locKey); return (locV && locV !== locKey) ? locV : v.short })()}</span>
              <span className={styles.ventureBtnCount} style={isActive ? { background: 'rgba(255,255,255,.2)', color: '#fff' } : { background: `${VENTURE_COLORS[k]}22`, color: VENTURE_COLORS[k] }}>
                {v.upcoming ? `🔜 ${tv('common.upcoming', 'Upcoming')}` : v.totalPlots ? `${v.totalPlots} ${tv('common.plots', 'plots')}` : tv('common.upcoming', 'Upcoming')}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Price banner / Upcoming placeholder ──────────────────────────── */}
      {venture.upcoming ? (
        <motion.div
          key="upcoming"
          className={styles.upcomingCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ borderColor: `${color}44` }}
        >
          {/* Show pricing if available even for upcoming */}
          {VENTURE_PRICING[ventureKey] ? (
            <>
              {(() => {
                const vp = VENTURE_PRICING[ventureKey]
                if (!vp) return null
                return (
                  <div className={styles.priceGrid}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceDir}>☀ {tv('facings.east', 'East Facing')}</span>
                      <span className={styles.priceVal}>
                        ₹{vp.east.base.toLocaleString('en-IN')} + ₹{vp.east.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')} {tv('project.charges', 'Charges')}
                        <strong> = ₹{(vp.east.base + vp.east.dev).toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')}</strong>
                      </span>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.priceDir}>🌙 {tv('facings.west', 'West Facing')}</span>
                      <span className={styles.priceVal}>
                        ₹{vp.west.base.toLocaleString('en-IN')} + ₹{vp.west.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')} {tv('project.charges', 'Charges')}
                        <strong> = ₹{(vp.west.base + vp.west.dev).toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')}</strong>
                      </span>
                    </div>
                    <div className={styles.priceDivider}>{tv('project.cornerCharges', 'Corner Charges (Extra)')}</div>
                    {vp.corners.map((c, i) => {
                      const CORNER_MAP = {
                        'North-East Corner': tv('project.cornerNE', 'North-East Corner'),
                        'Other Corners':     tv('project.cornerOther', 'Other Corners'),
                      }
                      return (
                        <div key={i} className={styles.priceRow}>
                          <span className={styles.priceDir}>{CORNER_MAP[c.type] || c.type}</span>
                          <span className={styles.priceVal}>₹{c.extra.toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')} {tv('project.extra', 'extra')}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
              <p className={styles.upcomingDesc} style={{ marginTop: 12 }}>
                {tv('sections.trimbakUpcomingDesc', 'Plot details for Trimbak Oaks, Penamaluru will be available shortly. Register your interest now and be the first to know when bookings open.')}
              </p>
            </>
          ) : (
            <>
              <div className={styles.upcomingIcon}>🔜</div>
              <div className={styles.upcomingTitle} style={{ color }}>{(() => { const nk = 'projects.trimbak.name'; const nv = t(nk); return (nv && nv !== nk) ? nv : 'Trimbak Oaks' })()} — {tv('portfolio.comingSoon', 'Coming Soon')}</div>
              <p className={styles.upcomingDesc}>
                {tv('sections.trimbakUpcomingDesc', 'Plot details for Trimbak Oaks, Penamaluru will be available shortly. Register your interest now and be the first to know when bookings open.')}
              </p>
            </>
          )}
          <button
            className="btn btn-gold"
            onClick={() => onEnquire({ source: 'UPCOMING_INTEREST', venture: 'Trimbak Oaks', type: 'NOTIFY_ME' })}
          >
            {tv('portfolio.interestedBtn', 'Register Interest →')}
          </button>
        </motion.div>
      ) : (
        <>
          {/* Price range banner */}
          {(() => {
            const vp = VENTURE_PRICING[ventureKey]
            if (!vp) return (
              <div className={styles.priceBanner} style={{ background: color }}>
                <span className={styles.priceBannerLabel}>{tv('project.priceRange', 'Price Range')}</span>
                <span className={styles.priceBannerValue}>{venture.priceRangeLabel}</span>
                <span className={styles.priceBannerNote}>{tv('sections.contactForPricing', 'Contact us for exact plot pricing')}</span>
              </div>
            )
            return (
              <div className={styles.priceBannerWrap}>
                <button
                  className={styles.priceBanner}
                  style={{ background: color, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  onClick={() => setPriceOpen(o => !o)}
                >
                  <span className={styles.priceBannerLabel} style={{ color: 'rgba(255,255,255,0.75)' }}>{tv('project.priceRange', 'Price Range')}</span>
                  <span className={styles.priceBannerValue} style={{ color: '#fff', fontSize: '15px' }}>
                    {tv('project.eastShort', 'East')}: ₹{vp.east.base.toLocaleString('en-IN')} &nbsp;|&nbsp; {tv('project.westShort', 'West')}: ₹{vp.west.base.toLocaleString('en-IN')}
                    <span style={{fontSize:'12px',opacity:.8}}> + ₹{vp.east.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')}</span>
                  </span>
                  <span className={styles.priceBannerNote} style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    {priceOpen ? tv('sections.hidePricing', 'Hide pricing ▲') : tv('sections.viewPricing', 'View full pricing ▼')}
                  </span>
                </button>

                {priceOpen && (
                  <motion.div
                    className={styles.priceExpanded}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.priceGrid}>
                      <div className={styles.priceRow}>
                        <span className={styles.priceDir}>☀ {tv('facings.east', 'East Facing')}</span>
                        <span className={styles.priceVal}>
                          ₹{vp.east.base.toLocaleString('en-IN')} + ₹{vp.east.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')} {tv('project.charges', 'Charges')}
                          <strong> = ₹{(vp.east.base + vp.east.dev).toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')}</strong>
                        </span>
                      </div>
                      <div className={styles.priceRow}>
                        <span className={styles.priceDir}>🌙 {tv('facings.west', 'West Facing')}</span>
                        <span className={styles.priceVal}>
                          ₹{vp.west.base.toLocaleString('en-IN')} + ₹{vp.west.dev.toLocaleString('en-IN')} {tv('project.dev', 'Dev.')} {tv('project.charges', 'Charges')}
                          <strong> = ₹{(vp.west.base + vp.west.dev).toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')}</strong>
                        </span>
                      </div>
                      <div className={styles.priceDivider}>{tv('project.cornerCharges', 'Corner Charges (Extra)')}</div>
                      {vp.corners.map((c, i) => {
                        const CORNER_MAP = {
                          'North-East Corner': tv('project.cornerNE', 'North-East Corner'),
                          'Other Corners':     tv('project.cornerOther', 'Other Corners'),
                        }
                        return (
                          <div key={i} className={styles.priceRow}>
                            <span className={styles.priceDir}>{CORNER_MAP[c.type] || c.type}</span>
                            <span className={styles.priceVal}>₹{c.extra.toLocaleString('en-IN')}/{tv('project.sqYdShort', 'sq.yd')} {tv('project.extra', 'extra')}</span>
                          </div>
                        )
                      })}
                      {vp.corpus && (
                        <div className={styles.priceRow}>
                          <span className={styles.priceDir}>{tv('project.corpusFund', 'Corpus Fund')}</span>
                          <span className={styles.priceVal}>₹{vp.corpus.amount}/{tv('project.sqYdShort', 'sq.yd')}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })()}

          {/* Category cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={ventureKey}
              className={styles.categoryGrid}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {categories.map(({ key, data }) => {
                const meta   = CATEGORY_META[key]
                const CAT_LABEL_KEYS = {
                  'East-Facing':  'sections.eastFacing',
                  'West-Facing':  'sections.westFacing',
                  'Corner Plots': 'sections.cornerPlots',
                  'North-Facing': 'sections.northFacing',
                  'South-Facing': 'sections.southFacing',
                }
                const CAT_DESC_KEYS = {
                  'East-Facing':  'sections.eastFacingDesc',
                  'West-Facing':  'sections.westFacingDesc',
                  'Corner Plots': 'sections.cornerPlotsDesc',
                }
                const lk = CAT_LABEL_KEYS[data.label]; const lv = t(lk||'')
                const dk = CAT_DESC_KEYS[data.label];  const dv = t(dk||'')
                const translatedData = {
                  ...data,
                  label:       (lv && lv !== lk) ? lv : data.label,
                  description: (dv && dv !== dk) ? dv : data.description,
                }
                const isOpen = activeCategory === key
                return (
                  <motion.div key={key} layout>
                    <CategoryCard
                      meta={meta}
                      data={translatedData}
                      isOpen={isOpen}
                      onToggle={() => setActiveCategory(isOpen ? null : key)}
                      onEnquire={onEnquire}
                      hoveredPlot={hoveredPlot}
                      setHoveredPlot={setHoveredPlot}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* By Plot Size breakdown */}
          <div className={styles.dimSection}>
            <h3 className={styles.dimTitle}>{tv('sections.byPlotSize', 'By Plot Size')}</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={`dim-${ventureKey}`}
                className={styles.dimGrid}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {venture.byDimension.map((d) => (
                  <motion.div
                    key={d.dimension}
                    className={styles.dimCard}
                    whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(30,77,43,0.12)' }}
                  >
                    <div className={styles.dimNum}>{d.count}</div>
                    <div className={styles.dimLabel}>{d.dimension} ft</div>
                    <div className={styles.dimArea}>{d.areaLabel.replace('Sq Yd', tv('project.sqYdFull', 'Sq Yd'))}</div>
                    <div className={styles.dimPrice} style={{ color }}>{d.priceFrom === 'Contact us' ? tv('sections.contactUs', 'Contact us') : d.priceFrom}</div>
                    <button
                      className={`btn btn-green btn-sm ${styles.dimBtn}`}
                      onClick={() => onEnquire({ category: d.dimension, source: 'DIMENSION_ENQUIRY', venture: venture.label })}
                    >
                      {tv('nav.enquireNow', 'Enquire')}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  )
}
