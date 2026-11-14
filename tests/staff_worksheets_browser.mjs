import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const base = process.env.BASE_URL || "http://127.0.0.1:8795";
try {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.url());
  });
  await page.goto(base + "/activities.html");
  assert.equal(await page.locator(".activity-card").count(), 6);
  for (const kind of ["ladybirds", "sunshine"]) {
    await page.setViewportSize({ width: 1100, height: 1000 });
    await page.goto(base + "/" + kind + ".html");
    await page.evaluate(() => document.fonts.ready);
    const first = page.locator('[data-index="0"]').first();
    await first.focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#count").innerText(), "1");
    assert.equal(
      await page.evaluate(() => document.activeElement?.dataset.index),
      "0",
    );
    await page.locator("#next").click();
    if (kind === "sunshine") {
      assert.equal(await page.locator(".sunshine-guide ellipse").count(), 2);
      await page.setViewportSize({ width: 390, height: 844 });
      assert.equal(
        await page
          .locator(".choices button")
          .evaluateAll((bs) =>
            bs.every(
              (b) =>
                b.getBoundingClientRect().width >= 44 &&
                b.getBoundingClientRect().height >= 44,
            ),
          ),
        true,
      );
      await page.setViewportSize({ width: 1100, height: 1000 });
    }
    await page.locator("#check").click();
    assert.match(
      await page.locator("#feedback").innerText(),
      new RegExp(kind === "ladybirds" ? "12" : "21"),
    );
    await page.locator(".profiles summary").click();
    await page.locator("#student-name").fill("QA");
    await page.locator("#profile-form button").click();
    assert.match(await page.locator("#student-label").innerText(), /QA/);
    await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".staff-card")];
      for (const card of cards) {
        let value;
        if (document.body.dataset.activity === "ladybirds") {
          const text = card.querySelector("p").textContent;
          const number = Number(text.match(/(\d)$/)[1]);
          value = String((number - 1) * 2 + (text.includes("Space") ? 1 : 0));
        } else {
          const notes = [...card.querySelectorAll("ellipse")];
          if (notes.length === 1) {
            const p = Math.round(
              (106 - Number(notes[0].getAttribute("cy"))) / 10,
            );
            value = String(Math.floor(p / 2) + 1);
          } else {
            value =
              Number(notes[1].getAttribute("cy")) <
              Number(notes[0].getAttribute("cy"))
                ? "up"
                : Number(notes[1].getAttribute("cy")) >
                    Number(notes[0].getAttribute("cy"))
                  ? "down"
                  : "same";
          }
        }
        const i = card.querySelector("[data-index]").dataset.index;
        document
          .querySelector(`[data-index="${i}"][data-value="${value}"]`)
          .dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
    });
    await page.locator("#check").click();
    assert.equal(await page.locator("#celebration").isVisible(), true);
    assert.equal(await page.locator(".note-person").count(), 5);
    await page.locator("#close-celebration").click();
    await page.screenshot({
      path: ".runtime/" + kind + "_desktop.png",
      fullPage: true,
    });
    await page.pdf({
      path: ".runtime/" + kind + "_print.pdf",
      format: "A4",
      printBackground: true,
    });
    await page.locator('[data-tool="erase"]').click();
    await page.locator('[data-index="0"]').first().dispatchEvent("click");
    await page.locator("#check").click();
    assert.match(await page.locator("#feedback").innerText(), /还有 1 处/);
    await page.locator("#next").click();
    assert.equal(await page.locator("#count").innerText(), "0");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: ".runtime/" + kind + "_mobile.png",
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }
  assert.deepEqual(errors, []);
  console.log("Staff worksheet browser checks passed");
} finally {
  await browser.close();
}
