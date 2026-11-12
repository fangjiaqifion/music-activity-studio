import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { generate } from "../src/core.mjs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 810, height: 1080 },
    hasTouch: true,
    isMobile: true,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:8787");
  const act = (a, v) =>
    page
      .locator(
        `[data-action="${a}"]${v === undefined ? "" : `[data-value="${v}"]`}`,
      )
      .first();
  const open = async (id) => {
    await page.locator(`[data-id="${id}"]`).tap();
    return Number(
      (await page.locator(".round small").textContent()).match(/\d+/)[0],
    );
  };
  await open("builder");
  await page.locator(".black-key").first().tap();
  assert.equal(await page.locator(".white-key.active").count(), 0);
  await act("key", 0).tap();
  assert.equal(await page.locator(".white-key.active").count(), 1);
  await act("home").first().tap();
  await open("ocean");
  const choice = act("choose", "Do");
  await choice.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("data-value"), "Do");
  await act("home").first().tap();
  // Resume fails only after navigation; the error must not replace a new game's prompt.
  await page.evaluate(() => {
    class BrokenAudio {
      resume() {
        return new Promise(
          (resolve, reject) => (window.rejectOldAudio = reject),
        );
      }
    }
    window.AudioContext = BrokenAudio;
  });
  await open("dice");
  await act("rhythm").tap();
  await act("home").first().tap();
  await open("shop");
  await page.evaluate(() => window.rejectOldAudio(Error("old audio failure")));
  await page.waitForTimeout(50);
  assert.match(await page.locator(".feedback").textContent(), /慢慢来/);
  await act("home").first().tap();
  // A browser with speech APIs but no voice must offer the current written call.
  await page.evaluate(() => {
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
      }
    };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel() {},
        speak(u) {
          u.onerror();
        },
      },
    });
  });
  const seed = await open("bingo"),
    q = generate("bingo", seed)[0];
  await act("call").tap();
  assert.match(await page.locator(".feedback").textContent(), /文字提示/);
  assert.match(
    await page.locator(".bingo-tools").textContent(),
    new RegExp(q.calls[0].letter + q.calls[0].octave),
  );
  await page.evaluate(
    () =>
      (Storage.prototype.setItem = function () {
        throw Error("quota");
      }),
  );
  for (const c of q.calls) {
    const n = q.board.findIndex(
      (v) => v.letter === c.letter && v.octave === c.octave,
    );
    await act("mark", n).tap();
    if (await page.locator(".feedback.success").count()) break;
  }
  assert.match(
    await page.locator(".feedback.success").textContent(),
    /未能保存/,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: iPad-size touch, black-key isolation, keyboard focus, stale audio rejection, failed speech fallback and Bingo storage failure.",
  );
} finally {
  await browser.close();
}
