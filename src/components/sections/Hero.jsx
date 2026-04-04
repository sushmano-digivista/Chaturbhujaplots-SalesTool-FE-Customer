import { DEFAULT_WA_NUMBER } from '@/constants/config'
import FALLBACK from '@/constants/fallbackContent'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, FileText, Phone } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '@/context/LanguageContext'
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
  const { t, language } = useLanguage()
  const isTe = language === 'te'

  // ── Resolve all data from MongoDB API, fall back to FALLBACK_CONTENT ──────
  const hero = content?.hero      || {}
  const dir  = content?.director  || {}
  const urg  = content?.urgency   || {}
  const lcs  = content?.lcStats   || []
  const hst  = content?.heroStats || []

  // Hero left panel — prefer t() in Telugu mode (DB content is English only)
  const headline    = (isTe && t('content.hero.headline'))    || hero.headline    || FB.hero.headline
  const subheadline = (isTe && t('content.hero.subheadline')) || hero.subheadline || FB.hero.subheadline
  const description = (isTe && t('content.hero.description')) || hero.description || FB.hero.description
  // Approval badges — use translated array in Telugu mode
  const teBadges = isTe ? t('content.hero.approvalBadges') : null
  const badges   = (Array.isArray(teBadges) && teBadges.length)
    ? teBadges
    : (hero.approvalBadges?.length ? hero.approvalBadges : FB.hero.approvalBadges)

  // Animated stats bar — labels translated in Telugu mode
  const heroStats = (hst.length ? hst : FB.heroStats).map((s, i) => {
    if (!isTe) return s
    const teLabels = [t('portfolio.yearsIndustry'), t('portfolio.projectsDelivered'), t('portfolio.happyCustomers')]
    return { ...s, label: teLabels[i] || s.label }
  })

  // Director card
  const dirTitle  = (isTe && t('hero.directorTitle')) || dir.title  || FB.director.title
  const dirName   = dir.name   || FB.director.name
  const dirPhone  = dir.phone  || FB.director.phone
  const dirAvatar = dir.avatar || FB.director.avatar

  // Urgency card — use t() in Telugu for all text (DB stores English only)
  const tagline           = (isTe && t('urgency.limitedOffer'))  || urg.tagline           || FB.urgency.tagline
  const urgHeadline       = (isTe && t('urgency.plotsClosing'))  || urg.headline          || FB.urgency.headline
  const urgSubheadline    = (isTe && t('urgency.lockInRates'))   || urg.subheadline       || FB.urgency.subheadline
  const urgDesc           = (isTe && t('urgency.pricesRising'))  || urg.description       || FB.urgency.description
  const openProjects      = urg.openProjects      ?? FB.urgency.openProjects
  const openProjectsLabel = (isTe && t('urgency.projectsOpen')) || urg.openProjectsLabel || FB.urgency.openProjectsLabel
  const openProjectsSub   = (isTe && t('urgency.forBooking'))   || urg.openProjectsSub   || FB.urgency.openProjectsSub
  const completedProjects = urg.completedProjects  ?? FB.urgency.completedProjects
  const completedLabel    = (isTe && t('urgency.completed'))    || urg.completedLabel    || FB.urgency.completedLabel
  const happyFamilies     = urg.happyFamilies      || FB.urgency.happyFamilies
  const familiesLabel     = (isTe && t('urgency.happy'))        || urg.familiesLabel     || FB.urgency.familiesLabel
  const familiesSub       = (isTe && t('urgency.families'))     || urg.familiesSub       || FB.urgency.familiesSub
  const barOpenLabel      = (isTe && t('urgency.barOpenLabel'))  || (isTe && t('nav.openForBooking'))   || urg.barOpenLabel   || FB.urgency.barOpenLabel
  const barClosedLabel    = (isTe && t('urgency.barClosedLabel')) || (isTe && t('nav.completedSoldOut')) || urg.barClosedLabel || FB.urgency.barClosedLabel
  const completedSub      = (isTe && t('urgency.completedSub'))  || urg.completedSub || ''
  const ctaButton         = (isTe && t('urgency.exploreCta'))   || urg.ctaButton         || FB.urgency.ctaButton

  // Trust stats — translate labels in Telugu
  const lcStats = (lcs.length ? lcs : FB.lcStats).map((s, i) => {
    if (!isTe) return s
    const teLabels = [t('common.yearsOfTrust'), t('common.clearTitle'), t('common.reraRegistered')]
    return { ...s, label: teLabels[i] || s.label }
  })

  const whatsapp = content?.contact?.whatsapp || DEFAULT_WA_NUMBER
  const waMsg    = content?.contact?.whatsappMessage || 'Hi, I am interested in Chaturbhuja Properties plots. Please share more details.'
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
            <MapPin size={15} /> {t('hero.enquireCta')}
          </motion.button>
          <motion.button className="btn btn-ghost"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Book Site Visit', type: 'SITE_VISIT' })}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
            <Calendar size={15} /> {t('hero.siteVisitCta')}
          </motion.button>
          <motion.button className="btn btn-ghost"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.26 }}
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Download Brochure', type: 'BROCHURE' })}>
            <FileText size={15} /> {t('hero.brochureCta')}
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
              <Phone size={13} /><span>{t('contact.callUs')}</span>
            </a>
            <a
              href={`https://wa.me/${DEFAULT_WA_NUMBER}?text=${encodeURIComponent(waMsg)}`}
              target="_blank" rel="noreferrer"
              className={styles.directorWaBtn} aria-label="WhatsApp">
              💬
            </a>
          </div>
        </div>

        {/* ── Urgency Tag — from MongoDB urgency.tagline ────────────────── */}
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
              {openProjectsLabel || t('urgency.projectsOpen')}<br /><span>{openProjectsSub || t('urgency.forBooking')}</span>
            </div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(76,175,116,.1)' }}>
            <div className={styles.lcStatusIcon}>✅</div>
            <div className={styles.lcStatusNum}>{completedProjects}</div>
            <div className={styles.lcStatusLabel}>
              {completedLabel || t('urgency.completed')}<br /><span>{completedSub}</span>
            </div>
          </div>
          <div className={styles.lcStatusDiv} />
          <div className={styles.lcStatusCard} style={{ background: 'rgba(100,181,246,.08)' }}>
            <div className={styles.lcStatusIcon}>🏠</div>
            <div className={styles.lcStatusNum}>{happyFamilies}</div>
            <div className={styles.lcStatusLabel}>
              {familiesLabel || t('urgency.happy')}<br /><span>{familiesSub || t('urgency.families')}</span>
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
            {ctaButton || t('urgency.exploreCta')}
          </button>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMsg)}`}
            target="_blank" rel="noreferrer"
            className={styles.lcBtnWA}>
            💬
          </a>
        </div>


      </motion.div>
    </section>
  )
}
