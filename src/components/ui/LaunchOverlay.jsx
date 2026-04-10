import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'

const LAUNCH_DATE = new Date('2026-04-11T10:00:00+05:30')

function pad(n) { return String(n).padStart(2, '0') }

function getTimeLeft() {
  const diff = LAUNCH_DATE - new Date()
  if (diff <= 0) return null
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    secs:  Math.floor((diff % 60000) / 1000),
  }
}

// Persist across mounts via sessionStorage so SPA navigations never re-trigger
function wasShown() { try { return sessionStorage.getItem('launch_overlay_shown') === '1' } catch { return false } }
function markShown() { try { sessionStorage.setItem('launch_overlay_shown', '1') } catch {} }

/**
 * LaunchOverlay — "big boom" fullscreen splash that auto-shrinks into the banner.
 * Phase 1 (0-5s):   Full-screen centered card with boom entrance
 * Phase 2 (5-5.6s): Card shrinks + flies to top → overlay fades out
 */
export default function LaunchOverlay() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isTe = language === 'te'
  const [phase, setPhase] = useState(() => wasShown() ? 'done' : 'boom')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const cardRef = useRef(null)

  useEffect(() => {
    if (phase === 'done') return
    markShown()
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [phase])

  // Phase transitions: boom → shrink → done
  useEffect(() => {
    if (phase !== 'boom') return
    const t = setTimeout(() => setPhase('shrink'), 5000)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'shrink') return
    const t = setTimeout(() => setPhase('done'), 700)
    return () => clearTimeout(t)
  }, [phase])

  const dismiss = () => setPhase('shrink')

  if (phase === 'done' || !timeLeft) return null

  const cdItems = [
    { val: timeLeft.days,  label: isTe ? 'రోజులు'   : 'Days'  },
    { val: timeLeft.hours, label: isTe ? 'గంటలు'    : 'Hours' },
    { val: timeLeft.mins,  label: isTe ? 'నిమిషాలు' : 'Mins'  },
    { val: timeLeft.secs,  label: isTe ? 'సెకన్లు'  : 'Secs'  },
  ]

  const waUrl = `https://wa.me/919948709041?text=${encodeURIComponent(
    isTe
      ? 'నమస్కారం! ట్రింబక్ ఓక్స్ ఫేజ్ II బ్రోచర్ లాంచ్ (ఏప్రిల్ 11, 2026) పట్ల ఆసక్తిగా ఉన్నాను. వివరాలు పంపగలరు!'
      : "Hi! I'm interested in Trimbak Oaks Phase II Brochure Launch on 11th April 2026. Please share details!"
  )}`

  const isShrink = phase === 'shrink'

  return (
    <div onClick={dismiss} style={{
      ...overlayStyle,
      opacity: isShrink ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <div ref={cardRef} onClick={(e) => e.stopPropagation()} style={{
        ...cardStyle,
        animation: isShrink ? 'none' : 'boomIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)',
        ...(isShrink ? {
          transform: 'scale(0.15) translateY(-120vh)',
          opacity: 0,
          transition: 'transform 0.6s cubic-bezier(0.6,0,0.4,1), opacity 0.5s ease',
        } : {}),
      }}>

        {/* Close */}
        <button onClick={dismiss} style={closeStyle}>✕</button>

        {/* Sparkle ring */}
        <div style={sparkRingStyle} />

        {/* Badge */}
        <div style={badgeStyle}>
          ✦ {isTe ? 'గ్రాండ్ లాంచ్ ఈవెంట్' : 'Grand Launch Event'} ✦
        </div>

        {/* Title */}
        <h2 style={titleStyle}>
          {isTe ? 'ట్రింబక్ ఓక్స్' : 'Trimbak Oaks'}{' '}
          <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Phase II</em>
          <br />
          {isTe ? 'బ్రోచర్ లాంచ్' : 'Brochure Launch'}
        </h2>

        {/* Meta */}
        <div style={metaStyle}>
          <span>📅 {isTe ? 'ఏప్రిల్ 11, 2026' : '11th April 2026'} &nbsp;|&nbsp; 10:00 AM</span>
          <span>📍 {isTe ? 'పద్మావతి ఐకాన్, విజయవాడ' : 'Padmavathi Icon, Vijayawada'}</span>
          <span style={lunchStyle}>🍽️ {isTe ? 'భోజనం ఉంటుంది' : 'Lunch follows'}</span>
        </div>

        {/* Countdown */}
        <div style={cdRowStyle}>
          {cdItems.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: 'rgba(201,168,76,.5)', fontWeight: 700, fontSize: 28 }}>:</span>}
              <div style={cdBoxStyle}>
                <div style={cdNumStyle}>{pad(item.val)}</div>
                <div style={cdLabelStyle}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={ctaRowStyle}>
          <a href={waUrl} target="_blank" rel="noreferrer" style={btnGoldStyle}
            onClick={(e) => e.stopPropagation()}>
            {isTe ? 'ఆసక్తి నమోదు చేయండి →' : 'Register Interest →'}
          </a>
          <button style={btnOutlineStyle}
            onClick={(e) => { e.stopPropagation(); setPhase('done'); navigate('/project/trimbak'); }}>
            {isTe ? 'ప్రాజెక్ట్ చూడండి →' : 'View Project →'}
          </button>
        </div>

        <p style={dismissStyle}>{isTe ? 'మూసివేయడానికి ఎక్కడైనా క్లిక్ చేయండి' : 'Click anywhere to dismiss'}</p>
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: 'radial-gradient(ellipse at center, rgba(10,30,18,0.95) 0%, rgba(0,0,0,0.92) 100%)',
  backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}
