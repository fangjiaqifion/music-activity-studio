import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.BASE_URL || "http://127.0.0.1:8797";
await mkdir(".runtime/keyboard", { recursive: true });
try {
  await page.goto(base + "/keyboard.html");
  assert.equal(await page.locator(".paint-groups .piano").count(), 3);
  assert.equal(
    await page.locator('[data-task="paint"][data-black]').count(),
    10,
  );
  await page.locator(".zoom-keyboard").first().click();
  assert.equal(await page.locator(".keyboard-scroll.enlarged").count(), 1);
  await page.locator(".zoom-keyboard").first().click();
  await page.locator("#check").click();
  assert.match(await page.locator("#feedback").innerText(), /还有/);
  await page.locator('[data-task="paint"][data-key="0"]').click();
  await page.locator('[data-task="paint"][data-key="0"]').click();
  for (const b of await page.locator('[data-task="paint"][data-black]').all())
    await b.click();
  // Infer C boundaries from the rendered two/three black-key pattern, without exposing answers in UI.
  for (let r = 0; r < 2; r++) {
    const keys = page.locator('[data-task="' + r + '"][data-key]');
    assert.equal(
      await page.locator('[data-choices="' + r + '"]').isVisible(),
      false,
    );
    const n = await keys.count();
    const blacks = await page
      .locator('[data-task="' + r + '"][data-black]')
      .evaluateAll((bs) => bs.map((b) => +b.dataset.black));
    let total = 0;
    for (let i = 0; i + 6 < n; i++)
      if (
        blacks.includes(i) &&
        blacks.includes(i + 1) &&
        !blacks.includes(i + 2) &&
        blacks.includes(i + 3) &&
        blacks.includes(i + 4) &&
        blacks.includes(i + 5)
      ) {
        await keys.nth(i).click();
        await keys.nth(i + 6).click();
        total++;
      }
    await page.locator('[data-begin-count="' + r + '"]').click();
    await page
      .locator('[data-row="' + r + '"][data-count="' + total + '"]')
      .click();
  }
  const ring = page.locator('[data-remove-row="0"]').first();
  await ring.focus();
  await page
    .locator('[data-task="paint"][data-black="0"]')
    .evaluate((b) => b.click());
  assert.equal(
    await page
      .locator('[data-remove-row="0"]')
      .first()
      .evaluate((b) => b === document.activeElement),
    true,
  );
  await page.locator('[data-task="paint"][data-black="0"]').click();
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: ".runtime/keyboard/print.pdf",
    preferCSSPageSize: true,
  });
  await page.emulateMedia({ media: "screen" });
  await page.screenshot({
    path: ".runtime/keyboard/answered.png",
    fullPage: true,
  });
  await page.locator("#check").click();
  assert.match(await page.locator("#feedback").innerText(), /全部答对/);
  assert.equal(await page.locator("#celebration").isVisible(), true);
  await page.locator("#next").click();
  assert.equal(await page.locator("#count").innerText(), "0");
  assert.deepEqual(errors, []);
  for (const [w, h] of [
    [390, 844],
    [820, 1180],
    [1180, 820],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(base + "/keyboard.html");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo(0, 0));
    const ratios = await page
      .locator(".fit-keyboard .white")
      .evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return r.height / r.width;
        }),
      );
    assert.ok(
      ratios.every((v) => Math.abs(v - 184 / 44) < 0.05),
      "white-key proportions stay constant",
    );
    await page.screenshot({
      path: ".runtime/keyboard/" + w + ".png",
      fullPage: true,
    });
  }
  console.log(
    "PASS keyboard coloring, circles, counts, celebration, reset and screenshots",
  );
} finally {
  await browser.close();
}
