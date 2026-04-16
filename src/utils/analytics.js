/**
 * Google Analytics 4 event tracking helper.
 *
 * Wraps window.gtag with a small, consistent API so every CTA across
 * the site can emit a GA4 event without worrying about whether gtag
 * is loaded yet (ad-blockers, dev env, etc.).
 *
 * All events funnel into GA4 where you can see them under:
 *   Reports → Engagement → Events
 *   Reports → Admin → Events → Mark as key event (to count as conversion)
 *
 * Key events to mark as conversions in GA4 UI:
 *   - callback_requested
 *   - site_visit_scheduled
 *   - plot_enquired
 *   - brochure_downloaded
 *   - whatsapp_click
 *   - phone_click
 */

/**
 * Fire a GA4 custom event. Silently no-ops if gtag isn't available
 * (blocked by ad-blocker, server-side render, etc.).
 *
 * @param {string} eventName — GA4 event name (snake_case, max 40 chars)
 * @param {object} [params]  — extra event parameters (keys must be ≤40 chars)
 */
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    window.gtag('event', eventName, params)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[GA4]', eventName, params)
    }
  } catch (_) {
    // never let analytics break the UI
  }
}

// ── Pre-baked helpers for common events ─────────────────────────────────────

/** User clicked a phone/tel link — high-intent. */
export const trackPhoneClick = (source, phone) =>
  trackEvent('phone_click', { source, phone })

/** User clicked a WhatsApp link (any) — high-intent. */
export const trackWhatsAppClick = (source, context = {}) =>
  trackEvent('whatsapp_click', { source, ...context })

/** User submitted the Request Callback form. */
export const trackCallbackRequested = (context = {}) =>
  trackEvent('callback_requested', context)

/** User submitted the Schedule Site Visit form. */
export const trackSiteVisitScheduled = (context = {}) =>
  trackEvent('site_visit_scheduled', context)

/** User submitted a plot-specific enquiry. */
export const trackPlotEnquired = (context = {}) =>
  trackEvent('plot_enquired', context)

/** User downloaded a brochure (single or multi). */
export const trackBrochureDownloaded = (context = {}) =>
  trackEvent('brochure_downloaded', context)

/** User clicked the main Enquire Now CTA (nav / hero / sticky). */
export const trackEnquireCta = (source, context = {}) =>
  trackEvent('enquire_cta_click', { source, ...context })

/** User opened the lead modal (any entry point). */
export const trackLeadModalOpen = (source, context = {}) =>
  trackEvent('lead_modal_open', { source, ...context })

/** User switched to a venture on home page (via PricingBanner or PlotGrid). */
export const trackVentureSwitched = (venture, source) =>
  trackEvent('venture_switched', { venture, source })

/** User opened a plot dimensions popover. */
export const trackPlotClicked = (venture, plotNumber, status) =>
  trackEvent('plot_clicked', { venture, plot_number: String(plotNumber), status })

/** User navigated to a specific project detail page. */
export const trackProjectPageView = (projectId) =>
  trackEvent('project_page_view', { project_id: projectId })

/** User clicked a social media icon in the footer. */
export const trackSocialClick = (platform) =>
  trackEvent('social_click', { platform })

/** User toggled language (EN ↔ TE). */
export const trackLanguageToggle = (toLanguage) =>
  trackEvent('language_toggle', { to_language: toLanguage })
