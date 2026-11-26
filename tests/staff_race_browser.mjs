import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = (process.env.BASE_URL || "http://127.0.0.1:8892").replace(/\/$/, "");
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const rolls = [];
    for (let round = 0; round < 4; round++) rolls.push(0.99, 0.99, 0, 0);
    Math.random = () => rolls.shift() ?? 0.5;
  });
  await page.goto(`${base}/index.html`);
  await page.getByRole("link", { name: /五线谱竞走/ }).tap();
  await page.locator(".row.line").first().waitFor();
  const roll = page.locator("#roll");
  const row = (position) => page.locator(`[data-position="${position}"]`);
  const score = (player) => page.locator(`#score-${player} strong`);
  const turn = page.locator("#turn");
  const feedback = page.locator("#feedback");

  assert.equal(await page.locator(".row.line").count(), 5);
  assert.equal(await page.locator(".row.space").count(), 4);
  assert.equal(await row(4).locator(".token").count(), 2);
  await row(5).tap({ force: true });
  assert.equal(await row(4).locator(".token").count(), 2);
  await roll.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#direction").innerText(), "↑ 向上");
  assert.equal(await page.locator("#distance").innerText(), "4 步");
  for (let count = 0; count < 6; count++) await row(6).tap();
  assert.match(await feedback.innerText(), /相邻的一格/);
  assert.equal(await row(4).locator(".token").count(), 2);
  assert.equal(await score(0).innerText(), "0 步");
  assert.match(await page.locator(".retry-answer").innerText(), /第三间/);
  await row(4).focus();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  assert.equal(await row(5).locator(".token.mint").count(), 1);
  assert.match(await feedback.innerText(), /还要走 3 步/);
  assert.equal(await page.locator(".retry-hint, .retry-answer").count(), 0);
  for (const position of [6, 7, 8]) await row(position).tap();
  assert.equal(await score(0).innerText(), "4 步");

  const positions = [8, 4];
  for (let next = 1; next < 8; next++) {
    const player = next % 2;
    await roll.tap();
    const direction = (await page.locator("#direction").innerText()).includes("向上") ? 1 : -1;
    const distance = parseInt(await page.locator("#distance").innerText(), 10);
    for (let step = 0; step < distance; step++) {
      positions[player] += direction;
      await row(positions[player]).tap();
    }
    if (next === 6) {
      assert.equal(await score(0).innerText(), "16 步");
      assert.equal(await turn.innerText(), "轮到紫音符");
    }
  }
  assert.equal(await turn.innerText(), "绿音符赢了！");
  assert.equal(await score(1).innerText(), "4 步");
  await roll.press("Enter");
  assert.equal(await turn.innerText(), "绿音符赢了！");
  await page.locator("#reset").tap();
  assert.equal(await turn.innerText(), "轮到紫音符");
  assert.equal(await row(4).locator(".token").count(), 2);
  await roll.tap();
  await page.locator("#reset").tap();
  assert.equal(await turn.innerText(), "轮到绿音符");
  assert.equal(await page.locator("#die").isVisible(), false);
  await roll.tap();

  for (const [width, height] of [[320, 568], [390, 844], [844, 390], [820, 1180], [1180, 820], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    const boxes = await page.locator("#staff button").evaluateAll((buttons) => buttons.map((button) => {
      const { width, height, top } = button.getBoundingClientRect();
      return { width, height, top };
    }));
    assert.ok(boxes.every((box, i) => box.width >= 44 && box.height >= 44 && (!i || box.top >= boxes[i - 1].top + 44)));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `.runtime/staff-race/${width}x${height}.png` });
  }
  await page.getByRole("link", { name: /音乐游乐工坊/ }).click();
  assert.equal(await page.getByRole("link", { name: /五线谱竞走/ }).count(), 1);
  assert.deepEqual(errors, []);
  console.log("PASS: staff race catalog, touch and keyboard, retries, full match, reset and six active board layouts");
} finally {
  await browser.close();
}
