import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { getProjectVideos } from '@/constants/projectGalleries'
import styles from './Sections.module.css'

/**
 * VideosSection — home page video grid.
 * Auto-detects all videos from src/assets/videos/chaturbhuja/<project>/
 * Add/remove videos by dropping files in those folders — no code changes needed.
 */

// Combine all project videos into one flat list
const ALL_VIDEOS = [
  ...getProjectVideos('anjana'),
  ...getProjectVideos('aparna'),
  ...getProjectVideos('varaha'),
  ...getProjectVideos('trimbak'),
]

export default function VideosSection({ content }) {
  const [activeVideo, setActiveVideo] = useState(null)

  // Use local video files; never show YouTube placeholder IDs
  const videos = ALL_VIDEOS.length > 0
    ? ALL_VIDEOS
    : (content?.videos || []).filter(v => v.type === 'youtube' && v.id && !v.id.includes('dQw4w9WgXcY'))

  useEffect(() => {
    if (!activeVideo) return
    const handler = (e) => { if (e.key === 'Escape') setActiveVideo(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeVideo])

  if (!videos.length) return null

  return (
    <section className={`section ${styles.vidSec}`} id="videos">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Watch &amp; Explore</div>
        <h2 className="sec-title light">Project <em>Videos</em></h2>
      </div>

      <div className={styles.vidGrid}>
        {videos.map((v, i) => (
          <motion.div
            key={i}
            className={styles.vidCard}
            whileHover={{ translateY: -4, boxShadow: '0 12px 40px rgba(0,0,0,.4)' }}
            onClick={() => setActiveVideo(v)}
          >
            <div className={styles.vidThumb}>
              {v.type === 'youtube'
                ? <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} className={styles.vidThumbnailImg} />
                : (
                  <video
                    src={v.src}
                    className={styles.vidThumbnailImg}
                    muted preload="metadata"
                    style={{ pointerEvents: 'none' }}
                  />
                )
              }
              <div className={styles.vidPlayWrap}>
                <div className={styles.vidPlay}>
                  <Play size={24} fill="var(--green)" color="var(--green)" />
                </div>
              </div>
            </div>
            <div className={styles.vidInfo}>
              <div className={styles.vidTitle}>{v.title || v.name}</div>
              {v.subtitle && <div className={styles.vidSub}>{v.subtitle}</div>}
            </div>
          </motion.div>
        ))}
      </div>

      {activeVideo && createPortal(
        <motion.div
          className={styles.vidModal}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveVideo(null) }}
        >
          <div className={styles.vidModalInner}>
            <button className={styles.vidModalClose} onClick={() => setActiveVideo(null)}>
              <X size={18} />
            </button>
            <div className={styles.vidModalTitle}>{activeVideo.title || activeVideo.name}</div>
            {activeVideo.type === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              />
            ) : (
              <video src={activeVideo.src} controls autoPlay playsInline />
            )}
          </div>
        </motion.div>,
        document.body,
      )}
    </section>
  )
}
