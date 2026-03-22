import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { usePlotSummary } from '@/hooks/useData'
import styles from './Hero.module.css'

export default function Hero({ content, onEnquire }) {
  const { data: summary }   = usePlotSummary()
  const { ref, inView }     = useInView({ triggerOnce: true, threshold: 0.2 })
  const hero    = content?.hero    || {}
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

        <div className={styles.badges}>
          {(hero.approvalBadges || ['APCRDA Proposed Layout · LP No: 35/2025','AP RERA · P06060125894','Ready for Construction'])
            .map(b => (
              <span key={b} className={styles.badge}>
                <span className={styles.badgeDot} />
                {b}
              </span>
            ))}
        </div>

        <h1 className={styles.title}>
          {hero.headline || 'Premium Plots Near'}<br />
          <em>{hero.subheadline || 'Amaravati'}</em>
        </h1>

        <p className={styles.desc}>
          {hero.description || "Own a piece of Andhra Pradesh's fastest-growing capital corridor. CRDA Proposed Layout with 100% Clear Title in Paritala — just 8 km from Amaravati, the New State Capital. Avenue-lined roads, 24/7 water, overhead electricity & ready for immediate construction."}
        </p>

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
            { value: 25,   suffix: '+',   label: 'Years in Industry'  },
            { value: 15,   suffix: '+',   label: 'Projects Delivered' },
            { value: 1200, suffix: '+',   label: 'Happy Customers'    },
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
            <div className={styles.lcStatusIcon}>🏗️</div>
            <div className={styles.lcStatusNum}>{urgency.happyFamilies || '1200+'}</div>
            <div className={styles.lcStatusLabel}>Happy<br /><span>Families</span></div>
          </div>
        </div>

        <div className={styles.lcBar}>
          <div className={styles.lcBarFill} style={{ width: '42%' }} />
        </div>
        <div className={styles.lcBarLabels}>
          <span>🟡 4 Open for Booking</span>
          <span>✅ 11 Completed &amp; Sold Out</span>
        </div>

        <div className={styles.lcStats}>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{urgency.plotsLeft || 14}</div>
            <div className={styles.lcsLabel}>Plots Left</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>{urgency.soldThisMonth || 6}</div>
            <div className={styles.lcsLabel}>Sold This Month</div>
          </div>
          <div className={styles.lcs}>
            <div className={styles.lcsNum}>↑{urgency.priceRisePercent || 18}%</div>
            <div className={styles.lcsLabel}>Price Next Qtr</div>
          </div>
        </div>

        <div className={styles.lcBtns}>
          <button className={styles.lcBtnGold} onClick={() => scrollTo('plots')}>
            Grab Available Plots →
          </button>
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots near Amaravati. Please share details.')}`}
              target="_blank" rel="noreferrer"
              className={styles.lcBtnWA}>
              💬
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}
