import { Phone, Map } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER, DEFAULT_PHONE } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import { trackPhoneClick, trackWhatsAppClick, trackEnquireCta } from '@/utils/analytics'
import styles from './Footer.module.css'

export default function StickyBar({ contact, onEnquire }) {
  const { t, language } = useLanguage()

  const openWA = () => {
    const num = contact?.whatsapp || DEFAULT_WA_NUMBER
    const msg = language === 'te' ? t('contact.whatsappMessage') : (contact?.whatsappMessage || t('contact.whatsappMessage'))
    trackWhatsAppClick('STICKY_BAR')
    openWhatsApp(num, msg)
  }

  return (
    <div className={styles.stickyBar}>
      <a href={'tel:' + (contact?.phone || DEFAULT_PHONE)} className={styles.sbBtn}
         onClick={() => trackPhoneClick('STICKY_BAR', contact?.phone || DEFAULT_PHONE)}>
        <Phone size={20} />
        <span>{t('contact.callUs')}</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <WhatsAppIcon size={44} onClick={openWA} title={t('contact.sendWhatsApp')} />
      </div>

      <button
        className={styles.sbBtn + ' ' + styles.sbMain}
        onClick={() => { trackEnquireCta('STICKY_BAR'); onEnquire({ source: 'STICKY_BAR', label: 'Enquire Now' }) }}
      >
        <Map size={20} />
        <span>{t('nav.enquireNow')}</span>
      </button>
    </div>
  )
}
