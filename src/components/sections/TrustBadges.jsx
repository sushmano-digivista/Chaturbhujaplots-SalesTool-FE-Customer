import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef } from 'react'
import { Landmark, FileCheck2, BadgeCheck, Shield } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * TrustBadges v3 — premium cream-background "trust certificate" strip.
 *
 * v1: too subtle.
 * v2: dark green with big numbers — better, but still felt similar to Hero.
 * v3: LIGHT background with brand logo & ornate gold frame — acts as a
 *     strong visual break between the dark Hero and the cream Availability
 *     banner, catching the eye like a certificate of credibility.
 *
 * Changes vs v2:
 *   - Cream background with subtle gold watermark pattern
 *   - Chaturbhuja brand logo prominently placed at top-center
 *   - Ornate top + bottom gold framing lines
 *   - Deep-green numbers on cream — maximum contrast
 *   - Approval seals (APCRDA / RERA / Clear Title) on certificate-style
 *     gold-outlined chips at the bottom
 *   - Stats also get an icon above each number for quick scan
 */

// Lightweight animated counter — runs only once on first viewport entry
function AnimatedCount({ end, duration = 1800, suffix = '', active }) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    if (!active) return
    let start
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [end, duration, active])
  return <>{count}{suffix}</>
}

const TE_MAP = {
  tag:      'మా ఆధారాలు',
  headline: 'ఆంధ్రప్రదేశ్‌లో విశ్వసనీయ పేరు',
  tagline:  '25 సంవత్సరాల నిరూపితమైన ట్రాక్ రికార్డ్ · 1200+ సంతృప్తికర కుటుంబాలు',
  stats: [
    { value: 25,   suffix: '+', label: 'సంవత్సరాల',   sub: 'నమ్మకం' },
    { value: 1200, suffix: '+', label: 'కుటుంబాలు',    sub: 'సంతృప్తి' },
    { value: 15,   suffix: '+', label: 'ప్రాజెక్టులు',  sub: 'పూర్తి' },
    { value: 100,  suffix: '%', label: 'క్లియర్',       sub: 'టైటిల్' },
  ],
  apcrda: 'ఏపిసిఆర్డేఏ ఆమోదితం',
  rera:   'ఏపి రేరా నమోదితం',
  clear:  '100% క్లియర్ టైటిల్',
}

const EN_STATS = [
  { value: 25,   suffix: '+', label: 'Years of',  sub: 'Proven Trust' },
  { value: 1200, suffix: '+', label: 'Happy',     sub: 'Families Settled' },
  { value: 15,   suffix: '+', label: 'Projects',  sub: 'Successfully Delivered' },
  { value: 100,  suffix: '%', label: 'Clear',     sub: 'Title on Every Plot' },
]

export default function TrustBadges() {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 })
  const stats = isTe ? TE_MAP.stats : EN_STATS

  return (
    <section
      ref={ref}
      aria-label="Chaturbhuja trust signals"
      style={{
        background: '#FDFAF4',
        padding: 'clamp(44px, 6vw, 72px) 16px clamp(40px, 5vw, 56px)',
        position: 'relative',
        overflow: 'hidden',
        // Subtle diagonal watermark pattern for visual texture
        backgroundImage: `
          linear-gradient(135deg, rgba(201,168,76,0.04) 25%, transparent 25%),
          linear-gradient(225deg, rgba(201,168,76,0.04) 25%, transparent 25%),
          linear-gradient(45deg,  rgba(201,168,76,0.04) 25%, transparent 25%),
          linear-gradient(315deg, rgba(201,168,76,0.04) 25%, transparent 25%)
        `,
        backgroundPosition: '16px 0, 16px 0, 0 0, 0 0',
        backgroundSize: '32px 32px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#FDFAF4',
      }}
    >
      {/* Top ornate gold framing line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 6,
        background: 'linear-gradient(90deg, #1E4D2B 0%, #C9A84C 50%, #1E4D2B 100%)',
      }} />
      {/* Bottom ornate gold framing line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
        background: 'linear-gradient(90deg, #1E4D2B 0%, #C9A84C 50%, #1E4D2B 100%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 10 }}
        >
          <img
            src="/chaturbhuja-logo.webp"
            alt="Chaturbhuja Properties & Infra"
            loading="lazy"
            style={{ height: 56, width: 'auto', margin: '0 auto' }}
          />
        </motion.div>

        {/* Tag */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(30,77,43,0.08)',
            color: 'var(--green)',
            padding: '4px 14px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
          }}>
            <Shield size={12} />
            {isTe ? TE_MAP.tag : 'Our Credentials'}
            <Shield size={12} />
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(26px, 3.6vw, 38px)',
          fontWeight: 600,
          color: 'var(--green)',
          margin: '0 0 4px',
          lineHeight: 1.15,
        }}>
          {isTe ? TE_MAP.headline : (
            <>Andhra Pradesh's most <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>trusted</em> name in real estate</>
          )}
        </h2>
        <p style={{
          fontSize: 14, color: 'var(--text-mid)',
          margin: '0 0 clamp(28px, 4vw, 42px)',
        }}>
          {isTe ? TE_MAP.tagline : '25 years of proven track record · 1200+ happy families settled'}
        </p>

        {/* The 4 big stats — horizontal row with divider lines */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 0,
          marginBottom: 'clamp(30px, 4vw, 40px)',
          border: '1.5px solid rgba(201,168,76,0.35)',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#fff',
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              style={{
                textAlign: 'center',
                padding: 'clamp(20px, 3vw, 28px) 12px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(201,168,76,0.22)',
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(44px, 6.5vw, 72px)',
                fontWeight: 700,
                color: 'var(--green)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                <AnimatedCount end={s.value} suffix={s.suffix} active={inView} />
              </div>
              <div style={{
                width: 24, height: 2,
                background: '#C9A84C',
                margin: '10px auto 8px',
              }} />
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--text-dark)',
                letterSpacing: 0.3,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--text-mid)',
                fontWeight: 500,
                marginTop: 2,
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approval certificate pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {[
            { icon: <Landmark size={16} />,    title: isTe ? TE_MAP.apcrda : 'APCRDA APPROVED',      sub: 'LP No: 35/2025' },
            { icon: <FileCheck2 size={16} />,  title: isTe ? TE_MAP.rera   : 'AP RERA REGISTERED', sub: 'P06060125894' },
            { icon: <BadgeCheck size={16} />,  title: isTe ? TE_MAP.clear  : '100% CLEAR TITLE',    sub: null },
          ].map((pill, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff',
              border: '1.5px solid #C9A84C',
              boxShadow: '0 2px 6px rgba(201,168,76,0.2)',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 12, fontWeight: 700,
              color: 'var(--green)',
              letterSpacing: 0.3,
            }}>
              <span style={{ color: '#C9A84C' }}>{pill.icon}</span>
              {pill.title}
              {pill.sub && (
                <>
                  <span style={{ opacity: 0.4, fontWeight: 400 }}>·</span>
                  <span style={{ color: '#C9A84C', fontWeight: 700 }}>{pill.sub}</span>
                </>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
