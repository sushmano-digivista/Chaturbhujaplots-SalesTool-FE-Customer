import axios from 'axios'

const isDev = import.meta.env.DEV

const DASHBOARD_BASE = isDev
  ? '/api/dashboard'
  : 'https://chaturbhujaplots-sales-tool-be-dasboard-services-bl1y4rh7f.vercel.app/api/v1'

const PLOT_BASE = isDev
  ? '/api/plots'
  : 'https://chaturbhujaplots-sales-tool-be-plot-upload-services-3oufzzl9q.vercel.app/api/v1/plots'

const MEDIA_BASE = isDev
  ? '/api/media'
  : 'https://chaturbhujaplots-sales-tool-be-common-services-p78gvop5a.vercel.app/api/v1/media'

const dashApi  = axios.create({ baseURL: DASHBOARD_BASE, timeout: 15000 })
const plotApi  = axios.create({ baseURL: PLOT_BASE,      timeout: 15000 })
const mediaApi = axios.create({ baseURL: MEDIA_BASE,     timeout: 15000 })

export const contentApi = {
  getAll: () => dashApi.get('/content').then(r => r.data),
}

export const plotSummaryApi = {
  getSummary: () => plotApi.get('/summary').then(r => r.data),
}

export const leadApi = {
  submit: (data) => dashApi.post('/leads', data).then(r => r.data),
}
