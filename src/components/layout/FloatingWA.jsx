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
    openWhatsApp(contact?.whatsapp || DEFAULT_WA_NUMBER, 'Hi')
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
