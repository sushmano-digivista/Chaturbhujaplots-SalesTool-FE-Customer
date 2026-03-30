/**
 * config.js — Application-level constants.
 *
 * Centralises values that are used in multiple components (Sonar: S1192
 * "string literals should not be duplicated").  Change once here rather than
 * hunting for magic strings across the codebase.
 */

/** WhatsApp bot number (Twilio sandbox) — customers chat here to start the questionnaire bot. */
export const DEFAULT_WA_NUMBER = '14155238886'

/** Voice-call contact number for the business. */
export const DEFAULT_PHONE = '+919739762698'

/** Owner/business WhatsApp number — for direct enquiries (not bot). */
export const OWNER_WA_NUMBER = '919739762698'

/** Business hours label shown across CTAs. */
export const BUSINESS_HOURS = '9am–7pm'

/** Maximum minutes for a callback promise. */
export const CALLBACK_MINUTES = 30
