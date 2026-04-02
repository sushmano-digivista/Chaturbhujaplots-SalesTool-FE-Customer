import { useState, useEffect } from 'react'
import styles from './ScrollToTop.module.css'

/**
 * ScrollToTop — floating button that appears after scrolling 300px.
 * Smoothly scrolls back to the top when clicked.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      className={styles.btn}
      onClick={scrollUp}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  )
}

