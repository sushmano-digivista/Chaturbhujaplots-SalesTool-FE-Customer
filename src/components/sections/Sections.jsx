import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation, Play, X }  from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './Sections.module.css'

// ── Portfolio ─────────────────────────────────────────────────
const ACTIVE_PROJECTS = [
  {
    id: 'anjana', name: 'Anjana Paradise', loc: 'Paritala, Near Amaravati',
    color: 'c1', available: 14, total: 242, starting: 'Rs.23.9L',
    approvals: ['CRDA Proposed', 'AP RERA', 'Clear Title', 'Vaasthu'],
    highlights: ['Adjacent to NH-16', '8km from Amaravati', 'Ready to Build', 'Avenue Lined Roads'],
  },
  {
    id: 'trimbak', name: 'Trimbak Oaks', loc: 'Penamaluru, Near Vijayawada',
    color: 'c2', available: 18, total: 48, starting: 'Rs.28L',
    approvals: ['CRDA Approved', 'RERA Registered', 'Clear Title'],
    highlights: ['5km from Vijayawada', 'NH-16 Access', 'Gated Security', 'Water & Electricity'],
  },
  {
    id: 'aparna', name: 'Aparna Legacy', loc: 'Chevitikallu',
    color: 'c3', available: 16, total: 28, starting: 'Rs.26L',
    approvals: ['CRDA Approved', 'Vaastu Compliant', 'East-Facing'],
    highlights: ['East-Facing Plots', 'Park Facing Options', 'Corner Plots Available', 'Water & Electricity'],
  },
  {
    id: 'varaha', name: 'Varaha Virtue', loc: 'Pamarru, Near NH-16',
    color: 'c4', available: 20, total: 32, starting: 'Rs.25L',
    approvals: ['CRDA Approved', 'NH-16 Access', 'Industrial Corridor'],
    highlights: ['Direct NH-16 Access', 'Industrial Corridor Zone', 'Gated Security 24/7', 'Jogging Track'],
  },
]
const COMPLETED_PROJECTS = [
  { name: 'Nandana Vihar', loc: 'Kanumuru' },
  { name: 'County',        loc: 'Edupugallu' },
  { name: 'Pearl',         loc: 'Kankipadu' },
  { name: 'Empire',        loc: 'Penamaluru' },
  { name: 'Pride',         loc: 'Nepalli' },
  { name: 'Prime',         loc: 'Kankipadu' },
]

