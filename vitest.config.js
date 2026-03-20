import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include:  ['src/**/*.{js,jsx}'],
      exclude:  ['src/main.jsx', 'src/__tests__/**'],
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
  },
})
