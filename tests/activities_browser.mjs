import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=(process.env.BASE_URL||'http://127.0.0.1:8794').replace(/\/+$/,'');
try{
const page=await browser.newPage({viewport:{width:1100,height:1000}});let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
await page.goto(base+'/activities.html');
await page.waitForURL('**/index.html');
await page.locator('.studio-card').first().waitFor();
assert.equal(await page.locator('.studio-card').count(),29);
assert.equal(await page.locator('.studio-topics a').count(),5);
for (const link of await page.locator('.studio-topics a').all()) {
  await link.click();
  assert.ok(await page.locator(new URL(page.url()).hash).isVisible());
}
const manifest = await page.locator('link[rel="manifest"]').evaluate(link => link.href);
const manifestResponse = await page.request.get(manifest);
assert.ok(manifestResponse.ok());
const metadata = await manifestResponse.json();
assert.equal(metadata.display, 'standalone');
assert.equal(metadata.name, '音乐游戏工坊');
assert.equal(metadata.short_name, '音乐游戏工坊');
assert.equal(new URL(metadata.start_url, manifest).pathname, '/');
const touchIcon = await page.locator('link[rel="apple-touch-icon"]').evaluate(link => link.href);
const iconResponse = await page.request.get(touchIcon);
assert.ok(iconResponse.ok());
const icon = await iconResponse.body();
assert.deepEqual([icon.readUInt32BE(16), icon.readUInt32BE(20)], [180, 180]);
assert.equal(await page.locator('.activity-card').count(),23);for(const a of await page.locator('.activity-card').all()){assert.equal(await a.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0),true);}await page.screenshot({path:'.runtime/activities_desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.runtime/activities_mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
for(const kind of ['hands','cows']){
await page.setViewportSize({width:1100,height:1000});await page.goto(base+'/'+kind+'.html');await page.evaluate(()=>document.fonts.ready);await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),new RegExp(kind==='hands'?'12':'19'));
if(kind==='cows'){
 assert.equal(await page.locator('.cow-clef').count(),19);
 assert.match(await page.locator('.clef-examples').innerText(),/Treble clef[\s\S]*Bass clef/);
 const centered=await page.locator('.cow-clef').evaluateAll(buttons=>buttons.every(button=>{const box=button.getBoundingClientRect(),ink=button.querySelector('path').getBoundingClientRect();return Math.abs(box.x+box.width/2-ink.x-ink.width/2)<1 && Math.abs(box.y+box.height/2-ink.y-ink.height/2)<1;}));
 assert.equal(centered,true,'every clef uses centered actual ink bounds');
}
await page.locator('.profiles summary').click();await page.locator('#student-name').fill('QA');await page.locator('#profile-form button').click();assert.match(await page.locator('#student-label').innerText(),/QA/);
async function solve(wrong=false){if(kind==='hands'){for(let h=0;h<2;h++){const card=page.locator('.hand-card').nth(h);const hand=(await card.locator('img').getAttribute('src')).includes('left')?'left':'right';await card.locator('[data-value="'+hand+'"]').click();for(let f=1;f<=5;f++){await page.locator('[data-tool="'+(wrong&&h===0&&f===1?'5':f)+'"]').click();await page.locator('[data-index="'+(h*6+f)+'"]').click();}}}else{for(let i=0;i<19;i++){const b=page.locator('.cow-clef').nth(i);let c=(await b.getAttribute('class')).includes('bass')?'brown':'black';if(wrong&&i===0)c=c==='black'?'brown':'black';await page.locator('[data-tool="'+c+'"]').click();await b.click();}}}
await solve(true);await page.locator('#check').click();assert.equal(await page.locator('#feedback').innerText(),'有 1 个需要再想一想。');await solve();await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);assert.equal(await page.locator('.note-person').count(),5);await page.locator('#close-celebration').click();await page.screenshot({path:'.runtime/'+kind+'_desktop.png',fullPage:true});await page.locator('[data-tool="erase"]').click();await page.locator('[data-index="1"]').first().click();assert.equal(await page.locator('#count').innerText(),kind==='hands'?'11':'18');await page.locator('#next').click();assert.equal(await page.locator('#count').innerText(),'0');await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.runtime/'+kind+'_mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.setViewportSize({width:1100,height:1000});await page.pdf({path:'.runtime/'+kind+'_print.pdf',preferCSSPageSize:true});
}
const touch = await browser.newPage({viewport: {width: 390, height: 844}, hasTouch: true});
await touch.goto(base + '/cows.html');
const spot = touch.locator('.cow-clef').first();
await spot.scrollIntoViewIfNeeded();
const hit = await spot.boundingBox();
const x = hit.x + hit.width / 2 + 15;
const y = hit.y + hit.height / 2;
assert.equal(await touch.evaluate(([x, y]) => document.elementFromPoint(x, y).matches('.cow-art'), [x, y]), true);
await touch.touchscreen.tap(x, y);
assert.equal(await spot.getAttribute('aria-pressed'), 'true');
assert.equal(await touch.locator('#count').innerText(), '1');
assert.deepEqual(errors,[]);console.log('PASS: unified 29-activity catalog, compatibility route, install metadata, desktop/mobile, both games blank/error/correction/erase/reset, profiles, celebration, no failed resources or page errors.');
}finally{await browser.close();}
