import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter:  ['text', 'lcov'],
      // Coverage measured only on pure JS logic files.
      // JSX components (React UI) are excluded — they require E2E / Storybook
      // testing, not unit tests, and are not part of SonarCloud's unit-test gate.
      include: [
        'src/utils/**/*.js',
        'src/constants/**/*.js',
        'src/api/**/*.js',
        'src/api/index.js',          // compile-time import.meta.env branches not unit-testable
        'src/hooks/**/*.js',
      ],
      exclude: [
        'src/assets/**',
        'src/test/**',
        'src/constants/projectGalleries.js',  // uses Vite import.meta.glob — not unit-testable
        'src/constants/fallbackContent.js',   // pure static data object — no logic
        'src/constants/projects.js',          // pure static data object — no logic
      ],
    },
  },
  optimizeDeps: {
    include: ['react-countup', 'countup.js'],  // force CJS→ESM pre-bundling
  },
  server: {
    port: 3000,
    proxy: {
      '/api/dashboard': {
        target:       'http://localhost:8082',
        rewrite:      p => p.replace(/^\/api\/dashboard/, '/api/v1'),
        changeOrigin: true,
      },
      '/api/plots': {
        target:       'http://localhost:8083',
        rewrite:      p => p.replace(/^\/api\/plots/, '/api/v1/plots'),
        changeOrigin: true,
      },
      '/api/media': {
        target:       'http://localhost:8081',
        rewrite:      p => p.replace(/^\/api\/media/, '/api/v1/media'),
        changeOrigin: true,
      },
      // commonApi calls — brochure, site-visit, etc.
      '/api/common': {
        target:       'http://localhost:8081',
        rewrite:      p => p.replace(/^\/api\/common/, '/api/v1'),
        changeOrigin: true,
      },
    },
  },
})