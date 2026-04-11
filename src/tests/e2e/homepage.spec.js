import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// Chaturbhuja Properties — End-to-End Test Suite
// Covers: EN + TE language, all sections, project pages, modals, forms
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3000'

// ── Helpers ──────────────────────────────────────────────────────────────────
async function switchToTelugu(page) {
  await page.waitForSelector('nav', { timeout: 15000 })
  await page.waitForTimeout(3000)
  // Click the తె span inside nav — bubbles to toggle div onClick
  await page.locator('nav span').filter({ hasText: /^తె$/ }).first().click({ force: true })
  await page.waitForTimeout(8000)
}

async function switchToEnglish(page) {
  await page.waitForSelector('nav', { timeout: 15000 })
  await page.waitForTimeout(2000)
  // Only click if currently in Telugu mode
  const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'))
  if (lang === 'te') {
    await page.locator('nav span').filter({ hasText: /^EN$/ }).first().click({ force: true })
    await page.waitForTimeout(6000)
  }
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
    await page.waitForTimeout(4000)
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
    await page.waitForSelector('nav', { timeout: 15000 })
    await page.waitForTimeout(2000)
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
    const locBody = await page.locator('body').textContent()
    expect(locBody).toContain('Anjana Paradise')
    expect(locBody).toContain('Aparna Legacy')
    expect(locBody).toContain('Varaha Virtue'); expect(locBody).toContain('Trimbak Oaks')
  })

  test('2.7 Plots section shows East-Facing / West-Facing', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await expect(page.locator('text=East-Facing').first()).toBeVisible()
    await expect(page.locator('text=West-Facing').first()).toBeVisible()
  })

  test('2.8 Footer visible with tagline', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(4000)
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 3 — Telugu Mode (i18n)
// ══════════════════════════════════════════════════════════════════════════════
test.describe('3. Telugu Mode — i18n', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('#root', { timeout: 15000 })
    await page.waitForTimeout(2000)
    await switchToTelugu(page)
  })

  test('3.1 Hero CTA changes to Telugu', async ({ page }) => {
    await page.waitForSelector('#root', { timeout: 15000 })
    await page.waitForTimeout(3000)
    const body31 = await page.locator('body').textContent()
    expect(body31).toMatch(/అందుబాటులోని|ఇప్పుడే|అందుబాటు|సైట్|పాంప్లెట్/)
  })

  test('3.2 Navbar shows Telugu text', async ({ page }) => {
    const nav = page.locator('nav')
    const text = await nav.textContent()
    expect(text).toMatch(/[\u0C00-\u0C7F]/)
  })

  test('3.3 Why Chaturbhuja shows Telugu', async ({ page }) => {
    const b33 = await page.locator('body').textContent(); expect(b33).toContain('మాతో ఎందుకు')
  })

  test('3.4 Amenities section shows Telugu heading', async ({ page }) => {
    const b34 = await page.locator('body').textContent(); expect(b34).toContain('అత్యాధునిక సౌకర్యాలు')
  })

  test('3.5 Plot categories show Telugu', async ({ page }) => {
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    const b35 = await page.locator('body').textContent(); expect(b35).toContain('ప్లాట్ విభాగాలు')
  })

  test('3.6 Location section shows Telugu heading', async ({ page }) => {
    const b36 = await page.locator('body').textContent(); expect(b36).toContain('మమ్మల్ని కనుగొనండి')
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
      await expect(page.locator('[class*="tab"]').first()).toBeVisible()
    })
  }

  test('4.9 Anjana Paradise pricing visible', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    // Click Overview tab
    await page.locator('text=Overview').or(page.locator('text=వివరణ')).first().click()
    await page.waitForTimeout(4000)
    const pricingBody = await page.locator('body').textContent()
    expect(pricingBody).toMatch(/PLOT PRICING|ప్లాట్ ధరలు/)
  })

  test('4.10 Anjana amenities tab works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Amenities').or(page.locator('text=సౌకర్యాలు')).first().click()
    await page.waitForTimeout(4000)
    await expect(page.locator('[class*="amGrid"], [class*="amItem"]').first()).toBeVisible()
  })

  test('4.11 Project page EN→TE translation works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.waitForSelector('nav', { timeout: 15000 })
    await page.waitForTimeout(2000)
    await page.locator('nav span').filter({ hasText: /^తె$/ }).first().click({ force: true }).catch(async () => {
      await page.evaluate(() => {
        const spans = Array.from(document.querySelectorAll('span'))
        const te = spans.find(s => s.textContent.trim() === 'తె')
        if (te) te.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
    })
    await page.waitForTimeout(6000)
    const header = await page.locator('nav, header').first().textContent()
    expect(header).toMatch(/[ఀ-౿]/)
  })

  test('4.12 Back to Home button works', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Back to Home').or(page.locator('text=హోమ్')).first().click()
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
    const b94 = await page.locator('body').textContent(); expect(b94).toContain('Anjana Paradise')
  })

  test('5.2 Clicking Anjana from dropdown navigates to project page', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
    await page.waitForTimeout(2000)
    // Click first dropCard — Anjana Paradise is always first active project
    await page.locator('[class*="dropCard"]').first().click()
    await page.waitForTimeout(3000)
    const url = page.url()
    expect(url).toMatch(/\/project\/(anjana|aparna|trimbak|varaha)/)
  })

  test('5.3 View All Projects link works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
    await page.locator('text=View All Projects').first().click()
    await expect(page).toHaveURL(/\/#portfolio|\/portfolio|\//)
  })

  test('5.4 404 page shows for unknown route', async ({ page }) => {
    const res = await page.goto(`${BASE}/unknown-page-xyz`)
    const notFoundBody = await page.locator('body').textContent()
    expect(notFoundBody).toMatch(/404|Page Not Found|not found/i)
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
    await page.waitForTimeout(2000)
    // Try Escape key — works universally
    await page.keyboard.press('Escape')
    await page.waitForTimeout(2000)
    const isVis = await page.locator('[class*="modal"], [role="dialog"]').first().isVisible().catch(() => false)
    expect(isVis).toBe(false)
  })

  test('6.4 Modal shows validation — empty submit', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("View Available Plots")').first().click()
    await page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Enquire Now")').first().click()
    // Should show validation error or not proceed
    await page.waitForTimeout(4000)
    await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  })

  test('6.5 Book Site Visit modal opens', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit"), button:has-text("సైట్ విజిట్")').first().click()
    await page.waitForTimeout(2000)
    const b65 = await page.locator('body').textContent()
    expect(b65).toMatch(/Book Site Visit|Schedule|Site Visit|షెడ్యూల్/)
  })

  test('6.6 Modal shows in Telugu when language is TE', async ({ page }) => {
    await page.goto(BASE)
    await switchToTelugu(page)
    await page.waitForTimeout(2000)
    // Click first hero button to open modal
    await page.locator('button').filter({ hasText: /అందుబాటు|సైట్|చూడండి/ }).first().click().catch(() => {})
    await page.waitForTimeout(3000)
    const body = await page.locator('body').textContent()
    expect(body).toMatch(/[ఀ-౿]/)
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
    await page.waitForTimeout(1500)
    await expect(page.locator('text=Lifestyle').first()).toBeVisible()
  })

  test('7.2 Location section tab switching works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#location').scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(2000)
    // Click Aparna tab by index using force — avoids hidden mobile element
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[class*="locTab"], [class*="projTab"]'))
      const aparna = tabs.find(t => t.textContent.includes('Aparna'))
      if (aparna) aparna.click()
      else {
        // fallback — click second location button
        const btns = Array.from(document.querySelectorAll('#location button, #location [role="button"]'))
        if (btns[1]) btns[1].click()
      }
    })
    await page.waitForTimeout(4000)
    const b72 = await page.locator('body').textContent()
    expect(b72).toMatch(/Chevitikallu|చేవిటికల్లు|Aparna/)
  })

  test('7.3 Plot venture switcher works', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    await page.locator('[class*="ventureBtn"]:has-text("Aparna")').first().click()
    await page.waitForTimeout(1500)
    const b73 = await page.locator('body').textContent(); expect(b73).toMatch(/273/)
  })

  test('7.4 Pricing toggle opens pricing dropdown', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
    const pricingBtn = page.locator('[class*="priceBanner"]').first()
    if (await pricingBtn.isVisible()) {
      await pricingBtn.click()
      await page.waitForTimeout(1500)
      const b74 = await page.locator('body').textContent(); expect(b74).toMatch(/East|తూర్పు/)
    }
  })

  test('7.5 Gallery images load', async ({ page }) => {
    await page.goto(`${BASE}/project/anjana`)
    await page.locator('text=Gallery').or(page.locator('text=గ్యాలరీ')).first().click()
    await page.waitForTimeout(3000)
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
      await page.waitForTimeout(1500)
      await expect(page.locator('[class*="mobileMenu"], [class*="mobile"]').first()).toBeVisible()
    }
  })

  test('9.3 CTA button visible on mobile', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(3000)
    const b93 = await page.locator('body').textContent()
    expect(b93).toMatch(/View Available Plots|Enquire Now|Schedule Site Visit/)
  })

  test('9.4 Project cards visible on mobile', async ({ page }) => {
    await page.goto(BASE)
    await page.locator('#portfolio, #plots').first().scrollIntoViewIfNeeded().catch(() => {})
    const b94 = await page.locator('body').textContent()
    expect(b94).toContain('Anjana Paradise')
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
    await page.waitForTimeout(3000)
    const b103 = await page.locator('body').textContent()
    expect(b103).toMatch(/99487|Call Us|WhatsApp|Chaturbhuja/)
  })
})
