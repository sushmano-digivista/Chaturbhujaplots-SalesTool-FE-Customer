const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix switchToTelugu — use correct selector + text content EN/తె
let i = lines.findIndex(l => l.includes('async function switchToTelugu'));
if (i !== -1) {
  lines.splice(i, 9,
    'async function switchToTelugu(page) {',
    '  // CSS module compiles .toggle class — use text content EN/తె to find it',
    '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
    '  await page.waitForTimeout(2000)',
    '  const toggle = page.locator(\'button:has-text("EN తె"), button:has-text("EN"), [class*="toggle"]\').first()',
    '  const text = await toggle.textContent().catch(() => \'EN\')',
    '  if (text && text.includes(\'EN\')) await toggle.click().catch(() => {})',
    '  await page.waitForTimeout(6000)',
    '  await page.waitForFunction(() => document.documentElement.getAttribute(\'lang\') === \'te\', { timeout: 10000 }).catch(() => {})',
    '}'
  );
}

// Fix switchToEnglish
i = lines.findIndex(l => l.includes('async function switchToEnglish'));
if (i !== -1) {
  lines.splice(i, 7,
    'async function switchToEnglish(page) {',
    '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
    '  await page.waitForTimeout(2000)',
    '  const toggle = page.locator(\'button:has-text("EN తె"), button:has-text("తె"), [class*="toggle"]\').first()',
    '  const text = await toggle.textContent().catch(() => \'\')',
    '  if (text && text.includes(\'తె\')) await toggle.click().catch(() => {})',
    '  await page.waitForTimeout(6000)',
    '}'
  );
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Toggle selector fixed!');
