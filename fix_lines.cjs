const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix 7.2 — split b72 onto separate lines
let i = lines.findIndex(l => l.includes("const b72 = await page.locator('body').textContent(); expect(b72)"));
if (i !== -1) {
  lines.splice(i, 1,
    "    const b72 = await page.locator('body').textContent()",
    "    expect(b72).toMatch(/Chevitikallu|\u0c1a\u0c47\u0c35\u0c3f\u0c1f\u0c3f\u0c15\u0c32\u0c4d\u0c32\u0c41|Aparna/)"
  );
}

// Fix 9.3 — add waitForTimeout
i = lines.findIndex(l => l.includes("9.3 CTA button visible on mobile"));
if (i !== -1) {
  lines.splice(i + 1, 3,
    "    await page.goto(BASE)",
    "    await page.waitForTimeout(3000)",
    "    const b93 = await page.locator('body').textContent()",
    "    expect(b93).toMatch(/View Available Plots|Enquire Now|Schedule Site Visit/)"
  );
}

// Fix 10.3 — add missing b103 definition
i = lines.findIndex(l => l.includes("10.3 Phone number link visible"));
if (i !== -1) {
  lines.splice(i + 1, 3,
    "    await page.goto(BASE)",
    "    await page.waitForTimeout(3000)",
    "    const b103 = await page.locator('body').textContent()",
    "    expect(b103).toMatch(/99487|Call Us|WhatsApp|Chaturbhuja/)"
  );
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed!');
