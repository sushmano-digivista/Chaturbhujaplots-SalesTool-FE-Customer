import { createPortal }         from 'react-dom'
import { useEffect, useState }  from 'react'
import { useForm }               from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Download, Mail, Loader2 } from 'lucide-react'
import { useSubmitLead }         from '@/hooks/useData'
import { ACTIVE_PROJECTS }       from '@/constants/projects'
import { BROCHURES }             from '@/constants/brochures'
import { brochureApi }           from '@/api'
import styles from './LeadModal.module.css'

export default function LeadModal({ context, onClose, whatsapp }) {
  const isOpen    = !!context
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const submitLead   = useSubmitLead()
  const [submitted,  setSubmitted]  = useState(false)
  const [emailSent,  setEmailSent]  = useState(false)
  const [waSent,     setWaSent]     = useState(false)
  const [sending,    setSending]    = useState(null) // 'email' | 'wa' | null

  const selectedProject  = watch('project') || ''
  const enteredEmail     = watch('email')    || ''
  const enteredPhone     = watch('phone')    || ''
  const enteredName      = watch('name')     || ''
  const selectedProjObj  = ACTIVE_PROJECTS.find(p => p.name === selectedProject)
  const brochureUrl      = BROCHURES[selectedProjObj?.id] || BROCHURES[context?.projectId] || BROCHURES.general || null

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) { setSubmitted(false); setEmailSent(false); setWaSent(false); reset() }
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
    } catch { reset() }
  }

  const handleEmail = async () => {
    if (!enteredEmail || sending) return
    setSending('email')
    try {
      await brochureApi.sendEmail({
        email:       enteredEmail,
        name:        enteredName,
        projectId:   selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category,
      })
      setEmailSent(true)
    } catch { /* toast shown by axios interceptor */ }
    finally { setSending(null) }
  }

  const handleWhatsApp = async () => {
    if (!enteredPhone || sending) return
    setSending('wa')
    try {
      const res = await brochureApi.sendWhatsApp({
        phone:       enteredPhone,
        name:        enteredName,
        projectId:   selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category,
      })
      if (res.method === 'deeplink' && res.deepLink) {
        window.open(res.deepLink, '_blank')
      }
      setWaSent(true)
    } catch {
      // fallback: open wa.me directly
      const num  = whatsapp || '918977262683'
      const text = `Hi, I am interested in ${selectedProject || 'Chaturbhuja Properties'} plots. Please share details.`
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank')
    }
    finally { setSending(null) }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>

          <motion.div className={styles.sheet}
            initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
            transition={{ type:'spring', damping:28, stiffness:300 }}>

            <div className={styles.handle} />
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.title}>{context?.label || 'Get In Touch'}</h3>
              {context?.category && <span className={styles.catTag}>{context.category}</span>}
              <p className={styles.subtitle}>
                Fill in your details — we'll call you back and send the brochure directly.
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
                    className={styles.downloadBtn}>
                    <Download size={15} /> Download Brochure
                  </a>
                )}
                <button className="btn btn-green btn-full" onClick={onClose} style={{ marginTop:8 }}>
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
                      pattern:  { value:/^[6-9]\d{9}$/, message:'Enter valid 10-digit Indian number' },
                    })} />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email (optional — to receive brochure)</label>
                  <input className="form-input" placeholder="you@example.com"
                    inputMode="email" autoComplete="email"
                    {...register('email', {
                      pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Enter valid email' },
                    })} />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>

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

                {!context?.category && (
                  <div className="form-group">
                    <label className="form-label">Plot Interest</label>
                    <select className="form-input" {...register('category')}>
                      <option value="">Select preference</option>
                      <option>East-Facing</option>
                      <option>West-Facing</option>
                      <option>North-Facing</option>
                      <option>South-Facing</option>
                      <option>Corner Plots</option>
                      <option>30×40 ft</option>
                      <option>33×50 ft</option>
                      <option>40×60 ft</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}

                {/* ── CTAs ── */}
                <div className={styles.actions}>

                  {/* 1. Email */}
                  <button type="button" className={styles.emailBtn}
                    onClick={handleEmail}
                    disabled={!enteredEmail || sending === 'email' || emailSent}
                    title={!enteredEmail ? 'Enter your email above to receive brochure' : ''}>
                    {sending === 'email'
                      ? <Loader2 size={15} className={styles.spin} />
                      : <Mail size={15} />}
                    {emailSent ? 'Brochure Sent ✓' : 'Email Brochure'}
                  </button>

                  {/* 2. WhatsApp */}
                  <button type="button" className={styles.waBtn}
                    onClick={handleWhatsApp}
                    disabled={!enteredPhone || sending === 'wa' || waSent}>
                    {sending === 'wa'
                      ? <Loader2 size={15} className={styles.spin} />
                      : <MessageCircle size={15} />}
                    {waSent ? 'Sent on WhatsApp ✓' : 'WhatsApp Brochure'}
                  </button>

                  {/* 3. Download */}
                  {brochureUrl
                    ? <a href={brochureUrl} download target="_blank" rel="noreferrer"
                        className={styles.downloadBtn}>
                        <Download size={15} /> Download Brochure
                      </a>
                    : <button type="button" className={`${styles.downloadBtn} ${styles.disabled}`} disabled>
                        <Download size={15} /> Download Brochure
                      </button>
                  }

                  {/* Divider */}
                  <div className={styles.divider}><span>or</span></div>

                  {/* 4. Request Callback (primary) */}
                  <button type="submit" className="btn btn-green btn-full"
                    disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Sending…' : 'Request Callback'}
                  </button>
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
