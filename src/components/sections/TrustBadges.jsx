import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef } from 'react'
import { Landmark, FileCheck2, BadgeCheck, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import heroBg from '@/assets/gallery/chaturbhuja/000_All_Projects_Hero.png'

/**
 * TrustBadges v4 — dominant dark certificate band with photo background.
 *
 * v1: too subtle (green gradient).
 * v2: dark green, good but not dominant enough.
 * v3: light cream certificate — was visually 'eaten' by the equally-light
 *     AvailabilityBanner that sits directly below.
 * v4: DARK, RICH, AUTHORITATIVE — with an actual project photo as a
 *     tinted background, giving the section visual weight that dominates
 *     its surroundings rather than being drowned out.
 *
 * Visual recipe:
 *   - Photo of a Chaturbhuja project as a background layer (tinted
 *     dark green to keep text legible)
 *   - Gold border frame (top + bottom) for 'certificate' feel
 *   - Chaturbhuja logo prominently centered, slightly larger
 *   - HUGE (56-88px) gold Cormorant Garamond numerals with glow
 *   - 4 stats sit on translucent dark glass panels — legible over
 *     the photo, premium feel
 *   - Approval seals at bottom with bright gold against the dark
 *
 * Result: Hero (dark) → TrustBadges (DARKER + richer) → Availability
 * (light cream) → Portfolio (cream). TrustBadges is now the visual
 * anchor and the break to the cream half of the page.
 */

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
    { value: 25,   suffix: '+', label: 'సంవత్సరాల',  sub: 'నమ్మకం' },
    { value: 1200, suffix: '+', label: 'కుటుంబాలు',   sub: 'సంతృప్తి' },
    { value: 15,   suffix: '+', label: 'ప్రాజెక్టులు', sub: 'పూర్తి' },
    { value: 100,  suffix: '%', label: 'క్లియర్',      sub: 'టైటిల్' },
  ],
  apcrda: 'ఏపిసిఆర్డేఏ ఆమోదితం',
  rera:   'ఏపి రేరా నమోదితం',
  clear:  '100% క్లియర్ టైటిల్',
}

const EN_STATS = [
  { value: 25,   suffix: '+', label: 'Years of',  sub: 'Proven Trust' },
  { value: 1200, suffix: '+', label: 'Happy',     sub: 'Families Settled' },
  { value: 15,   suffix: '+', label: 'Projects',  sub: 'Delivered' },
  { value: 100,  suffix: '%', label: 'Clear',     sub: 'Title Always' },
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
        position: 'relative',
        padding: 'clamp(52px, 7vw, 80px) 16px clamp(48px, 6vw, 64px)',
        color: '#fff',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* Photo background layer — project imagery tinted with deep-green */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: -2,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) saturate(0.85)',
        }}
      />
      {/* Dark green overlay on top of photo for legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: 'linear-gradient(180deg, rgba(11,40,24,0.85) 0%, rgba(11,40,24,0.92) 100%)',
        }}
      />

      {/* Top + bottom gold framing */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, transparent 0%, #C9A84C 20%, #E8D5A3 50%, #C9A84C 80%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, transparent 0%, #C9A84C 20%, #E8D5A3 50%, #C9A84C 80%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        {/* Brand logo — slightly bigger so it anchors the section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 14 }}
        >
          <img
            src="/chaturbhuja-logo.webp"
            alt="Chaturbhuja Properties & Infra"
            loading="lazy"
            style={{
              height: 68, width: 'auto', margin: '0 auto',
              filter: 'brightness(0) invert(1)',  // white logo against dark bg
            }}
          />
        </motion.div>

        {/* Tag pill */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.15)',
            color: '#E8D5A3',
            border: '1px solid rgba(201,168,76,0.45)',
            padding: '5px 16px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
          }}>
            <ShieldCheck size={13} />
            {isTe ? TE_MAP.tag : 'Our Credentials'}
            <ShieldCheck size={13} />
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 600,
          color: '#fff',
          margin: '0 0 6px',
          lineHeight: 1.15,
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}>
          {isTe ? TE_MAP.headline : (
            <>Andhra Pradesh's most <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>trusted</em> name in real estate</>
          )}
        </h2>
        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.75)',
          margin: '0 0 clamp(32px, 4vw, 44px)',
        }}>
          {isTe ? TE_MAP.tagline : '25 years of proven track record · 1200+ happy families settled'}
        </p>

        {/* The 4 BIG stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          marginBottom: 'clamp(32px, 4vw, 42px)',
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              style={{
                textAlign: 'center',
                padding: 'clamp(20px, 3vw, 30px) 12px',
                background: 'rgba(11,40,24,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: 14,
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              }}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(52px, 8vw, 88px)',
                fontWeight: 700,
                color: '#C9A84C',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textShadow: '0 3px 18px rgba(201,168,76,0.45), 0 0 40px rgba(201,168,76,0.15)',
              }}>
                <AnimatedCount end={s.value} suffix={s.suffix} active={inView} />
              </div>
              <div style={{
                width: 28, height: 2,
                background: '#C9A84C',
                margin: '12px auto 10px',
              }} />
              <div style={{
                fontSize: 14, fontWeight: 700, color: '#fff',
                letterSpacing: 0.3,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.7)',
                fontWeight: 500, marginTop: 2,
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approval seals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {[
            { icon: <Landmark size={16} />,   title: isTe ? TE_MAP.apcrda : 'APCRDA APPROVED',    sub: 'LP No: 35/2025' },
            { icon: <FileCheck2 size={16} />, title: isTe ? TE_MAP.rera   : 'AP RERA REGISTERED', sub: 'P06060125894' },
            { icon: <BadgeCheck size={16} />, title: isTe ? TE_MAP.clear  : '100% CLEAR TITLE',   sub: null },
          ].map((pill, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,168,76,0.12)',
              border: '1.5px solid #C9A84C',
              padding: '9px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: 0.4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <span style={{ color: '#C9A84C' }}>{pill.icon}</span>
              {pill.title}
              {pill.sub && (
                <>
                  <span style={{ opacity: 0.6, fontWeight: 400 }}>·</span>
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
