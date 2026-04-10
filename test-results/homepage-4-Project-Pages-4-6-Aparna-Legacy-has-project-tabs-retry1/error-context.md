# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.js >> 4. Project Pages >> 4.6 Aparna Legacy has project tabs
- Location: src\tests\e2e\homepage.spec.js:187:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Home, text=హోమ్, [class*="tab"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Home, text=హోమ్, [class*="tab"]').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button "Back to Home" [ref=e6] [cursor=pointer]:
        - img [ref=e7]
        - text: Back to Home
      - generic [ref=e9]:
        - generic [ref=e10]: Aparna Legacy
        - generic [ref=e11]: 📍 Chevitikallu, Gateway of Amaravati Capital Region
      - generic [ref=e12]:
        - button "Switch to Telugu" [ref=e13] [cursor=pointer]:
          - generic [ref=e14]: EN
          - generic [ref=e15]: తె
        - button "Enquire Now →" [ref=e16] [cursor=pointer]
    - navigation [ref=e17]:
      - button "Home" [ref=e18] [cursor=pointer]
      - button "Overview" [ref=e19] [cursor=pointer]
      - button "Amenities" [ref=e20] [cursor=pointer]
      - button "Gallery" [ref=e21] [cursor=pointer]
      - button "Videos" [ref=e22] [cursor=pointer]
      - button "Location" [ref=e23] [cursor=pointer]
      - button "Contact" [ref=e24] [cursor=pointer]
  - main [ref=e25]:
    - generic [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]: Limited
          - heading "Aparna Legacy" [level=1] [ref=e31]
          - paragraph [ref=e32]: 📍 Chevitikallu, Gateway of Amaravati Capital Region
          - paragraph [ref=e33]: Premium APCRDA proposed layout plots at Chevitikallu, NTR District — located near the Outer Ring Road with outstanding connectivity to Amaravati. Vastu-compliant plots available. Phase II now open for booking.
          - generic [ref=e34]:
            - button "Enquire Now →" [ref=e35] [cursor=pointer]
            - button "Send WhatsApp" [ref=e36] [cursor=pointer]:
              - img [ref=e37]
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]: "273"
            - generic [ref=e42]: Total Plots
          - generic [ref=e44]:
            - generic [ref=e45]: Rs.26L
            - generic [ref=e46]: Starting from
      - generic [ref=e47]:
        - generic [ref=e48]: ✓ APCRDA Proposed Layout
        - generic [ref=e49]: ✓ 100% Vastu Compliant
        - generic [ref=e50]: ✓ 100% Clear Title
        - generic [ref=e51]: ✓ RERA Registered
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: ✓
          - generic [ref=e55]: Near ORR — excellent AP Capital connectivity
        - generic [ref=e56]:
          - generic [ref=e57]: ✓
          - generic [ref=e58]: 12 km from Amaravati Capital City
        - generic [ref=e59]:
          - generic [ref=e60]: ✓
          - generic [ref=e61]: Govt. Proposed Railway Connectivity from Amaravati
        - generic [ref=e62]:
          - generic [ref=e63]: ✓
          - generic [ref=e64]: Near Amrita Sai, MVR & MIC Engineering Colleges
        - generic [ref=e65]:
          - generic [ref=e66]: ✓
          - generic [ref=e67]: Close to Nimra Medical College
        - generic [ref=e68]:
          - generic [ref=e69]: ✓
          - generic [ref=e70]: Near Mulapadu International Cricket Stadium
        - generic [ref=e71]:
          - generic [ref=e72]: ✓
          - generic [ref=e73]: Proposed Logistic Hub at Paritala
        - generic [ref=e74]:
          - generic [ref=e75]: ✓
          - generic [ref=e76]: Govt. Proposed Cine Studio near Nandigama
