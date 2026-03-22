import { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import styles from './Navbar.module.css'

const PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise',  sub: 'Paritala, Near Amaravati',    available: 14 },
  { id: 'trimbak', name: 'Trimbak Oaks',     sub: 'Penamaluru, Near Vijayawada', available: 18 },
  { id: 'aparna',  name: 'Aparna Legacy',    sub: 'Chevitikallu',                available: 16 },
  { id: 'varaha',  name: 'Varaha Virtue',    sub: 'Pamarru, Near NH-16',         available: 20 },
]
const COMPLETED = ['Nandana Vihar', 'County', 'Pearl', 'Empire', 'Pride', 'Prime']

export default function Navbar({ contact, onEnquire }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [portOpen,  setPortOpen]  = useState(false)
  const [plotsOpen, setPlotsOpen] = useState(false)
  const portRef  = useRef(null)
  const plotsRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = e => {
      if (portRef.current  && !portRef.current.contains(e.target))  setPortOpen(false)
      if (plotsRef.current && !plotsRef.current.contains(e.target)) setPlotsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = id => {
    setMenuOpen(false); setPortOpen(false); setPlotsOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#home" className={styles.logo} onClick={e => { e.preventDefault(); scrollTo('home') }}>
          <div className={styles.logoIcon}>CP</div>
          <div>
            <div className={styles.logoBrand}>Chaturbhuja Properties</div>
            <div className={styles.logoSub}>& Infra · Premium Plots</div>
          </div>
        </a>

        <div className={styles.links}>
          {/* Portfolio dropdown */}
          <div className={styles.dropdown} ref={portRef}>
            <button className={`${styles.link} ${styles.dropTrigger}`}
              onClick={() => { setPortOpen(o => !o); setPlotsOpen(false) }}>
              Portfolio ▾
            </button>
            {portOpen && (
              <div className={styles.dropMenu}>
                <span className={styles.dropLabel}>🟡 Open for Booking</span>
                {PROJECTS.map(p => (
                  <button key={p.id} className={styles.dropItem}
                    onClick={() => { scrollTo('portfolio'); }}>
                    <span className={styles.dropDot} />
                    <div className={styles.dropItemText}>
                      <strong>{p.name}</strong>
                      <span className={styles.dropSub}>{p.sub}</span>
                    </div>
                    <span className={styles.dropAvail}>● {p.available} left</span>
                  </button>
                ))}
                <div className={styles.dropDivider} />
                <span className={styles.dropLabel}>✅ Completed &amp; Sold Out</span>
                <div className={styles.dropCompleted}>{COMPLETED.join(' · ')}</div>
              </div>
            )}
          </div>

          <button className={styles.link} onClick={() => scrollTo('gallery')}>Gallery</button>
          <button className={styles.link} onClick={() => scrollTo('videos')}>Videos</button>
          <button className={styles.link} onClick={() => scrollTo('amenities')}>Amenities</button>

          {/* Open Plots dropdown */}
          <div className={styles.dropdown} ref={plotsRef}>
            <button className={`${styles.link} ${styles.dropTrigger}`}
              onClick={() => { setPlotsOpen(o => !o); setPortOpen(false) }}>
              Open Plots ▾
            </button>
            {plotsOpen && (
              <div className={`${styles.dropMenu} ${styles.dropMenuWide}`}>
                <span className={styles.dropLabel}>🟢 Ready to Buy</span>
                {PROJECTS.map(p => (
                  <button key={p.id} className={styles.dropItem}
                    onClick={() => { scrollTo('plots'); }}>
                    <span className={styles.dropDot} />
                    <div className={styles.dropItemText}>
                      <strong>{p.name}</strong>
                      <span className={styles.dropSub}>{p.sub}</span>
                    </div>
                    <span className={styles.dropAvail}>● {p.available} available</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={styles.link} onClick={() => scrollTo('location')}>Location</button>
          <button className={styles.link} onClick={() => scrollTo('contact')}>Contact</button>
          <button className="btn btn-gold btn-sm"
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' })}>
            Enquire Now →
          </button>
        </div>

        <div className={styles.mobileRight}>
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className={styles.phoneBtn}><Phone size={16} /></a>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {[['Portfolio','portfolio'],['Gallery','gallery'],['Videos','videos'],
          ['Amenities','amenities'],['Plots','plots'],['Location','location'],['Contact','contact']
        ].map(([label, id]) => (
          <button key={id} className={styles.mobileLink} onClick={() => scrollTo(id)}>{label}</button>
        ))}
        <button className={styles.mobileEnquire}
          onClick={() => { setMenuOpen(false); onEnquire({ source:'HERO_CTA', label:'Enquire Now' }) }}>
          Enquire Now →
        </button>
      </div>
    </>
  )
}
