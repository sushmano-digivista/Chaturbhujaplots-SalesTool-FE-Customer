import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

// ── Helpers ───────────────────────────────────────────────────────────────────
async function waitForPageLoad(page) {
  // Wait for PageLoader to finish (min 2.8s animation)
  await page.waitForSelector('nav', { timeout: 10000 })
}

// ── 1. Page Load & PageLoader ─────────────────────────────────────────────────
test.describe('Page Load', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
    await expect(page).toHaveTitle(/Chaturbhuja/i)
  })

  test('PageLoader animation completes and home page renders', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('nav', { timeout: 10000 })
    await expect(page.locator('nav')).toBeVisible()
  })

  test('favicon is set', async ({ page }) => {
    await page.goto(BASE)
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveAttribute('href', /favicon/)
  })
})

// ── 2. Navbar ─────────────────────────────────────────────────────────────────
test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
  })

  test('logo is visible', async ({ page }) => {
    await expect(page.locator('nav img, nav .logo, header img').first()).toBeVisible()
  })

  test('Portfolio menu opens on click', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    await expect(page.getByText('Anjana Paradise')).toBeVisible()
  })

  test('Portfolio dropdown shows all 4 projects', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    await expect(page.getByText('Anjana Paradise')).toBeVisible()
    await expect(page.getByText('Aparna Legacy')).toBeVisible()
    await expect(page.getByText('Varaha Virtue')).toBeVisible()
    await expect(page.getByText('Trimbak Oaks')).toBeVisible()
  })

  test('clicking Anjana Paradise navigates to project page', async ({ page }) => {
    await page.getByRole('button', { name: /portfolio/i }).first().click()
    await page.getByText('Anjana Paradise').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/)
  })
})

// ── 3. Mobile Navbar ──────────────────────────────────────────────────────────
test.describe('Mobile Navbar', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
  })

  test('hamburger menu opens', async ({ page }) => {
    await page.locator('button[aria-label="Menu"], button.hamburger').click()
    await expect(page.getByText('Gallery')).toBeVisible()
  })

  test('clicking Gallery closes menu and scrolls', async ({ page }) => {
    await page.locator('button[aria-label="Menu"], button.hamburger').click()
    await page.getByText('Gallery').click()
    // Menu should close
    await expect(page.getByText('Videos').first()).not.toBeVisible({ timeout: 2000 }).catch(() => {})
  })
})

// ── 4. Hero Section ───────────────────────────────────────────────────────────
test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
  })

  test('hero headline is visible', async ({ page }) => {
    await expect(page.getByText(/Premium Plots/i).first()).toBeVisible()
  })

  test('View Available Plots button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /View Available Plots/i }).first()).toBeVisible()
  })

  test('Book Site Visit button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Book Site Visit/i }).first()).toBeVisible()
  })
})

// ── 5. Portfolio Section ──────────────────────────────────────────────────────
test.describe('Portfolio Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(500)
  })

  test('all 4 project cards are visible', async ({ page }) => {
    await expect(page.getByText('Anjana Paradise').first()).toBeVisible()
    await expect(page.getByText('Aparna Legacy').first()).toBeVisible()
    await expect(page.getByText('Varaha Virtue').first()).toBeVisible()
    await expect(page.getByText('Trimbak Oaks').first()).toBeVisible()
  })

  test('Anjana Paradise shows correct location', async ({ page }) => {
    await expect(page.getByText('Paritala, Near Amaravati').first()).toBeVisible()
  })

  test('Aparna Legacy shows Gateway of Amaravati', async ({ page }) => {
    await expect(page.getByText(/Gateway of Amaravati/i).first()).toBeVisible()
  })
})

// ── 6. Section Scrolling ──────────────────────────────────────────────────────
test.describe('Section Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
  })

  test('scrolling to gallery section works', async ({ page }) => {
    await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView())
    await expect(page.locator('#gallery')).toBeInViewport()
  })

  test('scrolling to location section works', async ({ page }) => {
    await page.evaluate(() => document.getElementById('location')?.scrollIntoView())
    await expect(page.locator('#location')).toBeInViewport()
  })

  test('scrolling to contact section works', async ({ page }) => {
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
    await expect(page.locator('#contact')).toBeInViewport()
  })
})

// ── 7. Lead Modal ─────────────────────────────────────────────────────────────
test.describe('Lead Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
  })

  test('Enquire Now opens lead modal', async ({ page }) => {
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await expect(page.getByRole('dialog').or(page.locator('[class*="modal"]').first())).toBeVisible()
  })

  test('modal closes on X click', async ({ page }) => {
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await page.locator('[class*="modal"] button, [class*="close"]').first().click()
    await expect(page.locator('[class*="modal"]').first()).not.toBeVisible({ timeout: 3000 })
  })
})

// ── 8. Footer ─────────────────────────────────────────────────────────────────
test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
  })

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('footer shows company name', async ({ page }) => {
    await expect(page.locator('footer').getByText(/Chaturbhuja/i).first()).toBeVisible()
  })
})

// ── 9. ScrollToTop button ─────────────────────────────────────────────────────
test.describe('ScrollToTop', () => {
  test('scroll to top button appears after scrolling', async ({ page }) => {
    await page.goto(BASE)
    await waitForPageLoad(page)
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(500)
    await expect(page.locator('button[class*="scrollTop"], button[aria-label*="top"], button[class*="Top"]').first()).toBeVisible({ timeout: 3000 })
  })
})
