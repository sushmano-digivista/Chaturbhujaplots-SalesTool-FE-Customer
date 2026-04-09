import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// Chaturbhuja Properties — End-to-End Test Suite
// Covers: EN + TE language, all sections, project pages, modals, forms
// ─────────────────────────────────────────────────────────────────────────────

const BASE = 'http://127.0.0.1:3000'

// ── Helpers ──────────────────────────────────────────────────────────────────
async function switchToTelugu(page) {
  const toggle = page.locator('button:has-text("EN"), button:has-text("తె"), [class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent()
  if (text?.includes('EN')) await toggle.click()
  await page.waitForTimeout(500)
}

async function switchToEnglish(page) {
  const toggle = page.locator('button:has-text("EN"), button:has-text("తె"), [class*="langToggle"], [class*="LanguageToggle"]').first()
  const text = await toggle.textContent()
  if (text?.includes('తె')) await toggle.click()
  await page.waitForTimeout(500)
}

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 1 — Page Load & Core Structure
// ══════════════════════════════════════════════════════════════════════════════
test.describe('1. Page Load & Core Structure', () => {
  test('1.1 Homepage loads with 200 status', async ({ page }) => {
    const res = await page.goto(BASE)
    expect(res.status()).toBe(200)
  })

  test('1.2 Page title contains Chaturbhuja', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle(/Chaturbhuja/i)
  })

  test('1.3 Navbar is visible', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('1.4 Language toggle button is visible', async ({ page }) => {
    await page.goto(BASE)
    const toggle = page.locator('button:has-text("EN"), button:has-text("తె"), [class*="langToggle"]').first()
    await expect(toggle).toBeVisible()
  })

  test('1.5 Hero section is visible', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('#hero, [class*="hero"], section').first()).toBeVisible()
  })

  test('1.6 No console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.goto(BASE)
    await page.waitForTimeout(2000)
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('DevTools'))
    expect(critical.length).toBe(0)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 2 — English Mode (default)
// ══════════════════════════════════════════════════════════════════════════════
test.describe('2. English Mode — Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await switchToEnglish(page)
  })

  test('2.1 Hero headline visible in English', async ({ page }) => {
    const hero = page.locator('h1, [class*="heroH"], [class*="headline"]').first()
    await expect(hero).toBeVisible()
    const text = await hero.textContent()
    expect(text?.length).toBeGreaterThan(5)
  })

  test('2.2 "View Available Plots" CTA button visible', async ({ page }) => {
    await expect(page.locator('button:has-text("View Available Plots"), a:has-text("View Available Plots")').first()).toBeVisible()
  })

  test('2.3 Navbar has Portfolio link', async ({ page }) => {
    await expect(page.locator('nav').locator('text=Portfolio').first()).toBeVisible()
  })

  test('2.4 Why Chaturbhuja section visible', async ({ page }) => {
    await page.locator('#highlights, [id="highlights"], section').nth(2).scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  })

  test('2.5 Amenities section has tabs', async ({ page }) => {
    await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=What We Offer').first()).toBeVisible()
  })

  test('2.6 Location section visible with 4 project tabs', async ({ page }) => {
    await page.locator('#location, [id="location"]').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
    await expect(page.locator('text=Aparna Legacy').first()).toBeVisible()
    await expect(page.locator('text=Varaha Virtue').first()).toBeVisible()
    await expect(page.locator('text=Trimbak Oaks').first()).toBeVisible()
  })

  test('2.7 Plots section shows East-Facing / West-Facing', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=East-Facing').first()).toBeVisible()
    await expect(page.locator('text=West-Facing').first()).toBeVisible()
  })

  test('2.8 Footer visible with tagline', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 3 — Telugu Mode (i18n)
// ══════════════════════════════════════════════════════════════════════════════
test.describe('3. Telugu Mode — i18n', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await switchToTelugu(page)
  })

  test('3.1 Hero CTA changes to Telugu', async ({ page }) => {
    const cta = page.locator('button:has-text("అందుబాటులోని"), button:has-text("ఇప్పుడే")').first()
    await expect(cta).toBeVisible()
  })

  test('3.2 Navbar shows Telugu text', async ({ page }) => {
    const nav = page.locator('nav')
    const text = await nav.textContent()
    expect(text).toMatch(/[\u0C00-\u0C7F]/)
  })

  test('3.3 Why Chaturbhuja shows Telugu', async ({ page }) => {
    await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  })

  test('3.4 Amenities section shows Telugu heading', async ({ page }) => {
    await expect(page.locator('text=అత్యాధునిక సౌకర్యాలు').first()).toBeVisible()
  })

  test('3.5 Plot categories show Telugu', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=ప్లాట్ విభాగాలు').first()).toBeVisible()
  })

  test('3.6 Location section shows Telugu heading', async ({ page }) => {
    await expect(page.locator('text=మమ్మల్ని కనుగొనండి').first()).toBeVisible()
  })

  test('3.7 No raw key strings visible (e.g. "sections.highlights")', async ({ page }) => {
    const body = await page.locator('body').textContent()
    const rawKeys = body?.match(/\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer)\.[a-z]+/g) || []
    const filtered = rawKeys.filter(k => !k.includes('localhost') && !k.includes('.jsx') && !k.includes('.js'))
    expect(filtered.length).toBe(0)
  })

  test('3.8 Switching back to English restores EN content', async ({ page }) => {
    await switchToEnglish(page)
    await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 4 — Project Pages
// ══════════════════════════════════════════════════════════════════════════════
test.describe('4. Project Pages', () => {
  const PROJECTS = [
    { id: 'anjana',  name: 'Anjana Paradise',  loc: 'Paritala' },
    { id: 'aparna',  name: 'Aparna Legacy',    loc: 'Chevitikallu' },
    { id: 'varaha',  name: 'Varaha Virtue',    loc: 'Pamarru' },
    { id: 'trimbak', name: 'Trimbak Oaks',     loc: 'Penamaluru' },
  ]

  for (const proj of PROJECTS) {
    test(`4.${PROJECTS.indexOf(proj)+1} ${proj.name} page loads`, async ({ page }) => {
      await page.goto(`${BASE}/project/${proj.id}`)
      await expect(page.locator(`text=${proj.name}`).first()).toBeVisible()
    })

    test(`4.${PROJECTS.indexOf(proj)+5} ${proj.name} has project tabs`, async ({ page }) => {
      await page.goto(`${BASE}/project/${proj.id}`)
      await expect(page.locator('text=Home, text=హోమ్, [class*="tab"]').first()).toBeVisible()
    })
  }

  test('4.9 Anjana Paradise pricing visible', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    // Click Overview tab
    await page.locator('text=Overview, text=వివరణ').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=PLOT PRICING, text=ప్లాట్ ధరలు').first()).toBeVisible()
  })

  test('4.10 Anjana amenities tab works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Amenities, text=సౌకర్యాలు').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="amGrid"], [class*="amItem"]').first()).toBeVisible()
  })

  test('4.11 Project page EN→TE translation works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await switchToTelugu(page)
    await page.waitForTimeout(500)
    const header = await page.locator('nav, header').first().textContent()
    expect(header).toMatch(/[\u0C00-\u0C7F]/)
  })

  test('4.12 Back to Home button works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Back to Home, text=హోమ్‌కు తిరిగి').first().click()
    await expect(page).toHaveURL(BASE + '/')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 5 — Navigation
