import axios from 'axios'

// ── Detect environment ────────────────────────────────────────────────────────
const isDev = import.meta.env.DEV

const DASHBOARD_URL = isDev
  ? '/api/dashboard'
  : 'https://chaturbhujaplots-salestool-be-dasboardservices-production.up.railway.app/api/v1'

const PLOT_URL = isDev
  ? '/api/plots'
  : 'https://chaturbhujaplots-salestool-be-plotuploadservices-production.up.railway.app/api/v1/plots'

const MEDIA_URL = isDev
  ? '/api/media'
  : 'https://chaturbhujaplots-salestool-be-commonservices-production.up.railway.app/api/v1/media'

// ── Axios clients ─────────────────────────────────────────────────────────────
const dashApi  = axios.create({ baseURL: DASHBOARD_URL, timeout: 15000 })
const plotApi  = axios.create({ baseURL: PLOT_URL,      timeout: 15000 })
const mediaApi = axios.create({ baseURL: MEDIA_URL,     timeout: 15000 })

// ── Content API ───────────────────────────────────────────────────────────────
export const contentApi = {
  getAll: () => dashApi.get('/content').then(r => r.data),
}

// ── Plot Summary API ──────────────────────────────────────────────────────────
export const plotSummaryApi = {
  getSummary: () => plotApi.get('/summary').then(r => r.data),
}

// ── Lead API ──────────────────────────────────────────────────────────────────
export const leadApi = {
  submit: (data) => dashApi.post('/leads', data).then(r => r.data),
}
