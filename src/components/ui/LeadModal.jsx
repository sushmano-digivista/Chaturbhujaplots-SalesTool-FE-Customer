import { createPortal }         from 'react-dom'
import { useEffect, useState }  from 'react'
import { useForm }               from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Mail, Loader2, AlertCircle, Calendar, ChevronRight } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { useSubmitLead }         from '@/hooks/useData'
import { ACTIVE_PROJECTS }       from '@/constants/projects'
import { BROCHURES, getBrochureUrl } from '@/constants/brochures'
import { brochureApi, siteVisitApi, leadApi } from '@/api'
import { openWhatsApp, safeOpenExternal } from '@/utils/security'
import { DEFAULT_WA_NUMBER }     from '@/constants/config'
import { useLanguage }           from '@/context/LanguageContext'
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

export default function LeadModal({ context, onClose, whatsapp, content }) {
  const isOpen    = !!context
  const isSV      = isSiteVisit(context)
  const isPE      = isPlotEnquiry(context)
  const isCB      = isCallback(context)
  const { t, language } = useLanguage()
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()
  const submitLead  = useSubmitLead()
  const [submitted, setSubmitted]  = useState(false)
  const [emailSent, setEmailSent]  = useState(false)
  const [waSent,    setWaSent]     = useState(false)
  const [sending,   setSending]    = useState(null)
  const [ctaErrors, setCtaErrors]  = useState({})
  const [waStep, setWaStep]         = useState(0)   // 0=hidden, 1=project, 2=visit, 3=callback, 4=done
  const [waAnswers, setWaAnswers]   = useState({})

  const selectedProject = watch('project')  || ''
  const enteredEmail    = watch('email')     || ''
  const enteredPhone    = watch('phone')     || ''
  const enteredName     = watch('name')      || ''
  const enteredDate     = watch('date')      || ''

  const selectedProjObj = ACTIVE_PROJECTS.find(p => p.name === selectedProject)
  const isAny           = selectedProject === 'Any Project'

  // Use getBrochureUrl so explicit null (unavailable) is preserved correctly
  const brochureUrl = isAny
    ? null
    : getBrochureUrl(selectedProjObj?.id || context?.projectId)

  // Brochure note from MongoDB — shown when selected project has no brochure
  const brochureNote = !isAny && selectedProject
    ? content?.brochureNotes?.find(n => n.projectName === selectedProject && n.available === false)?.note
    : null

  const clearCtaError = key => setCtaErrors(e => ({ ...e, [key]: '' }))

  // Today's date as min for date picker
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = scrollbarWidth + 'px'
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => { document.body.style.overflow = ''; document.body.style.paddingRight = '' }
  }, [isOpen])

  // Pre-select project from venture/category context
  // - `venture` is used by PlotGrid dimension enquiries
  // - `category` is used by ProjectPage CTAs (Enquire Now, Callback, Site Visit, Brochure)
  useEffect(() => {
    const projectName = context?.venture || context?.category
    if (isOpen && projectName) {
      const proj = ACTIVE_PROJECTS.find(p => p.name === projectName)
      if (proj) setValue('project', proj.name)
    }
  }, [isOpen, context?.venture, context?.category])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  // Reset WA questionnaire when modal closes
  useEffect(() => {
    if (!isOpen) { setWaStep(0); setWaAnswers({}) }
  }, [isOpen])

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
      // Also save lead to DB (silently - don't show error toast if this fails)
      leadApi.submit({
        name: data.name, phone: data.phone, email: data.email || undefined,
        source: 'CONTACT_FORM', categoryInterest: data.project || context?.category || undefined,
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
      const text = language === 'te'
        ? t('contact.waLeadFallback').replace('{project}', selectedProject || 'Chaturbhuja Properties')
        : `Hi, I am interested in ${selectedProject || 'Chaturbhuja Properties'} plots. Please share details.`
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
        <label className="form-label">{t('modal.namePlaceholder')} *</label>
        <input className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder={t('contact.namePlaceholder')} autoComplete="name"
          {...register('name', { required: language === 'te' ? 'పేరు అవసరం' : 'Name is required' })} />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">{t('modal.phonePlaceholder')} *</label>
        <input className={`form-input ${errors.phone ? 'error' : ''}`}
          placeholder={t('contact.phonePlaceholder')} inputMode="tel" autoComplete="tel"
          {...register('phone', {
            required: language === 'te' ? 'ఫోన్ నంబర్ అవసరం' : 'Phone number is required',
            pattern:  { value:/^[6-9]\d{9}$/, message: language === 'te' ? 'చెల్లుబాటు అయ్యే 10 అంకెల నంబర్ నమోదు చేయండి' : 'Enter valid 10-digit Indian number' },
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
        <input className="form-input" placeholder={t('contact.emailPlaceholder')}
          inputMode="email" autoComplete="email"
          {...register('email', {
            pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message:'Enter valid email' },
          })} />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">
          {t('modal.projectInterest') || 'Project Interest'}
          {!isSV && <span style={{ color:'rgba(0,0,0,0.4)', fontWeight:400, marginLeft:6 }}>({t('modal.requiredForDownload') || 'required for Download'})</span>}
        </label>
        <select className="form-input" {...register('project')}
          disabled={!!context?.venture}
          style={context?.venture ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
          onChange={e => { clearCtaError('download'); register('project').onChange(e) }}>
          <option value="">{t('modal.selectProject') || 'Select a project'}</option>
          {/* On a specific project page, show only that project; otherwise show all */}
          {(() => {
            const currentProject = context?.venture || context?.category
            const projectsToShow = currentProject
              ? ACTIVE_PROJECTS.filter(p => p.name === currentProject)
              : ACTIVE_PROJECTS
            return projectsToShow.map(p => {
              const NAME_TE = { 'Anjana Paradise': 'అంజన పారడైజ్', 'Trimbak Oaks': 'ట్రింబక్ ఓక్స్', 'Aparna Legacy': 'అపర్ణ లెగసీ', 'Varaha Virtue': 'వరాహ వర్చ్యూ' }
              const LOC_TE = { 'Paritala, Near Amaravati': 'పరిటాల అమరావతి సమీపంలో', 'Penamaluru, Near Vijayawada': 'పెనమలూరు విజయవాడ సమీపంలో', 'Chevitikallu, Gateway of Amaravati Capital Region': 'చెవిటికల్లు అమరావతి క్యాపిటల్ రీజియన్ గేట్‌వే', 'Pamarru, Krishna District': 'పామర్రు కృష్ణా జిల్లా' }
              const name = language === 'te' ? (NAME_TE[p.name] || p.name) : p.name
              const loc = language === 'te' ? (LOC_TE[p.loc] || p.loc) : p.loc
              return <option key={p.id} value={p.name}>{name} — {loc}</option>
            })
          })()}
          <option value="Any Project">{isSV ? (t('modal.anyNotSure') || 'Any / Not Sure Yet') : (t('modal.anyNotSureAll') || 'Any / Not Sure Yet — Download All')}</option>
        </select>
        {/* Dynamic note from MongoDB when selected project has no brochure */}
        {!isSV && brochureNote && (
          <div className={styles.brochureUnavailableNote}>
            <span className={styles.brochureNoteIcon}>ℹ️</span>
            <p>{brochureNote}</p>
          </div>
        )}
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

            <div className={styles.topBar}>
              <div style={{width:44}} />{/* spacer to center handle */}
              <div className={styles.handle} />
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close" type="button">
                <X size={20} />
              </button>
            </div>

            <div className={styles.scrollBody}>
            <div className={styles.modalHeader}>
              <h3 className={styles.title}>{(() => {
                if (!context?.label) return t('sections.contact')
                if (language === 'te') {
                  const LABEL_TE = {
                    'Enquire Now': 'ఇప్పుడే సంప్రదించండి',
                    'Get Plot Details': 'ప్లాట్ వివరాలు పొందండి',
                    'Register Interest': 'ఆసక్తి నమోదు చేయండి',
                    'Request Callback': 'తిరిగి కాల్ చేయమని అభ్యర్థన',
                    'Schedule Site Visit': 'సైట్ విజిట్ షెడ్యూల్',
                    'Get Callback': 'తిరిగి కాల్ చేయమని అభ్యర్థన',
                    'Notify Me': 'నాకు తెలియజేయండి',
                    'Secure Plot': 'ప్లాట్ బుక్ చేయండి',
                    'Book Site Visit': 'సైట్ విజిట్ బుక్ చేయండి',
                    'Download Brochure': 'పాంప్లెట్ డౌన్‌లోడ్',
                    'Enquire About Plot': 'ప్లాట్ గురించి సంప్రదించండి',
                  }
                  return LABEL_TE[context.label] || context.label
                }
                return context.label
              })()}</h3>
              {context?.category && <span className={styles.catTag}>{(() => {
                if (language !== 'te') return context.category
                const CAT_TE = {
                  'Anjana Paradise': 'అంజన పారడైజ్',
                  'Trimbak Oaks': 'ట్రింబక్ ఓక్స్',
                  'Aparna Legacy': 'అపర్ణ లెగసీ',
                  'Varaha Virtue': 'వరాహ వర్చ్యూ',
                  'East-Facing': '☀️ తూర్పు ముఖం',
                  'West-Facing': '🌙 పడమర ముఖం',
                  'Corner Plots': '◣ మూల ప్లాట్లు',
                  'North-Facing': '▲ ఉత్తర ముఖం',
                  'South-Facing': '▼ దక్షిణ ముఖం',
                  'Corner / Special Facing': 'మూల / ప్రత్యేక ముఖం',
                  'Phase I — East': 'ఫేజ్ I — తూర్పు',
                  'Phase I — West': 'ఫేజ్ I — పడమర',
                  'Phase I — Corner/Other': 'ఫేజ్ I — మూల/ఇతర',
                  'Phase II — East': 'ఫేజ్ II — తూర్పు',
                  'Phase II — West': 'ఫేజ్ II — పడమర',
                  'Phase II — Corner/Other': 'ఫేజ్ II — మూల/ఇతర',
                }
                return CAT_TE[context.category] || context.category
              })()}</span>}
              <p className={styles.subtitle}>
                {isSV
                  ? t('modal.siteVisitTitle')
                  : isPE
                  ? t('modal.enquiryTitle')
                  : isCB
                  ? t('modal.callbackTitle')
                  : t('modal.brochureTitle')}
              </p>
            </div>

            {/* ── Success ── */}
            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>{isSV ? '🏠' : '✅'}</div>
                <div className={styles.successTitle}>{isSV ? t('modal.scheduleVisit') : t('modal.submit')}</div>
                <p className={styles.successMsg}>
                  {isSV
                    ? 'Confirmation sent to your phone/email. Our team will call you a day before to confirm the time.'
                    : isCB
                    ? 'Our property advisor will call you within 30 minutes during business hours (9am–7pm).'
                    : t('modal.successMessage')}
                </p>
                {!isSV && (brochureUrl || isAny) && (
                  <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                    <Download size={15} /> {isAny ? 'Download All Brochures' : t('modal.sendBrochure')}
                  </button>
                )}
                <button className="btn btn-green btn-full" onClick={onClose} style={{ marginTop:8 }}>{t('modal.close')}</button>
              </div>

            ) : isCB ? (
              /* ══ CALLBACK FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>
                <div className="form-group">
                  <label className="form-label">{t('modal.namePlaceholder')} *</label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder={t('contact.namePlaceholder')} autoComplete="name"
                    {...register('name', { required: 'Name is required' })} />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">{t('modal.phonePlaceholder')} *</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder={t('contact.phonePlaceholder')} inputMode="tel" autoComplete="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern:  { value:/^[6-9]\d{9}$/, message:'Enter valid 10-digit Indian number' },
                    })} />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'te' ? 'కాల్ చేయడానికి సరైన సమయం' : 'Best Time to Call'}</label>
                  <select className="form-input" {...register('callTime')}>
                    <option value="">{language === 'te' ? 'వ్యాపార వేళల్లో ఎప్పుడైనా' : 'Anytime during business hours'}</option>
                    <option value="Morning (9am–12pm)">{language === 'te' ? 'ఉదయం (9am–12pm)' : 'Morning (9am–12pm)'}</option>
                    <option value="Afternoon (12pm–4pm)">{language === 'te' ? 'మధ్యాహ్నం (12pm–4pm)' : 'Afternoon (12pm–4pm)'}</option>
                    <option value="Evening (4pm–7pm)">{language === 'te' ? 'సాయంత్రం (4pm–7pm)' : 'Evening (4pm–7pm)'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'te' ? 'ప్రాజెక్ట్ ఆసక్తి' : 'Project Interest'}</label>
                  <select className="form-input" {...register('project')}>
                    <option value="">{t('modal.selectProjectOptional') || 'Select a project (optional)'}</option>
                    {/* On a specific project page, show only that project; otherwise show all */}
                    {(() => {
                      const currentProject = context?.venture || context?.category
                      const projectsToShow = currentProject
                        ? ACTIVE_PROJECTS.filter(p => p.name === currentProject)
                        : ACTIVE_PROJECTS
                      return projectsToShow.map(p => {
                        const NAME_TE = { 'Anjana Paradise': 'అంజన పారడైజ్', 'Trimbak Oaks': 'ట్రింబక్ ఓక్స్', 'Aparna Legacy': 'అపర్ణ లెగసీ', 'Varaha Virtue': 'వరాహ వర్చ్యూ' }
                        const LOC_TE = { 'Paritala, Near Amaravati': 'పరిటాల అమరావతి సమీపంలో', 'Penamaluru, Near Vijayawada': 'పెనమలూరు విజయవాడ సమీపంలో', 'Chevitikallu, Gateway of Amaravati Capital Region': 'చెవిటికల్లు అమరావతి క్యాపిటల్ రీజియన్ గేట్‌వే', 'Pamarru, Krishna District': 'పామర్రు కృష్ణా జిల్లా' }
                        const name = language === 'te' ? (NAME_TE[p.name] || p.name) : p.name
                        const loc = language === 'te' ? (LOC_TE[p.loc] || p.loc) : p.loc
                        return <option key={p.id} value={p.name}>{name} — {loc}</option>
                      })
                    })()}
                    <option value="Any Project">{language === 'te' ? 'ఏదైనా / ఇంకా నిర్ణయించలేదు' : 'Any / Not Sure Yet'}</option>
                  </select>
                </div>

                <div className={styles.callbackNote}>
                  <span>📞</span>
                  <span>{language === 'te' ? <>మా ప్రాపర్టీ సలహాదారు <strong>30 నిమిషాలలో</strong> మీకు కాల్ చేస్తారు (ఉదయం 9 నుండి సాయంత్రం 7 వరకు).</> : <>Our property advisor will call you within <strong>30 minutes</strong> during business hours (9am–7pm).</>}</span>
                </div>

                <div className={styles.actions}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                    <button type="submit" className="btn btn-green" style={{ flex: 1 }}
                      disabled={submitLead.isPending}>
                      {submitLead.isPending ? (language === 'te' ? 'అభ్యర్థిస్తోంది…' : 'Requesting…') : '📞 ' + t('modal.requestCallback')}
                    </button>
                    <WhatsAppIcon size={44} onClick={() => setWaStep(1)} />
                  </div>
                </div>
              </form>

            ) : waStep > 0 ? (
              /* ══ WHATSAPP QUESTIONNAIRE ══ */
              <div className={styles.waQuestionnaire}>

                {/* Step 1 — Project */}
                {waStep === 1 && (
                  <div className={styles.waStep}>
                    <div className={styles.waStepHeader}>
                      🏡 <strong>{language === 'te' ? 'స్టెప్ 1/3 — ప్రాజెక్ట్ ఆసక్తి' : 'Step 1 of 3 — Project Interest'}</strong>
                    </div>
                    <p className={styles.waStepDesc}>{language === 'te' ? 'మీకు ఏ ప్రాజెక్ట్‌పై ఆసక్తి ఉంది?' : 'Which project are you interested in?'}</p>
                    {(language === 'te' ? [
                      { id: 'anjana',  label: 'అంజన పారడైజ్',   sub: 'పరిటాల · అమరావతి సమీపంలో · 242 ప్లాట్లు' },
                      { id: 'aparna',  label: 'అపర్ణ లెగసీ',     sub: 'చెవిటికల్లు · 273 ప్లాట్లు' },
                      { id: 'varaha',  label: 'వరాహ వర్చ్యూ',     sub: 'పామర్రు · జాతీయ రహదారి-16 · 132 ప్లాట్లు' },
                      { id: 'trimbak', label: 'ట్రింబక్ ఓక్స్',      sub: 'పెనమలూరు · విజయవాడ సమీపంలో · త్వరలో' },
                      { id: 'any',     label: 'ఏదైనా / అన్ని ప్రాజెక్టులు', sub: 'అన్ని పాంప్లెట్లు పంపండి' },
                    ] : [
                      { id: 'anjana',  label: 'Anjana Paradise',   sub: 'Paritala · Near Amaravati · 242 plots' },
                      { id: 'aparna',  label: 'Aparna Legacy',     sub: 'Chevitikallu · 273 plots' },
                      { id: 'varaha',  label: 'Varaha Virtue',     sub: 'Pamarru · Near NH-16 · 132 plots' },
                      { id: 'trimbak', label: 'Trimbak Oaks',      sub: 'Penamaluru · Near Vijayawada · Coming soon' },
                      { id: 'any',     label: 'Any / All Projects', sub: 'Send me all brochures' },
                    ]).map((p, i) => (
                      <button key={p.id} className={styles.waOption}
                        onClick={() => { setWaAnswers(a => ({ ...a, project: p.label })); setWaStep(2) }}>
                        <span className={styles.waOptionNum}>{i + 1}</span>
                        <span className={styles.waOptionText}>
                          <strong>{p.label}</strong>
                          <span>{p.sub}</span>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2 — Site Visit */}
                {waStep === 2 && (
                  <div className={styles.waStep}>
                    <div className={styles.waStepHeader}>
                      📅 <strong>Step 2 of 3 — Site Visit</strong>
                    </div>
                    <p className={styles.waStepDesc}>Would you like to schedule a free site visit?</p>
                    {[
                      { id: 'morning',   label: language === 'te' ? 'ఉదయం (9am–12pm)' : 'Morning (9am–12pm)' },
                      { id: 'afternoon', label: language === 'te' ? 'మధ్యాహ్నం (12pm–4pm)' : 'Afternoon (12pm–4pm)' },
                      { id: 'skip',      label: 'Skip for now' },
                    ].map((t, i) => (
                      <button key={t.id} className={styles.waOption}
                        onClick={() => { setWaAnswers(a => ({ ...a, visit: t.id === 'skip' ? null : t.label })); setWaStep(3) }}>
                        <span className={styles.waOptionNum}>{i + 1}</span>
                        <span className={styles.waOptionText}><strong>{t.label}</strong></span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3 — Callback */}
                {waStep === 3 && (
                  <div className={styles.waStep}>
                    <div className={styles.waStepHeader}>
                      📞 <strong>Step 3 of 3 — Callback Time</strong>
                    </div>
                    <p className={styles.waStepDesc}>When is the best time for our advisor to call you?</p>
                    {[
                      { id: 'morning',   label: language === 'te' ? 'ఉదయం (9am–12pm)' : 'Morning (9am–12pm)' },
                      { id: 'afternoon', label: language === 'te' ? 'మధ్యాహ్నం (12pm–4pm)' : 'Afternoon (12pm–4pm)' },
                      { id: 'skip',      label: 'Skip for now' },
                    ].map((t, i) => (
                      <button key={t.id} className={styles.waOption}
                        onClick={() => {
                          const cb = t.id === 'skip' ? null : t.label
                          const proj = waAnswers.project || 'Any Project'
                          const visit = waAnswers.visit ? `\n📅 Site Visit: ${waAnswers.visit}` : ''
                          const callback = cb ? `\n📞 Callback: ${cb}` : ''
                          const baseMsg = language === 'te' ? t('contact.waBrochureMsg') : '🏡 Hi! I am interested in Chaturbhuja Properties & Infra.'
                          const msg = `${baseMsg}\n\n` +
                            `🏘️ Project: ${proj}` + visit + callback +
                            `\n\nPlease share more details and brochure. Thank you!`
                          openWhatsApp(whatsapp || DEFAULT_WA_NUMBER, msg)
                          setWaStep(0)
                          onClose()
                        }}>
                        <span className={styles.waOptionNum}>{i + 1}</span>
                        <span className={styles.waOptionText}><strong>{t.label}</strong></span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                )}

                <button className={styles.waBack} onClick={() => setWaStep(s => Math.max(0, s - 1))}>
                  ← Back
                </button>
              </div>

            ) : isPE ? (
              /* ══ PLOT ENQUIRY FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>

                {/* Plot summary card */}
                <div className={styles.plotCard}>
                  <div className={styles.plotCardRow}>
                    <div className={styles.plotDim}>{(() => {
                      const val = context?.plotSize || context?.category
                      if (!val || language !== 'te') return val
                      const FACING_TE = {
                        'East-Facing': '☀️ తూర్పు ముఖం', 'West-Facing': '🌙 పడమర ముఖం',
                        'Corner Plots': '◣ మూల ప్లాట్లు', 'North-Facing': '▲ ఉత్తర ముఖం',
                        'Phase I — East': 'ఫేజ్ I — తూర్పు', 'Phase I — West': 'ఫేజ్ I — పడమర',
                        'Phase I — Corner/Other': 'ఫేజ్ I — మూల/ఇతర',
                        'Phase II — East': 'ఫేజ్ II — తూర్పు', 'Phase II — West': 'ఫేజ్ II — పడమర',
                        'Phase II — Corner/Other': 'ఫేజ్ II — మూల/ఇతర',
                      }
                      return FACING_TE[val] || val
                    })()}</div>
                    <div className={styles.plotPrice}>{context?.priceFrom}</div>
                  </div>
                  <div className={styles.plotCardRow}>
                    <span className={styles.plotArea}>{context?.plotArea}</span>
                    {context?.venture && <span className={styles.plotVenture}>{(() => {
                      if (language !== 'te') return context.venture
                      const V_TE = { 'Anjana Paradise': 'అంజన పారడైజ్', 'Trimbak Oaks': 'ట్రింబక్ ఓక్స్', 'Aparna Legacy': 'అపర్ణ లెగసీ', 'Varaha Virtue': 'వరాహ వర్చ్యూ' }
                      return V_TE[context.venture] || context.venture
                    })()}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'te' ? 'మీ పేరు *' : 'Your Name *'}</label>
                  <input className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder={language === 'te' ? 'పూర్తి పేరు' : 'Full name'} autoComplete="name"
                    {...register('name', { required: language === 'te' ? 'పేరు అవసరం' : 'Name is required' })} />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'te' ? 'ఫోన్ నంబర్ *' : 'Mobile Number *'}</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 XXXXX XXXXX" inputMode="tel" autoComplete="tel"
                    {...register('phone', {
                      required: language === 'te' ? 'ఫోన్ నంబర్ అవసరం' : 'Phone number is required',
                      pattern:  { value:/^[6-9]\d{9}$/, message: language === 'te' ? 'చెల్లుబాటు అయ్యే 10 అంకెల నంబర్ నమోదు చేయండి' : 'Enter valid 10-digit Indian number' },
                    })} />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'te' ? 'ఇమెయిల్' : 'Email'} <span style={{color:'rgba(0,0,0,0.4)',fontWeight:400}}>({language === 'te' ? 'ఐచ్ఛికం' : 'optional'})</span></label>
                  <input className="form-input" placeholder={language === 'te' ? 'మీ ఇమెయిల్' : 'you@example.com'}
                    inputMode="email" autoComplete="email"
                    {...register('email', {
                      pattern: { value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: language === 'te' ? 'చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి' : 'Enter valid email' },
                    })} />
                </div>

                <div className={styles.actions}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                    <button type="submit" className="btn btn-green" style={{ flex: 1 }}
                      disabled={submitLead.isPending}>
                      {submitLead.isPending ? t('common.loading') : '📞 ' + t('modal.requestCallback')}
                    </button>
                    <WhatsAppIcon size={44} onClick={() => {
                      const num = whatsapp || DEFAULT_WA_NUMBER
                      const txt = language === 'te'
                        ? t('contact.waPlotMsg').replace('{size}', context?.plotSize || context?.category || '').replace('{area}', context?.plotArea || '').replace('{venture}', context?.venture || 'చతుర్భుజ').replace('{price}', context?.priceFrom || '')
                        : `Hi, I am interested in a ${context?.plotSize || context?.category} plot (${context?.plotArea}) in ${context?.venture || 'Chaturbhuja Properties'}. Price: ${context?.priceFrom}. Please share details.`
                      openWhatsApp(num, txt)
                    }} />
                  </div>
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
                    {submitLead.isPending ? t('common.loading') : '🗓️ ' + t('modal.scheduleVisit')}
                  </button>
                </div>
              </form>

            ) : (
              /* ══ BROCHURE / ENQUIRY FORM ══ */
              <form onSubmit={handleSubmit(onBrochureSubmit)} noValidate className={styles.form}>
                {renderCommonFields()}

                {!context?.category && (
                  <div className="form-group">
                    <label className="form-label">{t('modal.plotInterest') || 'Plot Interest'}</label>
                    <select className="form-input" {...register('category')}>
                      <option value="">{t('modal.selectPreference') || 'Select preference'}</option>
                      <option>{t('facings.east') || 'East-Facing'}</option>
                      <option>{t('facings.west') || 'West-Facing'}</option>
                      <option>{t('facings.north') || 'North-Facing'}</option>
                      <option>{t('facings.south') || 'South-Facing'}</option>
                      <option>{t('sections.cornerPlots') || 'Corner Plots'}</option>
                      <option>30×40 ft</option>
                      <option>33×50 ft</option>
                      <option>40×60 ft</option>
                      <option>{t('modal.other') || 'Other'}</option>
                    </select>
                  </div>
                )}

                <div className={styles.actions}>
                  <div className={styles.ctaRow}>
                    <div className={styles.ctaGroup}>
                      <button type="button" className={styles.emailBtn}
                        onClick={handleEmail} disabled={sending === 'email' || emailSent}>
                        {sending === 'email' ? <Loader2 size={15} className={styles.spin} /> : <Mail size={15} />}
                        {emailSent ? 'Sent ✓' : 'Email'}
                      </button>
                      {ctaErrors.email && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.email}</p>}
                    </div>

                    <div className={styles.ctaGroup}>
                      {sending === 'wa'
                        ? <Loader2 size={44} className={styles.spin} />
                        : <WhatsAppIcon size={44} onClick={waSent ? undefined : handleWhatsApp} />}
                      {ctaErrors.wa && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.wa}</p>}
                    </div>

                    <div className={styles.ctaGroup}>
                      <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
                        <Download size={15} />
                        {isAny ? 'Download All' : 'Download'}
                      </button>
                      {ctaErrors.download && <p className={styles.ctaError}><AlertCircle size={12} /> {ctaErrors.download}</p>}
                    </div>
                  </div>{/* /ctaRow */}

                  <div className={styles.divider}><span>{language === 'te' ? 'లేదా' : 'or'}</span></div>

                  <button type="submit" className="btn btn-green btn-full" disabled={submitLead.isPending}>
                    {submitLead.isPending ? t('common.loading') : '📞 ' + t('modal.requestCallback')}
                  </button>
                </div>
              </form>
            )}

            </div>{/* /scrollBody */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
