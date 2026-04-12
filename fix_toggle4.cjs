const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let i = lines.findIndex(l => l.includes('async function switchToTelugu'));
let end = lines.findIndex((l, idx) => idx > i && l === '}');
lines.splice(i, end - i + 1,
  'async function switchToTelugu(page) {',
  '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '  await page.waitForTimeout(3000)',
  '  // Click the తె span inside nav — bubbles to toggle div onClick',
  '  await page.locator(\'nav span\').filter({ hasText: /^\u0c24\u0c46$/ }).first().click({ force: true })',
  '  await page.waitForTimeout(8000)',
  '}'
);

i = lines.findIndex(l => l.includes('async function switchToEnglish'));
end = lines.findIndex((l, idx) => idx > i && l === '}');
lines.splice(i, end - i + 1,
  'async function switchToEnglish(page) {',
  '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '  await page.waitForTimeout(3000)',
  '  // Click the EN span inside nav',
  '  await page.locator(\'nav span\').filter({ hasText: /^EN$/ }).first().click({ force: true })',
  '  await page.waitForTimeout(8000)',
  '}'
);

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed — clicking తె span directly!');
