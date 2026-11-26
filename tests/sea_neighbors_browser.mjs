import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = (process.env.BASE_URL || 'http://127.0.0.1:8877').replace(/\/$/, '');
const solfege = process.argv.includes('--solfege');
const route = solfege ? '/sea-neighbors.html?notation=solfege' : '/sea-neighbors.html';
const capture = solfege ? 'sea_solfege' : 'sea_neighbors';
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
  await page.goto(base + (solfege ? '/index.html' : route));
  if (solfege) {
    await page.getByRole('link', {name: /唱名版海底世界/}).click();
    assert.equal(await page.locator('h1').innerText(), '唱名版海底世界');
    assert.equal(new URL(page.url()).search, '?notation=solfege');
  }
  const rows = page.locator('.creature-row');
  await rows.first().waitFor();

  assert.deepEqual(await rows.locator('h2').allTextContents(), ['海马', '圆身鱼', '尖鳍鱼']);
  assert.deepEqual(await page.locator('.creature-group').evaluateAll(groups =>
    groups.map(group => [...group.querySelectorAll('.creature-letter')].map(cell =>
      cell.tagName === 'SELECT' ? '_' : cell.textContent).join(' '))),
    solfege
      ? ['_ si _', 'fa _ la', 'la _ do', 'sol _ si', 'do _ mi', '_ mi _', 'la _ do', 'si _ re', 'mi _ sol']
      : ['_ B _', 'F _ A', 'A _ C', 'G _ B', 'C _ E', '_ E _', 'A _ C', 'B _ D', 'E _ G']);
  const fields = page.locator('.creature select');
  assert.equal(await fields.count(), 11);
  assert.deepEqual(await fields.first().locator('option').evaluateAll(options =>
    options.map(option => option.value)), solfege
    ? ['', 'do', 're', 'mi', 'fa', 'sol', 'la', 'si']
    : ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.equal(await page.locator('#blank-total').innerText(), '11');
  await page.locator('#speak').tap();
  assert.match(await page.evaluate(() => window.spoken[0]), solfege ? /从左到右读每组唱名/ : /从左到右读每组音名/);
  for (let n = 0; n < 3; n++) await page.locator('#check').tap();
  assert.match(await page.locator('#feedback').innerText(), /还有 11/);
  assert.equal(await page.locator('.retry-hint').count(), 0);
  const first = fields.first();
  const desktop = await browser.newPage();
  await desktop.goto(base + route);
  const desktopField = desktop.locator(".creature select").first();
  await desktop.locator("#speak").focus();
  await desktop.keyboard.press("Tab");
  assert.equal(await desktopField.evaluate(field => document.activeElement === field), true);
  await desktop.close();
  const wrongAnswer = solfege ? 'sol' : 'G';
  await first.selectOption(wrongAnswer);
  assert.equal(await page.locator('.belly-label.answered').first().innerText(), wrongAnswer);
  for (let n = 1; n <= 6; n++) {
    await page.locator('#check').tap();
    assert.equal(await page.locator('.retry-hint').count(), Number(n >= 3));
    assert.equal(await page.locator('.retry-answer').count(), Number(n >= 6));
  }
  assert.match(await page.locator('.retry-answer').innerText(), solfege ? /la$/ : /A$/);
  const answers = solfege
    ? ['la', 'do', 'sol', 'si', 'la', 're', 're', 'fa', 'si', 'do', 'fa']
    : ['A', 'C', 'G', 'B', 'A', 'D', 'D', 'F', 'B', 'C', 'F'];
  for (const [index, answer] of answers.entries()) await fields.nth(index).selectOption(answer);
  assert.deepEqual(await page.locator('.belly-label.answered').allTextContents(), answers);
  await page.screenshot({path: `.runtime/${capture}_answered.png`, fullPage: true});
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
    await page.screenshot({path: `.runtime/${capture}_${width}.png`, fullPage: true});
  }
  await page.pdf({path: `.runtime/${capture}_print.pdf`, preferCSSPageSize: true});
  await page.getByRole('link', {name: /选择游戏/}).click();
  assert.equal(new URL(page.url()).pathname.split('/').at(-1), 'index.html');
  assert.deepEqual(errors, []);
  console.log('P-007 passed: nine triples, eleven blanks, keyboard focus, touchscreen checks, speech, hints, reset and six viewports.');
} finally {
  await browser.close();
}
