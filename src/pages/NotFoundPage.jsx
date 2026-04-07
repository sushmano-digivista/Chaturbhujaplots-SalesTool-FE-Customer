import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Page Not Found | ChaturbhujaPlots'
    return () => { document.title = 'ChaturbhujaPlots | Premium APCRDA & RERA Approved Plots Near Amaravati, AP' }
  }, [])

  return (
    <div className={styles.page}>

      {/* ── Brand header ─────────────────────────────────── */}
      <div className={styles.brand} onClick={() => navigate('/')} role="button" tabIndex={0}>
        <img src="/chaturbhuja-logo.webp" alt="ChaturbhujaPlots" className={styles.logo} />
      </div>

      {/* ── 404 content ──────────────────────────────────── */}
      <div className={styles.content}>
        <div className={styles.codeWrap}>
          <span className={styles.code}>404</span>
          <div className={styles.houseIcon}>
            <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4"  y="32" width="14" height="22" rx="2" fill="#0d3d26"/>
              <polygon points="4,32 11,18 18,32" fill="#0d3d26"/>
              <rect x="10" y="34" width="4" height="8" rx="1" fill="#C9A84C" opacity="0.6"/>
              <rect x="23" y="28" width="34" height="26" rx="2" fill="#1E4D2B"/>
              <polygon points="20,28 40,10 60,28" fill="#1E4D2B"/>
              <rect x="30" y="36" width="8" height="8"  rx="1" fill="#C9A84C" opacity="0.7"/>
              <rect x="42" y="36" width="8" height="8"  rx="1" fill="#C9A84C" opacity="0.7"/>
              <rect x="36" y="44" width="8" height="10" rx="1" fill="#0d3d26"/>
              <rect x="62" y="34" width="14" height="20" rx="2" fill="#0d3d26"/>
              <polygon points="62,34 69,20 76,34" fill="#0d3d26"/>
              <rect x="66" y="36" width="4" height="7"  rx="1" fill="#C9A84C" opacity="0.6"/>
              <line x1="0" y1="54" x2="80" y2="54" stroke="#C9A84C" stroke-width="1.5" opacity="0.4"/>
            </svg>
          </div>
        </div>

        <h1 className={styles.title}>Plot Not Found!</h1>
        <p className={styles.subtitle}>
          Looks like this page has been sold out or moved.<br />
          But don't worry — we have plenty of premium plots waiting for you!
        </p>

        {/* ── CTAs ─────────────────────────────────────── */}
        <div className={styles.btns}>
          <button className="btn btn-gold" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <button className="btn btn-ghost" onClick={() => {
            navigate('/')
            setTimeout(() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }), 300)
          }}>
            View All Projects
          </button>
        </div>

        {/* ── Quick project links ───────────────────────── */}
        <div className={styles.projectsWrap}>
          <p className={styles.projectsLabel}>Our Active Projects</p>
          <div className={styles.projectsGrid}>
            {ACTIVE_PROJECTS.filter(p => !p.upcoming).map(p => (
              <button
                key={p.id}
                className={styles.projectCard}
                onClick={() => navigate(`/project/${p.id}`)}
              >
                <span className={styles.projectName}>{p.name}</span>
                <span className={styles.projectLoc}>📍 {p.loc}</span>
                <span className={styles.projectPrice}>{p.starting}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer strip ─────────────────────────────────── */}
      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} Chaturbhuja Properties & Infra</span>
        <a href="tel:+919948709041">📞 +91 99487 09041</a>
      </div>
    </div>
  )
}
