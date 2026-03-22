import { createPortal } from 'react-dom'
import { useEffect }    from 'react'
import { useForm }      from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { useSubmitLead } from '@/hooks/useData'
import { ACTIVE_PROJECTS } from '@/constants/projects'
import styles from './LeadModal.module.css'

/**
 * context = { source, label, category, plotNumber, type }
 * source values: 'HERO_CTA' | 'CATEGORY_ENQUIRY' | 'CONTACT_FORM' | 'STICKY_BAR' | 'FLOATING_BUTTON'
 */
export default function LeadModal({ context, onClose, whatsapp }) {
  const isOpen = !!context
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const submitLead = useSubmitLead()

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

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
      reset()
      onClose()
    } catch {
      // toast is already shown by useSubmitLead's onError — just reset the form
      reset()
    }
  }

  const openWA = () => {
    const num = whatsapp || '919999999999'
    const cat = context?.category ? ` I am specifically interested in ${context.category}.` : ''
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(`Hi, I am interested in Anjana Paradise plots near Amaravati.${cat} Please share details.`)}`,
      '_blank'
    )
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

            {/* Handle */}
            <div className={styles.handle} />

            {/* Close */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.title}>
                {context?.label || 'Get In Touch'}
              </h3>
              {context?.category && (
                <span className={styles.catTag}>{context.category}</span>
              )}
              <p className={styles.subtitle}>
                Our team will reach out within 30 minutes during business hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Full name"
                  autoComplete="name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <span className="form-error">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+91 XXXXX XXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value:   /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit Indian mobile number',
                    },
                  })}
                />
                {errors.phone && <span className="form-error">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email (optional)</label>
                <input
                  className="form-input"
                  placeholder="you@example.com"
                  inputMode="email"
                  autoComplete="email"
                  {...register('email', {
                    pattern: {
                      value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              {/* Project selection — always shown */}
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

              {/* Plot Interest — shown for generic enquiries */}
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

              <div className={styles.actions}>
                <button
                  type="submit"
                  className="btn btn-green btn-full"
                  disabled={submitLead.isPending}>
                  {submitLead.isPending ? 'Sending…' : 'Request Callback'}
                </button>

                <button type="button" className={styles.waBtn} onClick={openWA}>
                  <MessageCircle size={16} /> Chat on WhatsApp
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
