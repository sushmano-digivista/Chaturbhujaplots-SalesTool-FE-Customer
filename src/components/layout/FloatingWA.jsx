import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import styles from './Footer.module.css'

export default function FloatingWA({ contact }) {
  const { t, language } = useLanguage()
  const openWA = () => {
    openWhatsApp(contact?.whatsapp || DEFAULT_WA_NUMBER, language === 'te' ? t('contact.whatsappMessage') : (contact?.whatsappMessage || t('contact.whatsappMessage')))
  }

  return (
    <div className={styles.floatWA} style={{ background: 'none', boxShadow: 'none', padding: 0 }}>
      <WhatsAppIcon size={52} onClick={openWA} title="Chat on WhatsApp" />
    </div>
  )
}
