import axios from 'axios'

// ── Backend URLs ──────────────────────────────────────────────────────────────
// In dev: use Vite proxy (/api/dashboard → localhost:8082)
// In prod (Railway): call backends directly from browser
const isDev = import.meta.env.DEV

const DASHBOARD_BASE = isDev
  ? '/api/dashboard'
  : 'https://chaturbhujaplots-salestool-be-dasboardservices-production.up.railway.app/api/v1'

const PLOT_BASE = isDev
  ? '/api/plots'
  : 'https://chaturbhujaplots-salestool-be-plotuploadservices-production.up.railway.app/api/v1/plots'

const MEDIA_BASE = isDev
  ? '/api/media'
  : 'https://chaturbhujaplots-salestool-be-commonservices-production.up.railway.app/api/v1/media'

// ── Axios instances ───────────────────────────────────────────────────────────
const dashApi  = axios.create({ baseURL: DASHBOARD_BASE, timeout: 15000 })
const plotApi  = axios.create({ baseURL: PLOT_BASE,      timeout: 15000 })
const mediaApi = axios.create({ baseURL: MEDIA_BASE,     timeout: 15000 })

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
