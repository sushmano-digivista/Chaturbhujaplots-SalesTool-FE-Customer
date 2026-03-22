import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import styles from './Sections.module.css'

const DEFAULT_VIDEOS = [
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Anjana Paradise — Project Overview', subtitle: 'Full property walkthrough & amenities'    },
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Location & Connectivity',            subtitle: 'Paritala to Amaravati route explained'     },
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Amenities Showcase',                 subtitle: 'Infrastructure, parks & lifestyle features' },
]

/**
 * VideosSection — video thumbnail grid with a modal player (YouTube + native video).
 * Props:
 *   content  { videos: Array<{ id, type, title, subtitle, thumbnailUrl? }> }
 */
export default function VideosSection({ content }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const videos = content?.videos || DEFAULT_VIDEOS

  useEffect(() => {
    if (!activeVideo) return
    const handler = (e) => { if (e.key === 'Escape') setActiveVideo(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeVideo])

  return (
    <section className={`section ${styles.vidSec}`} id="videos">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Watch &amp; Explore</div>
        <h2 className="sec-title light">Project <em>Videos</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.6)' }}>
          Take a virtual tour of our open-plot projects from the comfort of your home.
        </p>
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
              {v.thumbnailUrl
                ? <img src={v.thumbnailUrl} alt={v.title} />
                : <div className={styles.vidThumbPlaceholder}><span>🎬</span></div>
              }
              <div className={styles.vidPlayWrap}>
                <div className={styles.vidPlay}>
                  <Play size={24} fill="var(--green)" color="var(--green)" />
                </div>
              </div>
            </div>
            <div className={styles.vidInfo}>
              <div className={styles.vidTitle}>{v.title}</div>
              <div className={styles.vidSub}>{v.subtitle}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video modal — portal-rendered */}
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
            <div className={styles.vidModalTitle}>{activeVideo.title}</div>
            {activeVideo.type === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              />
            ) : (
              <video src={activeVideo.id} controls autoPlay playsInline />
            )}
          </div>
        </motion.div>,
        document.body,
      )}
    </section>
  )
}
