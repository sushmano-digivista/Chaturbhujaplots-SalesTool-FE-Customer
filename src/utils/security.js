/**
 * security.js — Shared security utilities.
 *
 * Centralises URL-validation and safe external-navigation helpers so every
 * component uses the same allow-list policy, eliminating repeated ad-hoc
 * checks (Sonar: duplicated-logic; Checkmarx: CWE-601 Open Redirect).
 */

/** Allowed URL prefixes for external navigation. */
const ALLOWED_URL_PREFIXES = [
  'https://wa.me/',
  'https://maps.google.com/',
  'https://www.google.com/maps',
  'https://goo.gl/maps',
]

/**
 * Returns true only when `url` starts with a known-safe prefix.
 * This prevents open-redirect vulnerabilities when URLs originate from
 * API responses or dynamic data (Checkmarx CWE-601).
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeExternalUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  return ALLOWED_URL_PREFIXES.some((prefix) => url.startsWith(prefix))
}

/**
 * Safe wrapper around `window.open` for external URLs.
 *
 * - Validates the URL against the allow-list before navigating.
 * - Passes `noopener,noreferrer` as the window features string to prevent the
 *   opened page from accessing `window.opener` (Checkmarx: CWE-1022 /
 *   Sonar: S5148).
 * - Silently no-ops on invalid URLs so callers never navigate to untrusted
 *   destinations.
 *
 * @param {string} url   - Destination URL (must match allow-list).
 * @param {string} [tab] - Window name; defaults to '_blank'.
 */
export function safeOpenExternal(url, tab = '_blank') {
  if (!isSafeExternalUrl(url)) {
    // Do not navigate — log in dev builds only
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[security] Blocked navigation to disallowed URL:', url)
    }
    return
  }
  window.open(url, tab, 'noopener,noreferrer')
}

/**
 * Builds a WhatsApp deep-link URL and opens it safely.
 *
 * @param {string} phone   - Recipient phone number (digits only, with country code).
 * @param {string} message - Pre-filled message text.
 */
export function openWhatsApp(phone, message) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  safeOpenExternal(url)
}

/**
 * Opens a Google Maps URL safely.
 *
 * @param {string} mapsUrl - A google.com/maps or goo.gl/maps URL.
 */
export function openMaps(mapsUrl) {
  safeOpenExternal(mapsUrl)
}
