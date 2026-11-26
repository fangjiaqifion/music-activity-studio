import { chromium } from 'playwright-core';

// Capture actual, unanswered exercise content in an isolated browser profile.
// Regenerate when the corresponding exercise layout changes.
const base = process.env.BASE_URL || 'http://127.0.0.1:8855';
const entries = {
  'fish-keys': '#activity-board', 'key-names': '#activity-board',
  "sea-neighbors": "#activity-board",
  hands: '#activity-board', balloons: '#balloons', cows: '.cow-art',
  cheesecake: '#cakes', ladybirds: '#activity-board', sunshine: '#activity-board',
  treble: '#activity-board', bass: '#activity-board', alto: '#activity-board',
  keyboard: '.exercise', 'pitch-motion': '#activity-board',
  'key-notes': '.note-grid', 'fish-notes': '.fish-match-layout',
  'fish-steps': '#activity-board', 'note-houses': '.town',
  'staff-race': '.board',
};
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true});
try {
  const context = await browser.newContext({viewport: {width: 1000, height: 1000}, reducedMotion: 'reduce'});
  await context.addInitScript(() => { Math.random = () => 0.42; });
  const page = await context.newPage();
  for (const [name, selector] of Object.entries(entries).filter(([name]) => !process.argv[2] || name === process.argv[2])) {
    await page.goto(`${base}/${name}.html`);
    await page.evaluate(() => document.fonts.ready);
    const area = page.locator(selector).first();
    await area.waitFor({state: 'visible'});
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    await area.scrollIntoViewIfNeeded();
    const box = await area.boundingBox();
    // Retain the full width, with enough rows to show the task at card size.
    await page.screenshot({path: `assets/preview_${name}.jpg`, type: 'jpeg', quality: 88,
      clip: {x: box.x, y: box.y, width: box.width, height: name === "staff-race" ? box.height : Math.min(box.height, 580)}});
    console.log(`Captured ${name}`);
  }
} finally { await browser.close(); }
