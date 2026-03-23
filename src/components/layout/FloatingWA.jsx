import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER } from '@/constants/config'
import styles from './Footer.module.css'

/**
 * FloatingWA — persistent WhatsApp floating action button.
 * Props:
 *   contact  { whatsapp }
 */
export default function FloatingWA({ contact }) {
  const openWA = () => {
    const num = contact?.whatsapp || DEFAULT_WA_NUMBER
    openWhatsApp(num, 'Hi, I am interested in Chatubhuja Properties & Infra.')
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
