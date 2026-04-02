import { Phone, MessageCircle, Map } from 'lucide-react'
import { openWhatsApp }    from '@/utils/security'
import { DEFAULT_WA_NUMBER, DEFAULT_PHONE } from '@/constants/config'
import styles from './Footer.module.css'

/**
 * StickyBar -- fixed bottom action bar shown on mobile.
 * Props:
 *   contact   { phone, whatsapp, whatsappMessage }
 *   onEnquire (ctx) => void
 */
export default function StickyBar({ contact, onEnquire }) {
  const openWA = () => {
    const num = contact?.whatsapp || DEFAULT_WA_NUMBER
    const msg = contact?.whatsappMessage ||
      'Hi! I am interested in Chaturbhuja Properties plots. Please share more details.'
    openWhatsApp(num, msg)
  }

  return (
    <div className={styles.stickyBar}>
      <a href={'tel:' + (contact?.phone || DEFAULT_PHONE)} className={styles.sbBtn}>
        <Phone size={20} />
        <span>Call</span>
      </a>

      <button className={styles.sbBtn + ' ' + styles.sbWa} onClick={openWA}>
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </button>

      <button
        className={styles.sbBtn + ' ' + styles.sbMain}
        onClick={() => onEnquire({ source: 'STICKY_BAR', label: 'Enquire Now' })}
      >
        <Map size={20} />
        <span>Enquire</span>
      </button>
    </div>
  )
}
