import { motion } from 'framer-motion'
import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Sections.module.css'

const PERKS_EN = [
  'Free site visit with transport',
  'No-obligation consultation',
  'Flexible payment plans',
  'Home loan assistance',
]
const PERKS_TE = [
  '\u0c09\u0c1a\u0c3f\u0c24 \u0c38\u0c48\u0c1f\u0c4d \u0c35\u0c3f\u0c1c\u0c3f\u0c1f\u0c4d (\u0c30\u0c35\u0c3e\u0c23\u0c3e \u0c38\u0c39\u0c3f\u0c24\u0c02)',
  '\u0c2c\u0c3e\u0c27\u0c4d\u0c2f\u0c24 \u0c32\u0c47\u0c28\u0c3f \u0c38\u0c32\u0c39\u0c3e',
  '\u0c05\u0c28\u0c41\u0c15\u0c42\u0c32\u0c28\u0c48\u0c28 \u0c1a\u0c46\u0c32\u0c4d\u0c32\u0c3f\u0c02\u0c2a\u0c41 \u0c35\u0c3f\u0c27\u0c3e\u0c28\u0c3e\u0c32\u0c41',
  '\u0c17\u0c43\u0c39\u0c30\u0c41\u0c23\u0c02 \u0c38\u0c39\u0c3e\u0c2f\u0c02',
]

export default function ContactSection({ content, onEnquire }) {
  const { t, language } = useLanguage()
  const contact = content?.contact || {}
  const perks = language === 'te' ? PERKS_TE : PERKS_EN

  const openWA = () => {
    const num = contact.whatsapp || DEFAULT_WA_NUMBER
    openWhatsApp(num, contact?.whatsappMessage || t('contact.whatsappMessage') || 'Hi! Interested in Chaturbhuja plots.')
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
          <div className="sec-tag" style={{ color: 'var(--gold-light)' }}>{t('sections.contact')}</div>
          <h2 className="sec-title" style={{ color: '#fff' }}>
            {t('contact.writeUs')} — <em>{t('contact.sendMessage')}</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
            Our team is available 7 days a week. {t('contact.callUs')}, {t('contact.sendWhatsApp')} or fill the form.
          </p>

          <div className={styles.perks}>
            {perks.map((p) => (
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
                <div className={styles.callLabel}>{t('contact.callUs')}</div>
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
          <h3 className={styles.ctaTitle}>{t('contact.sendMessage')}</h3>

          <div className={styles.ctaBtns}>
            <button
              className="btn btn-green btn-full"
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Get Callback', type: 'CALLBACK' })}
            >
              📞 {t('modal.requestCallback')}
            </button>

            <button
              className={styles.visitBtn}
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Schedule Site Visit', type: 'SITE_VISIT' })}
            >
              🗓️ {t('hero.siteVisitCta')}
            </button>

            <button className={styles.waBtn} onClick={openWA}>
              💬 {t('contact.sendWhatsApp')}
            </button>
          </div>

          <div className={styles.ctaNote}>
            {t('contact.respondNote') || 'We typically respond within'} <strong>30 {t('contact.respondMinutes') || 'minutes'}</strong> {t('contact.respondHours') || 'during business hours (9am–7pm).'}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
