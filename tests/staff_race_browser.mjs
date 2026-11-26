import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = (process.env.BASE_URL || "http://127.0.0.1:8897").replace(/\/$/, "");
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/index.html`);
  await page.getByRole("link", { name: /五线谱竞走/ }).tap();
  const roll = page.locator("#roll");
  const row = (position) => page.locator(`[data-position="${position}"]`);
  const turn = page.locator("#turn");
  const turnPortrait = page.locator("#turn-portrait");
  const feedback = page.locator("#feedback");
  const play = async (samples, path) => {
    await page.evaluate((values) => { Math.random = () => values.shift() ?? 0; }, samples);
    await roll.tap();
    const activeNote = page.locator(".token.active");
    assert.equal(await page.locator(".guides-on .target").count(), 11);
    const target = row(path[0]).locator(".target");
    assert.equal(await target.evaluate((node) => getComputedStyle(node).gridColumnStart),
      await activeNote.evaluate((node) => getComputedStyle(node).gridColumnStart));
    for (const position of path) await row(position).tap();
  };
  await row(0).waitFor();
  assert.equal(await page.locator(".row.line").count(), 5);
  assert.equal(await page.locator("#staff").getByText(/^[上下]加一线$/).count(), 0);
  assert.equal(await page.locator("#staff button").count(), 11);
  assert.match(await row(0).getAttribute("aria-label"), /下加一间，起点/);
  assert.match(await row(10).getAttribute("aria-label"), /上加一间，终点/);
  assert.equal(await page.locator(".character").count(), 4);
  await page.getByRole("button", { name: "圆眼蛙" }).tap();
  await page.getByRole("button", { name: "老师 / 家长", exact: true }).tap();
  await page.getByRole("button", { name: "方脸机器人" }).tap();
  assert.equal(await row(0).locator(".token.frog, .token.robot").count(), 2);
  await page.getByRole("button", { name: "开始游戏", exact: true }).tap();
  assert.equal(await turnPortrait.locator(".face").isVisible(), true);
  assert.match(await turnPortrait.getAttribute("class"), /frog/);

  await page.evaluate(() => { Math.random = () => 0.99; });
  await roll.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#distance").innerText(), "4 步");
  const guide = page.getByRole("switch", { name: "走棋引导" });
  assert.equal(await guide.isChecked(), true);
  assert.equal(await row(1).locator(".target").evaluate((target) => getComputedStyle(target).opacity), "1");
  assert.equal(await page.locator(".guides-on .target").count(), 11);
  assert.equal(await row(1).locator(".target").evaluate((target) => getComputedStyle(target).gridColumnStart), "2");
  await guide.uncheck();
  assert.equal(await page.locator(".guides-on .target").count(), 0);
  await guide.check();
  for (let count = 0; count < 6; count++) await row(2).tap();
  assert.match(await feedback.innerText(), /相邻的一格/);
  assert.equal(await row(0).locator(".token").count(), 2);
  assert.match(await page.locator(".retry-answer").innerText(), /第一线/);
  await row(0).focus();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  assert.equal(await row(1).locator(".token.frog").count(), 1);
  assert.equal(await page.locator(".guides-on .target").count(), 11);
  assert.equal(await page.locator(".retry-hint, .retry-answer").count(), 0);
  await row(2).tap();
  const geometry = await page.locator(".token.frog").evaluate((token) => {
    const rect = (el) => el.getBoundingClientRect();
    const center = (r) => (r.top + r.bottom) / 2;
    const row = token.closest(".row");
    return [center(rect(token.querySelector(".face"))), center(rect(row)),
      center(rect(row.previousElementSibling)), center(rect(row.nextElementSibling)),
      rect(token.querySelector(".crest")).top];
  });
  assert.equal(geometry[0], geometry[1]);
  assert.equal(geometry[0], (geometry[2] + geometry[3]) / 2);
  assert.ok(geometry[4] > geometry[2] + 1);
  await row(3).tap();
  assert.ok(await row(3).locator(".token.frog").evaluate((token) => {
    const head = token.querySelector(".face").getBoundingClientRect();
    const line = token.closest(".row").getBoundingClientRect();
    const center = (line.top + line.bottom) / 2;
    return (head.top + head.bottom) / 2 === center && head.top < center && head.bottom > center;
  }));
  await row(4).tap();
  assert.match(await turnPortrait.getAttribute("class"), /robot/);
  await play([0], [1]);
  await play([0.99, 0.99], [5, 6, 7, 8]);
  await play([0, 0], [0]);
  await play([0.99, 0.99], [9, 10]);
  assert.equal(await turn.innerText(), "圆眼蛙赢了！");
  assert.match(await feedback.innerText(), /先到达上加一间/);
  assert.match(await page.locator("#round").innerText(), /3 \/ 10/);

  await page.getByRole("button", { name: "下一关" }).tap();
  assert.equal(await page.locator("#level").innerText(), "第 2 关");
  assert.equal(await turn.innerText(), "轮到方脸机器人");
  for (let round = 1; round <= 10; round++) {
    assert.equal(await page.locator("#round").innerText(), `第 ${round} / 10 轮`);
    await play(round % 2 ? [0] : [0, 0], [round % 2 ? 1 : 0]);
    if (round === 10) assert.equal(await turn.innerText(), "轮到圆眼蛙");
    if (round === 1) await play([0.3], [1, 2]);
    else await play(round % 2 ? [0.99, 0] : [0, 0], [round % 2 ? 2 : 1]);
  }
  assert.equal(await turn.innerText(), "圆眼蛙赢了！");
  assert.match(await feedback.innerText(), /十轮结束/);
  assert.equal(await row(1).locator(".token.frog").count(), 1);
  assert.equal(await row(0).locator(".token.robot").count(), 1);

  await page.getByRole("button", { name: "下一关" }).tap();
  assert.equal(await page.locator("#level").innerText(), "第 3 关");
  assert.equal(await guide.isVisible(), false);
  await page.evaluate(() => { Math.random = () => 0.3; });
  await roll.tap();
  assert.equal(await page.locator("#distance").innerText(), "2 步");
  assert.equal(await page.locator(".guides-on .target").count(), 0);
  for (let count = 0; count < 6; count++) await row(2).tap();
  assert.equal(await page.locator(".retry-hint, .retry-answer").count(), 0);
  await row(1).tap();
  await row(2).tap();
  assert.equal(await row(2).locator(".token.frog").count(), 1);
  await page.locator("#reset").tap();
  for (const [width, height] of [[320, 568], [390, 844], [844, 390], [820, 1180], [1180, 820], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    const boxes = await page.locator("#staff button").evaluateAll((buttons) => buttons.map((button) => {
      const { width, height, top } = button.getBoundingClientRect();
      return { width, height, top };
    }));
    assert.ok(boxes.every((box, i) => box.width >= 44 && box.height >= 34 && box.height < 44 && (!i || box.top >= boxes[i - 1].top + boxes[i - 1].height - 0.01)));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    const board = await page.locator(".board").boundingBox();
    const dice = await roll.boundingBox();
    assert.ok(dice.y >= board.y + board.height);
    assert.ok(board.width >= width * 0.8);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `.runtime/staff-race/${width}x${height}.png` });
  }
  await page.getByRole("link", { name: /音乐游戏工坊/ }).click();
  await page.getByRole("link", { name: /五线谱竞走/ }).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS: four characters, keyboard and touch, notation geometry, immediate win, ten-round height win, reset and six layouts");
} finally {
  await browser.close();
}
