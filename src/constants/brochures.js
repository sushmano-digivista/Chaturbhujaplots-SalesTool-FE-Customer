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
 * getBrochureUrl(projectId) — returns brochure URL or null if not set up yet
 */
export function getBrochureUrl(projectId) {
  return BROCHURES[projectId] || BROCHURES.general || null
}
