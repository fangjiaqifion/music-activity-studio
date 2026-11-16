import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { pianoNotes } from "../src/note_house_piano.mjs";
const base = (process.env.BASE_URL || "http://127.0.0.1:8816").replace(
  /\/$/,
  "",
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.pianoEvents = [];
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      createBufferSource() {
        const s = super.createBufferSource(),
          start = s.start.bind(s);
        s.start = (...args) => {
          window.pianoEvents.push({
            rate: s.playbackRate.value,
            duration: s.buffer.duration,
            state: this.state,
          });
          start(...args);
        };
        return s;
      }
    };
  });
  await page.goto(base + "/note-houses.html");
  for (const name of ["A3", "C4", "Ds4", "Fs4"]) {
    const r = await page.request.get(base + `/assets/piano_${name}.mp3`);
    assert.equal(r.status(), 200);
    // GitHub Pages serves MP3 as audio/mp3; the local server uses audio/mpeg.
    assert.match(r.headers()["content-type"], /^audio\/(mpeg|mp3)(?:;|$)/);
  }
  for (const letter of "CDEFGAB") {
    const count = await page.evaluate(() => window.pianoEvents.length);
    await page.locator(`[data-letter="${letter}"]`).click();
    await page.waitForFunction((n) => window.pianoEvents.length > n, count);
    const event = await page.evaluate(() => window.pianoEvents.at(-1)),
      note = pianoNotes[letter];
    assert.ok(
      Math.abs(event.rate - 2 ** ((note.midi - note.base) / 12)) < 1e-6,
    );
    assert.ok(event.duration > 1);
    assert.equal(event.state, "running");
  }
  let count = await page.evaluate(() => window.pianoEvents.length);
  await page.locator("#level2").click();
  await page.waitForFunction((n) => window.pianoEvents.length > n, count);
  const home = (await page.locator("#prompt").innerText()).match(
    /我是 ([A-G]) 音/,
  )[1];
  assert.ok(
    Math.abs(
      (await page.evaluate(() => window.pianoEvents.at(-1))).rate -
        2 ** ((pianoNotes[home].midi - pianoNotes[home].base) / 12),
    ) < 1e-6,
  );
  count = await page.evaluate(() => window.pianoEvents.length);
  await page.locator(".house.speaker").click();
  await page.waitForFunction((n) => window.pianoEvents.length > n, count);
  count = await page.evaluate(() => window.pianoEvents.length);
  await page.locator('[data-letter="C"]').click();
  await page.waitForFunction((n) => window.pianoEvents.length > n, count);
  assert.equal((await page.evaluate(() => window.pianoEvents.at(-1))).rate, 1);
  assert.deepEqual(errors, []);
  console.log(
    "PASS real MP3 decode/playback: all seven pitches, correct playback rates, level-2 reference and resident replay.",
  );
} finally {
  await browser.close();
}
