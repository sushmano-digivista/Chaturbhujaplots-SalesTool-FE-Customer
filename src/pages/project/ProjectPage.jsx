import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, X, Play, Navigation, Menu } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { getFacingRows }                from '@/constants/facingMap'
import { getProjectGallery, getProjectVideos } from '@/constants/projectGalleries'
import { useSubmitLead, usePricing, useContactSettings, useProject } from '@/hooks/useData'
import LeadModal           from '@/components/ui/LeadModal'
import PricingCard         from '@/components/ui/PricingCard'
import QRCard              from '@/components/ui/QRCard'
import { openWhatsApp, openMaps } from '@/utils/security'
import { DEFAULT_WA_NUMBER }      from '@/constants/config'
import LaunchBanner               from '@/components/ui/LaunchBanner'
import LanguageToggle             from '@/components/layout/LanguageToggle'
import { useLanguage }            from '@/context/LanguageContext'
import styles              from './ProjectPage.module.css'

// ── Amenity label → translation key map ──────────────────────────────────────
const AMENITY_KEY_MAP = {
  'Architecturally Imposing Grand Entrance Arch': 'grandEntrance',
  'Avenue Plantation on Both Sides of Roads':     'avenuePlantation',
  'Overhead Tank — Pipeline to Every Plot':       'overheadTank',
  'Overhead Electricity Lines':                   'overheadElec',
  'Security Arch with CCTV Surveillance':         'securityCctv',
  'Name & Number Display Board per Plot':         'nameBoard',
  'BT Roads Throughout Layout':                   'btRoads',
  'CC Roads Throughout Layout':                   'ccRoads',
  '100% Vastu Compliant Layout':                  'vastu',
  'Gated Entrance with Security Arch':            'gatedEntrance',
  '40ft Internal CC Roads':                       'roads40ft',
  'Borewell & Pipeline Water Supply':             'borewellWater',
  'Gated Security 24/7':                          'gatedSecurity',
  'Tree-Lined Avenues':                           'treeLinedAve',
  'LED Street Lights':                            'ledStreetLights',
  'Drainage System':                              'drainageSystem',
  'Electricity Connection':                       'elecConnection',
  'Pure Drinking Water':                          'pureWater',
  'Walking Track':                                'walkingTrack',
  'Modern Park':                                  'modernPark',
  'Modern Park — Open Space (0.45 Ac)':           'modernPark',
  'CRDA Proposed Layout — Ready for Construction':'crdaLayout',
  'Housing Loans Available Through Banks':        'housingLoans',
  'Water Tank & Pipeline Connection':             'waterTank',
  'Compound Wall':                                'compoundWall',
  'Avenue Plantation on All Road Sides':          'avenuePlantation2',
  'Jogging Track Around Central Garden':          'jogTrack',
  'Security Arch — Grand Entrance':               'securityArch',
  'Hanuman Temple — Just Minutes Away':           'hanumanTemple',
  'Designed LED Street Lights':                   'designedLED',
  'CCTV Surveillance':                            'cctvSurveillance',
  'Ample Water Availability Round the Clock':     'ampleWater',
  '100% Vastu Compliance':                        'complianceVastu',
  '100% Vaastu Compliant':                        'vastu2',
  '100% Vaastu Compliant Layout':                 'vastuLayout',
  'Name & Number Display Board':                  'nameBoard2',
  'Overhead Electricity Connection':              'overheadElec2',
  'Avenue Plantation':                            'avenuePlain',
  'Avenue Lined Roads':                           'avenueLinedRoads',
  'BT Road Layout':                               'btRoadLayout',
  'Grand Entrance & Security':                    'grandEntranceSec',
  'Grand Entrance Arch':                          'grandEntranceArch',
  'Internal Roads':                               'internalRoads',
  'Jogging Track':                                'jogTrackSimple',
  'Main Entrance Gate':                           'mainEntranceGate',
  'NH-16 Frontage':                               'nh16Frontage',
  'Overhead Tank & Pipeline':                     'overheadTankSimple',
  "Children's Tot Lot & Green Equipped Parks":    'childrenspark',
  "Children's Play Area":                         'childrensPlayArea',
}
function translateAmenity(label, t) {
  const key = AMENITY_KEY_MAP[label]
  if (!key) return label
  const v = t('amenityLabels.' + key)
  return (v && v !== 'amenityLabels.' + key) ? v : label
}

