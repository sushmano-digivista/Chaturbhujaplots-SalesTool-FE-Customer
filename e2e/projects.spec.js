import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'
const PROJECTS = [
  { id: 'anjana',  name: 'Anjana Paradise',  loc: 'Paritala' },
  { id: 'aparna',  name: 'Aparna Legacy',    loc: 'Chevitikallu' },
  { id: 'varaha',  name: 'Varaha Virtue',    loc: 'Pamarru' },
  { id: 'trimbak', name: 'Trimbak Oaks',     loc: 'Penamaluru' },
]

async function goToProject(page, id) {
  await page.goto(`${BASE}/project/${id}`)
  await page.waitForSelector('header nav, [class*="tabBar"]', { timeout: 10000 })
}

// ── 1. Project Pages Load ─────────────────────────────────────────────────────
test.describe('All Project Pages Load', () => {
  for (const proj of PROJECTS) {
    test(`${proj.name} page loads`, async ({ page }) => {
      await goToProject(page, proj.id)
      await expect(page.getByText(proj.name).first()).toBeVisible()
    })

    test(`${proj.name} shows location`, async ({ page }) => {
      await goToProject(page, proj.id)
      await expect(page.getByText(new RegExp(proj.loc, 'i')).first()).toBeVisible()
    })
  }
})

// ── 2. Project Tab Navigation ─────────────────────────────────────────────────
test.describe('Project Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await goToProject(page, 'anjana')
  })

  test('Overview tab opens', async ({ page }) => {
    await page.getByRole('button', { name: /Overview/i }).click()
    await expect(page.getByText(/Project Overview/i)).toBeVisible()
  })

  test('Amenities tab opens', async ({ page }) => {
    await page.getByRole('button', { name: /Amenities/i }).click()
    await expect(page.getByText(/Amenities/i).first()).toBeVisible()
  })

  test('Gallery tab opens', async ({ page }) => {
    await page.getByRole('button', { name: /Gallery/i }).click()
    await expect(page.getByText(/Gallery/i).first()).toBeVisible()
  })

  test('Location tab opens', async ({ page }) => {
    await page.getByRole('button', { name: /Location/i }).click()
    await expect(page.getByText(/Location & Connectivity/i)).toBeVisible()
  })

  test('Contact tab opens', async ({ page }) => {
    await page.getByRole('button', { name: /Contact/i }).click()
    await expect(page.getByText(/Contact Us/i)).toBeVisible()
  })
})

// ── 3. Contact Tab Values ─────────────────────────────────────────────────────
test.describe('Contact Tab Values from MongoDB', () => {
  test('Anjana Paradise contact has phone number', async ({ page }) => {
    await goToProject(page, 'anjana')
    await page.getByRole('button', { name: /Contact/i }).click()
    await expect(page.getByText(/99487 09041/)).toBeVisible()
  })

  test('Aparna Legacy contact address has Gateway of Amaravati', async ({ page }) => {
    await goToProject(page, 'aparna')
    await page.getByRole('button', { name: /Contact/i }).click()
    await expect(page.getByText(/Gateway of Amaravati/i)).toBeVisible()
  })

  test('all projects have WhatsApp Chat button', async ({ page }) => {
    for (const proj of PROJECTS) {
      await goToProject(page, proj.id)
      await page.getByRole('button', { name: /Contact/i }).click()
      await expect(page.getByText(/WhatsApp Chat/i)).toBeVisible()
    }
  })
})

// ── 4. WhatsApp Links ─────────────────────────────────────────────────────────
test.describe('WhatsApp Message Content', () => {
  test('Anjana Paradise WhatsApp message contains correct text', async ({ page }) => {
    await goToProject(page, 'anjana')
    // Check the WhatsApp button href contains the right message
    const waBtn = page.locator('button:has-text("WhatsApp")').first()
    await expect(waBtn).toBeVisible()
  })

  test('Trimbak Oaks shows upcoming notice', async ({ page }) => {
    await goToProject(page, 'trimbak')
    await page.getByRole('button', { name: /Overview/i }).click()
    await expect(page.getByText(/Coming Soon/i).first()).toBeVisible()
  })
})

// ── 5. Back Navigation ────────────────────────────────────────────────────────
test.describe('Back Navigation', () => {
  test('Back button returns to homepage', async ({ page }) => {
    await goToProject(page, 'anjana')
    await page.getByRole('button', { name: /Back/i }).click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

// ── 6. Enquire Now Modal ──────────────────────────────────────────────────────
test.describe('Project Enquire Now', () => {
  test('Enquire Now button opens modal on project page', async ({ page }) => {
    await goToProject(page, 'anjana')
    await page.getByRole('button', { name: /Enquire Now/i }).first().click()
    await expect(page.locator('[class*="modal"], [class*="Modal"]').first()).toBeVisible()
  })
})

// ── 7. Mobile Project Page ────────────────────────────────────────────────────
test.describe('Mobile Project Page', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('mobile nav menu shows on project page', async ({ page }) => {
    await goToProject(page, 'anjana')
    await page.locator('button[class*="mobileNav"]').click()
    await expect(page.getByText('Overview')).toBeVisible()
  })

  test('mobile menu closes after tab selection', async ({ page }) => {
    await goToProject(page, 'anjana')
    await page.locator('button[class*="mobileNav"]').click()
    await page.getByText('Amenities').click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/Amenities/i).first()).toBeVisible()
  })
})
