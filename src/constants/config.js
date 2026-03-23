/**
 * config.js — Application-level constants.
 *
 * Centralises values that are used in multiple components (Sonar: S1192
 * "string literals should not be duplicated").  Change once here rather than
 * hunting for magic strings across the codebase.
 */

/** Default WhatsApp contact number (digits only, with country code). */
export const DEFAULT_WA_NUMBER = '918977262683'

/** Default voice-call contact number. */
export const DEFAULT_PHONE = '+918977262683'

/** Business hours label shown across CTAs. */
export const BUSINESS_HOURS = '9am–7pm'

/** Maximum minutes for a callback promise. */
export const CALLBACK_MINUTES = 30
