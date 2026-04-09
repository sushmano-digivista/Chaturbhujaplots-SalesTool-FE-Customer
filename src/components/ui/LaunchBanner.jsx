import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import styles from './LaunchBanner.module.css'

const LAUNCH_DATE = new Date('2026-04-11T10:00:00+05:30')

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

const SPARKS   = ['✦','★','✸','◆','✦','✸','★','◆']
const FW_SYMS  = ['✦','✸','★','◆','✦','✸']
const FW_COLS  = ['#C9A84C','#e8c97a','#fff','#C9A84C','#ffd700','#e05c2a']

export default function LaunchBanner({ compact = false }) {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('trimbak_launch_dismissed') === 'true'
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

    // Floating sparkles
    SPARKS.forEach((sym, i) => {
      const s = document.createElement('span')
      s.textContent = sym
      s.style.cssText = `position:absolute;font-size:${11 + Math.random() * 5}px;left:${4 + i * 12}%;top:${20 + Math.random() * 55}%;color:rgba(201,168,76,${0.22 + Math.random() * 0.3});animation:floatSpark ${1.8 + i * 0.35}s ease-in-out infinite;animation-delay:${i * 0.28}s;pointer-events:none`
      el.appendChild(s)
    })

    // Firework burst on load
    FW_SYMS.forEach((sym, i) => {
      const f = document.createElement('span')
      f.textContent = sym
      f.style.cssText = `position:absolute;font-size:${13 + Math.random() * 8}px;left:${10 + Math.random() * 80}%;top:${10 + Math.random() * 70}%;color:${FW_COLS[i]};animation:firework ${1.2 + Math.random() * 1.5}s ease-out ${i * 0.35}s both;pointer-events:none`
      el.appendChild(f)
    })
  }, [])

  if (!timeLeft || dismissed) return null

  const titleEN = 'Trimbak Oaks Phase II — Brochure Launch'
  const titleTE = 'ట్రింబక్ ఓక్స్ Phase II — బ్రోచర్ లాంచ్'
  const titleStr = isTe ? titleTE : titleEN
  const goldLen  = isTe ? 13 : 12

  const tickerEN = '✦ GRAND LAUNCH EVENT · TRIMBAK OAKS PHASE II — BROCHURE LAUNCH · 11TH APRIL 2026, 10:00 AM · PADMAVATHI ICON, VIJAYAWADA · LUNCH FOLLOWS · REGISTER YOUR INTEREST TODAY!     '
  const tickerTE = '✦ గ్రాండ్ లాంచ్ ఈవెంట్ · ట్రింబక్ ఓక్స్ ఫేజ్ II — బ్రోచర్ లాంచ్ · ఏప్రిల్ 11, 2026, 10:00 AM · పద్మావతి ఐకాన్, విజయవాడ · భోజనం ఉంటుంది · మీ ఆసక్తి నమోదు చేయండి!     '
  const ticker   = isTe ? tickerTE : tickerEN

  const cdItems = [
    { val: timeLeft.days,  label: isTe ? 'రోజులు' : 'Days'  },
    { val: timeLeft.hours, label: isTe ? 'గంటలు'  : 'Hours' },
    { val: timeLeft.mins,  label: isTe ? 'నిమిషాలు' : 'Mins' },
    { val: timeLeft.secs,  label: isTe ? 'సెకన్లు' : 'Secs' },
  ]

  return (
    <div className={`${styles.banner} ${compact ? styles.compact : ''}`}>

      {/* Ticker bar */}
      <div className={styles.tickerBar}>
        <span className={styles.livePill}>🔴 LIVE</span>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <span className={styles.tickerTrack}>{ticker}{ticker}</span>
        </div>
      </div>

      {/* Sparkles + fireworks layer */}
      <div className={styles.sparks} ref={sparksRef} />

      <div className={styles.inner}>

        {/* Left — event info */}
        <div className={styles.info}>
          <div className={styles.badge}>
            ✦ {isTe ? 'గ్రాండ్ లాంచ్ ఈవెంట్' : 'Grand Launch Event'} ✦
          </div>
          <div className={styles.titleWave}>
            {titleStr.split('').map((ch, i) => (
              <span
                key={i}
                style={{
                  color: i < goldLen ? '#C9A84C' : '#fff',
                  display: 'inline-block',
                  animation: `waveChar 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.055}s`,
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </div>
          <div className={styles.meta}>
            <span>📅 {isTe ? 'ఏప్రిల్ 11, 2026' : '11th April 2026'} &nbsp;|&nbsp; 10:00 AM</span>
            <span>📍 {isTe ? 'పద్మావతి ఐకాన్, విజయవాడ' : 'Padmavathi Icon, Vijayawada'}</span>
            <span>🍽️ {isTe ? 'భోజనం ఉంటుంది' : 'Lunch follows'}</span>
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
        <div className={styles.ctas}>
          <a
            href={`https://wa.me/919948709041?text=${encodeURIComponent(isTe
              ? 'నమస్కారం! ట్రింబక్ ఓక్స్ ఫేజ్ II బ్రోచర్ లాంచ్ (ఏప్రిల్ 11, 2026) పట్ల ఆసక్తిగా ఉన్నాను. వివరాలు పంపగలరు!'
              : "Hi! I'm interested in Trimbak Oaks Phase II Brochure Launch on 11th April 2026. Please share details!")}`}
            target="_blank" rel="noreferrer"
            className={styles.btnGold}
          >
            {isTe ? 'ఆసక్తి నమోదు చేయండి →' : 'Register Interest →'}
          </a>
          <a href="/project/trimbak" className={styles.btnOutline}>
            {isTe ? 'ప్రాజెక్ట్ చూడండి' : 'View Project'}
          </a>
        </div>

        {/* Dismiss */}
        <button
          className={styles.close}
          onClick={() => {
            setDismissed(true)
            localStorage.setItem('trimbak_launch_dismissed', 'true')
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>

      </div>
    </div>
  )
}
