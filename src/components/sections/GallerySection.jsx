import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Sections.module.css'

/**
 * Home page gallery — ALL images from ALL subfolders under
 * src/assets/gallery/chaturbhuja/ (root level + every subfolder).
 *
 * Drop any image anywhere in that tree → auto-appears. No code changes needed.
 */

// Single glob that picks up every image at every depth
// Using /src/ absolute path - works regardless of where this file lives
const allImageModules = {
  ...import.meta.glob('/src/assets/gallery/chaturbhuja/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
  ...import.meta.glob('/src/assets/gallery/chaturbhuja/**/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
}

// Build flat sorted list — filename without extension as label
const ALL_IMAGES = Object.keys(allImageModules)
  .sort()
  .map(path => ({
    src:   allImageModules[path].default,
    label: path.split('/').pop()
      .replace(/\.\w+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/^\d+\s*/, '')
      .trim(),
  }))

export default function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null)

  const apiGallery = content?.gallery || []
  const items = apiGallery.length > 0
    ? apiGallery.map(g => ({ src: g.thumbnailUrl || g.src, label: g.label }))
    : ALL_IMAGES

  const open  = idx => setLightbox({ idx })
  const close = () => setLightbox(null)
  const prev  = () => setLightbox(l => ({ idx: (l.idx - 1 + items.length) % items.length }))
  const next  = () => setLightbox(l => ({ idx: (l.idx + 1) % items.length }))

  useEffect(() => {
    if (!lightbox) return
    const fn = e => {
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
          onClick={e => { if (e.target === e.currentTarget) close() }}
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
