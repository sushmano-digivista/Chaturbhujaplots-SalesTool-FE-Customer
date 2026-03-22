import { motion }      from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation }  from 'lucide-react'
import styles from './Sections.module.css'

/**
 * LocationSection — embedded Google Map + distance-from-landmarks grid.
 * Props:
 *   content  { distances: Array<{ icon, name, subtitle, distance, sortOrder }>, contact: { mapEmbedUrl, mapOpenUrl, address } }
 */
export default function LocationSection({ content }) {
  const distances = (content?.distances || []).sort((a, b) => a.sortOrder - b.sortOrder)
  const contact   = content?.contact || {}
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 })

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">Find Us</div>
        <h2 className="sec-title">Location & <em>Connectivity</em></h2>
        <p className="sec-sub">8 km from Amaravati with excellent road, rail and air access.</p>
      </div>

      {/* Map embed */}
      <div className={styles.mapWrap} ref={ref}>
        {contact.mapEmbedUrl && (
          <iframe
            src={contact.mapEmbedUrl}
            className={styles.iframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Anjana Paradise Location"
          />
        )}

        {/* Popup pin */}
        <motion.div
          className={styles.popup}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className={styles.popupTitle}>📍 Anjana Paradise</div>
          <div className={styles.popupSub}>Paritala, Near Amaravati, AP</div>
          <div className={styles.popupBadges}>
            <span className={styles.badgeGreen}>CRDA Approved</span>
            <span className={styles.badgeBlue}>RERA Registered</span>
          </div>
          <button
            className={styles.popupBtn}
            onClick={() =>
              window.open(
                contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh',
                '_blank',
              )
            }
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
              <div className={styles.barName}>Anjana Paradise, Paritala</div>
              <div className={styles.barAddr}>{contact.address || 'Krishna District · Andhra Pradesh'}</div>
            </div>
          </div>
          <button
            className="btn btn-gold btn-sm"
            onClick={() =>
              window.open(
                contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh',
                '_blank',
              )
            }
          >
            <Navigation size={14} /> Get Directions
          </button>
        </div>
      </div>

      {/* Distance cards */}
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
    </section>
  )
}
