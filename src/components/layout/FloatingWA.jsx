import styles from './Footer.module.css'

/**
 * FloatingWA — persistent WhatsApp floating action button.
 * Props:
 *   contact  { whatsapp }
 */
export default function FloatingWA({ contact }) {
  const openWA = () => {
    const num = contact?.whatsapp || '919999999999'
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(
        'Hi, I am interested in Anjana Paradise plots near Amaravati.',
      )}`,
      '_blank',
    )
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
