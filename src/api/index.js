import axios from 'axios'

// ── Dashboard Service (content + leads) ──────────────────────────────────────
const dashApi = axios.create({ baseURL: '/api/dashboard', timeout: 10000 })

// ── Plot Service (summary + counts) ──────────────────────────────────────────
const plotApi = axios.create({ baseURL: '/api/plots', timeout: 10000 })

// ── Content API ───────────────────────────────────────────────────────────────
export const contentApi = {
  /** Fetches all project content in one shot */
  getAll: () => dashApi.get('/content').then(r => r.data),
}

// ── Plot Summary API ──────────────────────────────────────────────────────────
export const plotSummaryApi = {
  /** Returns category counts + plot numbers — no status, no auth */
  getSummary: () => plotApi.get('/summary').then(r => r.data),
}

// ── Lead API ──────────────────────────────────────────────────────────────────
export const leadApi = {
  submit: (data) => dashApi.post('/leads', data).then(r => r.data),
}