```

# Test source

```ts
  89  |   test('2.4 Why Chaturbhuja section visible', async ({ page }) => {
  90  |     await page.locator('#highlights, [id="highlights"], section').nth(2).scrollIntoViewIfNeeded().catch(() => {})
  91  |     await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  92  |   })
  93  | 
  94  |   test('2.5 Amenities section has tabs', async ({ page }) => {
  95  |     await page.locator('#amenities').scrollIntoViewIfNeeded().catch(() => {})
  96  |     await expect(page.locator('text=What We Offer').first()).toBeVisible()
  97  |   })
  98  | 
  99  |   test('2.6 Location section visible with 4 project tabs', async ({ page }) => {
  100 |     await page.locator('#location, [id="location"]').scrollIntoViewIfNeeded().catch(() => {})
  101 |     await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  102 |     await expect(page.locator('text=Aparna Legacy').first()).toBeVisible()
  103 |     await expect(page.locator('text=Varaha Virtue').first()).toBeVisible()
  104 |     await expect(page.locator('text=Trimbak Oaks').first()).toBeVisible()
  105 |   })
  106 | 
  107 |   test('2.7 Plots section shows East-Facing / West-Facing', async ({ page }) => {
  108 |     await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
  109 |     await expect(page.locator('text=East-Facing').first()).toBeVisible()
  110 |     await expect(page.locator('text=West-Facing').first()).toBeVisible()
  111 |   })
  112 | 
  113 |   test('2.8 Footer visible with tagline', async ({ page }) => {
  114 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  115 |     await page.waitForTimeout(500)
  116 |     await expect(page.locator('footer').first()).toBeVisible()
  117 |   })
  118 | })
  119 | 
  120 | // ══════════════════════════════════════════════════════════════════════════════
  121 | // SUITE 3 — Telugu Mode (i18n)
  122 | // ══════════════════════════════════════════════════════════════════════════════
  123 | test.describe('3. Telugu Mode — i18n', () => {
  124 |   test.beforeEach(async ({ page }) => {
  125 |     await page.goto(BASE)
  126 |     await switchToTelugu(page)
  127 |   })
  128 | 
  129 |   test('3.1 Hero CTA changes to Telugu', async ({ page }) => {
  130 |     const cta = page.locator('button:has-text("అందుబాటులోని"), button:has-text("ఇప్పుడే")').first()
  131 |     await expect(cta).toBeVisible()
  132 |   })
  133 | 
  134 |   test('3.2 Navbar shows Telugu text', async ({ page }) => {
  135 |     const nav = page.locator('nav')
  136 |     const text = await nav.textContent()
  137 |     expect(text).toMatch(/[\u0C00-\u0C7F]/)
  138 |   })
  139 | 
  140 |   test('3.3 Why Chaturbhuja shows Telugu', async ({ page }) => {
  141 |     await expect(page.locator('text=మాతో ఎందుకు').first()).toBeVisible()
  142 |   })
  143 | 
  144 |   test('3.4 Amenities section shows Telugu heading', async ({ page }) => {
  145 |     await expect(page.locator('text=అత్యాధునిక సౌకర్యాలు').first()).toBeVisible()
  146 |   })
  147 | 
  148 |   test('3.5 Plot categories show Telugu', async ({ page }) => {
  149 |     await page.locator('#plots').scrollIntoViewIfNeeded().catch(() => {})
  150 |     await expect(page.locator('text=ప్లాట్ విభాగాలు').first()).toBeVisible()
  151 |   })
  152 | 
  153 |   test('3.6 Location section shows Telugu heading', async ({ page }) => {
  154 |     await expect(page.locator('text=మమ్మల్ని కనుగొనండి').first()).toBeVisible()
  155 |   })
  156 | 
  157 |   test('3.7 No raw key strings visible (e.g. "sections.highlights")', async ({ page }) => {
  158 |     const body = await page.locator('body').textContent()
  159 |     const rawKeys = body?.match(/\b(nav|sections|hero|project|modal|quote|portfolio|urgency|footer)\.[a-z]+/g) || []
  160 |     const filtered = rawKeys.filter(k => !k.includes('localhost') && !k.includes('.jsx') && !k.includes('.js'))
  161 |     expect(filtered.length).toBe(0)
  162 |   })
  163 | 
  164 |   test('3.8 Switching back to English restores EN content', async ({ page }) => {
  165 |     await switchToEnglish(page)
  166 |     await expect(page.locator('text=Why Chaturbhuja').first()).toBeVisible()
  167 |   })
  168 | })
  169 | 
  170 | // ══════════════════════════════════════════════════════════════════════════════
  171 | // SUITE 4 — Project Pages
  172 | // ══════════════════════════════════════════════════════════════════════════════
  173 | test.describe('4. Project Pages', () => {
  174 |   const PROJECTS = [
  175 |     { id: 'anjana',  name: 'Anjana Paradise',  loc: 'Paritala' },
  176 |     { id: 'aparna',  name: 'Aparna Legacy',    loc: 'Chevitikallu' },
  177 |     { id: 'varaha',  name: 'Varaha Virtue',    loc: 'Pamarru' },
  178 |     { id: 'trimbak', name: 'Trimbak Oaks',     loc: 'Penamaluru' },
  179 |   ]
  180 | 
  181 |   for (const proj of PROJECTS) {
  182 |     test(`4.${PROJECTS.indexOf(proj)+1} ${proj.name} page loads`, async ({ page }) => {
  183 |       await page.goto(`${BASE}/project/${proj.id}`)
  184 |       await expect(page.locator(`text=${proj.name}`).first()).toBeVisible()
  185 |     })
  186 | 
  187 |     test(`4.${PROJECTS.indexOf(proj)+5} ${proj.name} has project tabs`, async ({ page }) => {
  188 |       await page.goto(`${BASE}/project/${proj.id}`)
> 189 |       await expect(page.locator('text=Home, text=హోమ్, [class*="tab"]').first()).toBeVisible()
      |                                                                                  ^ Error: expect(locator).toBeVisible() failed
  190 |     })
  191 |   }
  192 | 
  193 |   test('4.9 Anjana Paradise pricing visible', async ({ page }) => {
  194 |     await page.goto(`${BASE}/project/anjana`)
  195 |     // Click Overview tab
  196 |     await page.locator('text=Overview, text=వివరణ').first().click()
  197 |     await page.waitForTimeout(500)
  198 |     await expect(page.locator('text=PLOT PRICING, text=ప్లాట్ ధరలు').first()).toBeVisible()
  199 |   })
  200 | 
  201 |   test('4.10 Anjana amenities tab works', async ({ page }) => {
  202 |     await page.goto(`${BASE}/project/anjana`)
  203 |     await page.locator('text=Amenities, text=సౌకర్యాలు').first().click()
  204 |     await page.waitForTimeout(500)
  205 |     await expect(page.locator('[class*="amGrid"], [class*="amItem"]').first()).toBeVisible()
  206 |   })
  207 | 
  208 |   test('4.11 Project page EN→TE translation works', async ({ page }) => {
  209 |     await page.goto(`${BASE}/project/anjana`)
  210 |     await switchToTelugu(page)
  211 |     await page.waitForTimeout(500)
  212 |     const header = await page.locator('nav, header').first().textContent()
  213 |     expect(header).toMatch(/[\u0C00-\u0C7F]/)
  214 |   })
  215 | 
  216 |   test('4.12 Back to Home button works', async ({ page }) => {
  217 |     await page.goto(`${BASE}/project/anjana`)
  218 |     await page.locator('text=Back to Home, text=హోమ్‌కు తిరిగి').first().click()
  219 |     await expect(page).toHaveURL(BASE + '/')
  220 |   })
  221 | })
  222 | 
  223 | // ══════════════════════════════════════════════════════════════════════════════
  224 | // SUITE 5 — Navigation
  225 | // ══════════════════════════════════════════════════════════════════════════════
  226 | test.describe('5. Navigation', () => {
  227 |   test('5.1 Portfolio dropdown opens on click', async ({ page }) => {
  228 |     await page.goto(BASE)
  229 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  230 |     await expect(page.locator('text=Anjana Paradise').first()).toBeVisible()
  231 |   })
  232 | 
  233 |   test('5.2 Clicking Anjana from dropdown navigates to project page', async ({ page }) => {
  234 |     await page.goto(BASE)
  235 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  236 |     await page.locator('[class*="dropCard"]:has-text("Anjana")').first().click()
  237 |     await expect(page).toHaveURL(/\/project\/anjana/)
  238 |   })
  239 | 
  240 |   test('5.3 View All Projects link works', async ({ page }) => {
  241 |     await page.goto(BASE)
  242 |     await page.locator('nav button:has-text("Portfolio"), nav [class*="dropTrigger"]').first().click()
  243 |     await page.locator('text=View All Projects').first().click()
  244 |     await expect(page).toHaveURL(/\/#portfolio|\/portfolio|\//)
  245 |   })
  246 | 
  247 |   test('5.4 404 page shows for unknown route', async ({ page }) => {
  248 |     const res = await page.goto(`${BASE}/unknown-page-xyz`)
  249 |     await expect(page.locator('text=404, text=Page Not Found').first()).toBeVisible()
  250 |   })
  251 | })
  252 | 
  253 | // ══════════════════════════════════════════════════════════════════════════════
  254 | // SUITE 6 — Lead Modal
  255 | // ══════════════════════════════════════════════════════════════════════════════
  256 | test.describe('6. Lead Modal', () => {
  257 |   test('6.1 Modal opens when CTA clicked', async ({ page }) => {
  258 |     await page.goto(BASE)
  259 |     await page.locator('button:has-text("View Available Plots"), button:has-text("Enquire Now")').first().click()
  260 |     await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  261 |   })
  262 | 
  263 |   test('6.2 Modal has name and phone fields', async ({ page }) => {
  264 |     await page.goto(BASE)
  265 |     await page.locator('button:has-text("View Available Plots"), button:has-text("Enquire")').first().click()
  266 |     await expect(page.locator('input[type="text"], input[placeholder*="Name"], input[placeholder*="name"]').first()).toBeVisible()
  267 |     await expect(page.locator('input[type="tel"], input[placeholder*="Phone"], input[placeholder*="phone"]').first()).toBeVisible()
  268 |   })
  269 | 
  270 |   test('6.3 Modal closes on X button', async ({ page }) => {
  271 |     await page.goto(BASE)
  272 |     await page.locator('button:has-text("View Available Plots")').first().click()
  273 |     await page.locator('[class*="modal"] button[aria-label="Close"], [class*="closeBtn"], button:has-text("×"), button:has-text("✕")').first().click()
  274 |     await expect(page.locator('[class*="modal"], [role="dialog"]').first()).not.toBeVisible()
  275 |   })
  276 | 
  277 |   test('6.4 Modal shows validation — empty submit', async ({ page }) => {
  278 |     await page.goto(BASE)
  279 |     await page.locator('button:has-text("View Available Plots")').first().click()
  280 |     await page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Enquire Now")').first().click()
  281 |     // Should show validation error or not proceed
  282 |     await page.waitForTimeout(500)
  283 |     await expect(page.locator('[class*="modal"], [role="dialog"]').first()).toBeVisible()
  284 |   })
  285 | 
  286 |   test('6.5 Book Site Visit modal opens', async ({ page }) => {
  287 |     await page.goto(BASE)
  288 |     await page.locator('button:has-text("Book Site Visit"), button:has-text("Site Visit"), button:has-text("సైట్ విజిట్")').first().click()
  289 |     await expect(page.locator('text=Book Site Visit, text=Schedule').first()).toBeVisible()
```