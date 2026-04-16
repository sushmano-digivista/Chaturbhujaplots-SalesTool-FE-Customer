import { Landmark, FileCheck2, Award, Users, Building2, BadgeCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * TrustBadges — credibility stripe below Hero.
 *
 * Why this exists:
 *   The homepage now has urgency (AvailabilityBanner: "Only N plots left"),
 *   but urgency WITHOUT trust backfires — it reads as sleazy high-pressure.
 *   Pairing Trust + Scarcity is the proven combo: "This place is legit AND
 *   I need to act fast." Trust goes ABOVE scarcity so the visitor's brain
 *   processes credibility first.
 *
 * Design:
 *   - Horizontal strip of 6 signal cards (2 cols mobile, 3 cols tablet, 6 cols desktop)
 *   - Each card: lucide icon + headline + sub-line
 *   - Subtle gold accent on icons; cards have soft green-tinted borders
 *   - Single-row section, ~120-180px tall on desktop, stacks cleanly on mobile
 *
 * Content is kept factual & specific (LP number, RERA number, year count,
 * family count) so the claims feel verifiable, not fluffy marketing copy.
 */

const TE_MAP = {
  title: 'మీరు ఎందుకు నమ్మవచ్చు',
  subtitle: 'నిరూపితమైన ట్రాక్ రికార్డ్ · అన్ని ఆమోదాలు · 1200+ సంతృప్తికర కుటుంబాలు',
}

export default function TrustBadges() {
  const { language } = useLanguage()
  const isTe = language === 'te'

  const badges = [
    {
      icon: <Landmark size={22} />,
      title: isTe ? 'ఏపిసిఆర్డేఏ ఆమోదం' : 'APCRDA Approved',
      sub:   isTe ? 'LP నం: 35/2025' : 'LP No: 35/2025',
    },
    {
      icon: <FileCheck2 size={22} />,
      title: isTe ? 'ఏపి రేరా నమోదితం' : 'AP RERA Registered',
      sub:   'P06060125894',
    },
    {
      icon: <Award size={22} />,
      title: isTe ? '25+ సంవత్సరాల నమ్మకం' : '25+ Years of Trust',
      sub:   isTe ? 'రియల్ ఎస్టేట్‌లో' : 'In real estate',
    },
    {
      icon: <Users size={22} />,
      title: '1200+',
      sub:   isTe ? 'సంతృప్తికర కుటుంబాలు' : 'Happy Families Settled',
    },
    {
      icon: <Building2 size={22} />,
      title: '15+',
      sub:   isTe ? 'పూర్తి ప్రాజెక్టులు' : 'Projects Delivered',
    },
    {
      icon: <BadgeCheck size={22} />,
      title: isTe ? '100% క్లియర్ టైటిల్' : '100% Clear Title',
      sub:   isTe ? 'అన్ని ప్లాట్లపై' : 'On every plot',
    },
  ]

  return (
    <section
      aria-label="Chaturbhuja trust signals"
      style={{
        background: 'linear-gradient(180deg, #1E4D2B 0%, #2D6E40 100%)',
        padding: '22px 16px 26px',
        color: '#fff',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(18px, 2.4vw, 22px)',
            fontWeight: 600,
            margin: 0,
            color: '#C9A84C',
            letterSpacing: 0.2,
          }}>
            {isTe ? TE_MAP.title : 'Why You Can Trust Us'}
          </h2>
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0',
          }}>
            {isTe ? TE_MAP.subtitle : 'Proven track record · All approvals · 1200+ happy families'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}>
          {badges.map((b, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 10,
                padding: '10px 12px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                flexShrink: 0,
                width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(201,168,76,0.18)',
                color: '#C9A84C',
                borderRadius: '50%',
              }}>
                {b.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {b.title}
                </div>
                <div style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.2, marginTop: 1,
                }}>
                  {b.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
