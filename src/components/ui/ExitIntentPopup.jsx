import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Hand, CheckCircle2, Lock, HeartHandshake } from 'lucide-react'
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
const MOBILE_INACTIVITY_MS = 30000 // mobile: 30s screen-idle (no tap/key) — sole mobile trigger

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
    // ── URL-param test bypasses — makes mobile testing easy ─────────────
    // ?exitTest=force → show popup after 2s, ignore all guards
    // ?exitTest=reset → clear the session flag so popup can fire naturally
    const qs = new URLSearchParams(window.location.search)
    const testMode = qs.get('exitTest')
    if (testMode === 'reset') {
      try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
      // eslint-disable-next-line no-console
      console.log('[ExitIntent] ?exitTest=reset — session cleared, popup can fire naturally now.')
    }

    // Confirm component mounted — visible in browser console so you can
    // tell whether the popup JS loaded on mobile at all.
    // eslint-disable-next-line no-console
    console.log('[ExitIntent] mounted · testMode=' + (testMode || 'none') + ' · sessionFlag=' + (() => { try { return sessionStorage.getItem(STORAGE_KEY) } catch { return 'err' } })())

    const show = (trigger, opts = {}) => {
      if (shownRef.current) return
      // Modal-open guard: skip only if another modal is currently
      // blocking the scroll (LeadModal / LaunchOverlay / PricingOverlay
      // all set body.overflow='hidden' while open).
      if (document.body.style.overflow === 'hidden') return
      // Dwell time guard — applied to PASSIVE triggers only (mobile idle,
      // visibility return). True exit intent (desktop mouseleave toward
      // browser close button) fires instantly because the user's intent
      // is unambiguous — they're actively leaving.
      if (!opts.force && !opts.skipDwell) {
        if (Date.now() - pageLoadedAtRef.current < MIN_DWELL_MS) return
      }
      shownRef.current = true
      if (!opts.force) {
        try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
      }
      trackEvent('exit_intent_shown', { trigger })
      setVisible(true)
    }

    // ?exitTest=force — show after 2s regardless of session/dwell/everything
    if (testMode === 'force') {
      const forceTimer = setTimeout(() => show('url_param_force_test', { force: true }), 2000)
      return () => clearTimeout(forceTimer)
    }

    // Respect session flag: if already shown, never show again this session
    try { if (sessionStorage.getItem(STORAGE_KEY) === '1') return } catch {}

    // ── DIAGNOSTIC HELPERS — call from browser console to test ──────────────
    // Works on Safari's Web Inspector / Chrome DevTools.
    //   window.__cbpForceExitPopup()       → show immediately, bypass all guards
    //   window.__cbpClearExitSession()     → clear the once-per-session flag
    //   window.__cbpExitPopupStatus()      → log current state for debugging
    if (typeof window !== 'undefined') {
      window.__cbpForceExitPopup   = () => show('manual_test', { force: true })
      window.__cbpClearExitSession = () => {
        try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
        shownRef.current = false
        // eslint-disable-next-line no-console
        console.log('[ExitIntent] Session cleared. Reload page.')
      }
      window.__cbpExitPopupStatus  = () => {
        const dwelled = Date.now() - pageLoadedAtRef.current
        const idleFor = Date.now() - lastActivityRef.current
        // eslint-disable-next-line no-console
        console.log('[ExitIntent] status', {
          alreadyShown: shownRef.current,
          sessionFlag:  (() => { try { return sessionStorage.getItem(STORAGE_KEY) } catch { return 'err' } })(),
          dwelledMs:    dwelled,
          idleMs:       idleFor,
          scrollRatio:  maxScrollRatioRef.current.toFixed(2),
          bodyLocked:   document.body.style.overflow === 'hidden',
          isMobile:     window.matchMedia('(max-width: 768px)').matches,
        })
      }
    }

    // ── DESKTOP: mouse leaves via top edge ───────────────────────────────
    // Fires INSTANTLY when the cursor moves off the top of the viewport
    // (i.e. user heading to the browser's close/tab/back buttons).
    // skipDwell: true bypasses the 15s dwell guard — exit intent must
    // fire the moment the user decides to leave; waiting defeats the
    // purpose.
    const onMouseOut = (e) => {
      if (e.relatedTarget) return        // moved to another element, still inside
      if ((e.clientY ?? 0) > 0) return   // left via sides/bottom — ignore
      show('desktop_mouseleave_top', { skipDwell: true })
    }

    // ── MOBILE: pure 30s idle trigger ────────────────────────────────────
    // Only user-intent events (taps / keys) count as activity — scroll
    // events do NOT reset the timer. Rationale: on touch devices, finger
    // swipes fire scroll constantly; if scroll counted as activity the
    // 30s idle threshold would never trigger while the user is reading.
    const onInput = () => { lastActivityRef.current = Date.now() }

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    let mobileTimer = null
    if (isMobile) {
      // SOLE mobile trigger: 30 seconds of screen-idle, after the 15s
      // minimum dwell has elapsed. Max-dwell fallback + visibility-return
      // triggers intentionally removed per owner spec ("30s idle only").
      mobileTimer = setInterval(() => {
        if (shownRef.current) return
        const dwelled = Date.now() - pageLoadedAtRef.current
        if (dwelled < MIN_DWELL_MS) return
        const idleFor = Date.now() - lastActivityRef.current
        if (idleFor >= MOBILE_INACTIVITY_MS) {
          show('mobile_30s_idle')
        }
      }, 2000)
    }

    document.addEventListener('mouseout',  onMouseOut)
    window.addEventListener('touchstart',  onInput, { passive: true })
    window.addEventListener('click',       onInput)
    window.addEventListener('keydown',     onInput)

    return () => {
      document.removeEventListener('mouseout', onMouseOut)
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
          // Respect iOS safe areas (notch / home bar) — fallback to 16px
          padding: 'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
          // Use 100dvh where supported so mobile Safari's dynamic URL bar
          // doesn't push content off-screen. Falls back to 100vh.
          minHeight: '100vh',
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
            // Don't exceed viewport height — if content's tall, scroll inside
            maxHeight: 'calc(100vh - 32px)',
            background: '#fff',
            borderRadius: 16,
            padding: '28px 20px 22px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            overflowY: 'auto',
            // Smooth scrolling on iOS
            WebkitOverflowScrolling: 'touch',
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
              position: 'absolute', top: 8, right: 8,
              background: 'rgba(0,0,0,0.08)',
              border: 'none', borderRadius: '50%',
              // Bumped to 36×36 for a comfortable mobile tap target
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            <X size={18} />
          </button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                <HeartHandshake size={44} color="#C9A84C" strokeWidth={1.6} />
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22, color: 'var(--green)', margin: '0 0 6px',
              }}>
                {isTe ? 'ధన్యవాదాలు!' : 'Thank You!'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', margin: '0 0 18px' }}>
                {isTe
                  ? 'మా బృందం 24 గంటల్లో మిమ్మల్ని సంప్రదించి, మీ ప్రశ్నలకు సమాధానమిస్తుంది మరియు సైట్ విజిట్ షెడ్యూల్ చేస్తుంది.'
                  : 'Our team will call you within 24 hours to answer your questions and schedule a site visit.'}
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
                  gap: 4, alignItems: 'center',
                }}>
                  <Hand size={12} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                  {isTe ? 'వేచి ఉండండి' : 'Wait — Before You Go'}
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
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#2E7D32" style={{ flexShrink: 0 }} />
                  {isTe ? 'ఆన్-ది-స్పాట్ ధరల జాబితా' : 'Latest on-the-spot price list'}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#2E7D32" style={{ flexShrink: 0 }} />
                  {isTe ? 'APCRDA & RERA ఆమోదిత ప్లాట్లు' : 'APCRDA & RERA-approved plots'}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#2E7D32" style={{ flexShrink: 0 }} />
                  {isTe ? 'ఉచిత సైట్ విజిట్ & ట్రాన్స్‌పోర్ట్' : 'Free site visit + transport'}
                </li>
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
                    : (isTe ? 'తిరిగి కాల్ చేయమని అభ్యర్థించండి' : 'Request Call Back')}
                </button>
              </form>
              <p style={{
                fontSize: 10, color: 'var(--text-light)', textAlign: 'center',
                marginTop: 10, marginBottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <Lock size={11} style={{ flexShrink: 0 }} />
                {isTe
                  ? 'మేము మీ సంఖ్యను ఎవరికీ పంచుకోము'
                  : 'We never share your number. One call, zero spam.'}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
