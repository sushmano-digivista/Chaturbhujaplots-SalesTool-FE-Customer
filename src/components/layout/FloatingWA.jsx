import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useLanguage } from '@/context/LanguageContext'
import styles from './Footer.module.css'

export default function FloatingWA({ contact }) {
  const { t, language } = useLanguage()
  const openWA = () => {
    openWhatsApp(contact?.whatsapp || DEFAULT_WA_NUMBER, language === 'te' ? t('contact.whatsappMessage') : (contact?.whatsappMessage || t('contact.whatsappMessage')))
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
