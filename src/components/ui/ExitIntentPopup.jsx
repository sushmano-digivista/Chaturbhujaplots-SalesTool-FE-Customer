import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { leadApi } from '@/api'
import { trackEvent } from '@/utils/analytics'

/**
 * ExitIntentPopup — captures the lead from a user who's about to leave.
 *
 * Triggers:
 *   1. DESKTOP — mousemove toward top of viewport (cursor heading
 *      to browser close/tab/back buttons). Classic exit-intent.
 *   2. MOBILE — 45s of continuous inactivity AFTER the user has
 *      scrolled at least 40% of the page. Treating the session as
 *      about to end; classic mouseleave doesn't exist on touch.
 *
 * Guardrails (so it never annoys):
 *   - Only ever shown ONCE per session (sessionStorage flag).
 *   - Never shown in the first 15 seconds on page (avoid
 *     showing to users who haven't engaged yet).
 *   - Never shown if any lead modal is already open
 *     (detected by presence of [class*="overlay"] in the DOM).
 *   - User can dismiss with X or by clicking the backdrop; sets
 *     the session flag so it won't re-appear.
 *
 * Form: minimal (name + phone). On submit, POST to leadApi with
 * source='EXIT_INTENT' and close.
 */

const MIN_DWELL_MS         = 15000 // don't show in first 15s (both platforms)
const MOBILE_INACTIVITY_MS = 15000 // mobile: 15s of no tap/key after any scroll
const MOBILE_MAX_DWELL_MS  = 40000 // mobile fallback: show after 40s + scroll
const MIN_SCROLL_RATIO     = 0.20  // mobile: user must have scrolled >= 20%

const STORAGE_KEY = 'cbp_exit_intent_shown'

