import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = (process.env.BASE_URL || 'http://127.0.0.1:8877').replace(/\/$/, '');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
await mkdir('.runtime', {recursive: true});
try {
  const page = await browser.newPage({viewport: {width: 390, height: 844}, hasTouch: true, reducedMotion: 'reduce'});
  await page.addInitScript(() => {
    window.spoken = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, 'speechSynthesis', {value: {
      getVoices: () => [{lang: 'zh-CN'}],
      cancel() {},
      speak: utterance => window.spoken.push(utterance.text),
    }});
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/sea-neighbors.html');
  const rows = page.locator('.creature-row');
  assert.deepEqual(await rows.locator('h2').allTextContents(), ['海马', '圆身鱼', '尖鳍鱼']);
  assert.deepEqual(await page.locator('.creature-group').evaluateAll(groups =>
    groups.map(group => [...group.querySelectorAll('.creature-letter')].map(cell =>
      cell.tagName === 'SELECT' ? '_' : cell.textContent).join(''))),
    ['_B_', 'F_A', 'A_C', 'G_B', 'C_E', '_E_', 'A_C', 'B_D', 'E_G']);
  const fields = page.locator('.creature select');
  assert.equal(await fields.count(), 11);
  assert.equal(await page.locator('#blank-total').innerText(), '11');
  await page.locator('#speak').tap();
  assert.match(await page.evaluate(() => window.spoken[0]), /从左到右/);
  for (let n = 0; n < 3; n++) await page.locator('#check').tap();
  assert.match(await page.locator('#feedback').innerText(), /还有 11/);
  assert.equal(await page.locator('.retry-hint').count(), 0);
  const first = fields.first();
  const desktop = await browser.newPage();
  await desktop.goto(base + "/sea-neighbors.html");
  const desktopField = desktop.locator(".creature select").first();
  await desktop.locator("#speak").focus();
  await desktop.keyboard.press("Tab");
  assert.equal(await desktopField.evaluate(field => document.activeElement === field), true);
  await desktop.close();
  await first.selectOption('G');
  assert.equal(await page.locator('.belly-label.answered').first().innerText(), 'G');
  for (let n = 1; n <= 6; n++) {
    await page.locator('#check').tap();
    assert.equal(await page.locator('.retry-hint').count(), Number(n >= 3));
    assert.equal(await page.locator('.retry-answer').count(), Number(n >= 6));
  }
  assert.match(await page.locator('.retry-answer').innerText(), /A$/);
  const answers = ['A', 'C', 'G', 'B', 'A', 'D', 'D', 'F', 'B', 'C', 'F'];
  for (const [index, answer] of answers.entries()) await fields.nth(index).selectOption(answer);
  assert.deepEqual(await page.locator('.belly-label.answered').allTextContents(), answers);
  await page.screenshot({path: '.runtime/sea_neighbors_answered.png', fullPage: true});
  assert.equal(await page.locator('.retry-hint').count(), 0);
  await page.locator('#check').tap();
  assert.match(await page.locator('#feedback').innerText(), /全部答对/);
  assert.equal(await page.locator('#celebration').getAttribute('hidden'), null);
  await page.keyboard.press('Escape');
  await page.locator('#next').tap();
  assert.equal(await page.locator('#count').innerText(), '0');
  assert.equal(await page.locator('.belly-label.answered').count(), 0);
  for (const [width, height] of [[320, 568], [390, 844], [844, 390], [768, 1024], [1180, 820], [1440, 900]]) {
    await page.setViewportSize({width, height});
    assert.equal(await fields.evaluateAll(controls => controls.every(field => {
      const {width, height, left, right} = field.getBoundingClientRect();
      return width >= 44 && height >= 44 && left >= 0 && right <= innerWidth;
    })), true);
    assert.equal(await page.locator('.creature-groups').evaluateAll(groups =>
      groups.every(group => parseFloat(getComputedStyle(group).gap) >= 13)), true);
    assert.equal(await page.locator('.belly-label:has(+ select)').evaluateAll(labels =>
      labels.length === 11 && labels.every(label => label.textContent === '' &&
        getComputedStyle(label).borderTopWidth === '2px' &&
        getComputedStyle(label, '::after').borderTopWidth === '4px')), true);
    await page.screenshot({path: `.runtime/sea_neighbors_${width}.png`, fullPage: true});
  }
  await page.pdf({path: ".runtime/sea_neighbors_print.pdf", preferCSSPageSize: true});
  assert.deepEqual(errors, []);
  console.log('P-007 passed: nine triples, eleven blanks, keyboard focus, touchscreen checks, speech, hints, reset and six viewports.');
} finally {
  await browser.close();
}
