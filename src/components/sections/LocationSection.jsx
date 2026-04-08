import { useState }    from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation }  from 'lucide-react'
import { openMaps }    from '@/utils/security'
import { useContactSettings } from '@/hooks/useData'
import { useLanguage } from '@/context/LanguageContext'
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
      { icon: '🛣️', name: 'NH-16 National Hwy',       subtitle: 'Adjacent — direct access',          distance: '0 km'  },
      { icon: '🏛️', name: 'Amaravati Capital',         subtitle: 'A.P. State Capital',                distance: '8 km'  },
      { icon: '🎓', name: 'Engineering Colleges',       subtitle: 'Amrita Sai, MVR, MIC',              distance: '5 km'  },
      { icon: '🏥', name: 'Nimra Medical College',      subtitle: 'Healthcare hub',                    distance: '7 km'  },
      { icon: '🏏', name: 'Mulapadu Cricket Stadium',   subtitle: 'International Cricket',             distance: '6 km'  },
      { icon: '🎬', name: 'Cine Studio',                subtitle: 'Govt. proposed, Nandigama',         distance: 'Nearby'},
      { icon: '🚉', name: 'Railway Connectivity',       subtitle: 'Govt. proposed, Amaravati–Paritala',distance: 'Proposed'},
      { icon: '🏭', name: 'Logistic Hub',               subtitle: 'Govt. proposed, Paritala',          distance: 'Proposed'},
      { icon: '🙏', name: 'Hanuman Temple',              subtitle: 'Just minutes away',                 distance: 'Nearby'  },
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
      { icon: '🛣️', name: 'ORR (Ring Road)',            subtitle: 'Very near, excellent connectivity', distance: 'Nearby' },
      { icon: '🏛️', name: 'Amaravati Capital',          subtitle: 'A.P. State Capital',                distance: '12 km'  },
      { icon: '🎓', name: 'Engineering Colleges',        subtitle: 'Amrita Sai, MVR, MIC',              distance: 'Nearby' },
      { icon: '🏭', name: 'Logistic Hub',                subtitle: 'Govt. proposed, Paritala',          distance: 'Proposed'},
      { icon: '🏥', name: 'Nimra Medical College',       subtitle: 'Healthcare hub',                    distance: 'Nearby' },
      { icon: '🏏', name: 'Mulapadu Cricket Stadium',    subtitle: 'International Cricket',             distance: 'Nearby' },
      { icon: '🎬', name: 'Cine Studio',                 subtitle: 'Govt. proposed, Nandigama',         distance: 'Proposed'},
      { icon: '🚉', name: 'Railway Connectivity',        subtitle: 'Govt. proposed, from Amaravati',    distance: 'Proposed'},
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
      { icon: '🛣️', name: 'National Highway',          subtitle: 'Adjacent — direct access',          distance: '0 km'   },
      { icon: '🛤️', name: 'Kathipudi–Ongole Hwy',      subtitle: 'Secondary highway access',          distance: '15 km'  },
      { icon: '🏭', name: 'BEL Company',                subtitle: 'Bharat Electronics Limited',        distance: '5 km'   },
      { icon: '⚓', name: 'Bandar Port',                subtitle: 'Machilipatnam port',                distance: '20 km'  },
      { icon: '🛣️', name: '6-Lane Vja–Mtm Road',       subtitle: 'Proposed Vijayawada–Machilipatnam', distance: 'Adjacent'},
      { icon: '🎓', name: 'Engineering Colleges',       subtitle: 'Near proximity',                    distance: 'Nearby' },
      { icon: '💃', name: 'Bharatanatyam Institution',  subtitle: 'World renowned dance school',       distance: '6 km'   },
      { icon: '🏠', name: 'Housing Project',            subtitle: 'Ready to build',                    distance: 'Ready'  },
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
  },
]

