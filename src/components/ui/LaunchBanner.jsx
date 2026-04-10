import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import styles from './LaunchBanner.module.css'

const LAUNCH_DATE = new Date('2026-04-11T10:00:00+05:30')
const SPARKS = ['✦','★','✸','◆','✦','✸','★','◆']

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

function pad(n) { return String(n).padStart(2, '0') }

export default function LaunchBanner({ compact = false }) {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isTe = language === 'te'
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('trimbak_launch_collapsed') === 'true'
  )
  const sparksRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!sparksRef.current) return
    const el = sparksRef.current
    el.innerHTML = ''
    SPARKS.forEach((sym, i) => {
      const s = document.createElement('span')
      s.textContent = sym
      s.style.cssText = [
        'position:absolute',
        `font-size:${11 + Math.random() * 5}px`,
        `left:${4 + i * 12}%`,
        `top:${20 + Math.random() * 55}%`,
        `color:rgba(201,168,76,${(0.22 + Math.random() * 0.3).toFixed(2)})`,
        `animation:floatSpark ${(1.8 + i * 0.35).toFixed(2)}s ease-in-out infinite`,
        `animation-delay:${(i * 0.28).toFixed(2)}s`,
        'pointer-events:none',
      ].join(';')
      el.appendChild(s)
    })
  }, [])

  if (!timeLeft) return null

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('trimbak_launch_collapsed', String(next))
  }

  const cdItems = [
    { val: timeLeft.days,  label: isTe ? 'రోజులు'   : 'Days'  },
    { val: timeLeft.hours, label: isTe ? 'గంటలు'    : 'Hours' },
    { val: timeLeft.mins,  label: isTe ? 'నిమిషాలు' : 'Mins'  },
    { val: timeLeft.secs,  label: isTe ? 'సెకన్లు'  : 'Secs'  },
  ]

  return (
    <div className={`${styles.banner} ${compact ? styles.compact : ''}`}
      onClick={toggleCollapse}
      style={{ transition: 'max-height 0.4s ease, padding 0.4s ease', overflow: 'hidden', cursor: 'pointer' }}>

      {/* Sparkles layer */}
      <div className={styles.sparks} ref={sparksRef} />

      {collapsed ? (
        /* ── Collapsed slim bar ── */
        <div className={styles.inner} style={{ padding: '8px 1.25rem', justifyContent: 'center', gap: '12px' }}>
          <div className={styles.badge} style={{ marginBottom: 0, animation: 'none' }}>
            ✦ {isTe ? 'ట్రింబక్ ఓక్స్ — గ్రాండ్ లాంచ్' : 'Trimbak Oaks — Grand Launch'} ✦
          </div>
          <div className={styles.countdown} style={{ gap: 2 }}>
            {cdItems.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {i > 0 && <span style={{ color: 'rgba(201,168,76,.5)', fontWeight: 700, fontSize: 14 }}>:</span>}
                <span style={{ color: '#C9A84C', fontWeight: 700, fontSize: 14, fontFamily: 'Cormorant Garamond,serif' }}>{pad(item.val)}</span>
              </div>
            ))}
          </div>
          <span style={{ background: 'rgba(201,168,76,.2)', border: '1px solid rgba(201,168,76,.5)', borderRadius: 6, padding: '2px 8px', color: '#C9A84C', fontWeight: 700, fontSize: 11 }}>
            🍽️ {isTe ? 'భోజనం ఉంటుంది' : 'Lunch follows'}
          </span>
          <span style={{ color: '#C9A84C', fontSize: 14 }}>▼</span>
        </div>
      ) : (
        /* ── Expanded full banner ── */
        <div className={styles.inner}>

          {/* Left — event info */}
          <div className={styles.info}>
            <div className={styles.badge}>
              ✦ {isTe ? 'గ్రాండ్ లాంచ్ ఈవెంట్' : 'Grand Launch Event'} ✦
            </div>
            <div className={styles.title}>
              {isTe ? 'ట్రింబక్ ఓక్స్' : 'Trimbak Oaks'}{' '}
              <em style={{ fontStyle: 'italic' }}>Phase II</em>{' '}
              — {isTe ? 'బ్రోచర్ లాంచ్' : 'Brochure Launch'}
            </div>
            <div className={styles.meta}>
              <span>📅 {isTe ? 'ఏప్రిల్ 11, 2026' : '11th April 2026'} &nbsp;|&nbsp; 10:00 AM</span>
              <span>📍 {isTe ? 'పద్మావతి ఐకాన్, విజయవాడ' : 'Padmavathi Icon, Vijayawada'}</span>
              <span style={{ background: 'rgba(201,168,76,.2)', border: '1px solid rgba(201,168,76,.5)', borderRadius: 6, padding: '2px 8px', color: '#C9A84C', fontWeight: 700 }}>
              🍽️ {isTe ? 'భోజనం ఉంటుంది' : 'Lunch follows'}
            </span>
            </div>
          </div>

          {/* Center — countdown */}
          <div className={styles.countdown}>
            {cdItems.map((item, i) => (
              <div key={item.label} className={styles.cdWrap}>
                {i > 0 && <div className={styles.colon}>:</div>}
                <div className={styles.cdBox} style={{ animationDelay: `${i * 0.25}s` }}>
                  <div className={styles.cdNum}>{pad(item.val)}</div>
                  <div className={styles.cdLabel}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — CTAs */}
          <div className={styles.ctas} onClick={(e) => e.stopPropagation()}>
            <a
              href={`https://wa.me/919948709041?text=${encodeURIComponent(
                isTe
                  ? 'నమస్కారం! ట్రింబక్ ఓక్స్ ఫేజ్ II బ్రోచర్ లాంచ్ (ఏప్రిల్ 11, 2026) పట్ల ఆసక్తిగా ఉన్నాను. వివరాలు పంపగలరు!'
                  : "Hi! I'm interested in Trimbak Oaks Phase II Brochure Launch on 11th April 2026. Please share details!"
              )}`}
              target="_blank" rel="noreferrer"
              className={styles.btnGold}
            >
              {isTe ? 'ఆసక్తి నమోదు చేయండి →' : 'Register Interest →'}
            </a>
            <button className={styles.btnOutline}
              onClick={(e) => { e.stopPropagation(); navigate('/project/trimbak'); }}>
              {isTe ? 'ప్రాజెక్ట్ చూడండి' : 'View Project'}
            </button>
          </div>

          <span className={styles.close} style={{ pointerEvents: 'none' }}>▲</span>

        </div>
      )}
    </div>
  )
}
