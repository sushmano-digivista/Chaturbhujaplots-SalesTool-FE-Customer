import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useContactSettings } from '@/hooks/useData'
import { useLanguage } from '@/context/LanguageContext'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { trackSocialClick, trackPhoneClick, trackWhatsAppClick } from '@/utils/analytics'
import styles from './Footer.module.css'

const QUICK_LINKS = [
  ['Portfolio',  'portfolio'],
  ['Gallery',    'gallery'  ],
  ['Videos',     'videos'   ],
  ['Amenities',  'amenities'],
  ['Location',   'location' ],
  ['Contact',    'contact'  ],
]

const PROJECT_IDS = [
  { id: 'anjana',  name: 'Anjana Paradise' },
  { id: 'trimbak', name: 'Trimbak Oaks'    },
  { id: 'aparna',  name: 'Aparna Legacy'   },
  { id: 'varaha',  name: 'Varaha Virtue'   },
]

// Social media links
const SOCIAL_LINKS = [
  { icon: 'f',  label: 'Facebook',  url: 'https://www.facebook.com/profile.php?id=61575447640354', color: '#1877F2' },
  { icon: 'yt', label: 'YouTube',   url: 'https://www.youtube.com/@Chaturbhujaplots',              color: '#FF0000' },
  { icon: 'in', label: 'Instagram', url: 'https://www.instagram.com/chaturbhujaplots/',            color: '#E1306C' },
]

// Scroll to section with offset for sticky header
function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const navHeight = document.querySelector('[class*="navbar"]')?.offsetHeight || 68
  window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' })
}

export default function Footer({ content }) {
  const { data: ownerSettings } = useContactSettings()
  const { t, language } = useLanguage()

  // Build translated quick links so labels switch with language
  const QUICK_LINKS_I18N = [
    [t('nav.portfolio'), 'portfolio'],
    [t('nav.gallery'),   'gallery'  ],
    [t('nav.videos'),    'videos'   ],
    [t('nav.amenities'), 'amenities'],
    [t('nav.location'),  'location' ],
    [t('nav.contact'),   'contact'  ],
  ]

  const contact  = content?.contact || {}
  const phone    = ownerSettings?.ownerPhone
                    ? `+${ownerSettings.ownerPhone}`
                    : contact.phone || '+919948709041'
  const whatsapp = ownerSettings?.ownerPhone || DEFAULT_WA_NUMBER
  const email    = ownerSettings?.ownerEmail || contact.email || 'chaturbhujaplots@gmail.com'

  return (
    <footer className={styles.footer}>

      <div className={styles.topBar} />

      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* ── Brand column ─────────────────────────────────── */}
          <div className={styles.brandCol}>
            <img
              src="/chaturbhuja-logo.webp"
              alt="Chaturbhuja Properties & Infra"
              className={styles.footerLogo}
            />
            <p className={styles.tagline}>
              {t('footer.tagline')} — 25 {t('common.yearsOfTrust')}.{' '}
              15+ {t('portfolio.projectsDelivered')}, 1200+ {t('portfolio.happyCustomers')}.
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>{t('approvals.crdaApproved') || 'APCRDA Approved'}</span>
              <span className={styles.badge}>{t('approvals.apReraRegistered') || 'AP RERA Registered'}</span>
              <span className={styles.badge}>25 Yrs · 15+ Projects</span>
            </div>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.url} target='_blank' rel='noreferrer'
                  className={styles.socialBtn}
                  style={{ background: s.color }}
                  title={s.label}
                  onClick={() => trackSocialClick(s.label.toLowerCase())}
                >
                  {s.icon === 'f' && (
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='white'>
                      <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'/>
                    </svg>
                  )}
                  {s.icon === 'yt' && (
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='white'>
                      <path d='M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z'/>
                      <polygon fill='red' points='9.75 15.02 15.5 12 9.75 8.98 9.75 15.02'/>
                    </svg>
                  )}
                  {s.icon === 'in' && (
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <rect x='2' y='2' width='20' height='20' rx='5' ry='5'/>
                      <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'/>
                      <line x1='17.5' y1='6.5' x2='17.51' y2='6.5'/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>{t('footer.quickLinks')}</h5>
            {QUICK_LINKS_I18N.map(([label, id]) => (
              <button key={id} className={styles.link} onClick={() => scrollTo(id)}>
                <span className={styles.linkArrow}>›</span>{label}
              </button>
            ))}
          </div>

          {/* ── Ongoing Projects ──────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>{t('footer.ourProjects')}</h5>
            {PROJECT_IDS.map((p) => {
              const nameKey  = `projects.${p.id}.name`
              const nameVal  = t(nameKey)
              const projName = (language === 'te' && nameVal && nameVal !== nameKey) ? nameVal : p.name
              const locKey   = `projects.${p.id}.locShort`
              const locVal   = t(locKey)
              const loc      = (locVal && locVal !== locKey) ? locVal : ''
              return (
                <div key={p.id} className={styles.projectItem}>
                  <span className={styles.projectDot} />
                  {projName}{loc ? ` @ ${loc}` : ''}
                </div>
              )
            })}
            <div className={styles.projectItem} style={{ opacity: 0.45, marginTop: 10, fontSize: 11 }}>
              + VSR Grand @ Thadigadapa
            </div>
          </div>

          {/* ── Contact ───────────────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>{t('contact.callUs').replace('Call Us', t('contact.callUs'))}</h5>

            <div className={styles.contactRow} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <a href={`tel:${phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none' }}>
                <span className={styles.contactIcon}>📞</span>
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(language === 'te' ? t('contact.whatsappMessage') : (contact.whatsappMessage || t('contact.whatsappMessage')))}`}
                target="_blank" rel="noreferrer"
                aria-label={t('contact.sendWhatsApp')}
                style={{ display: 'inline-flex', marginLeft: 4 }}
              >
                <WhatsAppIcon size={28} title={t('contact.sendWhatsApp')} />
              </a>
            </div>

            <a href={`mailto:${email}`} className={styles.contactRow}>
              <span className={styles.contactIcon}>✉</span>
              <span>{email}</span>
            </a>

            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>📍</span>
              <span>{t('contact.officeLocation') || 'Vijayawada, Andhra Pradesh'}</span>
            </div>

            <a href="https://www.chaturbhujaplots.in" target="_blank" rel="noreferrer" className={styles.contactRow}>
              <span className={styles.contactIcon}>🌐</span>
              <span>www.chaturbhujaplots.in</span>
            </a>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Chaturbhuja Properties &amp; Infra. {t('footer.rights')}</span>
          <span>{t('approvals.crdaApproved') || 'APCRDA Approved'} · {t('approvals.reraRegistered') || 'RERA Registered'} · 100% {t('common.clearTitle')}</span>
        </div>
        <div className={styles.devCredit}>
          Developed by <a href="https://www.chaturbhujaplots.in" target="_blank" rel="noreferrer">SM Solutions &amp; Technologies</a>
        </div>
      </div>
    </footer>
  )
}

