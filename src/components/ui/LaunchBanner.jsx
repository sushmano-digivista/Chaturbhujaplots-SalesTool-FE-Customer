import { useState, useEffect } from 'react'
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

export default function LaunchBanner({ compact = false }) {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('trimbak_launch_dismissed') === 'true'
  )

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-dismiss after launch date
  if (!timeLeft || dismissed) return null

  return (
    <div className={`${styles.banner} ${compact ? styles.compact : ''}`}>
      <div className={styles.inner}>

        {/* Left — event info */}
        <div className={styles.info}>
          <div className={styles.badge}>{isTe ? 'గ్రాండ్ లాంచ్ ఈవెంట్' : 'Grand Launch Event'}</div>
          <div className={styles.title}>
            {isTe ? 'ట్రింబక్ ఓక్స్' : 'Trimbak Oaks'} <em>Phase II</em> — {isTe ? 'బ్రోచర్ లాంచ్' : 'Brochure Launch'}
          </div>
          <div className={styles.meta}>
            <span>📅 {isTe ? 'ఏప్రిల్ 11, 2026' : '11th April 2026'} &nbsp;|&nbsp; 10:00 AM</span>
            <span>📍 {isTe ? 'చతుర్భుజ మార్కెటింగ్ ఆఫీస్, 5వ అంతస్తు' : 'Chaturbhuja Marketing Office, 5th Floor'}</span>
            <span>🍽️ {isTe ? 'భోజనం ఉంటుంది' : 'Lunch follows'}</span>
          </div>
        </div>

        {/* Center — countdown */}
        <div className={styles.countdown}>
          {[
            { val: timeLeft.days,  label: isTe ? 'రోజులు' : 'Days'  },
            { val: timeLeft.hours, label: isTe ? 'గంటలు' : 'Hours' },
            { val: timeLeft.mins,  label: isTe ? 'నిమిషాలు' : 'Mins'  },
            { val: timeLeft.secs,  label: isTe ? 'సెకన్లు' : 'Secs'  },
          ].map((item, i) => (
            <div key={item.label} className={styles.cdWrap}>
              {i > 0 && <div className={styles.colon}>:</div>}
              <div className={styles.cdBox}>
                <div className={styles.cdNum}>{pad(item.val)}</div>
                <div className={styles.cdLabel}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — CTAs */}
        <div className={styles.ctas}>
          <a
            href={`https://wa.me/919948709041?text=${encodeURIComponent(isTe ? 'నమస్కారం! ట్రింబక్ ఓక్స్ ఫేజ్ II బ్రోచర్ లాంచ్ (ఏప్రిల్ 11, 2026) పట్ల ఆసక్తిగా ఉన్నాను. వివరాలు పంపగలరు!' : "Hi! I'm interested in Trimbak Oaks Phase II Brochure Launch on 11th April 2026. Please share details!")}`}
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