export function PortfolioSection({ content, onEnquire }) {
  const [tab, setTab] = useState('booking')
  const portfolioStats = content?.portfolio?.stats || [
    { value: '10+',   label: 'Projects'  },
    { value: '1000+', label: 'Families'  },
    { value: '15+',   label: 'Years'     },
    { value: '100%',  label: 'Approved'  },
  ]
  const active    = content?.portfolio?.active    || ACTIVE_PROJECTS
  const completed = content?.portfolio?.completed || COMPLETED_PROJECTS

  return (
    <section className={`section ${styles.portSec}`} id="portfolio">
      <div className="sec-hdr">
        <div className="sec-tag" style={{ color: 'var(--gold-dark)' }}>Our Projects</div>
        <h2 className="sec-title light">A Legacy of <em>Excellence</em></h2>
        <p className="sec-sub" style={{ color: 'rgba(255,255,255,.65)' }}>
          10+ projects delivered across the Krishna–Guntur corridor, with 1000+ families settled and 100% CRDA/RERA approved.
        </p>
      </div>

      {/* Stats bar */}
      <div className={styles.portStats}>
        {portfolioStats.map(s => (
          <div key={s.label} className={styles.ps}>
            <div className={styles.psNum}>{s.value}</div>
            <div className={styles.psLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.portTabs}>
        <button className={`${styles.portTab} ${tab === 'booking' ? styles.portTabActive : ''}`}
          onClick={() => setTab('booking')}>🟡 Open for Booking (4)</button>
        <button className={`${styles.portTab} ${tab === 'done' ? styles.portTabActive : ''}`}
          onClick={() => setTab('done')}>✅ Completed (6)</button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'booking' ? (
          <motion.div key="booking" className={styles.portGrid}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {active.map((proj, i) => (
              <ProjectCard key={proj.id} proj={proj} delay={i * 0.07} onEnquire={onEnquire} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="done" className={styles.compGrid}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {completed.map(p => (
              <div key={p.name} className={styles.compCard}>
                <div className={styles.compName}>{p.name}</div>
                <div className={styles.compLoc}>📍 {p.loc}</div>
                <span className={styles.compBadge}>✓ Completed · Fully Sold</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ proj, delay, onEnquire }) {
  return (
    <motion.div
      className={`${styles.portCard} ${styles[proj.color]}`}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }}
      whileHover={{ translateY: -4 }}>
      <div className={styles.pcHeader}>
        <div>
          <div className={styles.pcName}>{proj.name}</div>
          <div className={styles.pcLoc}>📍 {proj.loc}</div>
        </div>
        <div className={styles.pcBadge}>
          <span className={styles.pcDot} /> {proj.available} Available
        </div>
      </div>
      <div className={styles.pcApprovals}>
        {proj.approvals.map(a => <span key={a} className={styles.pcTag}>{a}</span>)}
      </div>
      <div className={styles.pcHighlights}>
        {proj.highlights.map(h => <div key={h} className={styles.pcHl}>{h}</div>)}
      </div>
      <div className={styles.pcPrice}>Starting from <strong>{proj.starting}</strong></div>
      <button className={styles.pcViewBtn}
        onClick={() => onEnquire({ source: 'PORTFOLIO_CARD', label: `Enquire — ${proj.name}`, category: proj.name })}>
        View Project & Enquire →
      </button>
    </motion.div>
  )
}


// ── Gallery ───────────────────────────────────────────────────
const HOME_GALLERY = [
  { label: 'Grand Entrance Arch',   icon: '🏛️' },
  { label: 'Avenue Lined Roads',    icon: '🛣️' },
  { label: 'Green Parks & Gardens', icon: '🌿' },
  { label: 'Plot Layout View',      icon: '🏞️' },
  { label: 'Tree Avenue',           icon: '🌴' },
  { label: 'Floral Gardens',        icon: '🌺' },
  { label: 'Security Gate',         icon: '🔒' },
]

export function GallerySection({ content }) {
  const [lightbox, setLightbox] = useState(null) // { idx }
  const items = content?.gallery || HOME_GALLERY

  const openLightbox = idx => setLightbox({ idx })
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox(l => ({ idx: (l.idx - 1 + items.length) % items.length }))
  const next = () => setLightbox(l => ({ idx: (l.idx + 1) % items.length }))

  useEffect(() => {
    if (!lightbox) return
    const handler = e => {
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
            transition={{ duration: 0.2 }}>
            <div className={styles.gIcon} style={{ fontSize: idx === 0 ? '5rem' : '3rem' }}>
              {item.icon || '🏞️'}
            </div>
            <div className={styles.gOverlay}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && createPortal(
        <motion.div className={styles.lbOverlay}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) closeLightbox() }}>
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
        document.body
      )}
    </section>
  )
}


// ── Videos ────────────────────────────────────────────────────
const DEFAULT_VIDEOS = [
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Anjana Paradise — Project Overview',    subtitle: 'Full property walkthrough & amenities' },
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Location & Connectivity',              subtitle: 'Paritala to Amaravati route explained' },
  { id: 'dQw4w9WgXcY', type: 'youtube', title: 'Amenities Showcase',                   subtitle: 'Infrastructure, parks & lifestyle features' },
]

export function VideosSection({ content }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const videos = content?.videos || DEFAULT_VIDEOS

  useEffect(() => {
    if (!activeVideo) return
    const handler = e => { if (e.key === 'Escape') setActiveVideo(null) }
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
          <motion.div key={i} className={styles.vidCard}
            whileHover={{ translateY: -4, boxShadow: '0 12px 40px rgba(0,0,0,.4)' }}
            onClick={() => setActiveVideo(v)}>
            <div className={styles.vidThumb}>
              {v.thumbnailUrl
                ? <img src={v.thumbnailUrl} alt={v.title} />
                : (
                  <div className={styles.vidThumbPlaceholder}>
                    <span>🎬</span>
                  </div>
                )
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

      {/* Video modal */}
      {activeVideo && createPortal(
        <motion.div className={styles.vidModal}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={e => { if (e.target === e.currentTarget) setActiveVideo(null) }}>
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
        document.body
      )}
    </section>
  )
}


// ── Highlights / Why Paritala ─────────────────────────────────
export function HighlightsSection({ content }) {
  const highlights = (content?.highlights || []).sort((a,b) => a.sortOrder - b.sortOrder)
  return (
    <section className={`section ${styles.hlSec}`} id="highlights">
      <div className="sec-hdr">
        <div className="sec-tag" style={{color:'var(--gold-light)'}}>Why Paritala</div>
        <h2 className="sec-title" style={{color:'#fff'}}>Location <em>Advantages</em></h2>
        <p className="sec-sub" style={{color:'rgba(255,255,255,0.55)'}}>
          Strategically situated on one of AP's most promising growth corridors.
        </p>
      </div>
      <div className={styles.hlGrid}>
        {highlights.map((h, i) => (
          <motion.div key={h.title} className={styles.hlCard}
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay: i*0.07 }}
            whileHover={{ y:-4 }}>
            <div className={styles.hlIcon}>{h.icon}</div>
            <h4 className={styles.hlTitle}>{h.title}</h4>
            <p className={styles.hlDesc}>{h.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Amenities ─────────────────────────────────────────────────
export function AmenitiesSection({ content }) {
  const [tab, setTab] = useState('INFRA')
  const all       = content?.amenities || []
  const tabs      = ['INFRA', 'LIFESTYLE', 'UTILITIES']
  const tabLabels = { INFRA:'Infrastructure', LIFESTYLE:'Lifestyle', UTILITIES:'Utilities' }
  const items     = all.filter(a => a.tab === tab).sort((a,b) => a.sortOrder - b.sortOrder)

  return (
    <section className="section section-cream" id="amenities">
      <div className="sec-hdr">
        <div className="sec-tag">What We Offer</div>
        <h2 className="sec-title">World-Class <em>Amenities</em></h2>
        <p className="sec-sub">Every detail crafted for a refined, future-ready lifestyle.</p>
      </div>
      <div className={styles.amTabs}>
        {tabs.map(t => (
          <button key={t} className={`${styles.amTab} ${tab===t ? styles.amTabActive : ''}`}
            onClick={() => setTab(t)}>
            {tabLabels[t]}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} className={styles.amGrid}
          initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
          {items.map((item, i) => (
            item.featured
              ? <FeaturedAmenity key={item.label} item={item} delay={i*0.05} />
              : (
                <motion.div key={item.label} className={styles.amItem}
                  initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}
                  whileHover={{borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
                  <div className={styles.amIcon}>{item.icon}</div>
                  <span>{item.label}</span>
                </motion.div>
              )
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function FeaturedAmenity({ item, delay }) {
  return (
    <motion.div className={styles.featCard}
      initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay}}
      whileHover={{borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
      <div className={styles.featIcon}>{item.icon}</div>
      <div>
        <div className={styles.featTitle}>{item.label}</div>
        <div className={styles.featDesc}>{item.featuredDesc}</div>
      </div>
      <span className={styles.featBadge}>Nearby</span>
    </motion.div>
  )
}

// ── Quote / Investment Banner ──────────────────────────────────
export function QuoteSection({ content, onEnquire }) {
  const q = content?.quote || {}
  return (
    <section className={`section ${styles.quoteSec}`}>
      <motion.div className={styles.quoteInner}
        initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6}}>
        <span className={styles.quoteTag}>Investment Opportunity</span>
        <h2 className={styles.quoteH}>{q.investLine1 || 'Invest ₹2 Today —'}</h2>
        <h2 className={styles.quoteH}>{q.investLine2 || 'Receive ₹20 Tomorrow'}</h2>
        <div className={styles.quoteDivider} />
        <p className={styles.quoteText}>&ldquo;{q.quote || 'If you invest 2 rupees now, in a few years it will be 10 times your investment.'}&rdquo;</p>
        <div className={styles.quoteStats}>
          {(q.stats || [{value:'10×',label:'Expected Return'},{value:'5–7',label:'Years'},{value:'Safe',label:'CRDA + RERA'}])
            .map(s => (
              <div key={s.label} className={styles.quoteStat}>
                <div className={styles.quoteStatNum}>{s.value}</div>
                <div className={styles.quoteStatLabel}>{s.label}</div>
              </div>
            ))}
        </div>
        <button className="btn btn-gold" onClick={() => onEnquire({ source:'HERO_CTA', label:'Secure Plot' })}>
          Secure Your Plot Now →
        </button>
      </motion.div>
    </section>
  )
}

// ── Location ──────────────────────────────────────────────────
export function LocationSection({ content }) {
  const distances = (content?.distances || []).sort((a,b) => a.sortOrder - b.sortOrder)
  const contact   = content?.contact || {}
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.25 })

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">Find Us</div>
        <h2 className="sec-title">Location & <em>Connectivity</em></h2>
        <p className="sec-sub">8 km from Amaravati with excellent road, rail and air access.</p>
      </div>

      <div className={styles.mapWrap} ref={ref}>
        {contact.mapEmbedUrl && (
          <iframe src={contact.mapEmbedUrl} className={styles.iframe}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Anjana Paradise Location" />
        )}
        <motion.div className={styles.popup}
          initial={{opacity:0, scale:0.5}} animate={inView ? {opacity:1, scale:1} : {}}
          transition={{delay:0.4, duration:0.5, ease:[0.34,1.56,0.64,1]}}>
          <div className={styles.popupTitle}>📍 Anjana Paradise</div>
          <div className={styles.popupSub}>Paritala, Near Amaravati, AP</div>
          <div className={styles.popupBadges}>
            <span className={styles.badgeGreen}>CRDA Approved</span>
            <span className={styles.badgeBlue}>RERA Registered</span>
          </div>
          <button className={styles.popupBtn}
            onClick={() => window.open(contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh', '_blank')}>
            Open in Maps
          </button>
          <div className={styles.popupArrow} />
        </motion.div>
        <div className={styles.mapBar}>
          <div className={styles.barLeft}>
            <div className={styles.liveDot} />
            <div>
              <div className={styles.barName}>Anjana Paradise, Paritala</div>
              <div className={styles.barAddr}>{contact.address || 'Krishna District · Andhra Pradesh'}</div>
            </div>
          </div>
          <button className="btn btn-gold btn-sm"
            onClick={() => window.open(contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh','_blank')}>
            <Navigation size={14} /> Get Directions
          </button>
        </div>
      </div>

      <div className={styles.distGrid}>
        {distances.map((d, i) => (
          <motion.div key={d.name} className={styles.distCard}
            initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
            transition={{delay:i*0.07}} whileHover={{y:-2, boxShadow:'var(--shadow)'}}>
            <div className={styles.distIcon}>{d.icon}</div>
            <div className={styles.distBody}>
              <div className={styles.distName}>{d.name}</div>
              <div className={styles.distSub}>{d.subtitle}</div>
            </div>
            <div className={styles.distBadge}>{d.distance}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────
export function ContactSection({ content, onEnquire }) {
  const contact = content?.contact || {}
  const openWA  = () => {
    const num = contact.whatsapp || '919999999999'
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots near Amaravati.')}`, '_blank')
  }

  return (
    <section className={`section ${styles.contactSec}`} id="contact">
      <div className={styles.contactGrid}>
        <motion.div
          initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.5}}>
          <div className="sec-tag" style={{color:'var(--gold-light)'}}>Get In Touch</div>
          <h2 className="sec-title" style={{color:'#fff'}}>Secure Your <em>Plot Today</em></h2>
          <p style={{color:'rgba(255,255,255,0.62)', fontSize:15, lineHeight:1.75, marginBottom:28}}>
            Our team is available 7 days a week. Call us, WhatsApp or fill the form.
          </p>
          <div className={styles.perks}>
            {['Free site visit with transport','No-obligation consultation','Flexible payment plans','Home loan assistance'].map(p => (
              <div key={p} className={styles.perk}><span className={styles.check}>✓</span>{p}</div>
            ))}
          </div>
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className={styles.callCard}>
              <span style={{fontSize:20}}>📞</span>
              <div>
                <div className={styles.callLabel}>Call Us Directly</div>
                <div className={styles.callNum}>{contact.phone}</div>
              </div>
            </a>
          )}
        </motion.div>

        <motion.div className={styles.ctaBox}
          initial={{opacity:0, x:20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}}>
          <h3 className={styles.ctaTitle}>Choose How to Connect</h3>
          <div className={styles.ctaBtns}>
            <button className="btn btn-green btn-full"
              onClick={() => onEnquire({ source:'CONTACT_FORM', label:'Get Callback', type:'CALLBACK' })}>
              📞 Get Callback
            </button>
            <button className={styles.visitBtn}
              onClick={() => onEnquire({ source:'CONTACT_FORM', label:'Schedule Site Visit', type:'SITE_VISIT' })}>
              🗓️ Schedule Site Visit
            </button>
            <button className={styles.waBtn} onClick={openWA}>
              💬 Chat on WhatsApp
            </button>
          </div>
          <div className={styles.ctaNote}>
            We typically respond within <strong>30 minutes</strong> during business hours (9am–7pm).
          </div>
        </motion.div>
      </div>
    </section>
  )
}
