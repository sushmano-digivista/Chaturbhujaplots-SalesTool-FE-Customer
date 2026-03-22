import { useNavigate } from 'react-router-dom'
import { motion }      from 'framer-motion'
import CountUp         from 'react-countup'
import { useInView }   from 'react-intersection-observer'
import { MapPin, ArrowRight } from 'lucide-react'
import { usePlotSummary } from '@/hooks/useData'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import styles from './Hero.module.css'

const ACCENT_COLORS = {
  accentGold:   '#C9A84C',
  accentGreen:  '#4CAF74',
  accentBlue:   '#64B5F6',
  accentOrange: '#FFB74D',
}

export default function Hero({ content, onEnquire }) {
  const { data: summary }     = usePlotSummary()
  const { ref, inView }       = useInView({ triggerOnce: true, threshold: 0.1 })
  const navigate              = useNavigate()

  const hero    = content?.hero    || {}
  const contact = content?.contact || {}
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const globalStats = [
    { value: 10,   suffix: '+',   label: 'Projects'     },
    { value: 1000, suffix: '+',   label: 'Families'     },
    { value: 15,   suffix: '+',   label: 'Years Trust'  },
    { value: 100,  suffix: '%',   label: 'CRDA / RERA'  },
  ]

  return (
    <section className={styles.hero} id="home" ref={ref}>
      <div className={styles.overlay} />
      <div className={styles.grain} />

      <div className={styles.inner}>

        {/* ── Top label ──────────────────────────────────────────── */}
        <motion.div className={styles.topLabel}
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <span className={styles.topLabelDot} />
          Premium Plot Developments · Andhra Pradesh
        </motion.div>

        {/* ── Main headline ──────────────────────────────────────── */}
        <motion.div className={styles.headlineWrap}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}>
          <h1 className={styles.headline}>
            {hero.headline || 'Premium Plots'}<br />
            Near <em>{hero.subheadline || 'Amaravati'}</em>
          </h1>
          <p className={styles.sub}>
            {hero.description ||
              "Own a piece of Andhra Pradesh's fastest-growing capital corridor. CRDA approved, RERA registered, clear title — ready for construction today."}
          </p>
        </motion.div>

        {/* ── Approval badges ────────────────────────────────────── */}
        <motion.div className={styles.badges}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}>
          {(hero.approvalBadges || ['CRDA Approved · LP No: 35/2025', 'AP RERA · P06060125894', 'Ready for Construction'])
            .map(b => (
              <span key={b} className={styles.badge}>
                <span className={styles.badgeDot} />{b}
              </span>
            ))}
        </motion.div>

        {/* ── CTA buttons ────────────────────────────────────────── */}
        <motion.div className={styles.btns}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <button className="btn btn-gold" onClick={() => scrollTo('portfolio')}>
            Explore All Projects
          </button>
          <button className="btn btn-ghost"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Book Site Visit', type: 'SITE_VISIT' })}>
            Book Site Visit
          </button>
          {contact.whatsapp && (
            <a href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in your plots near Amaravati. Please share details.')}`}
              target="_blank" rel="noreferrer" className={`btn btn-ghost ${styles.waBtn}`}>
              💬 WhatsApp
            </a>
          )}
        </motion.div>

        {/* ── Global stats strip ─────────────────────────────────── */}
        <motion.div className={styles.statsStrip}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          {globalStats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statNum}>
                {inView
                  ? <CountUp end={s.value} duration={2} delay={0.4 + i * 0.1} suffix={s.suffix} />
                  : `0${s.suffix}`}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Project cards strip ────────────────────────────────── */}
        <div className={styles.projectsStrip}>
          <div className={styles.stripLabel}>
            <span className={styles.stripPulse} />
            Open for Booking — {ACTIVE_PROJECTS.length} Projects
          </div>

          <div className={styles.projectCards}>
            {ACTIVE_PROJECTS.map((proj, i) => {
              const accentColor = ACCENT_COLORS[proj.accentClass] || '#C9A84C'
              return (
                <motion.div
                  key={proj.id}
                  className={styles.projCard}
                  style={{ '--pc': accentColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/project/${proj.id}`)}
                >
                  <div className={styles.projAccentBar} />
                  <div className={styles.projTop}>
                    <span className={styles.projTag} style={{ color: accentColor, borderColor: accentColor + '55', background: accentColor + '18' }}>
                      {proj.tag}
                    </span>
                    <span className={styles.projAvail}>Filling Fast</span>
                  </div>
                  <div className={styles.projName}>{proj.name}</div>
                  <div className={styles.projLoc}>
                    <MapPin size={10} />
                    {proj.loc}
                  </div>
                  <div className={styles.projFooter}>
                    <div className={styles.projPrice}>
                      <span className={styles.projPriceLabel}>From</span>
                      <span className={styles.projPriceVal} style={{ color: accentColor }}>{proj.starting}</span>
                    </div>
                    <div className={styles.projArrow}>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
