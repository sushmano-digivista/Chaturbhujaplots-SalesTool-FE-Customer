import { useState }    from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation }  from 'lucide-react'
import styles from './Sections.module.css'

// ── Per-venture colour palette ────────────────────────────────────────────────
const PALETTE = [
  { color: '#1E4D2B', light: 'rgba(30,77,43,.10)',   text: '#1E4D2B' },  // Anjana  — brand green
  { color: '#C9A84C', light: 'rgba(201,168,76,.12)', text: '#8B6914' },  // Aparna  — gold
  { color: '#1976D2', light: 'rgba(25,118,210,.10)', text: '#1565C0' },  // Varaha  — blue
  { color: '#C0522A', light: 'rgba(192,82,42,.10)',  text: '#9D3E1A' },  // Trimbak — terracotta
]

// ── Static venture definitions ────────────────────────────────────────────────
const VENTURES = [
  {
    id:      'anjana',
    name:    'Anjana Paradise',
    short:   'Paritala',
    address: 'Paritala Village, Kanchikacherla Mandal, N.T.R District, AP',
    badges:  ['CRDA Approved', 'RERA Registered'],
    mapUrl:  'https://maps.google.com/maps?q=Paritala+Village+Kanchikacherla+Mandal+NTR+District+Andhra+Pradesh&output=embed&z=14&iwloc=B',
    openUrl: 'https://maps.google.com/?q=Paritala+Village,Kanchikacherla+Mandal,NTR+District,Andhra+Pradesh',
    distances: [
      { icon: '🏛️', name: 'Amaravati Capital',    subtitle: 'New AP State Capital',     distance: '8 km'  },
      { icon: '🛣️', name: 'NH-16 National Hwy',   subtitle: 'Adjacent — direct access', distance: '0 km'  },
      { icon: '🎓', name: 'Engineering Colleges',  subtitle: 'Amrita Sai, MVR, MIC',     distance: '5 km'  },
      { icon: '🏥', name: 'Nimra Medical College', subtitle: 'Healthcare hub',            distance: '7 km'  },
      { icon: '🏏', name: 'Mulapadu Stadium',      subtitle: 'International Cricket',     distance: '6 km'  },
      { icon: '✈️', name: 'Vijayawada Airport',    subtitle: 'Air connectivity',          distance: '22 km' },
    ],
    highlights: [
      'The property is strategically located adjacent to National Highway ensuring excellent connectivity.',
      'Venture located within an 8 km radius of A.P. Capital, Amaravati.',
      'Govt. proposed road connectivity to A.P. Capital, Amaravati.',
      'Govt. proposed railway connectivity from Amaravati to Paritala.',
      'Govt. proposed Logistic Hub in Paritala.',
      'Our venture located in close proximity to renowned Engineering Colleges such as Amrita Sai, MVR College and MIC College.',
      'This venture located in close proximity to Nimra Medical College.',
      'Our venture located close to Mulapadu Cricket Stadium.',
      'The Government proposed Cine Studio near to Nandigama.',
    ],
  },
  {
    id:      'aparna',
    name:    'Aparna Legacy',
    short:   'Chevitikallu',
    address: 'Chevitikallu Village, Kanchikacherla Mandal, N.T.R District, AP',
    badges:  ['CRDA Approved', 'RERA Registered'],
    mapUrl:  'https://maps.google.com/maps?q=Chevitikallu+Village+Kanchikacherla+Mandal+NTR+District+Andhra+Pradesh&output=embed&z=14&iwloc=B',
    openUrl: 'https://maps.google.com/?q=Chevitikallu+Village,Kanchikacherla+Mandal,NTR+District,Andhra+Pradesh',
    distances: [
      { icon: '🏛️', name: 'Amaravati Capital',     subtitle: 'New AP State Capital',     distance: '10 km' },
      { icon: '🛣️', name: 'NH-16 National Hwy',    subtitle: 'Direct road access',       distance: '2 km'  },
      { icon: '🎓', name: 'Kanchikacherla Town',    subtitle: 'Education & commerce hub', distance: '3 km'  },
      { icon: '🏥', name: 'Govt. District Hospital',subtitle: 'NTR District HQ',          distance: '12 km' },
      { icon: '🚂', name: 'Kanchikacherla Stn.',    subtitle: 'Rail connectivity',         distance: '4 km'  },
      { icon: '✈️', name: 'Vijayawada Airport',    subtitle: 'Air connectivity',           distance: '25 km' },
    ],
    highlights: [
      'The property is strategically located very near to ORR ensuring excellent connectivity to A.P. Capital, Amaravati.',
      'Venture located within 12 km radius of A.P. Capital, Amaravati.',
      'Govt. proposed railway connectivity from Amaravati.',
      'Our venture located in close proximity to renowned Engineering Colleges such as Amrita Sai, MVR College and MIC College.',
      'Govt. proposed Logistic Hub in Paritala.',
      'This venture located in close proximity to Nimra Medical College.',
      'Our venture located close to Mulapadu Cricket Stadium.',
      'The Government proposed Cine Studio near to Nandigama.',
    ],
  },
  {
    id:      'varaha',
    name:    'Varaha Virtue',
    short:   'Pamarru',
    address: 'Pamarru Village & Mandal, Krishna District, AP',
    badges:  ['RERA Registered'],
    mapUrl:  'https://maps.google.com/maps?q=Pamarru+Village+Krishna+District+Andhra+Pradesh&output=embed&z=14&iwloc=B',
    openUrl: 'https://maps.google.com/?q=Pamarru+Village,Krishna+District,Andhra+Pradesh',
    distances: [
      { icon: '🏙️', name: 'Vijayawada City',      subtitle: 'Commercial capital of AP',  distance: '18 km' },
      { icon: '🛣️', name: 'NH-16 National Hwy',   subtitle: 'Close highway access',      distance: '5 km'  },
      { icon: '🎓', name: 'Pamarru Colleges',      subtitle: 'Local education hub',       distance: '1 km'  },
      { icon: '🏥', name: 'Apollo Hospital',       subtitle: 'Vijayawada healthcare',     distance: '20 km' },
      { icon: '🚂', name: 'Pamarru Railway Stn.',  subtitle: 'Direct rail to Vijayawada', distance: '2 km'  },
      { icon: '✈️', name: 'Vijayawada Airport',   subtitle: 'Air connectivity',           distance: '30 km' },
    ],
    highlights: [
      'Adjacent to National Highway.',
      '15 km from Kathipudi - Ongole Highway.',
      '5 km to BEL Company.',
      'Ready to build housing project.',
      '20 km to Bandar Port.',
      'Adjacent to proposed 6 Lane Vijayawada - Machilipatnam Road.',
      'Near proximity to Engineering Colleges.',
      '6 km to world renowned Bharatanatyam Institution.',
    ],
  },
  {
    id:      'trimbak',
    name:    'Trimbak Oaks',
    short:   'Penamaluru',
    address: 'Penamaluru, Vijayawada, Andhra Pradesh',
    badges:  ['RERA Registered'],
    mapUrl:  'https://maps.google.com/maps?q=Penamaluru+Vijayawada+Andhra+Pradesh&output=embed&z=14&iwloc=B',
    openUrl: 'https://maps.google.com/?q=Penamaluru,Vijayawada,Andhra+Pradesh',
    distances: [
      { icon: '🏙️', name: 'Vijayawada Centre',    subtitle: 'City core — 15 min drive',  distance: '8 km'  },
      { icon: '🛣️', name: 'NH-65 National Hwy',   subtitle: 'Direct highway access',     distance: '1 km'  },
      { icon: '🎓', name: 'VIT-AP University',     subtitle: 'Premier engineering campus',distance: '4 km'  },
      { icon: '🏥', name: 'Manipal Hospital',      subtitle: 'Penamaluru healthcare',     distance: '3 km'  },
      { icon: '🚂', name: 'Vijayawada Junction',   subtitle: 'Major railway hub',          distance: '10 km' },
      { icon: '✈️', name: 'Vijayawada Airport',   subtitle: 'Air connectivity',            distance: '12 km' },
    ],
    highlights: [
      'Adjacent to National Highway.',
      '15 km from Kathipudi - Ongole Highway.',
      '5 km to BEL Company.',
      'Ready to build housing project.',
      '20 km to Bandar Port.',
      'Adjacent to proposed 6 Lane Vijayawada - Machilipatnam Road.',
      'Near proximity to Engineering Colleges.',
      '6 km to world renowned Bharatanatyam Institution.',
    ],
  },
]