export default function ExitIntentPopup() {
  const { t, language } = useLanguage()
  const isTe = language === 'te'
  const [visible, setVisible] = useState(false)
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [error,   setError]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  // Track page dwell time so we only show AFTER user has had a chance to engage
  const pageLoadedAtRef = useRef(Date.now())
  const shownRef        = useRef(false)
  const lastActivityRef = useRef(Date.now())
  const maxScrollRatioRef = useRef(0)

  useEffect(() => {
    // Respect session flag: if already shown, never show again this session
    try { if (sessionStorage.getItem(STORAGE_KEY) === '1') return } catch {}

    const show = (trigger) => {
      if (shownRef.current) return
      if (Date.now() - pageLoadedAtRef.current < MIN_DWELL_MS) return
      // Don't show if any modal/overlay is currently blocking scroll.
      // LeadModal + LaunchOverlay + PricingOverlay all set
      // document.body.style.overflow = 'hidden' while open, which is
      // a precise signal (won't false-match Hero's decorative overlay div).
      if (document.body.style.overflow === 'hidden') return
      shownRef.current = true
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
      trackEvent('exit_intent_shown', { trigger })
      setVisible(true)
    }

    // ── DESKTOP: mouse leaves via top edge ───────────────────────────────
    // Use mouseout on documentElement — more reliable cross-browser than
    // mouseleave on document. Also requires relatedTarget to be null or
    // outside the viewport (mouse truly left the window, not just crossed
    // to another element).
    const onMouseOut = (e) => {
      if (e.relatedTarget) return        // moved to another element, still inside
      if ((e.clientY ?? 0) > 0) return   // left via sides/bottom — ignore
      show('desktop_mouseleave_top')
    }

    // ── MOBILE: scroll depth tracking ────────────────────────────────────
    // NOTE: scroll does NOT reset the idle timer. Rationale: on mobile,
    // every finger swipe fires scroll; if scroll counted as activity the
    // idle threshold would never trigger while the user is browsing.
    // Only actual taps/keys reset the timer.
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = window.scrollY / scrollable
      if (ratio > maxScrollRatioRef.current) maxScrollRatioRef.current = ratio
    }
    // Real activity: actual taps and keys
    const onInput = () => { lastActivityRef.current = Date.now() }

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    let mobileTimer = null
    if (isMobile) {
      // Poll every 2s. Three mobile triggers, whichever fires first:
      //   A) 15s idle (no taps/keys) + >= 20% scroll      (classic exit intent)
      //   B) 40s total dwell         + >= 20% scroll      (guaranteed fallback)
      //   C) visibilitychange to 'visible' after leaving  (handled separately)
      mobileTimer = setInterval(() => {
        if (shownRef.current) return
        const idleFor = Date.now() - lastActivityRef.current
        const dwelled = Date.now() - pageLoadedAtRef.current
        if (dwelled < MIN_DWELL_MS) return
        if (maxScrollRatioRef.current < MIN_SCROLL_RATIO) return
        if (idleFor >= MOBILE_INACTIVITY_MS) {
          show('mobile_idle_after_scroll')
        } else if (dwelled >= MOBILE_MAX_DWELL_MS) {
          show('mobile_max_dwell_after_scroll')
        }
      }, 2000)
    }

    // Extra trigger for BOTH platforms: fires when user hides the tab
    // (switches apps, locks phone, changes to another tab). Shown when
    // they come back — gives one final chance to capture before they
    // close the tab entirely.
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !shownRef.current) {
        const dwelled = Date.now() - pageLoadedAtRef.current
        if (dwelled >= MIN_DWELL_MS && maxScrollRatioRef.current >= 0.10) {
          show('visibility_return')
        }
      }
    }

    document.addEventListener('mouseout',         onMouseOut)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll',     onScroll,    { passive: true })
    window.addEventListener('touchstart', onInput,     { passive: true })
    window.addEventListener('click',      onInput)
    window.addEventListener('keydown',    onInput)

    return () => {
      document.removeEventListener('mouseout',         onMouseOut)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('touchstart', onInput)
      window.removeEventListener('click',      onInput)
      window.removeEventListener('keydown',    onInput)
      if (mobileTimer) clearInterval(mobileTimer)
    }
  }, [])

  const dismiss = (reason = 'close_button') => {
    trackEvent('exit_intent_dismissed', { reason })
    setVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError(isTe ? 'దయచేసి మీ పేరును నమోదు చేయండి' : 'Please enter your name'); return
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError(isTe ? '10-అంకెల భారతీయ నంబర్ నమోదు చేయండి' : 'Enter a valid 10-digit Indian mobile number'); return
    }
    setSubmitting(true)
    try {
      await leadApi.submit({
        name:   trimmedName,
        phone:  phone.trim(),
        source: 'EXIT_INTENT',
      })
      trackEvent('exit_intent_submitted', { has_phone: true })
      setSubmitted(true)
    } catch (err) {
      setError(isTe ? 'సమస్య ఏర్పడింది. మళ్ళీ ప్రయత్నించండి' : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible) return null

  const modal = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => dismiss('backdrop')}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
        aria-modal="true" role="dialog"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 440,
            background: '#fff',
            borderRadius: 16,
            padding: '28px 24px 24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}
        >
          {/* Decorative gold stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: 'linear-gradient(90deg, #C9A84C, #E8D5A3, #C9A84C)',
          }} />

          <button
            type="button"
            onClick={() => dismiss('close_button')}
            aria-label="Close"
            style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.06)',
              border: 'none', borderRadius: '50%',
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>🙏</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22, color: 'var(--green)', margin: '0 0 6px',
              }}>
                {isTe ? 'ధన్యవాదాలు!' : 'Thank You!'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', margin: '0 0 18px' }}>
                {isTe
                  ? 'మా బృందం 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తుంది.'
                  : 'Our team will call you within 24 hours with the latest price list and site-visit options.'}
              </p>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="btn btn-gold"
                style={{ padding: '8px 24px', fontSize: 13 }}
              >
                {isTe ? 'మూసివేయండి' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(192,57,43,0.1)',
                  color:      '#C0392B',
                  border:     '1px solid rgba(192,57,43,0.3)',
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  {isTe ? '✋ వేచి ఉండండి' : '✋ Wait — Before You Go'}
                </div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24, fontWeight: 600,
                  color: 'var(--green)',
                  margin: '0 0 6px',
                  lineHeight: 1.2,
                }}>
                  {isTe
                    ? <>ఈ <em style={{ color: '#C0392B' }}>ఉత్తమ ప్లాట్‌ని</em> మిస్ చేయవద్దు</>
                    : <>Don't miss the <em style={{ color: '#C0392B' }}>best plots</em> in Amaravathi</>}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-mid)', margin: 0 }}>
                  {isTe
                    ? 'మేము మీకు ఉచిత ప్లాట్ ధరల జాబితా + సైట్ విజిట్ పంపిస్తాము'
                    : 'Get the latest price list + a free site visit scheduled'}
                </p>
              </div>

              {/* Benefits mini-list */}
              <ul style={{
                listStyle: 'none', padding: 0, margin: '0 0 16px',
                display: 'grid', gap: 6, fontSize: 12, color: 'var(--text-dark)',
              }}>
                <li>✅ {isTe ? 'ఆన్-ది-స్పాట్ ధరల జాబితా' : 'Latest on-the-spot price list'}</li>
                <li>✅ {isTe ? 'APCRDA & RERA ఆమోదిత ప్లాట్లు' : 'APCRDA & RERA-approved plots'}</li>
                <li>✅ {isTe ? 'ఉచిత సైట్ విజిట్ & ట్రాన్స్‌పోర్ట్' : 'Free site visit + transport'}</li>
              </ul>

              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (error) setError('') }}
                  placeholder={isTe ? 'మీ పేరు' : 'Your Name'}
                  autoComplete="name"
                  className="form-input"
                  style={{ marginBottom: 8 }}
                />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g,'').slice(0,10)); if (error) setError('') }}
                  placeholder={isTe ? '10-అంకెల ఫోన్ నంబర్' : '10-digit Mobile Number'}
                  autoComplete="tel"
                  className="form-input"
                  style={{ marginBottom: 8 }}
                />
                {error && (
                  <div style={{
                    background: 'rgba(192,57,43,0.08)',
                    color: '#C0392B', fontSize: 12,
                    padding: '6px 10px', borderRadius: 6,
                    marginBottom: 8, fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold"
                  style={{
                    width: '100%', padding: '10px 16px', fontSize: 14,
                    fontWeight: 700,
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  <Phone size={14} style={{ marginRight: 6 }} />
                  {submitting
                    ? (isTe ? 'సబ్మిట్ చేస్తోంది…' : 'Sending…')
                    : (isTe ? 'నాకు ధరల జాబితా పంపండి' : 'Send Me the Price List')}
                </button>
              </form>
              <p style={{
                fontSize: 10, color: 'var(--text-light)', textAlign: 'center',
                marginTop: 10, marginBottom: 0,
              }}>
                {isTe
                  ? '🔒 మేము మీ సంఖ్యను ఎవరికీ పంచుకోము'
                  : '🔒 We never share your number. One call, zero spam.'}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
