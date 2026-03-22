import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Direct imports — Vite resolves these to hashed URLs at build time ─────────
import imgAllReady  from '@/assets/gallery/chaturbhuja/All_Ready_To_Buy_Ventures.png'
import imgAnjana    from '@/assets/gallery/chaturbhuja/Anjana_Paradise_Paritala_Home.png'
import imgAparna    from '@/assets/gallery/chaturbhuja/Aparna_Legacy_Chevitikallu_Home.png'
import imgVaraha    from '@/assets/gallery/chaturbhuja/Varaha_Virtue_Pamarru_Home.png'

import styles from './Sections.module.css'

/**
 * To add more images:
 *   1. Drop the file into src/assets/gallery/chaturbhuja/
 *   2. Add an import line above
 *   3. Add an entry to GALLERY_IMAGES below
 */
const GALLERY_IMAGES = [
  { src: imgAllReady, label: 'All Ready To Buy Ventures'       },
  { src: imgAnjana,   label: 'Anjana Paradise — Paritala'      },
  { src: imgAparna,   label: 'Aparna Legacy — Chevitikallu'    },
  { src: imgVaraha,   label: 'Varaha Virtue — Pamarru'         },
]

export default function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null)

  const apiGallery = content?.gallery || []
  const items = apiGallery.length > 0
    ? apiGallery.map((g) => ({ src: g.thumbnailUrl || g.src, label: g.label }))
    : GALLERY_IMAGES

  const open  = (idx) => setLightbox({ idx })
  const close = () => setLightbox(null)
  const prev  = () => setLightbox((l) => ({ idx: (l.idx - 1 + items.length) % items.length }))
  const next  = () => setLightbox((l) => ({ idx: (l.idx + 1) % items.length }))

  useEffect(() => {
    if (!lightbox) return
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [lightbox])

  if (!items.length) return null

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
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            className={`${styles.gCell} ${idx === 0 ? styles.gCellFeatured : ''}`}
            onClick={() => open(idx)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.src}
              alt={item.label}
              className={styles.gImg}
              loading="lazy"
            />
            <div className={styles.gOverlay}>
              <span className={styles.gOverlayLabel}>{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && createPortal(
        <motion.div
          className={styles.lbOverlay}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <button className={styles.lbClose} onClick={close}><X size={18} /></button>
          <button className={`${styles.lbNavBtn} ${styles.lbNavLeft}`} onClick={prev}>
            <ChevronLeft size={28} />
          </button>
          <div className={styles.lbInner}>
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox.idx}
                src={items[lightbox.idx]?.src}
                alt={items[lightbox.idx]?.label}
                className={styles.lbImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
              />
            </AnimatePresence>
            <div className={styles.lbCaption}>
              <span className={styles.lbLabel}>{items[lightbox.idx]?.label}</span>
              <span className={styles.lbCount}>{lightbox.idx + 1} / {items.length}</span>
            </div>
          </div>
          <button className={`${styles.lbNavBtn} ${styles.lbNavRight}`} onClick={next}>
            <ChevronRight size={28} />
          </button>
        </motion.div>,
        document.body,
      )}
    </section>
  )
}
