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
    openWhatsApp(contact?.whatsapp || DEFAULT_WA_NUMBER, 'Hi! 👋 I came across Chaturbhuja Properties & Infra and I'm interested in your premium plots. Could you please share more details on available plots, pricing, and site visit options? Thank you!')
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
