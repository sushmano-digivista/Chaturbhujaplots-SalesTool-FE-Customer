import { createPortal }         from 'react-dom'
import { useEffect, useState }  from 'react'
import { useForm }               from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Download, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useSubmitLead }         from '@/hooks/useData'
import { ACTIVE_PROJECTS }       from '@/constants/projects'
import { BROCHURES }             from '@/constants/brochures'
import { brochureApi }           from '@/api'
import styles from './LeadModal.module.css'

// All brochure PDFs for "Any / Not Sure" download
const ALL_BROCHURE_URLS = [
  { project: 'Anjana Paradise',  url: BROCHURES.anjana  },
  { project: 'Aparna Legacy',    url: BROCHURES.aparna  },
  { project: 'Varaha Virtue',    url: BROCHURES.varaha  },
  { project: 'Trimbak Oaks',     url: BROCHURES.trimbak },
].filter(b => b.url)

export default function LeadModal({ context, onClose, whatsapp }) {
  const isOpen    = !!context
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const submitLead  = useSubmitLead()
  const [submitted, setSubmitted]  = useState(false)
  const [emailSent, setEmailSent]  = useState(false)
  const [waSent,    setWaSent]     = useState(false)
  const [sending,   setSending]    = useState(null) // 'email'|'wa'|null
  const [ctaErrors, setCtaErrors]  = useState({})   // per-button validation msgs

  const selectedProject = watch('project')  || ''
  const enteredEmail    = watch('email')     || ''
  const enteredPhone    = watch('phone')     || ''
  const enteredName     = watch('name')      || ''

  const selectedProjObj = ACTIVE_PROJECTS.find(p => p.name === selectedProject)
  const isAny           = selectedProject === 'Any Project'
  const brochureUrl     = isAny ? null : (BROCHURES[selectedProjObj?.id] || BROCHURES[context?.projectId] || null)

  const clearCtaError = (key) => setCtaErrors(e => ({ ...e, [key]: '' }))

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
    if (!isOpen) { setSubmitted(false); setEmailSent(false); setWaSent(false); setCtaErrors({}); reset() }
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

  // ── Email: requires Name + Email ──────────────────────────────────────────
  const handleEmail = async () => {
    const errs = {}
    if (!enteredName)  errs.email = 'Please enter your name before sending.'
    if (!enteredEmail) errs.email = (errs.email ? errs.email + ' ' : '') + 'Please enter your email address.'
    if (Object.keys(errs).length) { setCtaErrors(errs); return }

    setSending('email')
    clearCtaError('email')
    try {
      await brochureApi.sendEmail({
        email:       enteredEmail,
        name:        enteredName,
        projectId:   selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category,
      })
      setEmailSent(true)
    } catch (err) {
      setCtaErrors(e => ({ ...e, email: err?.response?.data?.message || 'Failed to send email. Please try again.' }))
    } finally { setSending(null) }
  }

  // ── WhatsApp: requires Name + Mobile ─────────────────────────────────────
  const handleWhatsApp = async () => {
    const errs = {}
    if (!enteredName)  errs.wa = 'Please enter your name before sending.'
    if (!enteredPhone) errs.wa = (errs.wa ? errs.wa + ' ' : '') + 'Please enter your mobile number.'
    if (Object.keys(errs).length) { setCtaErrors(errs); return }

    setSending('wa')
    clearCtaError('wa')
    try {
      const res = await brochureApi.sendWhatsApp({
        phone:       enteredPhone,
        name:        enteredName,
        projectId:   selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category,
      })
      if (res.method === 'deeplink' && res.deepLink) window.open(res.deepLink, '_blank')
      setWaSent(true)
    } catch {
      const num  = whatsapp || '918977262683'
      const text = `Hi, I am interested in ${selectedProject || 'Chaturbhuja Properties'} plots. Please share details.`
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank')
      setWaSent(true)
    } finally { setSending(null) }
  }

  // ── Download: requires Project Interest selected ──────────────────────────
  const handleDownload = () => {
    if (!selectedProject) {
      setCtaErrors(e => ({ ...e, download: 'Please select a project to download its brochure.' }))
      return
    }
    clearCtaError('download')
    if (isAny) {
      // Download all available brochures
      ALL_BROCHURE_URLS.forEach(({ url }, i) => {
        setTimeout(() => {
          const a = document.createElement('a')
          a.href = url; a.download = ''; a.target = '_blank'
          document.body.appendChild(a); a.click(); document.body.removeChild(a)
        }, i * 600)
      })
    } else if (brochureUrl) {
      const a = document.createElement('a')
      a.href = brochureUrl; a.download = ''; a.target = '_blank'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    } else {
      setCtaErrors(e => ({ ...e, download: 'Brochure for this project is coming soon.' }))
    }
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

            <div className={styles.modalHeader}>
              <h3 className={styles.title}>{context?.label || 'Get In Touch'}</h3>
              {context?.category && <span className={styles.catTag}>{context.category}</span>}
              <p className={styles.subtitle}>
                Fill in your details — we'll call you back and send the brochure directly.
              </p>
            </div>

            {/* ── Success ── */}
            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✅</div>
                <div className={styles.successTitle}>Thank you!</div>
                <p className={styles.successMsg}>Our team will call you within 30 minutes.</p>
                {(brochureUrl || isAny) && (
                  <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                    <Download size={15} /> {isAny ? 'Download All Brochures' : 'Download Brochure'}
                  </button>
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
                  <label className="form-label">Email <span style={{color:'rgba(0,0,0,0.4)',fontWeight:400}}>(required for Email Brochure)</span></label>
                  <input className="form-input" placeholder="you@example.com"
                    inputMode="email" autoComplete="email"
                    {...register('email', {
                      pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Enter valid email' },
                    })} />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Project Interest <span style={{color:'rgba(0,0,0,0.4)',fontWeight:400}}>(required for Download)</span></label>
                  <select className="form-input" {...register('project')}
                    onChange={e => { clearCtaError('download'); register('project').onChange(e) }}>
                    <option value="">Select a project</option>
                    {ACTIVE_PROJECTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name} — {p.loc}</option>
                    ))}
                    <option value="Any Project">Any / Not Sure Yet — Download All</option>
                  </select>
                  {isAny && (
                    <p className={styles.allBrochuresNote}>
                      📦 {ALL_BROCHURE_URLS.length} brochures will be downloaded
                    </p>
                  )}
                </div>

                {!context?.category && (
                  <div className="form-group">
                    <label className="form-label">Plot Interest</label>
                    <select className="form-input" {...register('category')}>
                      <option value="">Select preference</option>
                      <option>East-Facing</option><option>West-Facing</option>
                      <option>North-Facing</option><option>South-Facing</option>
                      <option>Corner Plots</option><option>30×40 ft</option>
                      <option>33×50 ft</option><option>40×60 ft</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}

                {/* ── CTAs ── */}
                <div className={styles.actions}>

                  {/* 1. Email Brochure */}
                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.emailBtn}
                      onClick={handleEmail} disabled={sending === 'email' || emailSent}>
                      {sending === 'email' ? <Loader2 size={15} className={styles.spin} /> : <Mail size={15} />}
                      {emailSent ? 'Brochure Sent ✓' : 'Email Brochure'}
                    </button>
                    {ctaErrors.email && (
                      <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.email}</p>
                    )}
                  </div>

                  {/* 2. WhatsApp Brochure */}
                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.waBtn}
                      onClick={handleWhatsApp} disabled={sending === 'wa' || waSent}>
                      {sending === 'wa' ? <Loader2 size={15} className={styles.spin} /> : <MessageCircle size={15} />}
                      {waSent ? 'Sent on WhatsApp ✓' : 'WhatsApp Brochure'}
                    </button>
                    {ctaErrors.wa && (
                      <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.wa}</p>
                    )}
                  </div>

                  {/* 3. Download Brochure */}
                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                      <Download size={15} />
                      {isAny ? 'Download All Brochures' : 'Download Brochure'}
                    </button>
                    {ctaErrors.download && (
                      <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.download}</p>
                    )}
                  </div>

                  <div className={styles.divider}><span>or</span></div>

                  {/* 4. Request Callback */}
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
