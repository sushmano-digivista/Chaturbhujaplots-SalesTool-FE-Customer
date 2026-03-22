import { Phone, MessageCircle, Map } from 'lucide-react'
import styles from './Footer.module.css'

/**
 * StickyBar — fixed bottom action bar shown on mobile.
 * Props:
 *   contact   { phone, whatsapp }
 *   onEnquire (ctx) => void
 */
export default function StickyBar({ contact, onEnquire }) {
  const openWA = () => {
    const num = contact?.whatsapp || '919999999999'
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots.')}`,
      '_blank',
    )
  }

  return (
    <div className={styles.stickyBar}>
      <a href={`tel:${contact?.phone || '+919999999999'}`} className={styles.sbBtn}>
        <Phone size={20} />
        <span>Call</span>
      </a>

      <button className={`${styles.sbBtn} ${styles.sbWa}`} onClick={openWA}>
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </button>

      <button
        className={`${styles.sbBtn} ${styles.sbMain}`}
        onClick={() => onEnquire({ source: 'STICKY_BAR', label: 'Enquire Now' })}
      >
        <Map size={20} />
        <span>Enquire</span>
      </button>
    </div>
  )
}
