import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import styles from './Navbar.module.css'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'

export const NAV_PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise', sub: 'Paritala, Near Amaravati',    available: 14, total: 242 },
  { id: 'trimbak', name: 'Trimbak Oaks',    sub: 'Penamaluru, Near Vijayawada', available: 18, total: 48  },
  { id: 'aparna',  name: 'Aparna Legacy',   sub: 'Chevitikallu, Gateway of Amaravati Capital Region', available: 16, total: 28  },
  { id: 'varaha',  name: 'Varaha Virtue',   sub: 'Pamarru, Near NH-16',         available: 20, total: 32  },
]
export const NAV_COMPLETED = [
  'Nandana Vihar', 'County', 'Pearl', 'Empire', 'Pride', 'Prime',
]
export const NAV_COMPLETED_TE = [
  'నందన విహార్', 'కౌంటీ', 'పర్ల్', 'ఎంపైర్', 'ప్రైడ్', 'ప్రైమ్',
]

export default function Navbar({ contact, onEnquire }) {
  const navigate   = useNavigate()
  const { t }      = useLanguage()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [portOpen,  setPortOpen]  = useState(false)
  const portRef = useRef(null)

  const NAV_LINKS = [
    { label: t('nav.gallery'),   id: 'gallery'   },
    { label: t('nav.videos'),    id: 'videos'    },
    { label: t('nav.amenities'), id: 'amenities' },
    { label: t('nav.location'),  id: 'location'  },
    { label: t('nav.contact'),   id: 'contact'   },
  ]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (portRef.current && !portRef.current.contains(e.target)) setPortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      const navHeight = document.querySelector('[class*="navbar"]')?.offsetHeight || 68
      window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

        <a href="/" className={styles.logo} onClick={(e) => { e.preventDefault(); window.location.reload() }}>
          <img src="/chaturbhuja-logo.webp" alt="Chaturbhuja Properties & Infra" className={styles.logoImg} />
        </a>

        <div className={styles.links}>

          <div className={styles.dropdown} ref={portRef}>
            <button
              className={`${styles.link} ${styles.dropTrigger} ${portOpen ? styles.linkActive : ''}`}
              onClick={() => setPortOpen((o) => !o)}
            >
              {t('nav.portfolio')}
              <ChevronDown size={13} className={`${styles.chevron} ${portOpen ? styles.chevronOpen : ''}`} />
            </button>

            {portOpen && (
              <div className={styles.dropMenu}>
                <div className={styles.dropHeader}>
                  <div className={styles.dropHeaderTitle}>{t('nav.ourPortfolio')}</div>
                  <div className={styles.dropHeaderSub}>{t('nav.projectsSettled')}</div>
                </div>

                <div className={styles.dropSectionLabel}>
                  <span className={styles.dropPulse} />
                  {t('nav.openForBooking')}
                </div>
                <div className={styles.dropCards}>
                  {NAV_PROJECTS.map((p, i) => {
                    const colors = ['#C9A84C','#4CAF74','#64B5F6','#FFB74D']
                    const color  = colors[i] || '#C9A84C'
                    const locKey = 'projects.' + p.id + '.loc'
                    const locVal = t(locKey)
                    const loc      = (locVal && locVal !== locKey) ? locVal : p.sub
                    const nameKey  = 'projects.' + p.id + '.name'
                    const nameVal  = t(nameKey)
                    const projName = (nameVal && nameVal !== nameKey) ? nameVal : p.name
                    return (
                      <button
                        key={p.id}
                        className={styles.dropCard}
                        style={{ '--dc': color }}
                        onClick={() => { setPortOpen(false); navigate('/project/' + p.id) }}
                      >
                        <div className={styles.dropCardBar} />
                        <div className={styles.dropCardContent}>
                          <div className={styles.dropCardName}>{projName}</div>
                          <div className={styles.dropCardSub}>📍 {loc}</div>
                        </div>
                        <div className={styles.dropCardArrow}>›</div>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.dropDivider} />

                <div className={styles.dropSectionLabel}>
                  <span className={styles.dropCheckDot} />
                  {t('nav.completedSoldOut')}
                </div>
                <button className={styles.dropCompletedLine} onClick={() => { setPortOpen(false); scrollTo('portfolio') }}>
                  {(language === 'te' ? NAV_COMPLETED_TE : NAV_COMPLETED).join(' · ')}
                </button>

                <button className={styles.dropViewAll} onClick={() => { setPortOpen(false); scrollTo('portfolio') }}>
                  <span>{t('nav.viewAllProjects')}</span>
                  <span className={styles.dropViewAllArrow}>→</span>
                </button>
              </div>
            )}
          </div>

          {NAV_LINKS.map((l) => (
            <button key={l.id} className={styles.link} onClick={() => scrollTo(l.id)}>
              {l.label}
            </button>
          ))}

          <LanguageToggle />

          <button
            className={styles.enquireBtn}
            onClick={() => onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' })}
          >
            {t('nav.enquireNow')} <span className={styles.enquireArrow}>→</span>
          </button>
        </div>

        <div className={styles.mobileRight}>
          <LanguageToggle />
          {contact?.phone && (
            <a href={'tel:' + contact.phone} className={styles.phoneBtn}><Phone size={16} /></a>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>

        <div className={styles.mobilePortfolioSection}>
          <div className={styles.mobilePortfolioHeader}>
            <span className={styles.dropPulse} />
            {t('nav.ourPortfolio')}
          </div>
          {NAV_PROJECTS.map((p) => {
            const locKey = 'projects.' + p.id + '.loc'
            const locVal = t(locKey)
            const loc      = (locVal && locVal !== locKey) ? locVal : p.sub
            const nameKey  = 'projects.' + p.id + '.name'
            const nameVal  = t(nameKey)
            const projName = (nameVal && nameVal !== nameKey) ? nameVal : p.name
            return (
              <button
                key={p.id}
                className={styles.mobileProjectCard}
                onClick={() => { setMenuOpen(false); navigate('/project/' + p.id) }}
              >
                <div className={styles.mobileProjectName}>{projName}</div>
                <div className={styles.mobileProjectSub}>📍 {loc}</div>
              </button>
            )
          })}
          <div className={styles.mobileCompletedSection}>
            <div className={styles.mobileCompletedHeader}>
              <span className={styles.dropCheckDot} />
              {t('nav.completedSoldOut')}
            </div>
            <div className={styles.mobileCompletedList}>
              {(language === 'te' ? NAV_COMPLETED_TE : NAV_COMPLETED).join(' · ')}
            </div>
          </div>

          <button className={styles.mobileViewAll} onClick={() => { setMenuOpen(false); scrollTo('portfolio') }}>
            {t('nav.viewAllProjects')} →
          </button>
        </div>

        <div className={styles.mobileDivider} />

        {NAV_LINKS.map((l) => (
          <button key={l.id} className={styles.mobileLink} onClick={() => { setMenuOpen(false); scrollTo(l.id) }}>
            {l.label}
          </button>
        ))}
        <button
          className={styles.mobileEnquire}
          onClick={() => { setMenuOpen(false); onEnquire({ source: 'HERO_CTA', label: 'Enquire Now' }) }}
        >
          {t('nav.enquireNow')} →
        </button>
      </div>
    </>
  )
}
