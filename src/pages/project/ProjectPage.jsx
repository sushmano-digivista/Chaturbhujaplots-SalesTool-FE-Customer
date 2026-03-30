import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, MessageCircle, X, Play, Navigation, Menu } from 'lucide-react'
import { getFacingRows }                from '@/constants/facingMap'
import { getProjectGallery, getProjectVideos } from '@/constants/projectGalleries'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import { useSubmitLead }   from '@/hooks/useData'
import LeadModal           from '@/components/ui/LeadModal'
import { openWhatsApp, openMaps } from '@/utils/security'
import { DEFAULT_WA_NUMBER }      from '@/constants/config'
import styles              from './ProjectPage.module.css'

// ── In-page nav tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',      label: 'Home'      },
  { id: 'overview',  label: 'Overview'  },
  { id: 'amenities', label: 'Amenities' },
  { id: 'gallery',   label: 'Gallery'   },
  { id: 'videos',    label: 'Videos'    },
  { id: 'location',  label: 'Location'  },
  { id: 'contact',   label: 'Contact'   },
]

// ── Hero / Home tab ───────────────────────────────────────────────────────────
function HomeTab({ proj, onEnquire }) {
  const total = proj.facings ? Object.values(proj.facings).reduce((a, b) => a + b, 0) : proj.total
  return (
    <div className={styles.homeTab}>
      {/* Hero banner */}
      <div className={`${styles.heroBanner} ${styles[proj.accentClass]}`}
        style={proj.heroImage ? { '--hero-img': `linear-gradient(rgba(10,30,18,.75),rgba(10,30,18,.75)), url(${proj.heroImage})` } : {}}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>{proj.tag}</div>
          <h1 className={styles.heroName}>{proj.name}</h1>
          <p className={styles.heroLoc}>📍 {proj.loc}</p>
          <p className={styles.heroDesc}>{proj.description}</p>
          <div className={styles.heroBtns}>
            <button className="btn btn-gold"
              onClick={() => onEnquire({ source: 'PROJECT_HOME', label: 'Enquire Now', category: proj.name })}>
              Enquire Now →
            </button>
            <button className="btn btn-ghost"
              onClick={() => openWhatsApp(
                proj.contact?.whatsapp || DEFAULT_WA_NUMBER,
                `Hi, I'm interested in ${proj.name}.`,
              )}>
              💬 WhatsApp
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.hsNum}>{proj.upcoming ? 'Coming Soon' : proj.total}</div>
            <div className={styles.hsLabel}>Total Plots</div>
          </div>
          <div className={styles.hsDivider} />
          <div className={styles.heroStat}>
            <div className={styles.hsNum}>{proj.upcoming ? 'Coming Soon' : proj.starting}</div>
            <div className={styles.hsLabel}>Starting From</div>
          </div>
        </div>
      </div>

      {/* Approval badges */}
      <div className={styles.approvalRow}>
        {proj.approvals.map((a) => (
          <span key={a} className={styles.approvalChip}>✓ {a}</span>
        ))}
      </div>

      {/* Highlights */}
      <div className={styles.hlGrid}>
        {proj.highlights.map((h) => (
          <div key={h} className={styles.hlCard}>
            <span className={styles.hlCheck}>✓</span>
            <span>{h}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ proj, onEnquire }) {
  const facingRows  = getFacingRows(proj.facings || {})
  const totalFacing = facingRows.reduce((s, r) => s + r.value, 0)

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Project Overview</h2>

      {proj.upcoming ? (
        <div className={styles.upcomingOverview}>
          <div className={styles.upcomingBadge}>🔜 Upcoming Project</div>
          <h3 className={styles.upcomingHeading}>{proj.name} — Coming Soon</h3>
          <p className={styles.upcomingText}>
            Plot distribution details, pricing and availability for {proj.name} will be
            published shortly. Register your interest now to be notified first when
            bookings open.
          </p>
          <button className="btn btn-gold"
            onClick={() => onEnquire({ source: 'UPCOMING_INTEREST', label: 'Notify Me', category: proj.name, type: 'NOTIFY_ME' })}>
            Notify Me When Available →
          </button>
        </div>
      ) : (
        <>
          {/* Facing breakdown */}
          <div className={styles.facingCard}>
            <div className={styles.facingHeader}>
              <h3 className={styles.facingTitle}>Plot Distribution</h3>
              <span className={styles.facingTotal}>{proj.total} total plots</span>
            </div>
            <div className={styles.facingRows}>
              {facingRows.map((row) => (
                <div key={row.label} className={styles.facingRow}>
                  <div className={styles.facingLabel}>
                    <span style={{ marginRight: 4 }}>{row.icon}</span>
                    <div className={styles.facingDot} style={{ background: row.color }} />
                    {row.label}
                  </div>
                  <div className={styles.facingBar}>
                    <motion.div
                      className={styles.facingFill}
                      style={{ background: row.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(row.value / totalFacing) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className={styles.facingCount}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key facts grid */}
          <div className={styles.factsGrid}>
            {[
              { label: 'Total Plots',    value: proj.total },
              { label: 'Starting Price', value: proj.starting },
              { label: 'Project Status', value: 'Open for Booking' },
            ].map((f) => (
              <div key={f.label} className={styles.factCard}>
                <div className={styles.factVal}>{f.value}</div>
                <div className={styles.factLabel}>{f.label}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-gold"
            onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Get Plot Details', category: proj.name })}>
            Get Detailed Plot Information →
          </button>
        </>
      )}
    </div>
  )
}

// ── Amenities tab ─────────────────────────────────────────────────────────────
function AmenitiesTab({ proj }) {
  const [tab, setTab] = useState('INFRA')
  const tabs      = [...new Set((proj.amenities || []).map((a) => a.tab))]
  const tabLabels = { INFRA: 'Infrastructure', LIFESTYLE: 'Lifestyle', UTILITIES: 'Utilities' }
  const items     = (proj.amenities || []).filter((a) => a.tab === tab)

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Amenities</h2>
      <div className={styles.amTabs}>
        {tabs.map((t) => (
          <button key={t}
            className={`${styles.amTab} ${tab === t ? styles.amTabActive : ''}`}
            onClick={() => setTab(t)}>
            {tabLabels[t] || t}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} className={styles.amGrid}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {items.map((item) => (
            item.featured ? (
              <div key={item.label} className={styles.amFeatured}>
                <div className={styles.amFeatIcon}>{item.icon}</div>
                <div>
                  <div className={styles.amFeatLabel}>{item.label}</div>
                  <div className={styles.amFeatDesc}>{item.featuredDesc}</div>
                </div>
                <span className={styles.amNearby}>Nearby</span>
              </div>
            ) : (
              <motion.div key={item.label} className={styles.amItem}
                whileHover={{ borderColor: 'var(--gold)' }}>
                <div className={styles.amIcon}>{item.icon}</div>
                <span>{item.label}</span>
              </motion.div>
            )
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Gallery tab ───────────────────────────────────────────────────────────────
function GalleryTab({ proj }) {
  const [lightbox, setLightbox] = useState(null)
  const localImages = getProjectGallery(proj.id)
  const hasRealImages = localImages.length > 0
  const items = hasRealImages ? localImages : (proj.gallery || [])
  const close = () => setLightbox(null)
  const prev  = () => setLightbox(i => (i - 1 + items.length) % items.length)
  const next  = () => setLightbox(i => (i + 1) % items.length)

  useEffect(() => {
    if (lightbox === null) return
    const h = (e) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [lightbox])

  if (!hasRealImages) return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Gallery</h2>
      <div style={{ textAlign:'center', padding:'60px 0' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>📷</div>
        <div style={{ fontSize:'1.2rem', fontFamily:"'Cormorant Garamond',serif", color:'rgba(0,0,0,0.5)' }}>
          Gallery <em style={{ color:'var(--gold-dark)' }}>Coming Soon</em>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Gallery</h2>
      <div className={styles.galGrid}>
        {items.map((item, idx) => (
          <motion.div key={idx}
            className={`${styles.galCell} ${idx === 0 ? styles.galFeatured : ''}`}
            onClick={() => setLightbox(idx)}
            whileHover={{ scale: 1.02 }}>
            <img src={item.src} alt={item.label} className={styles.galImg} loading="lazy" />
            <div className={styles.galOverlay}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className={styles.lbOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) close() }}>
            <button className={styles.lbClose} onClick={close}><X size={16} /></button>
            <button className={`${styles.lbNavBtn} ${styles.lbNavLeft}`} onClick={prev}>‹</button>
            <div className={styles.lbPanel}>
              <img src={items[lightbox]?.src} alt={items[lightbox]?.label}
                className={styles.lbFullImg} />
              <div className={styles.lbCaption}>
                <span className={styles.lbLabel}>{items[lightbox]?.label}</span>
                <span className={styles.lbCount}>{lightbox + 1} / {items.length}</span>
              </div>
            </div>
            <button className={`${styles.lbNavBtn} ${styles.lbNavRight}`} onClick={next}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Videos tab ────────────────────────────────────────────────────────────────
function VideosTab({ proj }) {
  const [active, setActive] = useState(null)

  // Load local video files; fall back to youtube entries from proj.videos
  const localVids   = getProjectVideos(proj.id)
  const youtubeVids = (proj.videos || []).filter(v => v.type === 'youtube' && v.id && !v.id.includes('dQw4w9WgXcY'))
  const videos = localVids.length > 0
    ? localVids.map((v, i) => ({ type: 'local', src: v.src, title: v.label || `Video ${i + 1}`, subtitle: v.subtitle || proj.name }))
    : youtubeVids

  useEffect(() => {
    if (!active) return
    const h = (e) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active])

  if (!videos.length) return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Videos</h2>
      <div style={{ textAlign:'center', padding:'60px 0' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>🎬</div>
        <div style={{ fontSize:'1.2rem', fontFamily:"'Cormorant Garamond',serif", color:'rgba(0,0,0,0.5)' }}>
          Videos <em style={{ color:'var(--gold-dark)' }}>Coming Soon</em>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Videos</h2>
      <div className={styles.vidGrid}>
        {videos.map((v, i) => (
          <motion.div key={i} className={styles.vidCard}
            whileHover={{ y: -4 }} onClick={() => setActive(v)}>
            <div className={styles.vidThumb}>
              {v.type === 'youtube'
                ? <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} className={styles.vidThumbnailImg} />
                : <video src={v.src} className={styles.vidThumbnailImg} muted preload="metadata" style={{ pointerEvents:'none' }} />
              }
              <div className={styles.vidPlayWrap}>
                <Play size={22} fill="var(--green)" color="var(--green)" />
              </div>
            </div>
            <div className={styles.vidInfo}>
              <div className={styles.vidSub} style={{ color:'var(--gold-dark)', fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:3 }}>
                {v.subtitle}
              </div>
              <div className={styles.vidTitle}>{v.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className={styles.vidModal}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setActive(null) }}>
            <div className={styles.vidModalInner}>
              <button className={styles.vidClose} onClick={() => setActive(null)}><X size={18} /></button>
              <div className={styles.vidModalTitle}>{active.title}</div>
              {active.type === 'youtube' ? (
                <iframe src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title={active.title} />
              ) : (
                <video src={active.src} controls autoPlay playsInline style={{ width:'100%', borderRadius:8 }} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Location tab ──────────────────────────────────────────────────────────────
function LocationTab({ proj }) {
  const distances = proj.distances || []
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Location & Connectivity</h2>
      <div className={styles.mapWrap}>
        {proj.mapEmbedUrl && (
          <iframe src={proj.mapEmbedUrl} className={styles.iframe}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title={`${proj.name} Location`} />
        )}
        <button className={styles.mapOpenBtn}
          onClick={() => openMaps(proj.mapOpenUrl)}>
          <Navigation size={14} /> Open in Google Maps
        </button>
      </div>
      <div className={styles.distGrid}>
        {distances.map((d, i) => (
          <motion.div key={d.name} className={styles.distCard}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <div className={styles.distIcon}>{d.icon}</div>
            <div className={styles.distBody}>
              <div className={styles.distName}>{d.name}</div>
              <div className={styles.distSub}>{d.subtitle}</div>
            </div>
            <div className={styles.distBadge}>{d.distance}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Contact tab ───────────────────────────────────────────────────────────────
function ContactTab({ proj, onEnquire }) {
  const c = proj.contact || {}
  const openWA = () => openWhatsApp(
    c.whatsapp || DEFAULT_WA_NUMBER,
    `Hi, I am interested in ${proj.name} at ${proj.loc}.`
  )

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Contact Us</h2>
      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          {c.phone    && <a href={`tel:${c.phone}`}       className={styles.contactRow}><Phone size={16} />{c.phone}</a>}
          {c.whatsapp && <button className={styles.contactRow} onClick={openWA}><MessageCircle size={16} />WhatsApp Chat</button>}
          {c.email    && <a href={`mailto:${c.email}`}    className={styles.contactRow}>✉️ {c.email}</a>}
          {c.address  && <div className={styles.contactRow}>📍 {c.address}</div>}
          {c.website  && <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className={styles.contactRow}>🌐 {c.website}</a>}
        </div>
        <div className={styles.contactCtas}>
          <button className="btn btn-gold btn-full"
            onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Request Callback', type: 'CALLBACK', category: proj.name })}>
            📞 Request Callback
          </button>
          <button className="btn btn-green btn-full" style={{ marginTop: 10 }}
            onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Schedule Site Visit', type: 'SITE_VISIT', category: proj.name })}>
            🗓️ Schedule Site Visit
          </button>
          <button className={styles.waBtn} onClick={openWA}>
            💬 Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

// ── ProjectPage ───────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [activeTab, setActiveTab]   = useState('home')
  const [leadCtx,   setLeadCtx]     = useState(null)
  const [mobileNav, setMobileNav]   = useState(false)

  const proj = ACTIVE_PROJECTS.find((p) => p.id === id)

  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!proj) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>🏗️</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond,serif' }}>Project not found</h2>
        <button className="btn btn-gold" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    )
  }

  const tabComponents = {
    home:      <HomeTab      proj={proj} onEnquire={openEnquiry} />,
    overview:  <OverviewTab  proj={proj} onEnquire={openEnquiry} />,
    amenities: <AmenitiesTab proj={proj} />,
    gallery:   <GalleryTab   proj={proj} />,
    videos:    <VideosTab    proj={proj} />,
    location:  <LocationTab  proj={proj} />,
    contact:   <ContactTab   proj={proj} onEnquire={openEnquiry} />,
  }

  return (
    <div className={styles.page}>

      {/* ── Top nav bar ───────────────────────────────────────────────────── */}
      <header className={`${styles.header} ${styles[proj.accentClass]}`}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className={styles.headerTitle}>
            <span className={styles.headerName}>{proj.name}</span>
            <span className={styles.headerLoc}>📍 {proj.loc}</span>
          </div>
          <button className={styles.enquireBtn}
            onClick={() => openEnquiry({ source: 'CONTACT_FORM', label: 'Enquire Now', category: proj.name })}>
            Enquire Now →
          </button>
          {/* Mobile nav toggle */}
          <button className={styles.mobileNavBtn} onClick={() => setMobileNav((v) => !v)}>
            <Menu size={18} />
          </button>
        </div>

        {/* Desktop tab bar */}
        <nav className={styles.tabBar}>
          {TABS.map((t) => (
            <button key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ''}`}
              onClick={() => { setActiveTab(t.id); setMobileNav(false) }}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileNav && (
            <motion.nav className={styles.mobileTabMenu}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {TABS.map((t) => (
                <button key={t.id}
                  className={`${styles.mobileTabBtn} ${activeTab === t.id ? styles.mobileTabActive : ''}`}
                  onClick={() => { setActiveTab(t.id); setMobileNav(false) }}>
                  {t.label}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}>
            {tabComponents[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Lead modal ────────────────────────────────────────────────────── */}
      <LeadModal
        context={leadCtx}
        onClose={closeEnquiry}
        whatsapp={proj.contact?.whatsapp}
      />
    </div>
  )
}
