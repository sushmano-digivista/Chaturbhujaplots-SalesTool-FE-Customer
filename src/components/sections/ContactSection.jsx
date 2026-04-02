import { motion } from 'framer-motion'
import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import styles from './Sections.module.css'

/**
 * ContactSection — "Get In Touch" section with perks list + CTA buttons.
 * Props:
 *   content   { contact: { phone, whatsapp } }
 *   onEnquire (ctx) => void
 */
export default function ContactSection({ content, onEnquire }) {
  const contact = content?.contact || {}

  const openWA = () => {
    const num = contact.whatsapp || DEFAULT_WA_NUMBER
    openWhatsApp(num, contact?.whatsappMessage || 'Hi, I am interested in Chaturbhuja Properties plots. Please share more details.')
  }

  return (
    <section className={`section ${styles.contactSec}`} id="contact">
      <div className={styles.contactGrid}>

        {/* Left — info + perks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="sec-tag" style={{ color: 'var(--gold-light)' }}>Get In Touch</div>
          <h2 className="sec-title" style={{ color: '#fff' }}>
            Secure Your <em>Plot Today</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
            Our team is available 7 days a week. Call us, WhatsApp or fill the form.
          </p>

          <div className={styles.perks}>
            {[
              'Free site visit with transport',
              'No-obligation consultation',
              'Flexible payment plans',
              'Home loan assistance',
            ].map((p) => (
              <div key={p} className={styles.perk}>
                <span className={styles.check}>✓</span>
                {p}
              </div>
            ))}
          </div>

          {contact.phone && (
            <a href={`tel:${contact.phone}`} className={styles.callCard}>
              <span style={{ fontSize: 20 }}>📞</span>
              <div>
                <div className={styles.callLabel}>Call Us Directly</div>
                <div className={styles.callNum}>{contact.phone}</div>
              </div>
            </a>
          )}
        </motion.div>

        {/* Right — action buttons */}
        <motion.div
          className={styles.ctaBox}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className={styles.ctaTitle}>Choose How to Connect</h3>

          <div className={styles.ctaBtns}>
            <button
              className="btn btn-green btn-full"
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Get Callback', type: 'CALLBACK' })}
            >
              📞 Get Callback
            </button>

            <button
              className={styles.visitBtn}
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Schedule Site Visit', type: 'SITE_VISIT' })}
            >
              🗓️ Schedule Site Visit
            </button>

            <button className={styles.waBtn} onClick={openWA}>
              💬 Chat on WhatsApp
            </button>
          </div>

          <div className={styles.ctaNote}>
            We typically respond within <strong>30 minutes</strong> during business hours (9am–7pm).
          </div>
        </motion.div>
      </div>
    </section>
  )
}
