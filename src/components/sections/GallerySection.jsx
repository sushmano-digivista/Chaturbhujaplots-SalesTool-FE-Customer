import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Sections.module.css'

// ── Paritala (Anjana Paradise) ────────────────────────────────────────────────
import p01 from '@/assets/gallery/chaturbhuja/paritala/001.jpeg'
import p02 from '@/assets/gallery/chaturbhuja/paritala/002.jpeg'
import p03 from '@/assets/gallery/chaturbhuja/paritala/003.jpeg'
import p04 from '@/assets/gallery/chaturbhuja/paritala/004.jpeg'
import p05 from '@/assets/gallery/chaturbhuja/paritala/005.jpeg'
import p06 from '@/assets/gallery/chaturbhuja/paritala/006.jpeg'
import p07 from '@/assets/gallery/chaturbhuja/paritala/007.jpeg'
import p08 from '@/assets/gallery/chaturbhuja/paritala/008.jpeg'
import p09 from '@/assets/gallery/chaturbhuja/paritala/009.jpeg'

// ── Chevitikallu (Aparna Legacy) ─────────────────────────────────────────────
import c01 from '@/assets/gallery/chaturbhuja/chevitikallu/001.jpeg'
import c02 from '@/assets/gallery/chaturbhuja/chevitikallu/002.jpeg'
import c03 from '@/assets/gallery/chaturbhuja/chevitikallu/003.jpeg'
import c04 from '@/assets/gallery/chaturbhuja/chevitikallu/004.jpeg'
import c05 from '@/assets/gallery/chaturbhuja/chevitikallu/005.jpeg'

// ── Varaha (Varaha Virtue) ────────────────────────────────────────────────────
import v01 from '@/assets/gallery/chaturbhuja/varaha/001.jpeg'
import v02 from '@/assets/gallery/chaturbhuja/varaha/002.jpeg'
import v03 from '@/assets/gallery/chaturbhuja/varaha/003.jpeg'
import v04 from '@/assets/gallery/chaturbhuja/varaha/004.jpeg'
import v05 from '@/assets/gallery/chaturbhuja/varaha/005.jpeg'
import v06 from '@/assets/gallery/chaturbhuja/varaha/006.jpeg'
import v07 from '@/assets/gallery/chaturbhuja/varaha/007.jpeg'
import v08 from '@/assets/gallery/chaturbhuja/varaha/008.jpeg'
import v09 from '@/assets/gallery/chaturbhuja/varaha/009.jpeg'
import v10 from '@/assets/gallery/chaturbhuja/varaha/010.jpeg'
import v11 from '@/assets/gallery/chaturbhuja/varaha/011.jpeg'
import v12 from '@/assets/gallery/chaturbhuja/varaha/012.jpeg'
import v13 from '@/assets/gallery/chaturbhuja/varaha/013.jpeg'
import v14 from '@/assets/gallery/chaturbhuja/varaha/014.jpeg'
import v15 from '@/assets/gallery/chaturbhuja/varaha/015.jpeg'
import v16 from '@/assets/gallery/chaturbhuja/varaha/016.jpeg'

const GALLERY_IMAGES = [
  // Paritala
  { src: p01, label: 'Anjana Paradise — Paritala' },
  { src: p02, label: 'Anjana Paradise — Paritala' },
  { src: p03, label: 'Anjana Paradise — Paritala' },
  { src: p04, label: 'Anjana Paradise — Paritala' },
  { src: p05, label: 'Anjana Paradise — Paritala' },
  { src: p06, label: 'Anjana Paradise — Paritala' },
  { src: p07, label: 'Anjana Paradise — Paritala' },
  { src: p08, label: 'Anjana Paradise — Paritala' },
  { src: p09, label: 'Anjana Paradise — Paritala' },
  // Chevitikallu
  { src: c01, label: 'Aparna Legacy — Chevitikallu' },
  { src: c02, label: 'Aparna Legacy — Chevitikallu' },
  { src: c03, label: 'Aparna Legacy — Chevitikallu' },
  { src: c04, label: 'Aparna Legacy — Chevitikallu' },
  { src: c05, label: 'Aparna Legacy — Chevitikallu' },
  // Varaha
  { src: v01, label: 'Varaha Virtue — Pamarru' },
  { src: v02, label: 'Varaha Virtue — Pamarru' },
  { src: v03, label: 'Varaha Virtue — Pamarru' },
  { src: v04, label: 'Varaha Virtue — Pamarru' },
  { src: v05, label: 'Varaha Virtue — Pamarru' },
  { src: v06, label: 'Varaha Virtue — Pamarru' },
  { src: v07, label: 'Varaha Virtue — Pamarru' },
  { src: v08, label: 'Varaha Virtue — Pamarru' },
  { src: v09, label: 'Varaha Virtue — Pamarru' },
  { src: v10, label: 'Varaha Virtue — Pamarru' },
  { src: v11, label: 'Varaha Virtue — Pamarru' },
  { src: v12, label: 'Varaha Virtue — Pamarru' },
  { src: v13, label: 'Varaha Virtue — Pamarru' },
  { src: v14, label: 'Varaha Virtue — Pamarru' },
  { src: v15, label: 'Varaha Virtue — Pamarru' },
  { src: v16, label: 'Varaha Virtue — Pamarru' },
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
            <img src={item.src} alt={item.label} className={styles.gImg} loading="lazy" />
            <div className={styles.gOverlay}>
              <span className={styles.gOverlayLabel}>{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

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
