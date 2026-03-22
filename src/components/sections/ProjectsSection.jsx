import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle, Clock, ArrowRight, Phone } from 'lucide-react'
import styles from './ProjectsSection.module.css'

// ── Project data ──────────────────────────────────────────────────────────────
const PROJECTS = {
  booking: [
    {
      id: 'anjana-paradise',
      name: 'Anjana Paradise',
      tagline: 'Open Plots @ Paritala',
      location: 'Paritala, Krishna District',
      approvals: ['CRDA Approved', 'AP RERA'],
      highlights: ['8 km from Amaravati', 'NH-16 Connectivity', 'World-class Amenities'],
      priceRange: '₹23.9L – ₹48.1L',
      plotsAvailable: 24,
      color: '#C9A84C',
      emoji: '🏛️',
    },
    {
      id: 'trimbak-oaks',
      name: 'Trimbak Oaks',
      tagline: 'Open Plots @ Penamaluru',
      location: 'Penamaluru, Krishna District',
      approvals: ['CRDA Approved'],
      highlights: ['Near Vijayawada', 'Gated Community', 'Vaastu Compliant'],
      priceRange: 'Contact for Pricing',
      plotsAvailable: null,
      color: '#2d8a4e',
      emoji: '🌳',
    },
    {
      id: 'aparna-legacy',
      name: 'Aparna Legacy',
      tagline: 'Open Plots @ Chevitikallu',
      location: 'Chevitikallu, Krishna District',
      approvals: ['DTCP Approved'],
      highlights: ['Prime Location', 'Excellent Connectivity', 'Premium Layouts'],
      priceRange: 'Contact for Pricing',
      plotsAvailable: null,
      color: '#7c5cbf',
      emoji: '✨',
    },
    {
      id: 'varaha-virtue',
      name: 'Varaha Virtue',
      tagline: 'Open Plots @ Pamarru',
      location: 'Pamarru, Krishna District',
      approvals: ['DTCP Approved'],
      highlights: ['Growing Area', 'Investment Opportunity', 'Good Infrastructure'],
      priceRange: 'Contact for Pricing',
      plotsAvailable: null,
      color: '#c0522a',
      emoji: '🏡',
    },
  ],
  completed: [
    {
      id: 'nandana-vihar',
      name: 'Nandana Vihar',
      tagline: 'Open Plots @ Kanumuru',
      location: 'Kanumuru, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '🌿',
    },
    {
      id: 'county',
      name: 'County',
      tagline: 'Open Plots @ Edupugallu',
      location: 'Edupugallu, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '🏘️',
    },
    {
      id: 'pearl',
      name: 'Pearl @ Kankipadu',
      tagline: 'Open Plots @ Kankipadu',
      location: 'Kankipadu, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '💎',
    },
    {
      id: 'empire',
      name: 'Empire',
      tagline: 'Open Plots @ Penamaluru',
      location: 'Penamaluru, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '🏛️',
    },
    {
      id: 'pride',
      name: 'Pride',
      tagline: 'Open Plots @ Nepalli',
      location: 'Nepalli, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '⭐',
    },
    {
      id: 'prime',
      name: 'Prime @ Kankipadu',
      tagline: 'Open Plots @ Kankipadu',
      location: 'Kankipadu, Krishna District',
      highlights: ['Successfully Completed', 'Fully Occupied', 'Happy Customers'],
      emoji: '🌟',
    },
  ],
}

