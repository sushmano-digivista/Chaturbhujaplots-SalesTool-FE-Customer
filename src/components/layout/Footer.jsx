import { DEFAULT_WA_NUMBER } from '@/constants/config'
import { useContactSettings } from '@/hooks/useData'
import styles from './Footer.module.css'

const QUICK_LINKS = [
  ['Portfolio',  'portfolio'],
  ['Gallery',    'gallery'  ],
  ['Videos',     'videos'   ],
  ['Amenities',  'amenities'],
  ['Location',   'location' ],
  ['Contact',    'contact'  ],
]

const PROJECTS = [
  'Anjana Paradise @ Paritala',
  'Trimbak Oaks @ Penamaluru',
  'Aparna Legacy @ Chevitikallu',
  'Varaha Virtue @ Pamarru',
]

// Scroll to section with offset for sticky header
function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const headerHeight = document.querySelector('header')?.offsetHeight || 80
  const extraPadding = 32  // extra breathing room below header
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - extraPadding
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Footer({ content }) {
  const { data: ownerSettings } = useContactSettings()

  const contact  = content?.contact || {}
  const phone    = ownerSettings?.ownerPhone
                    ? `+${ownerSettings.ownerPhone}`
                    : contact.phone || '+919739762698'
  const whatsapp = ownerSettings?.ownerPhone || DEFAULT_WA_NUMBER
  const email    = ownerSettings?.ownerEmail || contact.email || 'info@chaturbhuja.in'

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
              Building trust in Andhra Pradesh's real estate sector for over
              25 years. Founded by <strong>Mr. Donepudi Durga Prasad</strong>,
              we have delivered 15+ successful ventures — open plots, houses
              and apartments — with 1200+ happy families settled across the
              Krishna–NTR–Guntur corridor.
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>APCRDA Approved</span>
              <span className={styles.badge}>AP RERA Registered</span>
              <span className={styles.badge}>25 Yrs · 15+ Projects</span>
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>Quick Links</h5>
            {QUICK_LINKS.map(([label, id]) => (
              <button key={id} className={styles.link} onClick={() => scrollTo(id)}>
                <span className={styles.linkArrow}>›</span>{label}
              </button>
            ))}
          </div>

          {/* ── Ongoing Projects ──────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>Ongoing Projects</h5>
            {PROJECTS.map((p) => (
              <div key={p} className={styles.projectItem}>
                <span className={styles.projectDot} />
                {p}
              </div>
            ))}
            <div className={styles.projectItem} style={{ opacity: 0.45, marginTop: 10, fontSize: 11 }}>
              + VSR Grand @ Thadigadapa
            </div>
          </div>

          {/* ── Contact ───────────────────────────────────────── */}
          <div>
            <h5 className={styles.colTitle}>Contact Us</h5>

            <a href={`tel:${phone}`} className={styles.contactRow}>
              <span className={styles.contactIcon}>📞</span>
              <span>{phone}</span>
            </a>

            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I am interested in Chaturbhuja plots. Please share details.')}`}
              target="_blank" rel="noreferrer"
              className={styles.contactRow}
            >
              <span className={styles.contactIcon}>💬</span>
              <span>WhatsApp Us</span>
            </a>

            <a href={`mailto:${email}`} className={styles.contactRow}>
              <span className={styles.contactIcon}>✉</span>
              <span>{email}</span>
            </a>

            <div className={styles.contactRow}>
              <span className={styles.contactIcon}>📍</span>
              <span>Vijayawada, Andhra Pradesh</span>
            </div>

            <a href="https://www.chaturbhujaplots.in" target="_blank" rel="noreferrer" className={styles.contactRow}>
              <span className={styles.contactIcon}>🌐</span>
              <span>www.chaturbhujaplots.in</span>
            </a>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Chaturbhuja Properties &amp; Infra. All rights reserved.</span>
          <span>APCRDA Approved · RERA Registered · 100% Clear Title</span>
        </div>
      </div>
    </footer>
  )
}

