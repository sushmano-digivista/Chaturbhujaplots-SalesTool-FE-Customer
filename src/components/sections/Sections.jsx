import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView }   from 'react-intersection-observer'
import { Navigation }  from 'lucide-react'
import styles from './Sections.module.css'

// ── Highlights / Why Paritala ─────────────────────────────────────────────────
export function HighlightsSection({ content }) {
  const highlights = (content?.highlights || []).sort((a,b) => a.sortOrder - b.sortOrder)
  return (
    <section className={`section ${styles.hlSec}`} id="highlights">
      <div className="sec-hdr">
        <div className="sec-tag" style={{color:'var(--gold-light)'}}>Why Paritala</div>
        <h2 className="sec-title" style={{color:'#fff'}}>Location <em>Advantages</em></h2>
        <p className="sec-sub" style={{color:'rgba(255,255,255,0.55)'}}>
          Strategically situated on one of AP's most promising growth corridors.
        </p>
      </div>
      <div className={styles.hlGrid}>
        {highlights.map((h, i) => (
          <motion.div key={h.title} className={styles.hlCard}
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay: i*0.07 }}
            whileHover={{ y:-4 }}>
            <div className={styles.hlIcon}>{h.icon}</div>
            <h4 className={styles.hlTitle}>{h.title}</h4>
            <p className={styles.hlDesc}>{h.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Amenities ─────────────────────────────────────────────────────────────────
export function AmenitiesSection({ content }) {
  const [tab, setTab] = useState('INFRA')
  const all       = content?.amenities || []
  const tabs      = ['INFRA', 'LIFESTYLE', 'UTILITIES']
  const tabLabels = { INFRA:'Infrastructure', LIFESTYLE:'Lifestyle', UTILITIES:'Utilities' }
  const items     = all.filter(a => a.tab === tab).sort((a,b) => a.sortOrder - b.sortOrder)

  return (
    <section className="section section-cream" id="amenities">
      <div className="sec-hdr">
        <div className="sec-tag">What We Offer</div>
        <h2 className="sec-title">World-Class <em>Amenities</em></h2>
        <p className="sec-sub">Every detail crafted for a refined, future-ready lifestyle.</p>
      </div>
      <div className={styles.amTabs}>
        {tabs.map(t => (
          <button key={t} className={`${styles.amTab} ${tab===t ? styles.amTabActive : ''}`}
            onClick={() => setTab(t)}>
            {tabLabels[t]}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} className={styles.amGrid}
          initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
          {items.map((item, i) => (
            item.featured
              ? <FeaturedAmenity key={item.label} item={item} delay={i*0.05} />
              : (
                <motion.div key={item.label} className={styles.amItem}
                  initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}
                  whileHover={{borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
                  <div className={styles.amIcon}>{item.icon}</div>
                  <span>{item.label}</span>
                </motion.div>
              )
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function FeaturedAmenity({ item, delay }) {
  return (
    <motion.div className={styles.featCard}
      initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay}}
      whileHover={{borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
      <div className={styles.featIcon}>{item.icon}</div>
      <div>
        <div className={styles.featTitle}>{item.label}</div>
        <div className={styles.featDesc}>{item.featuredDesc}</div>
      </div>
      <span className={styles.featBadge}>Nearby</span>
    </motion.div>
  )
}

// ── Quote / Investment Banner ──────────────────────────────────────────────────
export function QuoteSection({ content, onEnquire }) {
  const q = content?.quote || {}
  return (
    <section className={`section ${styles.quoteSec}`}>
      <motion.div className={styles.quoteInner}
        initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6}}>
        <span className={styles.quoteTag}>Investment Opportunity</span>
        <h2 className={styles.quoteH}>{q.investLine1 || 'Invest ₹2 Today —'}</h2>
        <h2 className={styles.quoteH}>{q.investLine2 || 'Receive ₹20 Tomorrow'}</h2>
        <div className={styles.quoteDivider} />
        <p className={styles.quoteText}>&ldquo;{q.quote || 'If you invest 2 rupees now, in a few years it will be 10 times your investment.'}&rdquo;</p>
        <div className={styles.quoteStats}>
          {(q.stats || [{value:'10×',label:'Expected Return'},{value:'5–7',label:'Years'},{value:'Safe',label:'CRDA + RERA'}])
            .map(s => (
              <div key={s.label} className={styles.quoteStat}>
                <div className={styles.quoteStatNum}>{s.value}</div>
                <div className={styles.quoteStatLabel}>{s.label}</div>
              </div>
            ))}
        </div>
        <button className="btn btn-gold" onClick={() => onEnquire({ source:'HERO_CTA', label:'Secure Plot' })}>
          Secure Your Plot Now →
        </button>
      </motion.div>
    </section>
  )
}

// ── Location ──────────────────────────────────────────────────────────────────
export function LocationSection({ content }) {
  const distances = (content?.distances || []).sort((a,b) => a.sortOrder - b.sortOrder)
  const contact   = content?.contact || {}
  const { ref, inView } = useInView({ triggerOnce:true, threshold:0.25 })

  return (
    <section className="section section-cream" id="location">
      <div className="sec-hdr">
        <div className="sec-tag">Find Us</div>
        <h2 className="sec-title">Location & <em>Connectivity</em></h2>
        <p className="sec-sub">8 km from Amaravati with excellent road, rail and air access.</p>
      </div>

      {/* Map */}
      <div className={styles.mapWrap} ref={ref}>
        {contact.mapEmbedUrl && (
          <iframe src={contact.mapEmbedUrl} className={styles.iframe}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Anjana Paradise Location" />
        )}

        {/* Popup pin */}
        <motion.div className={styles.popup}
          initial={{opacity:0, scale:0.5}} animate={inView ? {opacity:1, scale:1} : {}}
          transition={{delay:0.4, duration:0.5, ease:[0.34,1.56,0.64,1]}}>
          <div className={styles.popupTitle}>📍 Anjana Paradise</div>
          <div className={styles.popupSub}>Paritala, Near Amaravati, AP</div>
          <div className={styles.popupBadges}>
            <span className={styles.badgeGreen}>CRDA Approved</span>
            <span className={styles.badgeBlue}>RERA Registered</span>
          </div>
          <button className={styles.popupBtn}
            onClick={() => window.open(contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh', '_blank')}>
            Open in Maps
          </button>
          <div className={styles.popupArrow} />
        </motion.div>

        {/* Bottom bar */}
        <div className={styles.mapBar}>
          <div className={styles.barLeft}>
            <div className={styles.liveDot} />
            <div>
              <div className={styles.barName}>Anjana Paradise, Paritala</div>
              <div className={styles.barAddr}>{contact.address || 'Krishna District · Andhra Pradesh'}</div>
            </div>
          </div>
          <button className="btn btn-gold btn-sm"
            onClick={() => window.open(contact.mapOpenUrl || 'https://maps.google.com/?q=Paritala,Andhra+Pradesh','_blank')}>
            <Navigation size={14} /> Get Directions
          </button>
        </div>
      </div>

      {/* Distance grid */}
      <div className={styles.distGrid}>
        {distances.map((d, i) => (
          <motion.div key={d.name} className={styles.distCard}
            initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
            transition={{delay:i*0.07}} whileHover={{y:-2, boxShadow:'var(--shadow)'}}>
            <div className={styles.distIcon}>{d.icon}</div>
            <div className={styles.distBody}>
              <div className={styles.distName}>{d.name}</div>
              <div className={styles.distSub}>{d.subtitle}</div>
            </div>
            <div className={styles.distBadge}>{d.distance}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Contact / Lead Capture Section ────────────────────────────────────────────
export function ContactSection({ content, onEnquire }) {
  const contact = content?.contact || {}
  const openWA  = () => {
    const num = contact.whatsapp || '919999999999'
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots near Amaravati.')}`, '_blank')
  }

  return (
    <section className={`section ${styles.contactSec}`} id="contact">
      <div className={styles.contactGrid}>
        <motion.div
          initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.5}}>
          <div className="sec-tag" style={{color:'var(--gold-light)'}}>Get In Touch</div>
          <h2 className="sec-title" style={{color:'#fff'}}>Secure Your <em>Plot Today</em></h2>
          <p style={{color:'rgba(255,255,255,0.62)', fontSize:15, lineHeight:1.75, marginBottom:28}}>
            Our team is available 7 days a week. Call us, WhatsApp or fill the form.
          </p>
          <div className={styles.perks}>
            {['Free site visit with transport','No-obligation consultation','Flexible payment plans','Home loan assistance'].map(p => (
              <div key={p} className={styles.perk}><span className={styles.check}>✓</span>{p}</div>
            ))}
          </div>
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className={styles.callCard}>
              <span style={{fontSize:20}}>📞</span>
              <div>
                <div className={styles.callLabel}>Call Us Directly</div>
                <div className={styles.callNum}>{contact.phone}</div>
              </div>
            </a>
          )}
        </motion.div>

        <motion.div className={styles.ctaBox}
          initial={{opacity:0, x:20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}}>
          <h3 className={styles.ctaTitle}>Choose How to Connect</h3>
          <div className={styles.ctaBtns}>
            <button className="btn btn-green btn-full"
              onClick={() => onEnquire({ source:'CONTACT_FORM', label:'Get Callback', type:'CALLBACK' })}>
              📞 Get Callback
            </button>
            <button className={styles.visitBtn}
              onClick={() => onEnquire({ source:'CONTACT_FORM', label:'Schedule Site Visit', type:'SITE_VISIT' })}>
              🗓️ Schedule Site Visit
            </button>
            <button className={styles.waBtn} onClick={openWA}>
              💬 Chat on WhatsApp
            </button>
          </div>
          <div className={styles.ctaNote}>
            We typically respond within <strong>30 minutes</strong> during business hours (9am–7pm).
          </div>
        </motion.div>
      </div>
    </section>
  )
}