export default function LocationSection({ content }) {
  const [active, setActive] = useState(0)
  const { ref, inView }     = useInView({ triggerOnce: true, threshold: 0.25 })

  const venture = VENTURES[active]
  const palette = PALETTE[active]

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">Find Us</div>
        <h2 className="sec-title">Location & <em>Connectivity</em></h2>
        <p className="sec-sub">All ventures located in prime corridors of Andhra Pradesh.</p>
      </div>

      {/* ── Venture tab selector ─────────────────────────────────────────── */}
      <div className={styles.ventureTabs}>
        {VENTURES.map((v, i) => {
          const p      = PALETTE[i]
          const isActive = active === i
          return (
            <button
              key={v.id}
              className={`${styles.ventureTab} ${isActive ? styles.ventureTabActive : ''}`}
              style={isActive
                ? { background: p.color, borderColor: p.color }
                : { '--tab-hover-bg': p.light, '--tab-dot': p.color, '--tab-name': p.color }
              }
              onClick={() => setActive(i)}
            >
              <span className={styles.ventureTabDot} style={{ background: isActive ? '#fff' : p.color }} />
              <span className={styles.ventureTabName} style={{ color: isActive ? '#fff' : p.color }}>{v.name}</span>
              <span className={styles.ventureTabShort} style={{ color: isActive ? 'rgba(255,255,255,.75)' : 'var(--text-light)' }}>{v.short}</span>
            </button>
          )
        })}
      </div>

      {/* ── Map embed ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={venture.id}
          className={styles.mapWrap}
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{ borderColor: palette.color }}
        >
          <iframe
            src={venture.mapUrl}
            className={styles.iframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${venture.name} Location`}
          />

          {/* Popup pin */}
          <motion.div
            className={styles.popup}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className={styles.popupTitle} style={{ color: palette.color }}>📍 {venture.name}</div>
            <div className={styles.popupSub}>{venture.address}</div>
            <div className={styles.popupBadges}>
              {venture.badges.map(b => (
                <span key={b} className={styles.badgeGreen}
                  style={{ background: palette.light, color: palette.text, borderColor: `${palette.color}44` }}>
                  {b}
                </span>
              ))}
            </div>
            <button className={styles.popupBtn} style={{ background: palette.color }}
              onClick={() => window.open(venture.openUrl, '_blank')}>
              Open in Maps
            </button>
            <div className={styles.popupArrow} />
          </motion.div>

          {/* Bottom info bar */}
          <div className={styles.mapBar} style={{ background: `${palette.color}E6` }}>
            <div className={styles.barLeft}>
              <div className={styles.liveDot} />
              <div>
                <div className={styles.barName}>{venture.name}</div>
                <div className={styles.barAddr}>{venture.address}</div>
              </div>
            </div>
            <button className="btn btn-gold btn-sm"
              onClick={() => window.open(venture.openUrl, '_blank')}>
              <Navigation size={14} /> Get Directions
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Distance cards + Location Highlights — both switch per venture ─ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${venture.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* Distance cards */}
          <div className={styles.distGrid}>
            {venture.distances.map((d, i) => (
              <motion.div
                key={d.name}
                className={styles.distCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2, boxShadow: 'var(--shadow)' }}
              >
                <div className={styles.distIcon} style={{ background: palette.light }}>{d.icon}</div>
                <div className={styles.distBody}>
                  <div className={styles.distName}>{d.name}</div>
                  <div className={styles.distSub}>{d.subtitle}</div>
                </div>
                <div className={styles.distBadge}
                  style={{ background: palette.light, color: palette.text }}>
                  {d.distance}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Location Highlights */}
          <div className={styles.highlightsBox} style={{ borderColor: `${palette.color}33`, background: palette.light }}>
            <div className={styles.highlightsTitle} style={{ color: palette.color }}>
              📌 Location Highlights
            </div>
            <ul className={styles.highlightsList}>
              {venture.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  className={styles.highlightItem}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className={styles.highlightDot} style={{ background: palette.color }} />
                  {h}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
