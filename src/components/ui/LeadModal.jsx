import { createPortal }         from 'react-dom'
import { useEffect, useState }  from 'react'
import { useForm }               from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Download, Mail, Loader2, AlertCircle, Calendar } from 'lucide-react'
import { useSubmitLead }         from '@/hooks/useData'
import { ACTIVE_PROJECTS }       from '@/constants/projects'
import { BROCHURES }             from '@/constants/brochures'
import { brochureApi, siteVisitApi } from '@/api'
import { openWhatsApp, safeOpenExternal } from '@/utils/security'
import { DEFAULT_WA_NUMBER }     from '@/constants/config'
import styles from './LeadModal.module.css'

const ALL_BROCHURE_URLS = [
  { project: 'Anjana Paradise', url: BROCHURES.anjana  },
  { project: 'Aparna Legacy',   url: BROCHURES.aparna  },
  { project: 'Varaha Virtue',   url: BROCHURES.varaha  },
  { project: 'Trimbak Oaks',    url: BROCHURES.trimbak },
].filter(b => b.url)

const isSiteVisit  = ctx => ctx?.type === 'SITE_VISIT'
const isPlotEnquiry = ctx => ctx?.type === 'PLOT_ENQUIRY'
const isCallback    = ctx => ctx?.type === 'CALLBACK'

