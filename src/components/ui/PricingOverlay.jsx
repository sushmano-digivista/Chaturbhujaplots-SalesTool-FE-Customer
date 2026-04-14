import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ACTIVE_PROJECTS } from '@/constants/projects'

function wasShown() { try { return sessionStorage.getItem('pricing_overlay_shown') === '1' } catch { return false } }
function markShown() { try { sessionStorage.setItem('pricing_overlay_shown', '1') } catch {} }

const NAME_TE = {
  'Anjana Paradise': 'అంజన పారడైజ్', 'Trimbak Oaks': 'ట్రింబక్ ఓక్స్',
  'Aparna Legacy': 'అపర్ణ లెగసీ', 'Varaha Virtue': 'వరాహ వర్చ్యూ',
}

export default function PricingOverlay() {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const [phase, setPhase] = useState(() => wasShown() ? 'done' : 'boom')

  useEffect(() => {
    if (phase === 'done') return
    markShown()
  }, [phase])

  useEffect(() => {
    if (phase !== 'boom') return
    const t = setTimeout(() => setPhase('shrink'), 2000)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'shrink') return
    const t = setTimeout(() => setPhase('done'), 600)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'done') return null

  const ventures = ACTIVE_PROJECTS.filter(p => p.pricing).map(p => ({
    name: isTe ? (NAME_TE[p.name] || p.name) : p.name,
    east: p.pricing.east.base,
    west: p.pricing.west.base,
  }))

  const minPrice = Math.min(...ventures.map(v => Math.min(v.east, v.west)))
  const isShrink = phase === 'shrink'

  return (
    <div onClick={() => setPhase('shrink')} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at center, rgba(10,30,18,0.97) 0%, rgba(0,0,0,0.95) 100%)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      opacity: isShrink ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, #0a1e12 0%, #14321e 50%, #0a1e12 100%)',
        border: '2px solid rgba(201,168,76,.7)',
        borderRadius: 20, padding: '44px 48px', maxWidth: 620, width: '94vw',
        textAlign: 'center', position: 'relative',
        boxShadow: '0 0 80px rgba(201,168,76,.35), 0 0 160px rgba(201,168,76,.15)',
        animation: isShrink ? 'none' : 'boomIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)',
        transform: isShrink ? 'scale(0.15) translateY(-120vh)' : 'scale(1)',
        transition: isShrink ? 'transform 0.6s cubic-bezier(0.6,0,0.4,1), opacity 0.5s ease' : 'none',
        cursor: 'default',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #C9A84C, #e2bf64)',
          color: '#0d2818', fontSize: 13, fontWeight: 700, letterSpacing: 2.5,
          textTransform: 'uppercase', padding: '6px 20px', borderRadius: 24,
          marginBottom: 20,
          boxShadow: '0 0 20px rgba(201,168,76,.5)',
        }}>
          {isTe ? 'ప్లాట్లు ప్రారంభ ధర' : 'PLOTS STARTING FROM'}
        </div>

        {/* Big Price */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 700,
          lineHeight: 1.1, marginBottom: 8, color: '#C9A84C',
          textShadow: '0 0 30px rgba(201,168,76,0.5)',
        }}>
          ₹{minPrice.toLocaleString('en-IN')}
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)' }}>/{isTe ? 'చ.గ.' : 'sq.yd'}</span>
        </h1>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
          {isTe ? 'ఏపిసిఆర్డేఏ & రేరా ఆమోదిత ప్రీమియం ప్లాట్లు — అమరావతి సమీపంలో' : 'APCRDA & RERA approved premium plots — Near Amaravati Capital'}
        </p>

        {/* Venture prices */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
          {ventures.map(v => (
            <div key={v.name} style={{
              background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)',
              borderRadius: 12, padding: '10px 14px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{v.name}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                <span>☀ <strong style={{ color: '#C9A84C', fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>₹{v.east.toLocaleString('en-IN')}</strong></span>
                <span>🌙 <strong style={{ color: '#C9A84C', fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>₹{v.west.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss hint */}
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', margin: 0 }}>
          {isTe ? 'మూసివేయడానికి ఎక్కడైనా క్లిక్ చేయండి' : 'Click anywhere to dismiss'}
        </p>
      </div>
    </div>
  )
}
