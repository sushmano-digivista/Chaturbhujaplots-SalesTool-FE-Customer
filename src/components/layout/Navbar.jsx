import { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import styles from './Navbar.module.css'

// ── Shared project data — single source of truth for navbar ───────────────────
export const NAV_PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise', sub: 'Paritala, Near Amaravati',    available: 14, total: 242 },
  { id: 'trimbak', name: 'Trimbak Oaks',    sub: 'Penamaluru, Near Vijayawada', available: 18, total: 48  },
  { id: 'aparna',  name: 'Aparna Legacy',   sub: 'Chevitikallu',                available: 16, total: 28  },
  { id: 'varaha',  name: 'Varaha Virtue',   sub: 'Pamarru, Near NH-16',         available: 20, total: 32  },
]
export const NAV_COMPLETED = [
  'Nandana Vihar', 'County', 'Pearl', 'Empire', 'Pride', 'Prime',
]

const NAV_LINKS = [
  { label: 'Gallery',   id: 'gallery'   },
  { label: 'Videos',    id: 'videos'    },
  { label: 'Amenities', id: 'amenities' },
  { label: 'Location',  id: 'location'  },
  { label: 'Contact',   id: 'contact'   },
]

export default function Navbar({ contact, onEnquire }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [portOpen,  setPortOpen]  = useState(false)
  const portRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (portRef.current && !portRef.current.contains(e.target)) setPortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setPortOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

        {/* Logo */}
        <a href="#home" className={styles.logo} onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          <div className={styles.logoIcon}>CP</div>
          <div>
            <div className={styles.logoBrand}>Chaturbhuja Properties</div>
            <div className={styles.logoSub}>& Infra · Premium Plots</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className={styles.links}>

          {/* Portfolio dropdown — single entry point for all projects */}
          <div className={styles.dropdown} ref={portRef}>
            <button
              className={`${styles.link} ${styles.dropTrigger} ${portOpen ? styles.linkActive : ''}`}
              onClick={() => setPortOpen((o) => !o)}
            >
              Portfolio
              <ChevronDown size={13} className={`${styles.chevron} ${portOpen ? styles.chevronOpen : ''}`} />
            </button>

            {portOpen && (
              <div className={styles.dropMenu}>
                {/* Open for booking */}
                <div className={styles.dropSection}>
                  <span className={styles.dropLabel}>
                    <span className={styles.dropLabelDot} style={{ background: '#F6C347' }} />
                    Open for Booking
                  </span>
                  <div className={styles.dropChips}>
                    {NAV_PROJECTS.map((p) => (
                      <button
                        key={p.id}
                        className={`${styles.dropChip} ${styles.dropChipActive}`}
                        onClick={() => scrollTo('portfolio')}
                      >
                        <span className={styles.chipName}>{p.name}</span>
                        <span className={styles.chipAvail}>{p.available} left</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.dropDivider} />

                {/* Completed */}
                <div className={styles.dropSection}>
                  <span className={styles.dropLabel}>
                    <span className={styles.dropLabelDot} style={{ background: '#4CAF74' }} />
                    Completed &amp; Sold Out
                  </span>
                  <div className={styles.dropChips}>
                    {NAV_COMPLETED.map((name) => (
                      <button
                        key={name}
                        className={styles.dropChip}
                        onClick={() => scrollTo('portfolio')}
                      >
                        <span className={styles.chipName}>{name}</span>
                        <span className={styles.chipDone}>✓</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer CTA */}
                <div className={styles.dropFooter}>
                  <button className={styles.dropViewAll} onClick={() => scrollTo('portfolio')}>
                    View all projects overview →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Flat nav links */}
          {NAV_LINKS.map((l) => (
            <button key={l.id} className={styles.link} onClick={() => scrollTo(l.id)}>
              {l.label}
            </button>
          ))}

          <button
            className="btn btn-gold btn-sm"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' })}
          >
            Enquire Now →
          </button>
        </div>

        {/* Mobile right */}
        <div className={styles.mobileRight}>
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className={styles.phoneBtn}><Phone size={16} /></a>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <button className={styles.mobileLink} onClick={() => scrollTo('portfolio')}>Portfolio</button>
        {NAV_LINKS.map((l) => (
          <button key={l.id} className={styles.mobileLink} onClick={() => scrollTo(l.id)}>
            {l.label}
          </button>
        ))}
        <button
          className={styles.mobileEnquire}
          onClick={() => { setMenuOpen(false); onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' }) }}
        >
          Enquire Now →
        </button>
      </div>
    </>
  )
}
