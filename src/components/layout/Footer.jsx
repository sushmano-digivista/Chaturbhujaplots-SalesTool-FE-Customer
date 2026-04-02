import { DEFAULT_WA_NUMBER, DEFAULT_PHONE } from '@/constants/config'
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

export default function Footer({ content }) {
  const contact = content?.contact || {}
  const phone    = DEFAULT_PHONE
  const whatsapp = content?.contact?.whatsapp || DEFAULT_WA_NUMBER
  const email    = contact.email    || 'msnraoooo@gmail.com'
  const website  = contact?.website || 'www.chaturbhujaplots.in' // reads from DB
  const address  = contact.address  || 'Vijayawada, Andhra Pradesh'

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className={styles.footer}>

      {/* ── Top divider line ─────────────────────────────────── */}
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

            {/* Approval badges */}
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
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi! 👋 I came across Chaturbhuja Properties & Infra and I'm interested in your premium plots. Could you please share more details on available plots, pricing, and site visit options? Thank you!')}`}
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

            <a href={`https://${website}`} target="_blank" rel="noreferrer" className={styles.contactRow}>
              <span className={styles.contactIcon}>🌐</span>
              <span>{website}</span>
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