export default function ProjectsSection({ onEnquire, contact }) {
  const [tab, setTab] = useState('booking')

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.badge}>Our Portfolio</div>
          <h2 className={styles.title}>
            Projects by<br />
            <span className={styles.titleHighlight}>Chaturbhuja Properties</span>
          </h2>
          <p className={styles.subtitle}>
            Trusted by 1000+ families across Krishna District with premium plotted developments.
          </p>
        </div>

        {/* ── Stats bar ──────────────────────────────────────────────────────── */}
        <div className={styles.statsBar}>
          {[
            { value: '10+', label: 'Projects Delivered' },
            { value: '1000+', label: 'Happy Families' },
            { value: '15+', label: 'Years Experience' },
            { value: '100%', label: 'DTCP / CRDA Approved' },
          ].map(s => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'booking' ? styles.tabActive : ''}`}
            onClick={() => setTab('booking')}>
            <Clock size={16} />
            Open for Booking
            <span className={styles.tabCount}>{PROJECTS.booking.length}</span>
          </button>
          <button
            className={`${styles.tab} ${tab === 'completed' ? styles.tabActive : ''}`}
            onClick={() => setTab('completed')}>
            <CheckCircle size={16} />
            Completed Projects
            <span className={styles.tabCount}>{PROJECTS.completed.length}</span>
          </button>
        </div>

        {/* ── Booking projects ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === 'booking' && (
            <motion.div key="booking"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className={styles.bookingGrid}>
              {PROJECTS.booking.map((p, i) => (
                <BookingCard key={p.id} project={p} index={i} onEnquire={onEnquire} />
              ))}
            </motion.div>
          )}

          {/* ── Completed projects ─────────────────────────────────────────────── */}
          {tab === 'completed' && (
            <motion.div key="completed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className={styles.completedGrid}>
              {PROJECTS.completed.map((p, i) => (
                <CompletedCard key={p.id} project={p} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Looking for your dream plot? Our team is ready to assist you.
          </p>
          <div className={styles.ctaBtns}>
            <button
              className={styles.ctaPrimary}
              onClick={() => onEnquire({ source: 'CONTACT_FORM', type: 'CALLBACK', label: 'Get Expert Advice' })}>
              Get Expert Advice <ArrowRight size={16} />
            </button>
            {contact?.phone && (
              <a href={`tel:${contact.phone}`} className={styles.ctaCall}>
                <Phone size={16} /> {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ project: p, index, onEnquire }) {
  return (
    <motion.div
      className={styles.bookingCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}>

      {/* Color accent bar */}
      <div className={styles.cardAccent} style={{ background: p.color }} />

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.cardEmoji}>{p.emoji}</span>
          <span className={styles.bookingBadge}>
            <span className={styles.bookingDot} /> Open for Booking
          </span>
        </div>

        <h3 className={styles.cardName}>{p.name}</h3>
        <p className={styles.cardTagline}>{p.tagline}</p>

        <div className={styles.cardLocation}>
          <MapPin size={12} /> {p.location}
        </div>

        <div className={styles.cardApprovals}>
          {p.approvals.map(a => (
            <span key={a} className={styles.approvalBadge}>{a}</span>
          ))}
        </div>

        <ul className={styles.cardHighlights}>
          {p.highlights.map(h => (
            <li key={h}><CheckCircle size={12} /> {h}</li>
          ))}
        </ul>

        <div className={styles.cardFooter}>
          <div>
            <div className={styles.priceLabel}>Starting From</div>
            <div className={styles.priceValue}>{p.priceRange}</div>
          </div>
          <button
            className={styles.cardEnquire}
            style={{ background: p.color }}
            onClick={() => onEnquire({
              source: 'CATEGORY_ENQUIRY',
              label: `Enquire — ${p.name}`,
              category: p.name,
            })}>
            Enquire <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Completed Card ────────────────────────────────────────────────────────────
function CompletedCard({ project: p, index }) {
  return (
    <motion.div
      className={styles.completedCard}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}>

      <div className={styles.completedEmoji}>{p.emoji}</div>
      <div className={styles.completedInfo}>
        <h4 className={styles.completedName}>{p.name}</h4>
        <p className={styles.completedLoc}><MapPin size={11} /> {p.location}</p>
      </div>
      <div className={styles.completedBadge}>
        <CheckCircle size={14} /> Completed
      </div>
    </motion.div>
  )
}
