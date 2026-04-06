import axios from 'axios'
const isDev = import.meta.env.DEV
const DASHBOARD_BASE = isDev
  ? '/api/dashboard'
  : 'https://chaturbhujaplots-sales-tool-be-dasb.vercel.app/api/v1'
const PLOT_BASE = isDev
  ? '/api/plots'
  : 'https://chaturbhujaplots-sales-tool-be-plot-upload-services-3oufzzl9q.vercel.app/api/v1/plots'
const COMMON_URL = 'https://chaturbhujaplots-sales-tool-be-comm.vercel.app/api/v1'
const MEDIA_BASE = isDev
  ? '/api/media'
  : COMMON_URL + '/media'
const COMMON_BASE = isDev
  ? '/api/common'
  : COMMON_URL

// Force fresh responses -- prevents 304 Not Modified from serving stale DB data
const noCacheHeaders = { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }

const dashApi   = axios.create({ baseURL: DASHBOARD_BASE, timeout: 15000, headers: noCacheHeaders })
const plotApi   = axios.create({ baseURL: PLOT_BASE,      timeout: 15000, headers: noCacheHeaders })
const mediaApi  = axios.create({ baseURL: MEDIA_BASE,     timeout: 15000, headers: noCacheHeaders })
const commonApi = axios.create({ baseURL: COMMON_BASE,    timeout: 15000, headers: noCacheHeaders })

// Settings always calls production Vercel URL directly (not proxied locally)
const settingsApiClient = axios.create({ baseURL: COMMON_URL, timeout: 15000, headers: noCacheHeaders })

export const contentApi = {
  getAll: () => dashApi.get('/content').then(r => r.data),
}
export const plotSummaryApi = {
  getSummary: () => plotApi.get('/summary').then(r => r.data),
}
export const leadApi = {
  submit: (data) => dashApi.post('/leads', data).then(r => r.data),
}
// -- Brochure API -------------------------------------------------------
export const brochureApi = {
  sendEmail:    (data) => commonApi.post('/brochure/email',    data).then(r => r.data),
  sendWhatsApp: (data) => commonApi.post('/brochure/whatsapp', data).then(r => r.data),
}
// -- Site Visit API -----------------------------------------------------
export const siteVisitApi = {
  book: (data) => commonApi.post('/site-visit', data).then(r => r.data),
}
// -- Pricing API --------------------------------------------------------
export const pricingApi = {
  getAll: () => dashApi.get('/pricing').then(r => r.data),
  getOne: (id) => dashApi.get('/pricing/' + id).then(r => r.data),
}
// -- Settings API -------------------------------------------------------
// Always fetches from production Vercel URL (not local proxy)
export const settingsApi = {
  getContact: () => settingsApiClient.get('/settings/contact').then(r => r.data),
}
// -- Projects API -------------------------------------------------------
// Fetches all project content from MongoDB via DashboardServices
export const projectsApi = {
  getAll: () => dashApi.get('/projects').then(r => r.data),
  getOne: (id) => dashApi.get('/projects/' + id).then(r => r.data),
}
// -- i18n API -----------------------------------------------------------
// Fetches all translations (en + te) from MongoDB via DashboardServices
export const i18nApi = {
  getAll: () => dashApi.get('/i18n').then(r => r.data),
}
