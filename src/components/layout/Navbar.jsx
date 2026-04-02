import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
  const el = document.getElementById(id)
  if (!el) return
  const navHeight = document.querySelector('[class*="navbar"]')?.offsetHeight || 68
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 20
  window.scrollTo({ top, behavior: 'smooth' })
}

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

        {/* Logo — white pill container guarantees contrast on any bg */}
        <a href="/" className={styles.logo} onClick={(e) => { e.preventDefault(); window.location.reload() }}>
          <img
            src="/chaturbhuja-logo.webp"
            alt="Chaturbhuja Properties & Infra"
            className={styles.logoImg}
          />
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

                {/* Header */}
                <div className={styles.dropHeader}>
                  <div className={styles.dropHeaderTitle}>Our Portfolio</div>
                  <div className={styles.dropHeaderSub}>10+ projects · 1200+ families settled</div>
                </div>

                {/* Open for booking — rich project cards */}
                <div className={styles.dropSectionLabel}>
                  <span className={styles.dropPulse} />
                  Open for Booking
                </div>
                <div className={styles.dropCards}>
                  {NAV_PROJECTS.map((p, i) => {
                    const colors = ['#C9A84C','#4CAF74','#64B5F6','#FFB74D']
                    const color  = colors[i] || '#C9A84C'
                    return (
                      <button
                        key={p.id}
                        className={styles.dropCard}
                        style={{ '--dc': color }}
                        onClick={() => { setPortOpen(false); navigate(`/project/${p.id}`) }}
                      >
                        <div className={styles.dropCardBar} />
                        <div className={styles.dropCardContent}>
                          <div className={styles.dropCardName}>{p.name}</div>
                          <div className={styles.dropCardSub}>📍 {p.sub}</div>
                        </div>
                        <div className={styles.dropCardArrow}>›</div>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.dropDivider} />

                {/* Completed */}
                <div className={styles.dropSectionLabel}>
                  <span className={styles.dropCheckDot} />
                  Completed &amp; Sold Out
                </div>
                <button className={styles.dropCompletedLine} onClick={() => scrollTo('portfolio')}>
                  {NAV_COMPLETED.join(' · ')}
                </button>

                {/* Footer CTA */}
                <button className={styles.dropViewAll} onClick={() => scrollTo('portfolio')}>
                  <span>View all projects overview</span>
                  <span className={styles.dropViewAllArrow}>→</span>
                </button>
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
            className={styles.enquireBtn}
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' })}
          >
            Enquire Now <span className={styles.enquireArrow}>→</span>
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

        {/* Portfolio section with project cards */}
        <div className={styles.mobilePortfolioSection}>
          <div className={styles.mobilePortfolioHeader}>
            <span className={styles.dropPulse} />
            Our Portfolio
          </div>
          {NAV_PROJECTS.map((p) => (
            <button
              key={p.id}
              className={styles.mobileProjectCard}
              onClick={() => { setMenuOpen(false); navigate(`/project/${p.id}`) }}
            >
              <div className={styles.mobileProjectName}>{p.name}</div>
              <div className={styles.mobileProjectSub}>📍 {p.sub}</div>
            </button>
          ))}
          {/* Completed & Sold Out */}
          <div className={styles.mobileCompletedSection}>
            <div className={styles.mobileCompletedHeader}>
              <span className={styles.dropCheckDot} />
              Completed &amp; Sold Out
            </div>
            <div className={styles.mobileCompletedList}>
              {NAV_COMPLETED.join(' · ')}
            </div>
          </div>

          <button className={styles.mobileViewAll} onClick={() => { setMenuOpen(false); scrollTo('portfolio') }}>
            View all projects overview →
          </button>
        </div>

        <div className={styles.mobileDivider} />

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

