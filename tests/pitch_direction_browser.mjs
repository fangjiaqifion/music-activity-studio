import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = (process.env.BASE_URL || 'http://127.0.0.1:8862').replace(/\/$/, '');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

try {
  const page = await browser.newPage({
    viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const stairs of [false, true]) {
    await page.goto(`${base}/index.html`);
    await page.getByRole('link', { name: stairs ? /上行还是下行/ : /音名找树叶/ }).click();
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.locator('header span').textContent(), stairs ? /P-011/ : /P-010/);
    const check = page.locator('#check');
    const match = page.locator('.leaf-match');
    const leaf = page.locator('.leaf-choice');
    const stair = page.locator('.stair-question');
    async function answer(index, choice) {
      if (stairs) {
        await stair.nth(index).getByRole('button', { name: new RegExp(choice + '$') }).tap();
      } else if (index % 2 === 0) {
        await match.nth(index).press('Enter');
        assert.equal(await match.nth(index).getAttribute('aria-pressed'), 'true');
        await leaf.nth(choice).tap();
      } else {
        await leaf.nth(choice).tap();
        await match.nth(index).press('Enter');
      }
    }
    await check.click();
    assert.match(await page.locator('#feedback').textContent(), stairs ? /12 题/ : /7 题/);
    await answer(0, stairs ? '下行' : 0);
    for (let attempt = 1; attempt <= 6; attempt++) {
      await check.click();
      assert.equal(await page.locator('.retry-hint').count(), Number(attempt >= 3));
      assert.equal(await page.locator('.retry-answer').count(), Number(attempt === 6));
    }
    if (!stairs) {
      const step = await page.locator('.leaf-option').nth(2).locator('img').evaluateAll(images =>
        images.slice(1).map((image, i) => images[i].getBoundingClientRect().bottom - image.getBoundingClientRect().bottom));
      assert.deepEqual(step, [19, 19]);
      await answer(1, 0);
      assert.equal(await page.locator('.leaf-lines line').count(), 1);
      await page.locator('.leaf-clear').nth(1).tap();
      assert.equal(await page.locator('.leaf-lines line').count(), 0);
    }
    // Expected answers come from the printed sequences and the displayed artwork positions.
    const expected = stairs
      ? ['上行','下行','下行','上行','下行','上行','上行','下行','下行','下行','下行','下行']
      : [5, 2, 3, 4, 6, 0, 1];
    for (const [index, choice] of expected.entries()) await answer(index, choice);
    assert.equal(await page.locator('.retry-hint').count(), 0);
    await check.click();
    assert.match(await page.locator('#feedback').textContent(), /全部答对/);
    assert.equal(await page.locator('#celebration').isVisible(), true);
    await page.keyboard.press('Escape');
    await page.locator('#next').click();
    assert.equal(await page.locator('#count').textContent(), '0');
    assert.equal(await page.locator('#activity-board [aria-pressed="true"]').count(), 0);
    assert.equal(await page.locator('.leaf-lines line').count(), 0);
    assert.equal(await page.locator('#activity-board button').evaluateAll(buttons =>
      buttons.every(button => button.offsetHeight >= 44 && button.offsetWidth >= 44)), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  assert.deepEqual(errors, []);
  console.log('PASS: P-010 and P-011 catalog links, answers, touch, keyboard, hints, correction, reset, and 320px layout');
} finally {
  await browser.close();
}
