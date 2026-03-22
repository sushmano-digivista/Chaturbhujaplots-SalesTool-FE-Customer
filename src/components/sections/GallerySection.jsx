import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Sections.module.css'

/**
 * GallerySection
 * ─────────────────────────────────────────────────────────────────────────────
 * Images are loaded from /public/gallery/chaturbhuja/*.*
 *
 * To add images: drop any .jpg / .jpeg / .png / .webp file into
 *   public/gallery/chaturbhuja/
 *
 * GALLERY_IMAGES below is the manifest — add an entry for each file you place
 * in that folder. The path must match the filename exactly.
 */
const GALLERY_IMAGES = [
  { src: '/gallery/chaturbhuja/01_entrance_arch.jpg',      label: 'Grand Entrance Arch'       },
  { src: '/gallery/chaturbhuja/02_avenue_roads.jpg',       label: 'Avenue Lined Roads'        },
  { src: '/gallery/chaturbhuja/03_park.jpg',               label: 'Green Parks & Gardens'     },
  { src: '/gallery/chaturbhuja/04_plot_layout.jpg',        label: 'Plot Layout Overview'      },
  { src: '/gallery/chaturbhuja/05_water_tank.jpg',         label: 'Overhead Tank & Pipeline'  },
  { src: '/gallery/chaturbhuja/06_street_lights.jpg',      label: 'LED Street Lights'         },
  { src: '/gallery/chaturbhuja/07_children_play.jpg',      label: "Children's Play Area"      },
  { src: '/gallery/chaturbhuja/08_jogging_track.jpg',      label: 'Jogging Track'             },
  { src: '/gallery/chaturbhuja/09_security_gate.jpg',      label: 'Security Gate & Arch'      },
  { src: '/gallery/chaturbhuja/10_aerial_view.jpg',        label: 'Aerial Layout View'        },
  { src: '/gallery/chaturbhuja/11_compound_wall.jpg',      label: 'Compound Wall'             },
  { src: '/gallery/chaturbhuja/12_house_render.jpg',       label: 'House Construction Render' },
]

// Fallback placeholder when an image hasn't been added yet
function ImgCell({ item, featured, onClick, index }) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  return (
    <motion.div
      className={`${styles.gCell} ${featured ? styles.gCellFeatured : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {!error ? (
        <img
          src={item.src}
          alt={item.label}
          className={styles.gImg}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
          onLoad={()  => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        /* Placeholder shown until real image is placed in the folder */
        <div className={styles.gPlaceholder}>
          <span className={styles.gPlaceholderIcon}>🏞</span>
        </div>
      )}
      <div className={styles.gOverlay}><span className={styles.gOverlayLabel}>{item.label}</span></div>
    </motion.div>
  )
}

export default function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null)

  // Prefer API-supplied gallery; fall back to local image manifest
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

  return (
    <section className={`section ${styles.galSec}`} id="gallery">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Visual Tour</div>
        <h2 className="sec-title light">Project <em>Gallery</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.6)' }}>
          Glimpses from our open-plot projects — lush landscapes, infrastructure and modern amenities.
        </p>
      </div>

      {/* Masonry grid — first item spans 2 rows (featured) */}
      <div className={styles.galGrid}>
        {items.map((item, idx) => (
          <ImgCell
            key={idx}
            item={item}
            featured={idx === 0}
            index={idx}
            onClick={() => open(idx)}
          />
        ))}
      </div>

      {/* Lightbox portal */}
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
                transition={{ duration: 0.25 }}
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
