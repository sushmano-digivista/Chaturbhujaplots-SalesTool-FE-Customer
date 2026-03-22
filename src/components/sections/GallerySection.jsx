import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import styles from './Sections.module.css'

const HOME_GALLERY = [
  { label: 'Grand Entrance Arch',   icon: '🏛️' },
  { label: 'Avenue Lined Roads',    icon: '🛣️' },
  { label: 'Green Parks & Gardens', icon: '🌿' },
  { label: 'Plot Layout View',      icon: '🏞️' },
  { label: 'Tree Avenue',           icon: '🌴' },
  { label: 'Floral Gardens',        icon: '🌺' },
  { label: 'Security Gate',         icon: '🔒' },
]

/**
 * GallerySection — masonry-style photo gallery with a keyboard-navigable lightbox.
 * Props:
 *   content  { gallery: Array<{ label, icon, thumbnailUrl? }> }
 */
export default function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null) // { idx }
  const items = content?.gallery || HOME_GALLERY

  const openLightbox  = (idx) => setLightbox({ idx })
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox((l) => ({ idx: (l.idx - 1 + items.length) % items.length }))
  const next = () => setLightbox((l) => ({ idx: (l.idx + 1) % items.length }))

  useEffect(() => {
    if (!lightbox) return
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <section className={`section ${styles.galSec}`} id="gallery">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Visual Tour</div>
        <h2 className="sec-title light">Project <em>Gallery</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.6)' }}>
          Glimpses from our open-plot projects — lush landscapes, infrastructure and modern amenities.
        </p>
      </div>

      <div className={styles.galGrid}>
        {items.slice(0, 7).map((item, idx) => (
          <motion.div
            key={idx}
            className={`${styles.gCell} ${idx === 0 ? styles.gCellFeatured : ''}`}
            onClick={() => openLightbox(idx)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.gIcon} style={{ fontSize: idx === 0 ? '5rem' : '3rem' }}>
              {item.icon || '🏞️'}
            </div>
            <div className={styles.gOverlay}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox — portal-rendered */}
      {lightbox && createPortal(
        <motion.div
          className={styles.lbOverlay}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox() }}
        >
          <div className={styles.lbInner}>
            <button className={styles.lbClose} onClick={closeLightbox}><X size={18} /></button>
            <div className={styles.lbIcon}>{items[lightbox.idx]?.icon || '🏞️'}</div>
            <div className={styles.lbLabel}>{items[lightbox.idx]?.label}</div>
            <div className={styles.lbCount}>{lightbox.idx + 1} of {items.length}</div>
            <div className={styles.lbNav}>
              <button className={styles.lbBtn} onClick={prev}>← Prev</button>
              <button className={`${styles.lbBtn} ${styles.lbBtnGold}`} onClick={next}>Next →</button>
            </div>
          </div>
        </motion.div>,
        document.body,
      )}
    </section>
  )
}
