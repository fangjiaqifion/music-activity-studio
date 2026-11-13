import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
await mkdir('.runtime',{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
const page=await browser.newPage({viewport:{width:1100,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto((process.env.BASE_URL||'http://127.0.0.1:8790')+'/cheesecake.html');await page.locator(".cake").first().waitFor();await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('.cake').count(),9);
assert.equal(await page.locator('.example-card').count(),2);
assert.match(await page.locator('.example-list').innerText(),/L = line[\s\S]*线音[\s\S]*S = space[\s\S]*间音/);
assert.match(await page.locator('#speak').innerText(),/听题干/);
assert.equal(await page.locator('.eraser-icon').evaluate(el=>el.complete && el.naturalWidth>0),true);
assert.equal(await page.locator('.cake svg>ellipse').first().getAttribute('fill'),'none');
for(const size of [{width:1100,height:1000},{width:390,height:844}]){
 await page.setViewportSize(size);
 const anchors=await page.locator('.cake').first().evaluate(el=>{const box=el.getBoundingClientRect();return [...el.querySelectorAll('.letter')].map(b=>{const r=b.getBoundingClientRect();return [(r.x+r.width/2-box.x)/box.width,(r.y+r.height/2-box.y)/box.height];});});
 assert.ok(Math.abs(anchors[0][0]-.2445)<.005 && Math.abs(anchors[0][1]-.4154)<.005);
 assert.ok(Math.abs(anchors[1][0]-.389)<.005 && Math.abs(anchors[1][1]-.6346)<.005);
}
await page.setViewportSize({width:1100,height:1000});
await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),/9 块蛋糕/);
async function choose(wrong=false){for(let i=0;i<9;i++){const cake=page.locator('.cake').nth(i);const y=await cake.locator('svg>ellipse').getAttribute('cy');const answer=Math.round((80-Number(y))/6.5)%2?'S':'L';await cake.locator(`[data-answer="${wrong&&i===0?(answer==='S'?'L':'S'):answer}"]`).click();}}
await choose(true);await page.locator('#check').click();assert.equal(await page.locator('#feedback').innerText(),'有 1 个需要再想一想。');assert.equal(await page.locator('[data-error],.mark').count(),0);
await page.screenshot({path:'.runtime/cheesecake_desktop.png',fullPage:true});
await choose();await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);assert.equal(await page.locator('.note-person').count(),5);
await page.locator('#next').click();assert.equal(await page.locator('#celebration').isVisible(),false);assert.equal(await page.locator('.letter[aria-pressed=true]').count(),0);
await page.locator('.letter').first().click();await page.locator('#erase').click();await page.locator('.letter').first().click();assert.equal(await page.locator('.letter[aria-pressed=true]').count(),0);
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.runtime/cheesecake_mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.setViewportSize({width:1100,height:1000});await page.pdf({path:'.runtime/cheesecake_print.pdf',preferCSSPageSize:true});assert.deepEqual(errors,[]);
console.log('PASS: nine cakes, aggregate feedback, correction, five dancers, reset, eraser, mobile overflow, no page errors; captured print.');
} finally {await browser.close();}