export default function LeadModal({ context, onClose, whatsapp }) {
  const isOpen    = !!context
  const isSV      = isSiteVisit(context)
  const isPE      = isPlotEnquiry(context)
  const isCB      = isCallback(context)
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const submitLead  = useSubmitLead()
  const [submitted, setSubmitted]  = useState(false)
  const [emailSent, setEmailSent]  = useState(false)
  const [waSent,    setWaSent]     = useState(false)
  const [sending,   setSending]    = useState(null)
  const [ctaErrors, setCtaErrors]  = useState({})

  const selectedProject = watch('project')  || ''
  const enteredEmail    = watch('email')     || ''
  const enteredPhone    = watch('phone')     || ''
  const enteredName     = watch('name')      || ''
  const enteredDate     = watch('date')      || ''

  const selectedProjObj = ACTIVE_PROJECTS.find(p => p.name === selectedProject)
  const isAny           = selectedProject === 'Any Project'
  const brochureUrl     = isAny ? null : (BROCHURES[selectedProjObj?.id] || BROCHURES[context?.projectId] || null)

  const clearCtaError = key => setCtaErrors(e => ({ ...e, [key]: '' }))

  // Today's date as min for date picker
  const todayStr = new Date().toISOString().split('T')[0]

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
  }, [isOpen, reset])

  // ── Site Visit submit ────────────────────────────────────────────────────
  const onSiteVisitSubmit = async data => {
    try {
      await siteVisitApi.book({
        name:    data.name,
        phone:   data.phone,
        email:   data.email || undefined,
        project: data.project || context?.category || undefined,
        date:    data.date,
      })
      // Also save lead to DB
      await submitLead.mutateAsync({
        name: data.name, phone: data.phone, email: data.email || undefined,
        source: 'SITE_VISIT_SCHEDULED', categoryInterest: data.project || context?.category || undefined,
      }).catch(() => {})
      setSubmitted(true)
      reset()
    } catch (err) {
      setCtaErrors({ submit: err?.response?.data?.message || 'Booking failed. Please try again.' })
    }
  }

  // ── Brochure: Request Callback submit ────────────────────────────────────
  const onBrochureSubmit = async data => {
    try {
      await submitLead.mutateAsync({
        name: data.name, phone: data.phone, email: data.email || undefined,
        source: context?.source || 'CONTACT_FORM',
        categoryInterest: context?.category || data.category || undefined,
        projectInterest:  data.project || undefined,
      })
      setSubmitted(true)
      reset()
    } catch (err) {
      // Lead mutation failed — reset form so user can retry; toast is shown by useSubmitLead.onError
      if (import.meta.env.DEV) console.warn('[LeadModal] onBrochureSubmit error:', err)
      reset()
    }
  }

  // ── Email Brochure ───────────────────────────────────────────────────────
  const handleEmail = async () => {
    const errs = {}
    if (!enteredName)  errs.email = 'Please enter your name.'
    if (!enteredEmail) errs.email = (errs.email ? errs.email + ' ' : '') + 'Please enter your email address.'
    if (Object.keys(errs).length) { setCtaErrors(errs); return }
    setSending('email'); clearCtaError('email')
    try {
      await brochureApi.sendEmail({ email: enteredEmail, name: enteredName,
        projectId: selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category })
      setEmailSent(true)
    } catch (err) {
      setCtaErrors(e => ({ ...e, email: err?.response?.data?.message || 'Failed to send email.' }))
    } finally { setSending(null) }
  }

  // ── WhatsApp Brochure ────────────────────────────────────────────────────
  const handleWhatsApp = async () => {
    const errs = {}
    if (!enteredName)  errs.wa = 'Please enter your name.'
    if (!enteredPhone) errs.wa = (errs.wa ? errs.wa + ' ' : '') + 'Please enter your mobile number.'
    if (Object.keys(errs).length) { setCtaErrors(errs); return }
    setSending('wa'); clearCtaError('wa')
    try {
      const res = await brochureApi.sendWhatsApp({ phone: enteredPhone, name: enteredName,
        projectId: selectedProjObj?.id || context?.projectId,
        projectName: selectedProject || context?.category })
      // Only follow deepLink when it is a known-safe WhatsApp URL (Checkmarx CWE-601)
      if (res.method === 'deeplink' && res.deepLink) safeOpenExternal(res.deepLink)
      setWaSent(true)
    } catch {
      const num  = whatsapp || DEFAULT_WA_NUMBER
      const text = `Hi, I am interested in ${selectedProject || 'Chaturbhuja Properties'} plots. Please share details.`
      openWhatsApp(num, text)
      setWaSent(true)
    } finally { setSending(null) }
  }

  // ── Download Brochure ────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!selectedProject) {
      setCtaErrors(e => ({ ...e, download: 'Please select a project first.' })); return
    }
    clearCtaError('download')
    const urls = isAny ? ALL_BROCHURE_URLS.map(b => b.url) : (brochureUrl ? [brochureUrl] : [])
    if (!urls.length) { setCtaErrors(e => ({ ...e, download: 'Brochure coming soon.' })); return }
    urls.forEach((url, i) => setTimeout(() => {
      const a = document.createElement('a')
      a.href = url; a.download = ''; a.target = '_blank'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    }, i * 600))
  }

  // ── Shared form fields ───────────────────────────────────────────────────
  const renderCommonFields = () => (
    <>
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
        <label className="form-label">
          Email
          <span style={{ color:'rgba(0,0,0,0.4)', fontWeight:400, marginLeft:6 }}>
            {isSV ? '(optional — confirmation will be sent)' : '(required for Email Brochure)'}
          </span>
        </label>
        <input className="form-input" placeholder="you@example.com"
          inputMode="email" autoComplete="email"
          {...register('email', {
            pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Enter valid email' },
          })} />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">
          Project Interest
          {!isSV && <span style={{ color:'rgba(0,0,0,0.4)', fontWeight:400, marginLeft:6 }}>(required for Download)</span>}
        </label>
        <select className="form-input" {...register('project')}
          onChange={e => { clearCtaError('download'); register('project').onChange(e) }}>
          <option value="">Select a project</option>
          {ACTIVE_PROJECTS.map(p => (
            <option key={p.id} value={p.name}>{p.name} — {p.loc}</option>
          ))}
          <option value="Any Project">{isSV ? 'Any / Not Sure Yet' : 'Any / Not Sure Yet — Download All'}</option>
        </select>
        {!isSV && isAny && (
          <p className={styles.allBrochuresNote}>📦 {ALL_BROCHURE_URLS.length} brochures will be downloaded</p>
        )}
      </div>
    </>
  )

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>

          <motion.div className={styles.sheet}
            initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
            transition={{ type:'spring', damping:28, stiffness:300 }}>

            {/* Sticky header — always visible, never scrolls away */}
            <div className={styles.stickyHeader}>
              <div className={styles.handle} />
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className={styles.scrollBody}>
            <div className={styles.modalHeader}>
              <h3 className={styles.title}>{context?.label || 'Get In Touch'}</h3>
              {context?.category && <span className={styles.catTag}>{context.category}</span>}
              <p className={styles.subtitle}>
                {isSV
                  ? 'Book your free site visit — our executive will welcome you on the day and help you choose the right plot.'
                  : isPE
                  ? 'Share your details and our team will call you back with pricing, availability and plot options.'
                  : isCB
                  ? 'Leave your number and preferred time — our property advisor will call you back within 30 minutes.'
                  : 'Fill in your details — we\'ll call you back and send the brochure directly.'}
              </p>
            </div>

            {/* ── Success ── */}
            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>{isSV ? '🏠' : '✅'}</div>
                <div className={styles.successTitle}>{isSV ? 'Visit Confirmed!' : 'Thank you!'}</div>
                <p className={styles.successMsg}>
                  {isSV
                    ? 'Confirmation sent to your phone/email. Our team will call you a day before to confirm the time.'
                    : isCB
                    ? 'Our property advisor will call you within 30 minutes during business hours (9am–7pm).'
                    : 'Our team will call you within 30 minutes.'}
                </p>
                {!isSV && (brochureUrl || isAny) && (
                  <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                    <Download size={15} /> {isAny ? 'Download All Brochures' : 'Download Brochure'}
                  </button>
                )}
                <button className="btn btn-green btn-full" onClick={onClose} style={{ marginTop:8 }}>Close</button>
              </div>

            ) : isCB ? (
              /* ══ CALLBACK FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>
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
                  <label className="form-label">Best Time to Call</label>
                  <select className="form-input" {...register('callTime')}>
                    <option value="">Anytime during business hours</option>
                    <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
                    <option value="Afternoon (12pm–4pm)">Afternoon (12pm–4pm)</option>
                    <option value="Evening (4pm–7pm)">Evening (4pm–7pm)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Interest</label>
                  <select className="form-input" {...register('project')}>
                    <option value="">Select a project (optional)</option>
                    {ACTIVE_PROJECTS.map(p => (
                      <option key={p.id} value={p.name}>{p.name} — {p.loc}</option>
                    ))}
                    <option value="Any Project">Any / Not Sure Yet</option>
                  </select>
                </div>

                <div className={styles.callbackNote}>
                  <span>📞</span>
                  <span>Our property advisor will call you within <strong>30 minutes</strong> during business hours (9am–7pm).</span>
                </div>

                <div className={styles.actions}>
                  <button type="submit" className="btn btn-green btn-full"
                    disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Requesting…' : '📞 Call Me Back'}
                  </button>
                  <button type="button" className={styles.waBtn}
                    onClick={() => {
                      const num = whatsapp || DEFAULT_WA_NUMBER
                      const proj = watch('project') ? ` I am interested in ${watch('project')}.` : ''
                      const time = watch('callTime') ? ` Best time to reach me: ${watch('callTime')}.` : ''
                      openWhatsApp(num, `Hi, I would like a callback from Chaturbhuja Properties.${proj}${time} My name is ${watch('name') || ''}.`)
                    }}>
                    <MessageCircle size={15} /> WhatsApp Instead
                  </button>
                </div>
              </form>

            ) : isPE ? (
              /* ══ PLOT ENQUIRY FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>

                {/* Plot summary card */}
                <div className={styles.plotCard}>
                  <div className={styles.plotCardRow}>
                    <div className={styles.plotDim}>{context?.plotSize || context?.category}</div>
                    <div className={styles.plotPrice}>{context?.priceFrom}</div>
                  </div>
                  <div className={styles.plotCardRow}>
                    <span className={styles.plotArea}>{context?.plotArea}</span>
                    {context?.venture && <span className={styles.plotVenture}>{context.venture}</span>}
                  </div>
                </div>

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
                  <label className="form-label">Email <span style={{color:'rgba(0,0,0,0.4)',fontWeight:400}}>(optional)</span></label>
                  <input className="form-input" placeholder="you@example.com"
                    inputMode="email" autoComplete="email"
                    {...register('email', {
                      pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Enter valid email' },
                    })} />
                </div>

                <div className={styles.actions}>
                  <button type="submit" className="btn btn-green btn-full"
                    disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Sending…' : 'Request Callback'}
                  </button>
                  <button type="button" className={styles.waBtn} style={{marginTop:0}}
                    onClick={() => {
                      const num = whatsapp || DEFAULT_WA_NUMBER
                      const txt = `Hi, I am interested in a ${context?.plotSize || context?.category} plot (${context?.plotArea}) in ${context?.venture || 'Chaturbhuja Properties'}. Price: ${context?.priceFrom}. Please share details.`
                      openWhatsApp(num, txt)
                    }}>
                    <MessageCircle size={15} /> WhatsApp Us
                  </button>
                </div>
              </form>

            ) : isSV ? (
              /* ══ SITE VISIT FORM ══ */
              <form onSubmit={handleSubmit(onSiteVisitSubmit)} noValidate className={styles.form}>
                {renderCommonFields()}

                {/* Preferred Date */}
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} style={{ marginRight:5, verticalAlign:'middle' }} />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    className={`form-input ${errors.date ? 'error' : ''}`}
                    min={todayStr}
                    {...register('date', { required: 'Please select a preferred date' })}
                  />
                  {errors.date && <span className="form-error">{errors.date.message}</span>}
                </div>

                {ctaErrors.submit && (
                  <p className={styles.ctaError} style={{ marginBottom:8 }}>
                    <AlertCircle size={12} /> {ctaErrors.submit}
                  </p>
                )}

                <div className={styles.actions}>
                  <button type="submit" className="btn btn-green btn-full"
                    disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Booking…' : 'Confirm Visit'}
                  </button>
                </div>
              </form>

            ) : (
              /* ══ BROCHURE / ENQUIRY FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>
                {renderCommonFields()}

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

                <div className={styles.actions}>
                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.emailBtn}
                      onClick={handleEmail} disabled={sending === 'email' || emailSent}>
                      {sending === 'email' ? <Loader2 size={15} className={styles.spin} /> : <Mail size={15} />}
                      {emailSent ? 'Brochure Sent ✓' : 'Email Brochure'}
                    </button>
                    {ctaErrors.email && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.email}</p>}
                  </div>

                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.waBtn}
                      onClick={handleWhatsApp} disabled={sending === 'wa' || waSent}>
                      {sending === 'wa' ? <Loader2 size={15} className={styles.spin} /> : <MessageCircle size={15} />}
                      {waSent ? 'Sent on WhatsApp ✓' : 'WhatsApp Brochure'}
                    </button>
                    {ctaErrors.wa && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.wa}</p>}
                  </div>

                  <div className={styles.ctaGroup}>
                    <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                      <Download size={15} />
                      {isAny ? 'Download All Brochures' : 'Download Brochure'}
                    </button>
                    {ctaErrors.download && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.download}</p>}
                  </div>

                  <div className={styles.divider}><span>or</span></div>

                  <button type="submit" className="btn btn-green btn-full" disabled={submitLead.isPending}>
                    {submitLead.isPending ? 'Sending…' : 'Request Callback'}
                  </button>
                </div>
              </form>
            )}

            </div>{/* end scrollBody */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
