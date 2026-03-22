import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ── Backend URLs ──────────────────────────────────────────────────────────────
// In dev, proxy requests to the live Vercel backends so MongoDB data always
// reflects what is in the database without needing local services running.
const DASHBOARD_URL = 'https://chaturbhujaplots-sales-tool-be-dasboard-services-bl1y4rh7f.vercel.app'
const PLOT_URL      = 'https://chaturbhujaplots-sales-tool-be-plot-upload-services-3oufzzl9q.vercel.app'
const MEDIA_URL     = 'https://chaturbhujaplots-sales-tool-be-common-services-p78gvop5a.vercel.app'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 3000,
    proxy: {
      '/api/dashboard': {
        target:      DASHBOARD_URL,
        rewrite:     p => p.replace(/^\/api\/dashboard/, '/api/v1'),
        changeOrigin: true,
        secure:       true,
      },
      '/api/plots': {
        target:      PLOT_URL,
        rewrite:     p => p.replace(/^\/api\/plots/, '/api/v1/plots'),
        changeOrigin: true,
        secure:       true,
      },
      '/api/media': {
        target:      MEDIA_URL,
        rewrite:     p => p.replace(/^\/api\/media/, '/api/v1/media'),
        changeOrigin: true,
        secure:       true,
      },
    },
  },
})