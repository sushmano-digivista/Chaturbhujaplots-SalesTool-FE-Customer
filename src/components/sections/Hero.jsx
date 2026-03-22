import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, FileText } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import styles from './Hero.module.css'

// ── Lightweight animated counter — replaces react-countup JSX component
//    Uses requestAnimationFrame for smooth counting; no external dep issues.
function AnimatedCount({ end, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, duration])

  return <>{count}{suffix}</>
}

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
          <motion.button className="btn btn-gold" onClick={() => scrollTo('plots')}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <MapPin size={15} /> View Available Plots
          </motion.button>
          <motion.button className="btn btn-ghost"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Book Site Visit', type: 'SITE_VISIT' })}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
            <Calendar size={15} /> Book Site Visit
          </motion.button>
          <motion.button className="btn btn-ghost"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.26 }}
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Download Brochure', type: 'BROCHURE' })}>
            <FileText size={15} /> Get Brochure
          </motion.button>
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
                  ? <AnimatedCount end={s.value} duration={1800} suffix={s.suffix} />
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
            <div className={styles.lcsNum}>25+</div>
            <div className={styles.lcsLabel}>Years of Trust</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>100%</div>
            <div className={styles.lcsLabel}>Clear Title</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>RERA</div>
            <div className={styles.lcsLabel}>Registered</div>
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
