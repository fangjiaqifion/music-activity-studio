import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=(process.env.BASE_URL||'http://127.0.0.1:8817').replace(/\/$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('.runtime/pitch_motion',{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};window.speechSynthesis.speak=u=>window.spoken.push(u.text);window.speechSynthesis.getVoices=()=>[{lang:'zh-CN',name:'test'}];});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
try{
 await page.goto(base+'/activities.html');await page.locator('a[href="pitch-motion.html"]').click();
 await page.locator('.motion-card').first().waitFor();
 assert.equal(await page.locator('.motion-card').count(),9);
 assert.equal(await page.locator('.motion-guide article').count(),4);
 await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),/还有 9/);
 await page.locator('#speak').click();assert.match(await page.evaluate(()=>window.spoken.at(-1)),/中间隔一个音/);
 const original=await page.locator('.motion-grid').innerHTML();
 for(const card of await page.locator('.motion-card').all()){
  const [a,b]=await card.locator('[data-position]').evaluateAll(es=>es.map(e=>+e.dataset.position));
  const d=Math.abs(a-b),answer=d===0?'repeat':d===1?'step':d===2?'skip':'leap';
  await card.locator('[data-answer="'+answer+'"]').click();
 }
 assert.equal(await page.locator('#count').innerText(),'9');
 const first=page.locator('.motion-card').first();
 const correct=await first.locator('[aria-pressed=true]').getAttribute('data-answer');
 await first.locator('button:not([aria-pressed=true])').first().click();await page.locator('#check').click();
 assert.equal(await page.locator('#feedback').innerText(),'有 1 个需要再想一想。');
 assert.equal(await page.locator('.retry-cue').count(),0);
 await page.locator('#check').click();assert.equal(await page.locator('.retry-cue').count(),0);
 await page.locator('#check').click();assert.equal(await page.locator('.retry-cue').count(),1);
 assert.equal(await first.locator('.retry-cue').count(),1);
 await page.setViewportSize({width:390,height:844});
 await first.scrollIntoViewIfNeeded();await page.screenshot({path:'.runtime/pitch_motion/third-error-phone.png'});
 await page.setViewportSize({width:1440,height:1000});
 await first.locator('[data-answer="'+correct+'"]').focus();await page.keyboard.press('Enter');
 assert.equal(await first.locator('[data-answer="'+correct+'"]').evaluate(e=>e===document.activeElement),true);
 assert.equal(await page.locator('.retry-cue').count(),0);
 await page.locator('#check').click();assert.equal(await page.locator('.retry-cue').count(),0);assert.equal(await page.locator('#celebration').isVisible(),true);assert.equal(await page.locator('.note-person').count(),5);
 await page.keyboard.press('Escape');assert.equal(await page.locator('#celebration').isVisible(),false);
 await page.locator('#next').click();assert.equal(await page.locator('#count').innerText(),'0');assert.notEqual(await page.locator('.motion-grid').innerHTML(),original);
 for(const [width,height] of [[320,740],[390,844],[844,390],[768,1024],[1180,820],[1440,900]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.locator('.motion-options button').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth;})),true);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:'.runtime/pitch_motion/'+width+'x'+height+'.png'});
  await page.locator('.motion-card').first().scrollIntoViewIfNeeded();
  await page.screenshot({path:'.runtime/pitch_motion/card-'+width+'x'+height+'.png'});
 }
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const phone=await touch.newPage();await phone.goto(base+'/pitch-motion.html');
 await phone.locator('.motion-options button').first().tap();assert.equal(await phone.locator('#count').innerText(),'1');await touch.close();
 assert.deepEqual(errors,[]);console.log('PASS P-031 full correction/completion/reset, speech, keyboard/touch and six viewports');
}finally{await browser.close();}