// ── Approval label → translation key map ─────────────────────────────────────
const APPROVAL_KEY_MAP = {
  'CRDA Proposed Layout':   'approvals.crdaProposed',
  'AP RERA Registered':     'approvals.apReraRegistered',
  '100% Clear Title':       'approvals.clearTitle',
  'Clear Title':            'approvals.clearTitle',
  '100% Vastu Compliant':   'approvals.vastuCompliant',
  '100% Vaastu':            'approvals.vastuCompliant',
  'NH-16 Frontage':         'approvals.nh16Frontage',
  'CRDA Approved':          'approvals.crdaApproved',
  'RERA Registered':        'approvals.reraRegistered',
  'APCRDA Proposed Layout': 'approvals.apcrda',
}
function translateApproval(label, t) {
  const key = APPROVAL_KEY_MAP[label]
  if (!key) return label
  const v = t(key)
  return (v && v !== key) ? v : label
}

function HomeTab({ proj, onEnquire }) {
  const { t } = useLanguage()
  const { language } = useLanguage()
  const tProj = (field) => { const k = 'projects.' + proj.id + '.' + field; const v = t(k); if (field === 'name' && language !== 'te') return null; return (v && v !== k) ? v : null }
  return (
    <div className={styles.homeTab}>
      <div className={styles.heroBanner + ' ' + styles[proj.accentClass]}
        style={proj.heroImage ? { '--hero-img': 'linear-gradient(rgba(10,30,18,.75),rgba(10,30,18,.75)), url(' + proj.heroImage + ')' } : {}}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>{(() => { const k = 'tags.' + (proj.tag || '').toLowerCase(); const v = t(k); return (v && v !== k) ? v : proj.tag })()}</div>
          <h1 className={styles.heroName}>{tProj('name') || proj.name}</h1>
          <p className={styles.heroLoc}>📍 {tProj('loc') || proj.loc}</p>
          <p className={styles.heroDesc}>{tProj('description') || proj.description}</p>
          <div className={styles.heroBtns}>
            <button className='btn btn-gold'
              onClick={() => onEnquire({ source: 'PROJECT_HOME', label: 'Enquire Now', category: proj.name })}>
              {t('nav.enquireNow')} →
            </button>
            <WhatsAppIcon size={48} title={t('contact.sendWhatsApp')}
              onClick={() => openWhatsApp(
                proj.contact?.whatsapp || DEFAULT_WA_NUMBER,
                language === 'te'
                ? t('contact.waProjectMsg').replace('{name}', (language === 'te' && tProj('name')) ? tProj('name') : proj.name)
                : (proj.contact?.whatsappMessage || ('Hi! I am interested in ' + proj.name + '. Can I book a free site visit? 🏡')),
              )} />
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.hsNum}>{proj.total || t('portfolio.comingSoon')}</div>
            <div className={styles.hsLabel}>{t('portfolio.totalPlots')}</div>
          </div>
          <div className={styles.hsDivider} />
          <div className={styles.heroStat}>
            <div className={styles.hsNum}>{(!proj.starting || proj.starting === 'Coming Soon') ? t('portfolio.comingSoon') : proj.starting}</div>
            <div className={styles.hsLabel}>{t('portfolio.startingFrom')}</div>
          </div>
        </div>
      </div>
      <div className={styles.approvalRow}>
        {(proj.approvals || []).map((a) => (
          <span key={a} className={styles.approvalChip}>✓ {translateApproval(a, t)}</span>
        ))}
      </div>
      <div className={styles.hlGrid}>
        {(Array.isArray(tProj('highlights')) ? tProj('highlights') : (proj.highlights || [])).map((h) => (
          <div key={h} className={styles.hlCard}>
            <span className={styles.hlCheck}>✓</span>
            <span>{h}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OverviewTab({ proj, onEnquire, apiPricing }) {
  const { t } = useLanguage()
  const tProj = (field) => { const k = 'projects.' + proj.id + '.' + field; const v = t(k); return (v && v !== k) ? v : null }
  const facingRows  = getFacingRows(proj.facings || {})
  const totalFacing = facingRows.reduce((s, r) => s + r.value, 0)
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('project.overview')}</h2>
      {/* Pricing card — show if pricing exists, even for upcoming projects */}
      {(apiPricing || proj.pricing) && (
        <div style={{ marginBottom: 20 }}>
          <PricingCard pricing={apiPricing || proj.pricing} />
        </div>
      )}

      {/* Plot distribution — only for non-upcoming projects with facings */}
      {!proj.upcoming && facingRows.length > 0 && (
        <div className={styles.facingCard}>
          <div className={styles.facingHeader}>
            <h3 className={styles.facingTitle}>{t('portfolio.plotDistribution')}</h3>
            <span className={styles.facingTotal}>{proj.total} {t('portfolio.totalPlotsLabel')}</span>
          </div>
          <div className={styles.facingRows}>
            {facingRows.map((row) => (
              <div key={row.label} className={styles.facingRow}>
                <div className={styles.facingLabel}>
                  <span style={{ marginRight: 4 }}>{row.icon}</span>
                  <div className={styles.facingDot} style={{ background: row.color }} />
                  {(() => { const k = 'facings.' + row.key; const v = t(k); return v !== k ? v : row.label })()}
                </div>
                <div className={styles.facingBar}>
                  <motion.div
                    className={styles.facingFill}
                    style={{ background: row.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: (row.value / totalFacing * 100) + '%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className={styles.facingCount}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facts grid */}
      <div className={styles.factsGrid}>
        {[
          proj.total && { label: t('portfolio.totalPlots'),    value: proj.total },
          proj.starting && { label: t('portfolio.startingPrice'), value: proj.starting === 'Coming Soon' ? t('portfolio.comingSoon') : proj.starting },
          { label: t('portfolio.projectStatus'), value: proj.upcoming ? t('portfolio.comingSoon') : t('portfolio.openForBooking') },
        ].filter(Boolean).map((f) => (
          <div key={f.label} className={styles.factCard}>
            <div className={styles.factVal}>{f.value}</div>
            <div className={styles.factLabel}>{f.label}</div>
          </div>
        ))}
      </div>

      <button className='btn btn-gold'
        onClick={() => onEnquire({ source: proj.upcoming ? 'UPCOMING_INTEREST' : 'CONTACT_FORM', label: proj.upcoming ? 'Register Interest' : 'Get Plot Details', category: proj.name, type: proj.upcoming ? 'NOTIFY_ME' : undefined })}>
        {proj.upcoming ? t('portfolio.interestedBtn') : t('portfolio.getDetails')}
      </button>
    </div>
  )
}

function AmenitiesTab({ proj }) {
  const [tab, setTab] = useState('INFRA')
  const { t } = useLanguage()
  const tabs = [...new Set((proj.amenities || []).map((a) => a.tab))]
  const tabLabels = {
    INFRA:     t('amenities.infra'),
    LIFESTYLE: t('amenities.lifestyle'),
    UTILITIES: t('amenities.utilities'),
  }
  const items = (proj.amenities || []).filter((a) => a.tab === tab)
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('sections.amenities')}</h2>
      <div className={styles.amTabs}>
        {tabs.map((tabKey) => (
          <button key={tabKey}
            className={styles.amTab + ' ' + (tab === tabKey ? styles.amTabActive : '')}
            onClick={() => setTab(tabKey)}>
            {tabLabels[tabKey] || tabKey}
          </button>
        ))}
      </div>
      <AnimatePresence mode='wait'>
        <motion.div key={tab} className={styles.amGrid}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {items.map((item) => (
            item.featured ? (
              <div key={item.label} className={styles.amFeatured}>
                <div className={styles.amFeatIcon}>{item.icon}</div>
                <div>
                  <div className={styles.amFeatLabel}>{translateAmenity(item.label, t)}</div>
                  <div className={styles.amFeatDesc}>{item.featuredDesc}</div>
                </div>
                <span className={styles.amNearby}>Nearby</span>
              </div>
            ) : (
              <motion.div key={item.label} className={styles.amItem}
                whileHover={{ borderColor: 'var(--gold)' }}>
                <div className={styles.amIcon}>{item.icon}</div>
                <span>{translateAmenity(item.label, t)}</span>
              </motion.div>
            )
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function GalleryTab({ proj }) {
  const [lightbox, setLightbox] = useState(null)
  const { t } = useLanguage()
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
      <h2 className={styles.tabTitle}>{t('sections.gallery')}</h2>
      <div style={{ textAlign:'center', padding:'60px 0' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>📷</div>
        <div style={{ fontSize:'1.2rem', fontFamily:"'Cormorant Garamond',serif", color:'rgba(0,0,0,0.5)' }}>
          {t('sections.gallery')} <em style={{ color:'var(--gold-dark)' }}>{t('portfolio.comingSoon')}</em>
        </div>
      </div>
    </div>
  )
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('sections.gallery')}</h2>
      <div className={styles.galGrid}>
        {items.map((item, idx) => (
          <motion.div key={idx}
            className={styles.galCell + ' ' + (idx === 0 ? styles.galFeatured : '')}
            onClick={() => setLightbox(idx)}
            whileHover={{ scale: 1.02 }}>
            <img src={item.src} alt={item.label} className={styles.galImg} loading='lazy' />
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
            <button className={styles.lbNavBtn + ' ' + styles.lbNavLeft} onClick={prev}>‹</button>
            <div className={styles.lbPanel}>
              <img src={items[lightbox]?.src} alt={items[lightbox]?.label} className={styles.lbFullImg} />
              <div className={styles.lbCaption}>
                <span className={styles.lbLabel}>{items[lightbox]?.label}</span>
                <span className={styles.lbCount}>{lightbox + 1} / {items.length}</span>
              </div>
            </div>
            <button className={styles.lbNavBtn + ' ' + styles.lbNavRight} onClick={next}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VideosTab({ proj }) {
  const [active, setActive] = useState(null)
  const { t } = useLanguage()
  const localVids   = getProjectVideos(proj.id)
  const youtubeVids = (proj.videos || []).filter(v => v.type === 'youtube' && v.id && !v.id.includes('dQw4w9WgXcY'))
  const videos = localVids.length > 0
    ? localVids.map((v, i) => ({ type: 'local', src: v.src, title: v.label || ('Video ' + (i + 1)), subtitle: v.subtitle || proj.name }))
    : youtubeVids
  useEffect(() => {
    if (!active) return
    const h = (e) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active])
  if (!videos.length) return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('sections.videos')}</h2>
      <div style={{ textAlign:'center', padding:'60px 0' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>🎬</div>
        <div style={{ fontSize:'1.2rem', fontFamily:"'Cormorant Garamond',serif", color:'rgba(0,0,0,0.5)' }}>
          {t('sections.videos')} <em style={{ color:'var(--gold-dark)' }}>{t('portfolio.comingSoon')}</em>
        </div>
      </div>
    </div>
  )
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('sections.videos')}</h2>
      <div className={styles.vidGrid}>
        {videos.map((v, i) => (
          <motion.div key={i} className={styles.vidCard}
            whileHover={{ y: -4 }} onClick={() => setActive(v)}>
            <div className={styles.vidThumb}>
              {v.type === 'youtube'
                ? <img src={'https://img.youtube.com/vi/' + v.id + '/hqdefault.jpg'} alt={v.title} className={styles.vidThumbnailImg} />
                : <video src={v.src} className={styles.vidThumbnailImg} muted preload='metadata' style={{ pointerEvents:'none' }} />
              }
              <div className={styles.vidPlayWrap}>
                <Play size={22} fill='var(--green)' color='var(--green)' />
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
                <iframe src={'https://www.youtube.com/embed/' + active.id + '?autoplay=1&rel=0'}
                  frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
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

function LocationTab({ proj }) {
  const { t, language } = useLanguage()
  const distances = proj.distances || []

  // Translate landmark name/subtitle — hardcoded Telugu map (DB values)
  const tloc = (val, key) => {
    if (!key || language !== 'te') return val
    const TE = {
      nh16Highway: 'జాతీయ రహదారి-16', nh16Sub: 'ప్రక్కన — నేరు ప్రవేశం',
      amaravatiCapital: 'అమరావతి రాజధాని', amaravatiCapitalSub: 'ఆంధ్రప్రదేశ్ కొత్త రాజధాని',
      engineeringColleges: 'ఇంజనీరింగ్ కళాశాలలు', engineeringColSub: 'అమృత సాయి, MVR, MIC కళాశాల',
      engineeringColSub2: 'అమృత సాయి, MVR, MIC', engineeringColSub3: 'ప్రతిష్టాత్మక సంస్థలు',
      nimraMedical: 'నిమ్రా మెడికల్ కళాశాల', healthcareHub: 'ఆరోగ్య కేంద్రం',
      mulapaduStadium: 'మూలపాడు స్టేడియం', intlCricket: 'అంతర్జాతీయ క్రికెట్',
      cineStudio: 'సినిమా స్టూడియో', cineStudioSub: 'ప్రభుత్వ ప్రతిపాదితం, నందిగామ',
      railwayConn: 'రైల్వే కనెక్టివిటీ', railwayConnSub: 'ప్రభుత్వ ప్రతిపాదితం, అమరావతి-పారిటాల',
      logisticHub: 'లాజిస్టిక్ హబ్', logisticHubSub: 'ప్రభుత్వ ప్రతిపాదితం, పారిటాల',
      hanumanTemple: 'హనుమాన్ దేవాలయం', hanumanTempleSub: 'శ్రీ పారిటాల హనుమాన్ దేవాలయం',
      hanumanTempleSub2: 'కొన్ని నిమిషాలలో',
      orrRingRoad: 'ఓఆర్‌ఆర్ (రింగ్ రోడ్)', veryNearExcellent: 'చాలా సమీపంలో, అద్భుత కనెక్టివిటీ',
      orrSub: 'ప్రతిపాదితం — అద్భుత ప్రవేశం',
      nationalHighway: 'జాతీయ రహదారి', nh16Sub2: 'నేరుగా ప్రక్కన', nh16Sub3: 'నేరు ప్రవేశం',
      nh16Highway2: 'జాతీయ రహదారి-16 హైవే',
      kathipudiOngole: 'కటిపూడి–ఒంగోలు హైవే', secondaryHighway: 'ద్వితీయ హైవే ప్రవేశం',
      belCompany: 'బిఈఎల్ కంపెనీ (డిఫెన్స్ పీఎస్‌యూ)', belSub: 'భారత్ ఎలక్ట్రానిక్స్ లిమిటెడ్',
      bandarPort: 'బందరు పోర్టు', bandarSub: 'ప్రముఖ వాణిజ్య బందరు', machilipatnamPort: 'మచిలీపట్నం బందరు',
      sixLaneRoad: '6-లేన్ విజయవాడ–మచిలీపట్నం రోడ్డు', proposedVjaMtm: 'ప్రతిపాదిత విజయవాడ–మచిలీపట్నం',
      bharatanatyam: 'భరతనాట్యం సంస్థ', bharatanatyamSub: 'ప్రపంచ ప్రసిద్ధ కళా సంస్థ',
      worldDanceSchool: 'ప్రపంచ ప్రసిద్ధ నృత్య పాఠశాల',
      housingProject: 'హౌసింగ్ ప్రాజెక్ట్', readyToBuild: 'నిర్మాణానికి సిద్ధం',
      nearProximity: 'సమీప ప్రదేశంలో',
      vijayawadaCentre: 'విజయవాడ కేంద్రం', cityCore: 'నగర కేంద్రం — 15 నిమిషాల ప్రయాణం',
      nh65Highway: 'NH-65 జాతీయ రహదారి హైవే', directHighwayAccess: 'నేరు హైవే ప్రవేశం',
      vitUniversity: 'విఐటి ఏపి విశ్వవిద్యాలయం', premierEngineering: 'ప్రతిష్టాత్మక ఇంజనీరింగ్ క్యాంపస్',
      manipalHospital: 'మణిపాల్ ఆస్పత్రి', penamaluruHealthcare: 'పెనమలూరు ఆరోగ్య కేంద్రం',
      vijayawadaJunction: 'విజయవాడ జంక్షన్', majorRailwayHub: 'ప్రముఖ రైల్వే జంక్షన్',
      vijayawadaAirport: 'విజయవాడ విమానాశ్రయం', airConnectivity: 'వాయు సంపర్కం',
      vijayawadaCity: 'విజయవాడ', vijayawadaSub: 'AP వాణిజ్య రాజధాని',
      govtProposedAmaravati: 'ప్రభుత్వ ప్రతిపాదితం, అమరావతి నుండి',
    }
    return TE[key] || val
  }
  const LOC_NAME_KEYS = {
    'Amaravati Capital':         'amaravatiCapital',
    'NH-16 National Highway':    'nh16Highway',
    'NH-16 Highway':             'nh16Highway2',
    'Engineering Colleges':      'engineeringColleges',
    'Nimra Medical College':     'nimraMedical',
    'Mulapadu Stadium':          'mulapaduStadium',
    'Vijayawada Airport':        'vijayawadaAirport',
    'Hanuman Temple':            'hanumanTemple',
    'Outer Ring Road (ORR)':     'outerRingRoad',
    'BEL Company (Defence PSU)': 'belCompany',
    'Bandar Port':               'bandarPort',
    'Bharatanatyam Institution': 'bharatanatyam',
    'Vijayawada':                'vijayawadaCity',
  }
  const LOC_SUB_KEYS = {
    'New AP State Capital':               'amaravatiCapitalSub',
    'Adjacent — direct access':           'nh16Sub',
    'Directly Adjacent':                  'nh16Sub2',
    'Direct access':                      'nh16Sub3',
    'Amrita Sai, MVR, MIC College':       'engineeringColSub',
    'Amrita Sai, MVR, MIC':              'engineeringColSub2',
    'Multiple prestigious institutions':  'engineeringColSub3',
    'Healthcare hub':                     'healthcareHub',
    'International Cricket':              'intlCricket',
    'Air connectivity':                   'airConnectivity',
    'Shri Paritala Hanuman Temple':       'hanumanTempleSub',
    'Proposed — excellent access':        'orrSub',
    'Bharat Electronics Limited':         'belSub',
    'Major commercial seaport':           'bandarSub',
    'World-renowned arts centre':         'bharatanatyamSub',
    'Commercial capital of AP':           'vijayawadaSub',
  }
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('project.location')}</h2>
      <div className={styles.mapWrap}>
        {proj.mapEmbedUrl && (
          <iframe src={proj.mapEmbedUrl} className={styles.iframe}
            allowFullScreen loading='eager' referrerPolicy='no-referrer-when-downgrade'
            title={proj.name + ' Location'} />
        )}
        <button className={styles.mapOpenBtn}
          onClick={() => openMaps(proj.mapOpenUrl)}>
          <Navigation size={14} /> {t('contact.getDirections')}
        </button>
      </div>
      <div className={styles.distGrid}>
        {distances.map((d, i) => (
          <motion.div key={d.name} className={styles.distCard}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <div className={styles.distIcon}>{d.icon}</div>
            <div className={styles.distBody}>
              <div className={styles.distName}>{tloc(d.name, LOC_NAME_KEYS[d.name] || '')}</div>
              <div className={styles.distSub}>{tloc(d.subtitle, LOC_SUB_KEYS[d.subtitle] || '')}</div>
            </div>
            <div className={styles.distBadge}>{d.distance}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ContactTab({ proj, onEnquire, ownerSettings }) {
  const { t, language } = useLanguage()
  const c = proj.contact || {}
  const rawAddress = (proj.id === 'aparna' && ownerSettings?.aparna_contact_address)
    ? ownerSettings.aparna_contact_address
    : c.address
  const addrKey = 'projects.' + proj.id + '.address'
  const addrVal = t(addrKey)
  const address = (() => { let a = (language === 'te' && addrVal && addrVal !== addrKey) ? addrVal : rawAddress; if (language === 'te' && a) a = a.replace(/\bAP\b/g, 'ఆంధ్రప్రదేశ్'); return a })()
  const tProj = (field) => { const k = 'projects.' + proj.id + '.' + field; const v = t(k); if (field === 'name' && language !== 'te') return null; return (v && v !== k) ? v : null }
  const openWA = () => openWhatsApp(
    c.whatsapp || DEFAULT_WA_NUMBER,
    language === 'te'
    ? t('contact.waProjectMsg').replace('{name}', tProj('name') || proj.name)
    : (c.whatsappMessage || ('Hi! I am interested in ' + proj.name + '. Can I book a free site visit? 🏡'))
  )
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{t('sections.contact')}</h2>
      <div className={styles.contactGrid}>
        <div className={styles.contactInfo}>
          {c.phone && (
            <div className={styles.contactRow} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <a href={'tel:' + c.phone} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <Phone size={16} />{c.phone}
              </a>
              {c.whatsapp && <WhatsAppIcon size={36} onClick={openWA} title={t('contact.sendWhatsApp')} />}
            </div>
          )}
          {c.email    && <a href={'mailto:' + c.email}    className={styles.contactRow}>✉️ {c.email}</a>}
          {address    && (
            <a className={styles.contactRow}
              href="#" onClick={(e) => { e.preventDefault(); openMaps(proj.mapOpenUrl); }}
              style={{ cursor: 'pointer' }}>
              📍 {address}
            </a>
          )}
          {c.website  && <a href={'https://' + c.website} target='_blank' rel='noreferrer' className={styles.contactRow}>🌐 {c.website}</a>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <button className='btn btn-gold btn-full'
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Request Callback', type: 'CALLBACK', category: proj.name })}>
              📞 {t('modal.requestCallback')}
            </button>
            <button className='btn btn-green btn-full'
              onClick={() => onEnquire({ source: 'CONTACT_FORM', label: 'Schedule Site Visit', type: 'SITE_VISIT', category: proj.name })}>
              🗓️ {t('hero.siteVisitCta')}
            </button>
          </div>
        </div>
        <div className={styles.contactCtas}>
          {c.whatsapp && (
            <QRCard
              waNumber={c.whatsapp || DEFAULT_WA_NUMBER}
              title={language === 'te' ? 'వాట్సాప్ QR స్కాన్' : 'Scan & Chat on WhatsApp'}
              subtitle={language === 'te' ? 'ఈ QR స్కాన్ చేసి నేరుగా మాతో మాట్లాడండి' : 'Scan this QR to start a WhatsApp chat instantly'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab]   = useState('home')
  const [leadCtx,   setLeadCtx]     = useState(null)
  const [mobileNav, setMobileNav]   = useState(false)

  const { data: proj, isLoading } = useProject(id)
  const { data: ownerSettings }   = useContactSettings()
  const tProj = (field) => { if (!proj) return null; const k = 'projects.' + proj.id + '.' + field; const v = t(k); if (field === 'name' && language !== 'te') return null; return (v && v !== k) ? v : null }
  const { data: apiPricing }      = usePricing()
  const projectPricing = Array.isArray(apiPricing) ? (apiPricing.find(p => p.projectId === id) || null) : null

  const openEnquiry  = useCallback((ctx) => setLeadCtx(ctx), [])
  const closeEnquiry = useCallback(() => setLeadCtx(null),   [])

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // Tabs built inside render so labels react to language changes
  const TABS = [
    { id: 'home',      label: t('project.tabs.home')     },
    { id: 'overview',  label: t('project.tabs.overview') },
    { id: 'amenities', label: t('nav.amenities')         },
    { id: 'gallery',   label: t('nav.gallery')           },
    { id: 'videos',    label: t('nav.videos')            },
    { id: 'location',  label: t('nav.location')          },
    { id: 'contact',   label: t('nav.contact')           },
  ]

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    )
  }

  if (!proj) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>🏗️</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond,serif' }}>Project not found</h2>
        <button className='btn btn-gold' onClick={() => navigate('/')}>{t('portfolio.backHome')}</button>
      </div>
    )
  }

  useEffect(() => {
    if (proj) {
      document.title = proj.name + ' | APCRDA Approved Plots in ' + (tProj('loc') || proj.loc) + ' | ChaturbhujaPlots'
    }
    return () => {
      document.title = 'ChaturbhujaPlots | Premium Plots Near Amaravati, AP'
    }
  }, [proj])

  const tabComponents = {
    home:      <HomeTab      proj={proj} onEnquire={openEnquiry} />,
    overview:  <OverviewTab  proj={proj} onEnquire={openEnquiry} apiPricing={projectPricing} />,
    amenities: <AmenitiesTab proj={proj} />,
    gallery:   <GalleryTab   proj={proj} />,
    videos:    <VideosTab    proj={proj} />,
    location:  <LocationTab  proj={proj} />,
    contact:   <ContactTab   proj={proj} onEnquire={openEnquiry} ownerSettings={ownerSettings} />,
  }

  return (
    <div className={styles.page}>
      {proj.id === 'trimbak' && <LaunchBanner compact />}
      <header className={styles.header + ' ' + styles[proj.accentClass]}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> {t('portfolio.backHome').replace('\u2190 ', '')}
          </button>
          <div className={styles.headerTitle}>
            <span className={styles.headerName}>{(() => { const k = 'projects.' + proj.id + '.name'; const v = t(k); return (language === 'te' && v && v !== k) ? v : proj.name })()} </span>
            <span className={styles.headerLoc}>📍 {tProj('loc') || proj.loc}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LanguageToggle />
            <button className={styles.enquireBtn}
              onClick={() => openEnquiry({ source: 'CONTACT_FORM', label: 'Enquire Now', category: proj.name })}>
              {t('nav.enquireNow')} →
            </button>
          </div>
          <button className={styles.mobileNavBtn} onClick={() => setMobileNav((v) => !v)}>
            <Menu size={18} />
          </button>
        </div>
        <nav className={styles.tabBar}>
          {TABS.map((tab) => (
            <button key={tab.id}
              className={styles.tabBtn + ' ' + (activeTab === tab.id ? styles.tabBtnActive : '')}
              onClick={() => { setActiveTab(tab.id); setMobileNav(false) }}>
              {tab.label}
            </button>
          ))}
        </nav>
        <AnimatePresence>
          {mobileNav && (
            <motion.nav className={styles.mobileTabMenu}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {TABS.map((tab) => (
                <button key={tab.id}
                  className={styles.mobileTabBtn + ' ' + (activeTab === tab.id ? styles.mobileTabActive : '')}
                  onClick={() => { setActiveTab(tab.id); setMobileNav(false) }}>
                  {tab.label}
                </button>
              ))}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                <LanguageToggle />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main className={styles.main}>
        {/* Location tab always mounted (iframe preloaded), hidden when not active */}
        <div style={{ display: activeTab === 'location' ? 'block' : 'none' }}>
          <LocationTab proj={proj} />
        </div>
        {/* Contact tab always mounted (QR preloaded), hidden when not active */}
        <div style={{ display: activeTab === 'contact' ? 'block' : 'none' }}>
          <ContactTab proj={proj} onEnquire={openEnquiry} ownerSettings={ownerSettings} />
        </div>
        {/* Other tabs use AnimatePresence as before */}
        {activeTab !== 'location' && activeTab !== 'contact' && (
          <AnimatePresence mode='wait'>
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}>
              {tabComponents[activeTab]}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <LeadModal
        context={leadCtx}
        onClose={closeEnquiry}
        whatsapp={proj.contact?.whatsapp}
      />
    </div>
  )
}
