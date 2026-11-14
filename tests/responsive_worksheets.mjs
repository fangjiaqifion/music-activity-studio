import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = (process.env.BASE_URL || "http://127.0.0.1:8796").replace(
  /\/$/,
  "",
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const sizes = [
  [390, 844],
  [844, 390],
  [768, 1024],
  [820, 1180],
  [1180, 820],
  [1440, 900],
];
const pages = [
  "activities",
  "hands",
  "balloons",
  "cows",
  "cheesecake",
  "ladybirds",
  "sunshine",
];
const results = [];
await mkdir(".runtime/responsive", { recursive: true });
try {
  for (const [width, height] of sizes) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: width < 1200,
      isMobile: width < 900,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const name of pages) {
      await page.goto(`${base}/${name}.html`);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        `${name} overflow ${width}x${height}`,
      );
      const bad = await page.locator("button,input,select").evaluateAll((els) =>
        els
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return (
              e.getClientRects().length &&
              getComputedStyle(e).visibility !== "hidden" &&
              (r.left < -1 || r.right > innerWidth + 1)
            );
          })
          .map((e) => e.outerHTML.slice(0, 100)),
      );
      assert.deepEqual(bad, [], `${name} clipped controls ${width}x${height}`);
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
        true,
        `${name} missing art`,
      );
      if (name === "cows") {
        const detail=page.locator('[data-detail-index="0"]');
        await detail.click();
        assert.equal(await page.locator('.cow-clef[data-index="0"]').getAttribute("aria-pressed"),"true");
        assert.equal(await page.locator("#count").innerText(),"1");
        await page.locator("#next").click();
      }
      if (name !== "activities") {
        await page.locator("#check").click();
        assert.match(await page.locator("#feedback").innerText(), /还有/);
        await page.locator("#next").click();
        assert.equal(await page.locator("#count").innerText(), "0");
      }
      await page.screenshot({
        path: `.runtime/responsive/${name}-${width}x${height}.png`,
        fullPage: true,
      });
      results.push({ page: name, width, height });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  await writeFile(
    ".runtime/responsive/results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    `PASS ${results.length} worksheet/hub layouts across phone, iPad and desktop; controls, assets, blank checking and reset`,
  );
} finally {
  await browser.close();
}
