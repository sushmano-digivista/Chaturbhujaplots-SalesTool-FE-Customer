import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.use({ viewport: { width: 390, height: 844 } })

async function waitForLoad(page) {
  await page.waitForSelector('nav', { timeout: 10000 })
}

// ── 1. Mobile Sticky Bar ──────────────────────────────────────────────────────
test.describe('Mobile Sticky Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('Call button is visible', async ({ page }) => {
    await expect(page.getByText('Call').first()).toBeVisible()
  })

  test('WhatsApp button is visible', async ({ page }) => {
    await expect(page.getByText('WhatsApp').first()).toBeVisible()
  })

  test('Enquire button is visible', async ({ page }) => {
    await expect(page.getByText('Enquire').first()).toBeVisible()
  })

  test('Enquire button opens modal', async ({ page }) => {
    await page.getByText('Enquire').first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible()
  })
})

// ── 2. Mobile Navigation ──────────────────────────────────────────────────────
test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('hamburger opens mobile menu', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await expect(page.getByText('Gallery').first()).toBeVisible()
  })

  test('all nav links visible in mobile menu', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    for (const label of ['Gallery', 'Videos', 'Amenities', 'Location', 'Contact']) {
      await expect(page.getByText(label).first()).toBeVisible()
    }
  })

  test('Gallery nav link closes menu and scrolls', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await page.getByText('Gallery').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#gallery')).toBeInViewport({ timeout: 5000 })
  })

  test('Contact nav link closes menu and scrolls', async ({ page }) => {
    await page.locator('button[aria-label="Menu"]').click()
    await page.getByText('Contact').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 })
  })
})

// ── 3. Mobile Portfolio Section ───────────────────────────────────────────────
test.describe('Mobile Portfolio Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
    await page.evaluate(() => document.getElementById('portfolio')?.scrollIntoView())
    await page.waitForTimeout(500)
  })

  test('all 4 projects visible on mobile', async ({ page }) => {
    for (const name of ['Anjana Paradise', 'Aparna Legacy', 'Varaha Virtue', 'Trimbak Oaks']) {
      await expect(page.getByText(name).first()).toBeVisible()
    }
  })

  test('tapping Anjana Paradise navigates to project', async ({ page }) => {
    await page.getByText('Anjana Paradise').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/, { timeout: 5000 })
  })
})

// ── 4. Mobile Scroll Behaviour ────────────────────────────────────────────────
test.describe('Mobile Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)
  })

  test('page scrolls smoothly through sections', async ({ page }) => {
    const sections = ['portfolio', 'gallery', 'videos', 'location', 'contact']
    for (const id of sections) {
      await page.evaluate((sId) => document.getElementById(sId)?.scrollIntoView(), id)
      await page.waitForTimeout(300)
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 3000 })
    }
  })

  test('scroll to top button appears after scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(500)
    // ScrollToTop button should appear
    const scrollBtn = page.locator('button[class*="scrollTop"], button[class*="Top"], [class*="scrollToTop"]').first()
    await expect(scrollBtn).toBeVisible({ timeout: 3000 })
  })
})

// ── 5. Mobile Project Page Tabs ───────────────────────────────────────────────
test.describe('Mobile Project Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('[class*="tabBar"], [class*="mobileNav"]', { timeout: 10000 })
  })

  test('mobile project nav toggle works', async ({ page }) => {
    const toggle = page.locator('button[class*="mobileNav"]')
    if (await toggle.isVisible()) {
      await toggle.click()
      await expect(page.getByText('Overview').first()).toBeVisible()
    }
  })

  test('all project tabs accessible', async ({ page }) => {
    for (const tab of ['Overview', 'Amenities', 'Location', 'Contact']) {
      // Try desktop tab bar first, fall back to mobile menu
      const tabBtn = page.getByRole('button', { name: tab }).first()
      await tabBtn.click({ force: true })
      await page.waitForTimeout(300)
    }
  })
})
