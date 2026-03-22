import { createPortal }  from 'react-dom'
import { useEffect, useState } from 'react'
import { useForm }       from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Download, Mail } from 'lucide-react'
import { useSubmitLead } from '@/hooks/useData'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import { BROCHURES } from '@/constants/brochures'
import styles from './LeadModal.module.css'

/**
 * context = { source, label, category, plotNumber, type, projectId }
 */
export default function LeadModal({ context, onClose, whatsapp }) {
  const isOpen = !!context
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const submitLead   = useSubmitLead()
  const [submitted, setSubmitted] = useState(false)

  const selectedProject = watch('project') || ''
  // Derive project ID from selected project name
  const selectedProjObj = ACTIVE_PROJECTS.find(p => p.name === selectedProject)
  const brochureUrl = BROCHURES[selectedProjObj?.id] || BROCHURES[context?.projectId] || BROCHURES.general || null

  // Build WhatsApp message
  const buildWAText = (data) => {
    const proj = data?.project ? ` I am interested in ${data.project}.` : ''
    const plot = data?.category ? ` Plot preference: ${data.category}.` : ''
    return `Hi, I am interested in Chaturbhuja Properties plots near Amaravati.${proj}${plot} Please share details.`
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) { setSubmitted(false); reset() }
  }, [isOpen])

  const onSubmit = async data => {
    try {
      await submitLead.mutateAsync({
        name:             data.name,
        phone:            data.phone,
        email:            data.email || undefined,
        source:           context?.source || 'CONTACT_FORM',
        categoryInterest: context?.category || data.category || undefined,
        projectInterest:  data.project || undefined,
      })
      setSubmitted(true)
      reset()
    } catch {
      reset()
    }
  }

  const openWA = (formData) => {
    const num = whatsapp || '918977262683'
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(buildWAText(formData))}`,
      '_blank'
    )
  }

  const sendByEmail = (email, formData) => {
    if (!brochureUrl) return
    const subject = encodeURIComponent('Chaturbhuja Properties — Brochure Request')
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the brochure for ${formData?.project || 'our projects'} at the link below:\n\nhttps://chaturbhuja.in${brochureUrl}\n\nRegards,\nChaturbhuja Properties & Infra`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>

          <motion.div className={styles.sheet}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}>

            <div className={styles.handle} />
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.title}>{context?.label || 'Get In Touch'}</h3>
              {context?.category && <span className={styles.catTag}>{context.category}</span>}
              <p className={styles.subtitle}>
                Our team will reach out within 30 minutes during business hours.
              </p>
            </div>

            {/* Success state */}
            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✅</div>
                <div className={styles.successTitle}>Thank you!</div>
                <p className={styles.successMsg}>Our team will call you within 30 minutes.</p>
                {brochureUrl && (
                  <a href={brochureUrl} download target="_blank" rel="noreferrer"
                    className={`btn btn-gold btn-full ${styles.downloadBtn}`}>
                    <Download size={16} /> Download Brochure
                  </a>
                )}
                <button className={`btn btn-green btn-full`} onClick={onClose}
                  style={{ marginTop: 10 }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Full name" autoComplete="name"
                    {...register('name', { required: 'Name is required' })} />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 XXXXX XXXXX" inputMode="tel" autoComplete="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern:  { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                    })} />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input className="form-input" placeholder="you@example.com"
                    inputMode="email" autoComplete="email"
                    {...register('email', {
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                    })} />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>

                {/* Project Interest */}
                <div className="form-group">
                  <label className="form-label">Project Interest</label>
                  <select className="form-input" {...register('project')}>
                    <option value="">Select a project</option>
                    {ACTIVE_PROJECTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name} — {p.loc}</option>
                    ))}
                    <option value="Any Project">Any / Not Sure Yet</option>
                  </select>
                </div>

                {/* Plot Interest */}
                {!context?.category && (
                  <div className="form-group">
                    <label className="form-label">Plot Interest</label>
                    <select className="form-input" {...register('category')}>
                      <option value="">Select preference</option>
                      <option value="East-Facing">East-Facing</option>
                      <option value="West-Facing">West-Facing</option>
                      <option value="North-Facing">North-Facing</option>
                      <option value="South-Facing">South-Facing</option>
                      <option value="Corner Plots">Corner Plots</option>
                      <option value="30×40 ft">30×40 ft</option>
                      <option value="33×50 ft">33×50 ft</option>
                      <option value="40×60 ft">40×60 ft</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}

                {/* CTAs */}
                <div className={styles.actions}>
                  {/* Primary: Request Callback */}
                  <button type="submit" className={`btn btn-green btn-full`}
                    disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Sending…' : 'Request Callback'}
                  </button>

                  {/* Download Brochure */}
                  {brochureUrl && (
                    <a href={brochureUrl} download target="_blank" rel="noreferrer"
                      className={`btn btn-full ${styles.downloadBtn}`}>
                      <Download size={16} /> Download Brochure
                    </a>
                  )}

                  {/* WhatsApp brochure */}
                  <button type="button" className={styles.waBtn} onClick={() => openWA(watch())}>
                    <MessageCircle size={16} /> WhatsApp Brochure
                  </button>

                  {/* Email brochure — shown only if email entered */}
                  {watch('email') && brochureUrl && (
                    <button type="button" className={styles.emailBtn}
                      onClick={() => sendByEmail(watch('email'), watch())}>
                      <Mail size={16} /> Email Brochure
                    </button>
                  )}
                </div>
              </form>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
