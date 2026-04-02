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
  : `${COMMON_URL}/media`

const COMMON_BASE = isDev
  ? '/api/common'
  : COMMON_URL

const noCacheHeaders = { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }

const dashApi   = axios.create({ baseURL: DASHBOARD_BASE, timeout: 15000, headers: noCacheHeaders })
const plotApi   = axios.create({ baseURL: PLOT_BASE,      timeout: 15000, headers: noCacheHeaders })
const mediaApi  = axios.create({ baseURL: MEDIA_BASE,     timeout: 15000, headers: noCacheHeaders })
const commonApi = axios.create({ baseURL: COMMON_BASE,    timeout: 15000, headers: noCacheHeaders })

export const contentApi = {
  getAll: () => dashApi.get('/content').then(r => r.data),
}

export const plotSummaryApi = {
  getSummary: () => plotApi.get('/summary').then(r => r.data),
}

export const leadApi = {
  submit: (data) => dashApi.post('/leads', data).then(r => r.data),
}

export const brochureApi = {
  sendEmail:    (data) => commonApi.post('/brochure/email',    data).then(r => r.data),
  sendWhatsApp: (data) => commonApi.post('/brochure/whatsapp', data).then(r => r.data),
}

export const siteVisitApi = {
  book: (data) => commonApi.post('/site-visit', data).then(r => r.data),
}

// ── Settings API ──────────────────────────────────────────────────────────────
export const settingsApi = {
  getContact: () => commonApi.get('/settings/contact').then(r => r.data),
}
