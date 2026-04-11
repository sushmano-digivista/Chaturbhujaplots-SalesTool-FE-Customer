const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix switchToEnglish — only click if currently in Telugu
let i = lines.findIndex(l => l.includes('async function switchToEnglish'));
let end = lines.findIndex((l, idx) => idx > i && l === '}');
lines.splice(i, end - i + 1,
  'async function switchToEnglish(page) {',
  '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '  await page.waitForTimeout(2000)',
  '  // Only click if currently in Telugu mode',
  '  const lang = await page.evaluate(() => document.documentElement.getAttribute(\'lang\'))',
  '  if (lang === \'te\') {',
  '    await page.locator(\'nav span\').filter({ hasText: /^EN$/ }).first().click({ force: true })',
  '    await page.waitForTimeout(6000)',
  '  }',
  '}'
);

// Also fix Suite 2 beforeEach — just goto BASE, no switchToEnglish needed
// Page loads in English by default
i = lines.findIndex(l => l.includes('2. English Mode'));
const beforeEach = lines.findIndex((l, idx) => idx > i && l.includes('test.beforeEach'));
const beforeEachEnd = lines.findIndex((l, idx) => idx > beforeEach && l.trim() === '})');
lines.splice(beforeEach, beforeEachEnd - beforeEach + 1,
  '  test.beforeEach(async ({ page }) => {',
  '    await page.goto(BASE)',
  '    await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '    await page.waitForTimeout(2000)',
  '  })'
);

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed switchToEnglish and Suite 2 beforeEach!');
