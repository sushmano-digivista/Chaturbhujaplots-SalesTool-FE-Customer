import { DEFAULT_WA_NUMBER } from '@/constants/config'
import FALLBACK from '@/constants/fallbackContent'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, FileText, Phone } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import styles from './Hero.module.css'

// ── Lightweight animated counter — no external dep ───────────────────────────
function AnimatedCount({ end, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, duration])

  return <>{count}{suffix}</>
}

// ── Single source of truth for fallbacks: fallbackContent.js ─────────────────
const FB = FALLBACK

export default function Hero({ content, onEnquire }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  // ── Resolve all data from MongoDB API, fall back to FALLBACK_CONTENT ──────
  const hero = content?.hero      || {}
  const dir  = content?.director  || {}
  const urg  = content?.urgency   || {}
  const lcs  = content?.lcStats   || []
  const hst  = content?.heroStats || []

  // Hero left panel
  const headline    = hero.headline    || FB.hero.headline
  const subheadline = hero.subheadline || FB.hero.subheadline
  const description = hero.description || FB.hero.description
  const badges      = hero.approvalBadges?.length ? hero.approvalBadges : FB.hero.approvalBadges

  // Animated stats bar — from DB heroStats, fallback to FALLBACK_CONTENT.heroStats
  const heroStats = hst.length ? hst : FB.heroStats

  // Director card
  const dirTitle  = dir.title  || FB.director.title
  const dirName   = dir.name   || FB.director.name
  const dirPhone  = dir.phone  || FB.director.phone
  const dirAvatar = dir.avatar || FB.director.avatar

  // Urgency card
  const tagline           = urg.tagline           || FB.urgency.tagline
  const urgHeadline       = urg.headline          || FB.urgency.headline
  const urgSubheadline    = urg.subheadline       || FB.urgency.subheadline
  const urgDesc           = urg.description       || FB.urgency.description
  const openProjects      = urg.openProjects      ?? FB.urgency.openProjects
  const openProjectsLabel = urg.openProjectsLabel || FB.urgency.openProjectsLabel
  const openProjectsSub   = urg.openProjectsSub   || FB.urgency.openProjectsSub
  const completedProjects = urg.completedProjects  ?? FB.urgency.completedProjects
  const completedLabel    = urg.completedLabel    || FB.urgency.completedLabel
  const completedSub      = urg.completedSub      || FB.urgency.completedSub
  const happyFamilies     = urg.happyFamilies      || FB.urgency.happyFamilies
  const familiesLabel     = urg.familiesLabel     || FB.urgency.familiesLabel
  const familiesSub       = urg.familiesSub       || FB.urgency.familiesSub
  const barOpenLabel      = urg.barOpenLabel      || FB.urgency.barOpenLabel
  const barClosedLabel    = urg.barClosedLabel    || FB.urgency.barClosedLabel
  const ctaButton         = urg.ctaButton         || FB.urgency.ctaButton

  // Trust stats (bottom 3 boxes)
  const lcStats = lcs.length ? lcs : FB.lcStats

  const whatsapp = DEFAULT_WA_NUMBER
  const barWidth = `${Math.round((openProjects / (openProjects + completedProjects)) * 100)}%`
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const headBase   = urgHeadline.replace(/!+$/, '')
  const headSuffix = urgHeadline.endsWith('!') ? '!' : ''

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

        {/* Approval badges — from MongoDB hero.approvalBadges */}
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

        {/* Animated stats bar — from MongoDB heroStats */}
        <div className={styles.statsBar}>
          {heroStats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statNum}>
                {inView
                  ? <AnimatedCount end={s.end} duration={1800} suffix={s.suffix} />
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

<<<<<<< HEAD
        {/* ── Premium Director Contact Card — from MongoDB director ──────── */}
        <div className={styles.directorCard}>
          <div className={styles.directorShimmer1} />
          <div className={styles.directorShimmer2} />

          <div className={styles.directorAvatarWrap}>
            <div className={styles.directorRing} />
            <div className={styles.directorAvatar}>
              <span>{dirAvatar}</span>
            </div>
            <div className={styles.directorOnline} />
          </div>

          <div className={styles.directorInfo}>
            <div className={styles.directorBadge}>{dirTitle}</div>
            <div className={styles.directorName}>{dirName}</div>
            <a href={`tel:${dirPhone}`} className={styles.directorPhone}>
              <Phone size={10} />{dirPhone}
            </a>
          </div>

          <div className={styles.directorActions}>
            <a href={`tel:${dirPhone}`} className={styles.directorCallBtn} aria-label="Call">
              <Phone size={13} /><span>Call</span>
            </a>
            <a
              href={`https://wa.me/${DEFAULT_WA_NUMBER}?text=${encodeURIComponent('Hi, I am interested in Chaturbhuja plots. Please share details.')}`}
              target="_blank" rel="noreferrer"
              className={styles.directorWaBtn} aria-label="WhatsApp">
              💬
=======
        {/* MD Contact Card */}
        <div className={styles.mdCard}>
          <div className={styles.mdAvatar}>
            <span>M</span>
          </div>
          <div className={styles.mdInfo}>
            <div className={styles.mdRole}>Managing Director</div>
            <div className={styles.mdName}>M Siva Nageswara Rao</div>
            <a href="tel:+919948709041" className={styles.mdPhone}>
              📞 +91 99487 09041
>>>>>>> fb808556485f2c30fd40ff1787e3ff0ec81923f8
            </a>
          </div>
        </div>

<<<<<<< HEAD
        {/* ── Urgency Tag — from MongoDB urgency.tagline ────────────────── */}
=======
>>>>>>> fb808556485f2c30fd40ff1787e3ff0ec81923f8
        <div className={styles.lcTag}>
          <span className={styles.lcPulse} />
          {tagline}
        </div>

        <h3 className={styles.lcTitle}>
          {headBase}<em>{headSuffix}</em><br />
          {urgSubheadline}
        </h3>
        <p className={styles.lcDesc}>{urgDesc}</p>

        {/* ── Stats Grid — from MongoDB urgency ─────────────────────────── */}
        <div className={styles.lcStatus}>
          <div className={styles.lcStatusCard} style={{ background: 'rgba(201,168,76,.12)' }}>
            <div className={styles.lcStatusIcon}>🟡</div>
            <div className={styles.lcStatusNum}>{openProjects}</div>
            <div className={styles.lcStatusLabel}>
              {openProjectsLabel}<br /><span>{openProjectsSub}</span>
            </div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(76,175,116,.1)' }}>
            <div className={styles.lcStatusIcon}>✅</div>
            <div className={styles.lcStatusNum}>{completedProjects}</div>
            <div className={styles.lcStatusLabel}>
              {completedLabel}<br /><span>{completedSub}</span>
            </div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(100,181,246,.08)' }}>
            <div className={styles.lcStatusIcon}>🏠</div>
            <div className={styles.lcStatusNum}>{happyFamilies}</div>
            <div className={styles.lcStatusLabel}>
              {familiesLabel}<br /><span>{familiesSub}</span>
            </div>
          </div>
        </div>

        {/* ── Progress Bar ──────────────────────────────────────────────── */}
        <div className={styles.lcBar}>
          <div className={styles.lcBarFill} style={{ width: barWidth }} />
        </div>
        <div className={styles.lcBarLabels}>
          <span>🟡 {openProjects} {barOpenLabel}</span>
          <span>✅ {completedProjects} {barClosedLabel}</span>
        </div>

        {/* ── Trust Stats — from MongoDB lcStats ────────────────────────── */}
        <div className={styles.lcStats}>
          {lcStats.map((s, i) => (
            <div key={i} className={styles.lcs}>
              <div className={styles.lcsNum}>{s.num}</div>
              <div className={styles.lcsLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div className={styles.lcBtns}>
          <button className={styles.lcBtnGold} onClick={() => scrollTo('portfolio')}>
            {ctaButton}
          </button>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi')}`}
            target="_blank" rel="noreferrer"
            className={styles.lcBtnWA}>
            💬
          </a>
        </div>


      </motion.div>
    </section>
  )
}
