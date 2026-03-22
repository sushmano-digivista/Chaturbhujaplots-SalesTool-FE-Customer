import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { usePlotSummary } from '@/hooks/useData'
import styles from './Hero.module.css'

export default function Hero({ content, onEnquire }) {
  const { data: summary }  = usePlotSummary()
  const { ref, inView }    = useInView({ triggerOnce: true, threshold: 0.2 })

  const hero    = content?.hero    || {}
  const stats   = content?.stats   || []
  const contact = content?.contact || {}

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className={styles.hero} id="home">
      <div className={styles.overlay} />

      <motion.div
        className={styles.content}
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}>

        {/* Approval badges — from CMS */}
        <div className={styles.badges}>
          {(hero.approvalBadges || ['CRDA Approved', 'AP RERA · P06060125894', 'Ready for Construction'])
            .map(b => (
              <span key={b} className={styles.badge}>✓ {b}</span>
            ))}
        </div>

        {/* Headline */}
        <h1 className={styles.title}>
          {hero.headline || 'Premium Plots'}<br />
          Near <em>{hero.subheadline || 'Amaravati'}</em>
        </h1>

        <p className={styles.desc}>
          {hero.description || 'Secure your land just 8 km from Andhra Pradesh\'s new capital city — fully CRDA & RERA approved with world-class amenities.'}
        </p>

        {/* CTAs — all 3 surface the lead modal with different sources */}
        <div className={styles.btns}>
          <button className="btn btn-gold"
            onClick={() => scrollTo('plots')}>
            Explore Plots
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

        {/* Stats bar — live from plot-service */}
        <div className={styles.statsBar}>
          {[
            { value: summary?.totalPlots || 120, suffix: '+', label: 'Total Plots' },
            { value: 8,  suffix: ' km', label: 'From Amaravati' },
            { value: summary?.eastFacing?.count || 0, suffix: '',  label: 'East-Facing' },
          ].map((s, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statNum}>
                {inView ? <CountUp end={s.value} duration={1.8} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* WhatsApp quick-connect */}
      {contact.whatsapp && (
        <a
          href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots near Amaravati. Please share details.')}`}
          target="_blank" rel="noreferrer"
          className={styles.waQuick}>
          💬 Chat Now
        </a>
      )}
    </section>
  )
}
