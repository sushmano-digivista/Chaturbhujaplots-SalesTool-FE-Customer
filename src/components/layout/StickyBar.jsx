import { Phone, MessageCircle, Map } from 'lucide-react'
import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER, DEFAULT_PHONE } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Footer.module.css'

export default function StickyBar({ contact, onEnquire }) {
  const { t } = useLanguage()

  const openWA = () => {
    const num = contact?.whatsapp || DEFAULT_WA_NUMBER
    const msg = contact?.whatsappMessage ||
      t('contact.whatsappMessage') || 'Hi! Interested in Chaturbhuja plots.'
    openWhatsApp(num, msg)
  }

  return (
    <div className={styles.stickyBar}>
      <a href={'tel:' + (contact?.phone || DEFAULT_PHONE)} className={styles.sbBtn}>
        <Phone size={20} />
        <span>{t('contact.callUs')}</span>
      </a>

      <button className={styles.sbBtn + ' ' + styles.sbWa} onClick={openWA}>
        <MessageCircle size={20} />
        <span>{t('contact.sendWhatsApp')}</span>
      </button>

      <button
        className={styles.sbBtn + ' ' + styles.sbMain}
        onClick={() => onEnquire({ source: 'STICKY_BAR', label: 'Enquire Now' })}
      >
        <Map size={20} />
        <span>{t('nav.enquireNow')}</span>
      </button>
    </div>
  )
}
