import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { usePlotSummary } from '@/hooks/useData'
import styles from './Hero.module.css'

// ── Fallback values — used only when API is unavailable ───────────────────────
const FB = {
  headline:    'Premium Plots in',
  subheadline: 'Andhra Pradesh',
  description: "A name rooted in integrity — Chaturbhuja Properties & Infra has been shaping Andhra Pradesh's real estate landscape for 25 years. Under the leadership of Mr. Donepudi Durga Prasad, we have placed 1200+ families in homes they are proud of, across 15+ APCRDA & RERA approved ventures in the Krishna–NTR–Guntur corridor.",
  badges: [
    'APCRDA Proposed Layout · LP No: 35/2025',
    'AP RERA · P06060125894',
    'Ready for Construction',
  ],
  urgency: { openProjects: 4, completedProjects: 11, happyFamilies: '1200+', plotsLeft: 68, soldThisMonth: 8, priceRisePercent: 18 },
}

export default function Hero({ content, onEnquire }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  // Live data from API; fall back to FB constants when API is down / returns nothing
  const hero    = content?.hero    || {}
  const contact = content?.contact || {}
  const urgency = content?.urgency || {}

  const headline    = hero.headline    || FB.headline
  const subheadline = hero.subheadline || FB.subheadline
  const description = hero.description || FB.description
  const badges      = hero.approvalBadges?.length ? hero.approvalBadges : FB.badges

  const openProjects      = urgency.openProjects      || FB.urgency.openProjects
  const completedProjects = urgency.completedProjects  || FB.urgency.completedProjects
  const happyFamilies     = urgency.happyFamilies      || FB.urgency.happyFamilies
  const plotsLeft         = urgency.plotsLeft          || FB.urgency.plotsLeft
  const soldThisMonth     = urgency.soldThisMonth      || FB.urgency.soldThisMonth
  const priceRisePct      = urgency.priceRisePercent   || FB.urgency.priceRisePercent
  const whatsapp          = contact.whatsapp           || '918977262683'

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const barWidth = `${Math.round((openProjects / (openProjects + completedProjects)) * 100)}%`

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

        <div className={styles.badges}>
          {badges.map(b => (
            <span key={b} className={styles.badge}>
              <span className={styles.badgeDot} />{b}
            </span>
          ))}
        </div>

        <h1 className={styles.title}>
          {headline}<br />
          <em>{subheadline}</em>
        </h1>

        <p className={styles.desc}>{description}</p>

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

        <div className={styles.statsBar}>
          {[
            { value: 25,   suffix: '+', label: 'Years in Industry'  },
            { value: 15,   suffix: '+', label: 'Projects Delivered' },
            { value: 1200, suffix: '+', label: 'Happy Customers'    },
          ].map((s, i) => (
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
            <div className={styles.lcStatusNum}>{openProjects}</div>
            <div className={styles.lcStatusLabel}>Projects Open<br /><span>For Booking</span></div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(76,175,116,.1)' }}>
            <div className={styles.lcStatusIcon}>✅</div>
            <div className={styles.lcStatusNum}>{completedProjects}</div>
            <div className={styles.lcStatusLabel}>Projects<br /><span>Completed</span></div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(100,181,246,.08)' }}>
            <div className={styles.lcStatusIcon}>🏠</div>
            <div className={styles.lcStatusNum}>{happyFamilies}</div>
            <div className={styles.lcStatusLabel}>Happy<br /><span>Families</span></div>
          </div>
        </div>

        <div className={styles.lcBar}>
          <div className={styles.lcBarFill} style={{ width: barWidth }} />
        </div>
        <div className={styles.lcBarLabels}>
          <span>🟡 {openProjects} Open for Booking</span>
          <span>✅ {completedProjects} Completed &amp; Sold</span>
        </div>

        <div className={styles.lcStats}>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{plotsLeft}</div>
            <div className={styles.lcsLabel}>Plots Left</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{soldThisMonth}</div>
            <div className={styles.lcsLabel}>Sold This Month</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>↑{priceRisePct}%</div>
            <div className={styles.lcsLabel}>Price Next Qtr</div>
          </div>
        </div>

        <div className={styles.lcBtns}>
          <button className={styles.lcBtnGold} onClick={() => scrollTo('portfolio')}>
            Explore All Projects →
          </button>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I am interested in Chaturbhuja plots. Please share details.')}`}
            target="_blank" rel="noreferrer"
            className={styles.lcBtnWA}>
            💬
          </a>
        </div>
      </motion.div>
    </section>
  )
}
