const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Replace switchToTelugu with JS-based click
let i = lines.findIndex(l => l.includes('async function switchToTelugu'));
let end = lines.findIndex((l, idx) => idx > i && l === '}');
lines.splice(i, end - i + 1,
  'async function switchToTelugu(page) {',
  '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '  await page.waitForTimeout(2000)',
  '  // Use JS to find the EN/తె toggle by its unique dual-text content',
  '  await page.evaluate(() => {',
  '    const all = Array.from(document.querySelectorAll(\'div, button\'))',
  '    const toggle = all.find(el => {',
  '      const t = el.textContent || \'\'',
  '      return t.includes(\'EN\') && t.includes(\'\u0c24\u0c46\') && el.children.length <= 5',
  '    })',
  '    if (toggle) toggle.click()',
  '  })',
  '  await page.waitForTimeout(6000)',
  '  await page.waitForFunction(() => document.documentElement.getAttribute(\'lang\') === \'te\', { timeout: 10000 }).catch(() => {})',
  '}'
);

// Replace switchToEnglish
i = lines.findIndex(l => l.includes('async function switchToEnglish'));
end = lines.findIndex((l, idx) => idx > i && l === '}');
lines.splice(i, end - i + 1,
  'async function switchToEnglish(page) {',
  '  await page.waitForSelector(\'nav\', { timeout: 15000 })',
  '  await page.waitForTimeout(2000)',
  '  await page.evaluate(() => {',
  '    const all = Array.from(document.querySelectorAll(\'div, button\'))',
  '    const toggle = all.find(el => {',
  '      const t = el.textContent || \'\'',
  '      return t.includes(\'EN\') && t.includes(\'\u0c24\u0c46\') && el.children.length <= 5',
  '    })',
  '    if (toggle) toggle.click()',
  '  })',
  '  await page.waitForTimeout(6000)',
  '  await page.waitForFunction(() => document.documentElement.getAttribute(\'lang\') === \'en\', { timeout: 10000 }).catch(() => {})',
  '}'
);

fs.writeFileSync(file, lines.join('\n'));
console.log('switchToTelugu fixed with JS evaluate!');