const cardStyle = {
  background: 'linear-gradient(145deg, #0a1e12 0%, #14321e 50%, #0a1e12 100%)',
  border: '2px solid rgba(201,168,76,.7)',
  borderRadius: 20, padding: '48px 48px 36px', maxWidth: 580, width: '94vw',
  textAlign: 'center', position: 'relative',
  boxShadow: '0 0 80px rgba(201,168,76,.35), 0 0 160px rgba(201,168,76,.15), inset 0 1px 0 rgba(201,168,76,.2)',
  cursor: 'default', overflow: 'hidden',
}
const sparkRingStyle = {
  position: 'absolute', inset: -2,
  border: '2px solid transparent',
  borderRadius: 20,
  background: 'conic-gradient(from 0deg, transparent, rgba(201,168,76,.6), transparent, rgba(201,168,76,.4), transparent) border-box',
  mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude', WebkitMaskComposite: 'xor',
  animation: 'spinRing 3s linear infinite',
  pointerEvents: 'none',
}
const closeStyle = {
  position: 'absolute', top: 14, right: 18,
  background: 'none', border: 'none', color: 'rgba(255,255,255,.4)',
  fontSize: 22, cursor: 'pointer', zIndex: 2,
}
const badgeStyle = {
  display: 'inline-block',
  background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.5)',
  color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: 2.5,
  textTransform: 'uppercase', padding: '5px 16px', borderRadius: 20,
  marginBottom: 18, animation: 'pulseGlow 2s ease-in-out infinite',
}
const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700,
  lineHeight: 1.25, marginBottom: 18, color: '#fff',
}
const metaStyle = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
  gap: '8px 18px', fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 28,
}
const lunchStyle = {
  background: 'rgba(201,168,76,.25)', border: '1px solid rgba(201,168,76,.6)',
  borderRadius: 8, padding: '3px 12px', color: '#C9A84C', fontWeight: 700,
  animation: 'pulseGlow 1.5s ease-in-out infinite',
}
const cdRowStyle = {
  display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 30,
}
const cdBoxStyle = {
  background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.4)',
  borderRadius: 12, padding: '12px 18px', textAlign: 'center', minWidth: 70,
}
const cdNumStyle = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700,
  color: '#C9A84C', lineHeight: 1,
}
const cdLabelStyle = {
  fontSize: 10, color: 'rgba(255,255,255,.45)', letterSpacing: 1,
  textTransform: 'uppercase', marginTop: 4,
}
const ctaRowStyle = {
  display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 18,
}
const btnGoldStyle = {
  background: 'linear-gradient(135deg, #C9A84C, #e2bf64)', color: '#0d2818',
  fontSize: 15, fontWeight: 700, padding: '13px 28px', borderRadius: 10,
  textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,168,76,.4)',
  transition: 'transform .15s, box-shadow .15s',
}
const btnOutlineStyle = {
  background: 'transparent', color: '#C9A84C', fontSize: 15, fontWeight: 600,
  padding: '12px 28px', borderRadius: 10, border: '1.5px solid #C9A84C',
  textDecoration: 'none',
}
const dismissStyle = {
  fontSize: 11, color: 'rgba(255,255,255,.3)', margin: 0,
}
