import { useState }    from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation }  from 'lucide-react'
import styles from './Sections.module.css'

// ── Static venture definitions — one entry per project ───────────────────────
const VENTURES = [
  {
    id:       'anjana',
    name:     'Anjana Paradise',
    short:    'Paritala',
    address:  'Paritala Village, Kanchikacherla Mandal, N.T.R District, AP',
    badges:   ['CRDA Approved', 'RERA Registered'],
    mapUrl:   'https://maps.google.com/maps?q=Paritala+Village+Kanchikacherla+Mandal+NTR+District+Andhra+Pradesh&output=embed&z=14',
    openUrl:  'https://maps.google.com/?q=Paritala+Village,Kanchikacherla+Mandal,NTR+District,Andhra+Pradesh',
  },
  {
    id:       'aparna',
    name:     'Aparna Legacy',
    short:    'Chevitikallu',
    address:  'Chevitikallu Village, Kanchikacherla Mandal, N.T.R District, AP',
    badges:   ['CRDA Approved', 'RERA Registered'],
    mapUrl:   'https://maps.google.com/maps?q=Chevitikallu+Village+Kanchikacherla+Mandal+NTR+District+Andhra+Pradesh&output=embed&z=14',
    openUrl:  'https://maps.google.com/?q=Chevitikallu+Village,Kanchikacherla+Mandal,NTR+District,Andhra+Pradesh',
  },
  {
    id:       'varaha',
    name:     'Varaha Virtue',
    short:    'Pamarru',
    address:  'Pamarru Village & Mandal, Krishna District, AP',
    badges:   ['RERA Registered'],
    mapUrl:   'https://maps.google.com/maps?q=Pamarru+Village+Krishna+District+Andhra+Pradesh&output=embed&z=14',
    openUrl:  'https://maps.google.com/?q=Pamarru+Village,Krishna+District,Andhra+Pradesh',
  },
  {
    id:       'trimbak',
    name:     'Trimbak Oaks',
    short:    'Penamaluru',
    address:  'Penamaluru, Vijayawada, Andhra Pradesh',
    badges:   ['RERA Registered'],
    mapUrl:   'https://maps.google.com/maps?q=Penamaluru+Vijayawada+Andhra+Pradesh&output=embed&z=14',
    openUrl:  'https://maps.google.com/?q=Penamaluru,Vijayawada,Andhra+Pradesh',
  },
]

export default function LocationSection({ content }) {
  const [active, setActive] = useState(0)
  const distances = (content?.distances || []).sort((a, b) => a.sortOrder - b.sortOrder)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 })

  const venture = VENTURES[active]

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">Find Us</div>
        <h2 className="sec-title">Location & <em>Connectivity</em></h2>
        <p className="sec-sub">All ventures located in prime corridors of Andhra Pradesh.</p>
      </div>

      {/* ── Venture tab selector ─────────────────────────────────────────── */}
      <div className={styles.ventureTabs}>
        {VENTURES.map((v, i) => (
          <button
            key={v.id}
            className={`${styles.ventureTab} ${active === i ? styles.ventureTabActive : ''}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.ventureTabDot} />
            <span className={styles.ventureTabName}>{v.name}</span>
            <span className={styles.ventureTabShort}>{v.short}</span>
          </button>
        ))}
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
          transition={{ duration: 0.35 }}
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
            <div className={styles.popupTitle}>📍 {venture.name}</div>
            <div className={styles.popupSub}>{venture.address}</div>
            <div className={styles.popupBadges}>
              {venture.badges.map(b => (
                <span key={b} className={b.includes('CRDA') ? styles.badgeGreen : styles.badgeBlue}>
                  {b}
                </span>
              ))}
            </div>
            <button
              className={styles.popupBtn}
              onClick={() => window.open(venture.openUrl, '_blank')}
            >
              Open in Maps
            </button>
            <div className={styles.popupArrow} />
          </motion.div>

          {/* Bottom info bar */}
          <div className={styles.mapBar}>
            <div className={styles.barLeft}>
              <div className={styles.liveDot} />
              <div>
                <div className={styles.barName}>{venture.name}</div>
                <div className={styles.barAddr}>{venture.address}</div>
              </div>
            </div>
            <button
              className="btn btn-gold btn-sm"
              onClick={() => window.open(venture.openUrl, '_blank')}
            >
              <Navigation size={14} /> Get Directions
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Distance / connectivity cards ────────────────────────────────── */}
      {distances.length > 0 && (
        <div className={styles.distGrid}>
          {distances.map((d, i) => (
            <motion.div
              key={d.name}
              className={styles.distCard}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, boxShadow: 'var(--shadow)' }}
            >
              <div className={styles.distIcon}>{d.icon}</div>
              <div className={styles.distBody}>
                <div className={styles.distName}>{d.name}</div>
                <div className={styles.distSub}>{d.subtitle}</div>
              </div>
              <div className={styles.distBadge}>{d.distance}</div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
