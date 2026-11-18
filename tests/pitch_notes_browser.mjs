import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=(process.env.BASE_URL||'http://127.0.0.1:8831').replace(/\/$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('.runtime/pitch_notes',{recursive:true});
const errors=[];
try{
 for(const kind of ['key-notes','fish-notes']){
 const context=await browser.newContext({viewport:{width:1180,height:900},hasTouch:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
 await page.goto(`${base}/${kind}.html`);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.note-card').count(),9);
 await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),/9 题/);
 const first=page.locator('.note-card').first();
 if(kind==='key-notes'){
  assert.equal(await page.locator('.piano').count(),18,'both keyboard groups remain visible on every question');
  assert.equal(await page.locator('.white-key').count(),63);
  assert.equal(await page.locator('.white-key:disabled').count(),63,'students choose a group first');
  assert.ok((await page.locator('.white-key').allTextContents()).every(t=>!/[A-G]/.test(t)));
  assert.doesNotMatch(await page.locator('.note-guide').innerText(),/[A-G]/,'no note-to-key lookup guide');
 }

 async function pitch(card){return card.evaluate(el=>{const bass=el.querySelector('.clef').textContent==='\uE062';return (bass?18:30)+(106-Number(el.querySelector('.target-note').getAttribute('cy')))/10;});}
 const q=await pitch(first);
 if(kind==='key-notes'){
  await first.locator(`[data-group="${q%7<3?'3':'2'}"]`).click();
 }
 if(kind==='fish-notes'){
 const incorrect=await first.locator('[data-pitch]').evaluateAll((es,p)=>es.find(e=>+e.dataset.pitch!==p).dataset.pitch,q);
 await first.locator(`[data-pitch="${incorrect}"]`).tap();
 }
 for(let i=1;i<=6;i++){
 await page.locator('#check').click();assert.equal(await page.locator('.retry-hint').count(),i>=3?1:0);assert.equal(await page.locator('.retry-answer').count(),i>=6?1:0);
 }
 if(kind==='key-notes'){
 await first.locator('[data-group="'+(q%7<3?'2':'3')+'"]').click();
 const wrongKey=(q%7<3?'CDE':'FGAB').split('').find(k=>k!=='CDEFGAB'[q%7]);
 await first.locator('[data-key="'+wrongKey+'"]').click();
 assert.equal(await first.locator('.piano').count(),2);
 assert.ok((await first.locator('.white-key').allTextContents()).every(t=>!/[A-G]/.test(t)),'selection cannot disclose a key name');
 // Switching groups clears the marked position without naming its pitch.
 const correctGroup=q%7<3?'2':'3';
 await first.locator('[data-group="'+(correctGroup==='2'?'3':'2')+'"]').click();
 assert.equal(await first.locator('.white-key[aria-pressed=true]').count(),0);
 await first.locator('[data-group="'+correctGroup+'"]').click();
 await first.locator('[data-key="'+wrongKey+'"]').click();
 for(let attempt=1;attempt<=6;attempt++){
 await page.locator('#check').click();
 assert.equal(await page.locator('.retry-hint').count(),attempt>=3?1:0);
 assert.equal(await page.locator('.retry-answer').count(),attempt>=6?1:0);
 }
 }
 for(let i=0;i<9;i++){
 const card=page.locator('.note-card').nth(i),n=await pitch(card);
 if(kind==='key-notes'){
  await card.locator(`[data-group="${n%7<3?'2':'3'}"]`).click();
  const key=card.locator(`[data-key="${'CDEFGAB'[n%7]}"]`);await key.focus();await page.keyboard.press('Enter');
  assert.equal(await key.evaluate(e=>e===document.activeElement),true);
 }else await card.locator(`[data-pitch="${n}"]`).tap();
 }
 assert.equal(await page.locator('#count').innerText(),'9');
 await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);assert.equal(await page.locator('.retry-hint').count(),0);
 await page.locator('#next').click();assert.equal(await page.locator('#celebration').isVisible(),false);assert.equal(await page.locator('#count').innerText(),'0');
 for(const [width,height] of [[390,844],[844,390],[768,1024],[1180,820],[1440,900]]){
 await page.setViewportSize({width,height});
 if(kind==='key-notes'){
  await first.locator('[data-group="2"]').click();
  const small=await first.locator('.white-key:enabled').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width<43.9).length);
  assert.equal(small,0,'white keys preserve 44px touch width');
  const widths=await first.locator('.piano').evaluateAll(es=>es.map(e=>e.querySelector('.white-key').getBoundingClientRect().width));
  assert.ok(Math.abs(widths[0]-widths[1])<1,'both groups use the same white-key scale');
  await first.screenshot({path:`.runtime/pitch_notes/key-notes-card-${width}x${height}.png`});
 }
 await page.screenshot({path:`.runtime/pitch_notes/${kind}-${width}x${height}.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await context.close();console.log('PASS',kind,'nine questions, octave-aware answers, third/sixth hints, keyboard/touch, completion/reset, five viewports');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
