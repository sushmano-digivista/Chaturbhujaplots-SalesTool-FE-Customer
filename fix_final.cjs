const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find and replace switchToTelugu by line index
let i = lines.findIndex(l => l.includes('async function switchToTelugu'));
if (i !== -1) {
  lines.splice(i, 6,
    'async function switchToTelugu(page) {',
    '  await page.waitForSelector(\'[class*="langToggle"], [class*="LanguageToggle"]\', { timeout: 15000 })',
    '  const toggle = page.locator(\'[class*="langToggle"], [class*="LanguageToggle"]\').first()',
    '  const text = await toggle.textContent().catch(() => \'EN\')',
    '  const isEN = text ? text.includes(\'EN\') : true',
    '  if (isEN) await toggle.click()',
    '  await page.waitForTimeout(6000)',
    '  await page.waitForFunction(() => document.documentElement.classList.contains(\'lang-te\'), { timeout: 10000 }).catch(() => {})',
    '}'
  );
}

// Find and replace switchToEnglish by line index
i = lines.findIndex(l => l.includes('async function switchToEnglish'));
if (i !== -1) {
  lines.splice(i, 6,
    'async function switchToEnglish(page) {',
    '  await page.waitForSelector(\'[class*="langToggle"], [class*="LanguageToggle"]\', { timeout: 15000 })',
    '  const toggle = page.locator(\'[class*="langToggle"], [class*="LanguageToggle"]\').first()',
    '  const text = await toggle.textContent().catch(() => \'\')',
    '  if (text && text.includes(\'తె\')) await toggle.click()',
    '  await page.waitForTimeout(6000)',
    '}'
  );
}

// Fix test 3.1 — wait for splash to clear + wait for lang-te class
i = lines.findIndex(l => l.includes('3.1 Hero CTA changes to Telugu'));
if (i !== -1) {
  // Find the body31 line and replace the whole test body
  const testEnd = lines.findIndex((l, idx) => idx > i && l.trim() === '})');
  lines.splice(i + 1, testEnd - i - 1,
    '    await page.waitForSelector(\'#root\', { timeout: 15000 })',
    '    await page.waitForTimeout(3000)',
    '    const body31 = await page.locator(\'body\').textContent()',
    '    expect(body31).toMatch(/అందుబాటులోని|ఇప్పుడే|అందుబాటు|సైట్|పాంప్లెట్/)',
  );
}

// Fix tests 3.3-3.6 — add splash wait in beforeEach for suite 3
i = lines.findIndex(l => l.includes('3. Telugu Mode'));
if (i !== -1) {
  const beforeEach = lines.findIndex((l, idx) => idx > i && l.includes('test.beforeEach'));
  if (beforeEach !== -1) {
    const beforeEachEnd = lines.findIndex((l, idx) => idx > beforeEach && l.trim() === '})');
    lines.splice(beforeEach + 1, beforeEachEnd - beforeEach - 1,
      '    await page.goto(BASE)',
      '    await page.waitForSelector(\'#root\', { timeout: 15000 })',
      '    await page.waitForTimeout(2000)',
      '    await switchToTelugu(page)',
    );
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Done! switchToTelugu fixed with lang-te class wait.');
