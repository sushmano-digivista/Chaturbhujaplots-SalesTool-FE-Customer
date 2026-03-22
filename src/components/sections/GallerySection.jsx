import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Sections.module.css'

/**
 * GallerySection
 * ─────────────────────────────────────────────────────────────────────────────
 * Images are automatically picked up from /public/gallery/chaturbhuja/
 * via Vite's import.meta.glob — no manifest needed.
 *
 * To add/remove images: simply add or remove files from that folder.
 * Supported formats: .jpg  .jpeg  .png  .webp  .avif
 */

// Dynamically import all images from /src/gallery/chaturbhuja/
// We use eager:true so they are resolved at build time (no lazy chunks)
const globModules = import.meta.glob(
  '/public/gallery/chaturbhuja/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, as: 'url' }
)

// Sort by filename and build item list
const GALLERY_IMAGES = Object.keys(globModules)
  .sort() // alphabetical / numeric order (01_, 02_, ...)
  .map((path) => ({
    src:   globModules[path],
    label: path
      .split('/').pop()           // get filename
      .replace(/^\d+_/, '')       // strip leading number prefix (01_, 02_…)
      .replace(/\.[^.]+$/, '')    // strip extension
      .replace(/_/g, ' ')         // underscores → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()), // Title Case
  }))

export default function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null)

  // API gallery takes priority; fall back to local folder images
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

  if (items.length === 0) return null

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
            <div className={styles.gOverlay}>{item.label}</div>
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
