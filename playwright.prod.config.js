import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 90000,
  retries: 2,
  use: {
    baseURL: 'https://www.chaturbhujaplots.in',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    navigationTimeout: 30000,
    actionTimeout: 15000,
    ignoreHTTPSErrors: true,
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report-prod', open: 'never' }]],
})
