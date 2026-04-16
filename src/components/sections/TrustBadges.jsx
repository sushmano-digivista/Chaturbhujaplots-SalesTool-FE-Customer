import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef } from 'react'
import { Landmark, FileCheck2, BadgeCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * TrustBadges — big, attention-grabbing credibility stats strip
 * between Hero and AvailabilityBanner.
 *
 * v2 — redesigned for punch: the first version was too subtle and
 * visitors were scrolling past without noticing it. This version
 * uses:
 *   - Huge 56-72px animated count-up numbers (impossible to miss)
 *   - Gold accent frame & top "WHY CHATURBHUJA" pill tag
 *   - Stronger green→black vignette background
 *   - Separate approval pills (APCRDA / RERA) at the bottom
 *   - Staggered scroll-in animation for each stat
 */

// Lightweight animated counter — runs only once on first viewport entry
function AnimatedCount({ end, duration = 1600, suffix = '', active }) {
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
  tag:      'మీరు ఎందుకు నమ్మవచ్చు',
  headline: 'ఆంధ్రప్రదేశ్‌లో విశ్వసనీయ రియల్ ఎస్టేట్ పేరు',
  tagline:  'నిరూపితమైన ట్రాక్ రికార్డ్ · పూర్తి ఆమోదాలు · సంతృప్తికర కుటుంబాలు',
  stats: [
    { value: 25,   suffix: '+', label: 'సంవత్సరాల',   sub: 'నమ్మకం' },
    { value: 1200, suffix: '+', label: 'కుటుంబాలు',    sub: 'సంతృప్తి' },
    { value: 15,   suffix: '+', label: 'ప్రాజెక్టులు',  sub: 'పూర్తి' },
    { value: 100,  suffix: '%', label: 'క్లియర్',       sub: 'టైటిల్' },
  ],
  apcrda: 'ఏపిసిఆర్డేఏ ఆమోదితం',
  rera:   'ఏపి రేరా నమోదితం',
}

const EN_STATS = [
  { value: 25,   suffix: '+', label: 'Years of',  sub: 'Trust' },
  { value: 1200, suffix: '+', label: 'Happy',     sub: 'Families' },
  { value: 15,   suffix: '+', label: 'Projects',  sub: 'Delivered' },
  { value: 100,  suffix: '%', label: 'Clear',     sub: 'Title' },
]

export default function TrustBadges() {
  const { language } = useLanguage()
  const isTe = language === 'te'
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const stats = isTe ? TE_MAP.stats : EN_STATS

  return (
    <section
      ref={ref}
      aria-label="Chaturbhuja trust signals"
      style={{
        // Deep green → near-black vignette for max contrast against
        // cream sections above/below
        background: 'radial-gradient(ellipse at center top, #2D6E40 0%, #0B2818 80%)',
        padding: 'clamp(40px, 6vw, 64px) 16px clamp(36px, 5vw, 56px)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top & bottom gold stripes for strong visual framing */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Section tag pill */}
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(201,168,76,0.18)',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#E8D5A3',
            padding: '5px 14px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            ★ {isTe ? TE_MAP.tag : 'Why Chaturbhuja'} ★
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(24px, 3.4vw, 36px)',
          fontWeight: 600,
          color: '#C9A84C',
          textAlign: 'center',
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}>
          {isTe ? TE_MAP.headline : (
            <>Andhra Pradesh's most <em style={{ color: '#fff', fontStyle: 'italic' }}>trusted</em> real-estate name</>
          )}
        </h2>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.7)',
          textAlign: 'center', margin: '0 0 clamp(28px, 4vw, 40px)',
        }}>
          {isTe ? TE_MAP.tagline : 'Proven track record · Full approvals · Happy families'}
        </p>

        {/* The 4 big stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(12px, 2vw, 24px)',
          marginBottom: 'clamp(26px, 3vw, 34px)',
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              style={{
                textAlign: 'center',
                padding: 'clamp(14px, 2vw, 20px) 8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.22)',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(40px, 6vw, 60px)',
                fontWeight: 700,
                color: '#C9A84C',
                lineHeight: 1,
                textShadow: '0 2px 8px rgba(201,168,76,0.25)',
              }}>
                <AnimatedCount end={s.value} suffix={s.suffix} active={inView} />
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#fff',
                marginTop: 8, letterSpacing: 0.3,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.7)',
                fontWeight: 500,
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approval pills (APCRDA + RERA + Clear Title) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(201,168,76,0.4)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12, fontWeight: 600,
          }}>
            <Landmark size={16} style={{ color: '#C9A84C' }} />
            <span>{isTe ? TE_MAP.apcrda : 'APCRDA APPROVED'}</span>
            <span style={{ opacity: 0.6, fontWeight: 400 }}>·</span>
            <span style={{ color: '#C9A84C' }}>LP No: 35/2025</span>
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(201,168,76,0.4)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12, fontWeight: 600,
          }}>
            <FileCheck2 size={16} style={{ color: '#C9A84C' }} />
            <span>{isTe ? TE_MAP.rera : 'AP RERA REGISTERED'}</span>
            <span style={{ opacity: 0.6, fontWeight: 400 }}>·</span>
            <span style={{ color: '#C9A84C' }}>P06060125894</span>
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(201,168,76,0.4)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12, fontWeight: 600,
          }}>
            <BadgeCheck size={16} style={{ color: '#C9A84C' }} />
            <span>{isTe ? '100% క్లియర్ టైటిల్' : '100% CLEAR TITLE'}</span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
