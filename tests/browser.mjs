import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { generate, GAMES } from "../src/core.mjs";
const out = new URL("../.runtime/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:8787");
  await page.locator(".game-card").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".game-card").count(), 6);
  await page.screenshot({
    path: fileURLToPath(new URL("home-desktop.png", out)),
    fullPage: true,
  });
  const click = (a, v) =>
    page
      .locator(
        `[data-action="${a}"]${v !== undefined ? `[data-value="${v}"]` : ""}`,
      )
      .first()
      .click();
  async function open(id) {
    await page.locator(`[data-action="open"][data-id="${id}"]`).click();
    return Number(
      (await page.locator(".round small").textContent()).match(/\d+/)[0],
    );
  }
  for (const size of [
    { width: 1280, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 667, height: 375 },
  ]) {
    await page.setViewportSize(size);
    await click("home");
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      "home overflow",
    );
    if (size.width === 390)
      await page.screenshot({
        path: fileURLToPath(new URL("home-mobile.png", out)),
        fullPage: true,
      });
    for (const g of GAMES) {
      await open(g.id);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${g.id} overflow ${size.width}`,
      );
      assert.ok(await page.locator(".activity h2").isVisible());
      assert.ok(
        await page
          .locator(".mascot img")
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      );
      if (size.width === 1280 || size.width === 390)
        await page.screenshot({
          path: fileURLToPath(new URL(`${g.id}-${size.width}.png`, out)),
          fullPage: true,
        });
      await click("home");
    }
  }
  await page.setViewportSize({ width: 1280, height: 1000 });
  for (const id of ["shop", "detective", "ocean", "builder"]) {
    const seed = await open(id),
      qs = generate(id, seed);
    await click("check");
    for (let i = 0; i < 6; i++) {
      const q = qs[i];
      if (id === "shop")
        for (let n = 0; n < q.target; n++) await click("note", 0);
      if (id === "detective" || id === "ocean") await click("choose", q.answer);
      if (id === "builder") for (const n of q.keys) await click("key", n);
      await click("check");
      assert.match(await page.locator(".feedback").textContent(), /做到了/);
      await click("next");
    }
    assert.match(await page.locator(".result-score").textContent(), /5\s*\/ 6/);
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("music-activity-studio.demo.v1")).at(-1),
    );
    assert.equal(saved.records[0].firstCorrect, false);
    assert.deepEqual(
      saved.records[0].firstAnswer,
      id === "detective" || id === "ocean" ? null : [],
    );
    await click("replay");
    assert.equal(
      Number(
        (await page.locator(".round small").textContent()).match(/\d+/)[0],
      ),
      seed,
    );
    await click("home");
  }
  await open("dice");
  const before = await page.locator(".rhythm-cell").first().textContent();
  await click("cell", 0);
  assert.notEqual(
    await page.locator(".rhythm-cell").first().textContent(),
    before,
  );
  await click("route", 8);
  assert.equal(await page.locator(".rhythm-cell.on").count(), 4);
  await click("rhythm");
  assert.match(await page.locator(".feedback").textContent(), /四拍/);
  await click("home");
  await page.evaluate(() => {
    window.print = () => {};
  });
  await open("shop");
  await click("print");
  assert.equal(await page.locator("#print-sheet article").count(), 6);
  assert.equal(await page.locator("#print-sheet .answer-page").count(), 1);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: fileURLToPath(new URL("worksheet-print.pdf", out)),
    format: "A4",
    printBackground: true,
  });
  await page.emulateMedia({ media: "screen" });
  await click("home");
  const seed = await open("bingo"),
    q = generate("bingo", seed)[0];
  await click("reveal");
  assert.match(
    await page.locator(".bingo-tools").textContent(),
    new RegExp(q.calls[0].letter + q.calls[0].octave),
  );
  for (const c of q.calls) {
    const n = q.board.findIndex(
      (v) => v.letter === c.letter && v.octave === c.octave,
    );
    await click("mark", n);
    if (await page.locator(".feedback.success").count()) break;
  }
  assert.match(await page.locator(".feedback.success").textContent(), /Bingo/);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: six entries, 28 responsive screens, four complete sessions, replay, first errors, editable rhythm, audio start, Bingo and print; no page errors.",
  );
} finally {
  await browser.close();
}
