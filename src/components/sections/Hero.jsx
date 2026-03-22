import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { usePlotSummary } from '@/hooks/useData'
import styles from './Hero.module.css'

// ── Hardcoded brand constants — never pulled from API ─────────────────────────
const HEADLINE    = 'Premium Plots in'
const SUBHEADLINE = 'Andhra Pradesh'
const DESCRIPTION = "A name rooted in integrity — Chaturbhuja Properties & Infra has been shaping Andhra Pradesh's real estate landscape for 25 years. Under the leadership of Mr. Donepudi Durga Prasad, we have placed 1200+ families in homes they are proud of, across 15+ APCRDA & RERA approved ventures in the Krishna–NTR–Guntur corridor."
const BADGES      = [
  'APCRDA Proposed Layout · LP No: 35/2025',
  'AP RERA · P06060125894',
  'Ready for Construction',
]
const STATS = [
  { value: 25,   suffix: '+', label: 'Years in Industry'  },
  { value: 15,   suffix: '+', label: 'Projects Delivered' },
  { value: 1200, suffix: '+', label: 'Happy Customers'    },
]

export default function Hero({ content, onEnquire }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const contact = content?.contact || {}
  const urgency = content?.urgency || {}

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className={styles.hero} id="home">
      <div className={styles.overlay} />

      {/* LEFT — headline + CTAs */}
      <motion.div
        className={styles.heroLeft}
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}>

        {/* Approval badges */}
        <div className={styles.badges}>
          {BADGES.map(b => (
            <span key={b} className={styles.badge}>
              <span className={styles.badgeDot} />{b}
            </span>
          ))}
        </div>

        {/* Headline — always hardcoded */}
        <h1 className={styles.title}>
          {HEADLINE}<br />
          <em>{SUBHEADLINE}</em>
        </h1>

        {/* Description — always hardcoded */}
        <p className={styles.desc}>{DESCRIPTION}</p>

        <div className={styles.btns}>
          <button className="btn btn-gold" onClick={() => scrollTo('plots')}>
            View Available Plots
          </button>
          <button className="btn btn-ghost"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Book Site Visit', type: 'SITE_VISIT' })}>
            Book Site Visit
          </button>
          <button className="btn btn-ghost"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Download Brochure', type: 'BROCHURE' })}>
            Get Brochure
          </button>
        </div>

        {/* Stats — always hardcoded */}
        <div className={styles.statsBar}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statNum}>
                {inView
                  ? <CountUp end={s.value} duration={1.8} suffix={s.suffix} />
                  : `0${s.suffix}`}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT — Limited Time card */}
      <motion.div
        className={styles.limitedCard}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}>

        <div className={styles.lcTag}>
          <span className={styles.lcPulse} />
          Limited Time Offer
        </div>

        <h3 className={styles.lcTitle}>
          Plots Closing <em>Fast!</em><br />Lock In Current Rates
        </h3>
        <p className={styles.lcDesc}>
          Prices are set to rise next quarter. Secure your plot today before the revision hits.
        </p>

        <div className={styles.lcStatus}>
          <div className={styles.lcStatusCard} style={{ background: 'rgba(201,168,76,.12)' }}>
            <div className={styles.lcStatusIcon}>🟡</div>
            <div className={styles.lcStatusNum}>{urgency.openProjects || 4}</div>
            <div className={styles.lcStatusLabel}>Projects Open<br /><span>For Booking</span></div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(76,175,116,.1)' }}>
            <div className={styles.lcStatusIcon}>✅</div>
            <div className={styles.lcStatusNum}>{urgency.completedProjects || 11}</div>
            <div className={styles.lcStatusLabel}>Projects<br /><span>Completed</span></div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(100,181,246,.08)' }}>
            <div className={styles.lcStatusIcon}>🏠</div>
            <div className={styles.lcStatusNum}>{urgency.happyFamilies || '1200+'}</div>
            <div className={styles.lcStatusLabel}>Happy<br /><span>Families</span></div>
          </div>
        </div>

        <div className={styles.lcBar}>
          <div className={styles.lcBarFill} style={{ width: '27%' }} />
        </div>
        <div className={styles.lcBarLabels}>
          <span>🟡 4 Open for Booking</span>
          <span>✅ 11 Completed &amp; Sold</span>
        </div>

        <div className={styles.lcStats}>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{urgency.plotsLeft || 68}</div>
            <div className={styles.lcsLabel}>Plots Left</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{urgency.soldThisMonth || 8}</div>
            <div className={styles.lcsLabel}>Sold This Month</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>↑{urgency.priceRisePercent || 18}%</div>
            <div className={styles.lcsLabel}>Price Next Qtr</div>
          </div>
        </div>

        <div className={styles.lcBtns}>
          <button className={styles.lcBtnGold} onClick={() => scrollTo('portfolio')}>
            Explore All Projects →
          </button>
          <a
            href={`https://wa.me/${contact.whatsapp || '918977262683'}?text=${encodeURIComponent('Hi, I am interested in Chaturbhuja plots. Please share details.')}`}
            target="_blank" rel="noreferrer"
            className={styles.lcBtnWA}>
            💬
          </a>
        </div>
      </motion.div>
    </section>
  )
}