// ══════════════════════════════════════════════════════════════════════════════
test.describe('5. Navigation', () => {
  test('5.1 Portfolio dropdown opens on click', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
    await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  })

  test('5.2 Clicking Anjana from dropdown navigates to project page', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
    await page.locator('[class*="dropCard"]:has-text("Anjana")').first().click()
    await expect(page).toHaveURL(/\/project\/anjana/)
  })

  test('5.3 View All Projects link works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
    await page.locator('text=View All Projects').first().click()
    await expect(page).toHaveURL(/\/#portfolio|\/portfolio|\//)
  })

  test('5.4 404 page shows for unknown route', async ({ page }) => {
    const res = await page.goto(`${BASE}/unknown-page-xyz`)
    await expect(page.locator('text=404, text=Page Not Found').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 6 — Lead Modal
// ══════════════════════════════════════════════════════════════════════════════
test.describe('6. Lead Modal', () => {
  test('6.1 Modal opens when CTA clicked', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("View Available Plots"), button:has-text("Enquire Now")').first().click()
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

  test('6.2 Modal has name and phone fields', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("View Available Plots"), button:has-text("Enquire")').first().click()
    await expect(page.locator('input[type="text"], input[placeholder*="Name"], input[placeholder*="name"]').first()).toBeVisible()
    await expect(page.locator('input[type="tel"], input[placeholder*="Phone"], input[placeholder*="phone"]').first()).toBeVisible()
  })

  test('6.3 Modal closes on X button', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.locator('[class*="modal"] button[aria-label="Close"], [class*="closeBtn"], button:has-text("×"), button:has-text("✕")').first().click()
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).not.toBeVisible()
  })

  test('6.4 Modal shows validation — empty submit', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Enquire Now")').first().click()
    // Should show validation error or not proceed
    await page.waitForTimeout(500)
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

  test('6.5 Book Site Visit modal opens', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit"), button:has-text("సైట్ విజిట్")').first().click()
    await expect(page.locator('text=Book Site Visit, text=Schedule').first()).toBeVisible()
  })

  test('6.6 Modal shows in Telugu when language is TE', async ({ page }) => {
    await page.goto(BASE)
    await switchToTelugu(page)
    await page.locator('button:has-text("అందుబాటులోని"), button:has-text("ఇప్పుడే")').first().click()
    await page.waitForTimeout(500)
    const modal = page.locator('[class*="modal"], [role="dialog"]').first()
    const text = await modal.textContent()
    expect(text).toMatch(/[\u0C00-\u0C7F]/)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 7 — Sections Interaction
// ══════════════════════════════════════════════════════════════════════════════
test.describe('7. Sections Interaction', () => {
  test('7.1 Amenities tab switching works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('text=Lifestyle').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=Lifestyle').first()).toBeVisible()
  })

  test('7.2 Location section tab switching works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('text=Aparna Legacy').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Chevitikallu, text=చేవిటికల్లు').first()).toBeVisible()
  })

  test('7.3 Plot venture switcher works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('[class*="ventureBtn"]:has-text("Aparna")').first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('text=273 plots, text=273').first()).toBeVisible()
  })

  test('7.4 Pricing toggle opens pricing dropdown', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    const pricingBtn = page.locator('[class*="priceBanner"]').first()
    if (await pricingBtn.isVisible()) {
      await pricingBtn.click()
      await page.waitForTimeout(300)
      await expect(page.locator('text=East Facing, text=తూర్పు').first()).toBeVisible()
    }
  })

  test('7.5 Gallery images load', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Gallery, text=గ్యాలరీ').first().click()
    await page.waitForTimeout(1000)
    await expect(page.locator('[class*="galImg"], img').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 8 — Performance & SEO
// ══════════════════════════════════════════════════════════════════════════════
test.describe('8. Performance & SEO', () => {
  test('8.1 Page has meta description', async ({ page }) => {
    await page.goto(BASE)
    const meta = await page.locator('meta[name="description"]').getAttribute('content')
    expect(meta?.length).toBeGreaterThan(20)
  })

  test('8.2 Page has OG title for social sharing', async ({ page }) => {
    await page.goto(BASE)
    const og = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(og?.length).toBeGreaterThan(5)
  })

  test('8.3 Project pages have unique titles', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    const anjanaTitle = await page.title()
    await page.goto(`${BASE}/project/aparna`)
    const aparnaTitle = await page.title()
    expect(anjanaTitle).not.toBe(aparnaTitle)
  })

  test('8.4 Images have alt attributes', async ({ page }) => {
    await page.goto(BASE)
    const images = await page.locator('img').all()
    for (const img of images.slice(0, 5)) {
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('8.5 No broken internal links', async ({ page }) => {
    await page.goto(BASE)
    const links = await page.locator('a[href^="/"]').all()
    for (const link of links.slice(0, 5)) {
      const href = await link.getAttribute('href')
      if (href && !href.includes('#')) {
        const res = await page.goto(`${BASE}${href}`)
        expect(res?.status()).not.toBe(500)
        await page.goto(BASE)
      }
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 9 — Responsive / Mobile
// ══════════════════════════════════════════════════════════════════════════════
test.describe('9. Mobile Responsive', () => {
  test.use({ viewport: { width: 390, height: 844 } }) // iPhone 14

  test('9.1 Homepage loads on mobile', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('9.2 Mobile hamburger menu opens', async ({ page }) => {
    await page.goto(BASE)
    const hamburger = page.locator('[class*="menuBtn"], button[aria-label*="menu"], button:has([class*="Menu"])').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(300)
      await expect(page.locator('[class*="mobileMenu"], [class*="mobile"]').first()).toBeVisible()
    }
  })

  test('9.3 CTA button visible on mobile', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('button:has-text("View Available Plots"), button:has-text("Enquire")').first()).toBeVisible()
  })

  test('9.4 Project cards visible on mobile', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#portfolio, #plots').first().scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 10 — Contact & WhatsApp
// ══════════════════════════════════════════════════════════════════════════════
test.describe('10. Contact & WhatsApp', () => {
  test('10.1 Contact section visible', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#contact, [id="contact"]').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('#contact, [id="contact"]').first()).toBeVisible()
  })

  test('10.2 WhatsApp button has correct href', async ({ page }) => {
    await page.goto(BASE)
    const waBtn = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first()
    if (await waBtn.isVisible()) {
      const href = await waBtn.getAttribute('href')
      expect(href).toContain('wa.me')
    }
  })

  test('10.3 Phone number link visible', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('a[href*="tel:"], text=+91').first()).toBeVisible()
  })
})
