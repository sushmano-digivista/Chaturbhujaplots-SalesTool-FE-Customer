import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Plots',      id: 'plots'      },
  { label: 'Amenities',  id: 'amenities'  },
  { label: 'Gallery',    id: 'gallery'    },
  { label: 'Location',   id: 'location'   },
  { label: 'Contact',    id: 'contact'    },
]

export default function Navbar({ contact, onEnquire }) {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        {/* Logo */}
        <a href="#home" className={styles.logo} onClick={e => { e.preventDefault(); scrollTo('home') }}>
          <div className={styles.logoIcon}>AP</div>
          <div>
            <div className={styles.logoBrand}>Anjana Paradise</div>
            <div className={styles.logoSub}>Chaturbhuja Properties & Infra</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className={styles.links}>
          {NAV_LINKS.map(l => (
            <button key={l.id} className={styles.link} onClick={() => scrollTo(l.id)}>
              {l.label}
            </button>
          ))}
          <button className="btn btn-gold btn-sm"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' })}>
            Enquire Now
          </button>
        </div>

        {/* Mobile */}
        <div className={styles.mobileRight}>
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className={styles.phoneBtn}>
              <Phone size={16} />
            </a>
          )}
          <button className={styles.hamburger}
            onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${open ? styles.open : ''}`}>
        {NAV_LINKS.map(l => (
          <button key={l.id} className={styles.mobileLink} onClick={() => scrollTo(l.id)}>
            {l.label}
          </button>
        ))}
        <button className={styles.mobileEnquire}
          onClick={() => { setOpen(false); onEnquire({ source:'HERO_CTA', label:'Enquire Now' }) }}>
          Enquire Now
        </button>
      </div>
    </>
  )
}