export default function LocationSection({ content }) {
  const [active, setActive] = useState(0)
  const { ref, inView }     = useInView({ triggerOnce: true, threshold: 0.25 })
  const { data: ownerSettings } = useContactSettings()
  const { t } = useLanguage()

  const tloc = (val, key) => {
    if (!key) return val
    const v = t('locationLabels.' + key)
    return (v && v !== 'locationLabels.' + key) ? v : val
  }
  const LOC_NAME_KEYS = {
    'NH-16 National Hwy':        'nh16Highway',
    'NH-16 National Highway':    'nh16Highway',
    'Amaravati Capital':         'amaravatiCapital',
    'Engineering Colleges':      'engineeringColleges',
    'Nimra Medical College':     'nimraMedical',
    'Mulapadu Cricket Stadium':  'mulapaduStadium',
    'Cine Studio':               'cineStudio',
    'Railway Connectivity':      'railwayConn',
    'Logistic Hub':              'logisticHub',
    'Hanuman Temple':            'hanumanTemple',
    'Outer Ring Road (ORR)':     'outerRingRoad',
    'BEL Company (Defence PSU)': 'belCompany',
    'Bandar Port':               'bandarPort',
    'Bharatanatyam Institution': 'bharatanatyam',
    'Vijayawada Airport':        'vijayawadaAirport',
    'Vijayawada':                'vijayawadaCity',
  }
  const LOC_SUB_KEYS = {
    'Adjacent — direct access':           'nh16Sub',
    'A.P. State Capital':                 'amaravatiCapitalSub',
    'New AP State Capital':               'amaravatiCapitalSub',
    'Amrita Sai, MVR, MIC':              'engineeringColSub2',
    'Healthcare hub':                     'healthcareHub',
    'International Cricket':              'intlCricket',
    'Govt. proposed, Nandigama':          'cineStudioSub',
    'Govt. proposed, Amaravati-Paritala': 'railwayConnSub',
    'Govt. proposed, Paritala':           'logisticHubSub',
    'Just minutes away':                  'hanumanTempleSub2',
    'Proposed — excellent access':        'orrSub',
    'Bharat Electronics Limited':         'belSub',
    'Major commercial seaport':           'bandarSub',
    'World-renowned arts centre':         'bharatanatyamSub',
    'Air connectivity':                   'airConnectivity',
    'Commercial capital of AP':           'vijayawadaSub',
    'Directly Adjacent':                  'nh16Sub2',
  }

  const venture = {
    ...VENTURES[active],
    address: (VENTURES[active].id === 'aparna' && ownerSettings?.aparna_contact_address)
      ? ownerSettings.aparna_contact_address
      : VENTURES[active].address,
  }
  const palette = PALETTE[active]

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">{t('sections.findUs') || 'Find Us'}</div>
        <h2 className="sec-title">{t('sections.locationTitle') || 'Location'} & <em>{t('sections.locationEm') || 'Connectivity'}</em></h2>
        <p className="sec-sub">{t('sections.locationSub') || 'All ventures located in prime corridors of Andhra Pradesh.'}</p>
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
              {venture.badges.map(b => {
                const BADGE_MAP = {
                  'CRDA Approved':  'approvals.crdaApproved',
                  'RERA Registered':'approvals.reraRegistered',
                }
                const k = BADGE_MAP[b]
                const v = k ? t(k) : null
                const label = (v && v !== k) ? v : b
                return (
                  <span key={b} className={styles.badgeGreen}
                  style={{ background: palette.light, color: palette.text, borderColor: `${palette.color}44` }}>
                  {label}
                </span>
                )
              })}
            </div>
            <button className={styles.popupBtn} style={{ background: palette.color }}
              onClick={() => openMaps(venture.openUrl)}>
              {t('sections.openInMaps') || 'Open in Maps'}
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
              onClick={() => openMaps(venture.openUrl)}>
              <Navigation size={14} /> {t('contact.getDirections')}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Distance cards — switch per venture ─────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`dist-${venture.id}`}
          className={styles.distGrid}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
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
                <div className={styles.distName}>{tloc(d.name, LOC_NAME_KEYS[d.name] || '')}</div>
                <div className={styles.distSub}>{tloc(d.subtitle, LOC_SUB_KEYS[d.subtitle] || '')}</div>
              </div>
              <div className={styles.distBadge} style={{ background: palette.light, color: palette.text }}>
                {d.distance}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

