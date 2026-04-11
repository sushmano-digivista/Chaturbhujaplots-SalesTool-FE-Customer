/**
 * brochures.js — Brochure PDF links per project
 * Place PDF files in /public/brochures/ and update paths below.
 * Files in /public/ are served at root URL e.g. /brochures/anjana.pdf
 */
export const BROCHURES = {
  anjana:  '/brochures/Anjana_Paradise_Brochure.pdf',
  aparna:  '/brochures/Aparna_Legacy_Brochure.pdf',
  varaha:  '/brochures/Varaha_Virtue_Brochure.pdf',
  trimbak: '/brochures/Trimbak_Oaks_Brochure.pdf',
  general: '/brochures/Chaturbhuja_Overview_Brochure.pdf',
}

/**
 * getBrochureUrl(projectId)
 * - Returns the project's brochure URL if available
 * - Returns null if the project brochure is explicitly marked unavailable (null)
 * - Falls back to general brochure for unknown project IDs
 */
export function getBrochureUrl(projectId) {
  if (projectId && Object.prototype.hasOwnProperty.call(BROCHURES, projectId)) {
    return BROCHURES[projectId] // may be null = explicitly unavailable
  }
  return BROCHURES.general || null
}
