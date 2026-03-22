import styles from './Footer.module.css'

/**
 * Footer — site-wide footer with brand info, quick links and contact details.
 * Props:
 *   content  { contact, ... }
 *
 * Related layout components (split into their own files):
 *   StickyBar  → ./StickyBar.jsx
 *   FloatingWA → ./FloatingWA.jsx
 */
export default function Footer({ content }) {
  const contact = content?.contact || {}
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

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
          {[
            ['Explore Plots', 'plots'],
            ['Amenities',     'amenities'],
            ['Location',      'location'],
            ['Contact',       'contact'],
          ].map(([label, id]) => (
            <button key={id} className={styles.link} onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h5 className={styles.colTitle}>Contact</h5>
          {contact.phone    && <a href={`tel:${contact.phone}`}                              className={styles.link}>📞 {contact.phone}</a>}
          {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className={styles.link}>💬 WhatsApp</a>}
          {contact.email    && <a href={`mailto:${contact.email}`}                           className={styles.link}>✉️ {contact.email}</a>}
          {contact.address  && <span className={styles.link}>📍 {contact.address}</span>}
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Chaturbhuja Properties &amp; Infra. All rights reserved.</span>
        <span>RERA Registered · CRDA Approved</span>
      </div>
    </footer>
  )
}
