import { Phone, MessageCircle, Map } from 'lucide-react'
import styles from './Footer.module.css'

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer({ content }) {
  const contact = content?.contact || {}
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Brand */}
        <div>
          <div className={styles.brand}>Anjana <em>Paradise</em></div>
          <p className={styles.tagline}>
            A premium CRDA-approved plotted development by Chaturbhuja Properties &amp; Infra,
            near Amaravati — the new capital of Andhra Pradesh.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>CRDA Approved</span>
            <span className={styles.badge}>LP No: 35/2025</span>
            <span className={styles.badge}>RERA: P06060125894</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h5 className={styles.colTitle}>Quick Links</h5>
          {[['Explore Plots','plots'],['Amenities','amenities'],['Gallery','gallery'],['Location','location'],['Contact','contact']].map(([l,id]) => (
            <button key={id} className={styles.link} onClick={() => scrollTo(id)}>{l}</button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h5 className={styles.colTitle}>Contact</h5>
          {contact.phone    && <a href={`tel:${contact.phone}`}         className={styles.link}>📞 {contact.phone}</a>}
          {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className={styles.link}>💬 WhatsApp</a>}
          {contact.email    && <a href={`mailto:${contact.email}`}      className={styles.link}>✉️ {contact.email}</a>}
          {contact.address  && <span className={styles.link}>📍 {contact.address}</span>}
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2025 Chaturbhuja Properties &amp; Infra. All rights reserved.</span>
        <span>RERA Registered · CRDA Approved</span>
      </div>
    </footer>
  )
}

// ── Sticky Bottom Bar (mobile) ─────────────────────────────────────────────────
export function StickyBar({ contact, onEnquire }) {
  const openWA = () => {
    const num = contact?.whatsapp || '919999999999'
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots.')}`, '_blank')
  }

  return (
    <div className={styles.stickyBar}>
      <a href={`tel:${contact?.phone || '+919999999999'}`} className={styles.sbBtn}>
        <Phone size={20} /><span>Call</span>
      </a>
      <button className={`${styles.sbBtn} ${styles.sbWa}`} onClick={openWA}>
        <MessageCircle size={20} /><span>WhatsApp</span>
      </button>
      <button className={`${styles.sbBtn} ${styles.sbMain}`}
        onClick={() => onEnquire({ source:'STICKY_BAR', label:'Enquire Now' })}>
        <Map size={20} /><span>Enquire</span>
      </button>
    </div>
  )
}

// ── Floating WhatsApp button ───────────────────────────────────────────────────
export function FloatingWA({ contact, onEnquire }) {
  const openWA = () => {
    const num = contact?.whatsapp || '919999999999'
    window.open(`https://wa.me/${num}?text=${encodeURIComponent('Hi, I am interested in Anjana Paradise plots near Amaravati.')}`, '_blank')
    // also track as a lead
    onEnquire({ source:'FLOATING_BUTTON', label:'WhatsApp Float' })
  }

  return (
    <button className={styles.floatWA} onClick={openWA} title="Chat on WhatsApp">
      💬
    </button>
  )
}
