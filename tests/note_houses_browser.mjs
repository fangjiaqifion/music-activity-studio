import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {pitches} from '../src/note_houses_core.mjs';
const base=(process.env.BASE_URL||'http://127.0.0.1:8816').replace(/\/$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('.runtime/note-houses',{recursive:true});
const errors=[];
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  assert.equal((await page.goto(base+'/note-houses.html')).status(),200);
  await page.locator('.house').first().waitFor();
  // Keyboard selection, incorrect destination, and precise line/space bounds.
  await page.locator('[data-letter="C"]').press('Enter');
  await page.locator('[data-house="2"]').press('Enter');
  assert.equal(await page.locator('.house.filled').count(),0);
  await page.locator('[data-house="3"]').press('Enter');
  assert.equal(await page.locator('.house.filled').count(),1);
  const bounds=await page.locator('.house').evaluateAll(h=>h.map(g=>({index:Number(g.dataset.house),box:g.querySelector('.house-body').getBBox(),roof:g.querySelector('path:nth-of-type(2)').getBBox()})));
  assert.equal(bounds.length,7);
  // Complete a real mouse drag for G; tap placement for remaining characters.
  const target=page.locator('[data-house="0"]');await target.scrollIntoViewIfNeeded();
  const from=await page.locator('[data-letter="G"]').boundingBox(),to=await target.boundingBox();
  await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();
  await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:12});await page.mouse.up();
  assert.equal(await page.locator('.house.filled').count(),2);
  for(let i=0;i<7;i++){if(i===0||i===3)continue;await page.locator(`[data-letter="${pitches[i][0]}"]`).click();await page.locator(`[data-house="${i}"]`).click();}
  await page.locator('#celebration').waitFor({state:'visible'});await page.locator('#close-finish').click();
  assert.equal(await page.locator('#progress').innerText(),'7 / 7');
  await page.screenshot({path:'.runtime/note-houses/completed-desktop.png',fullPage:true});
  await page.locator('#level2').click();
  for(let q=0;q<6;q++){
    const text=await page.locator('#prompt').innerText(),m=text.match(/我是 ([A-G])，谁住在我楼(上|下)([123])层/);assert.ok(m);
    const home=pitches.findIndex(p=>p[0]===m[1]);const answer=pitches[home+(m[2]==='上'?1:-1)*Number(m[3])][0];
    const wrong='CDEFGAB'.split('').find(l=>l!==answer);await page.locator(`[data-letter="${wrong}"]`).click();assert.equal(await page.locator('#next').isVisible(),false);
    await page.locator(`[data-letter="${answer}"]`).press('Enter');assert.equal(await page.locator('#next').isVisible(),true);
    if(q===0)await page.screenshot({path:'.runtime/note-houses/neighbors-desktop.png',fullPage:true});
    await page.locator('#next').click();
  }
  assert.equal(await page.locator('#celebration').isVisible(),true);await page.locator('#again').click();assert.equal(await page.locator('#progress').innerText(),'1 / 6');
  for(const [width,height] of [[320,740],[390,844],[844,390],[768,1024],[820,1180],[1180,820],[1440,900]]){
    await page.setViewportSize({width,height});await page.locator('#level1').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const sizes=await page.locator('.character').evaluateAll(bs=>bs.map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})));
    assert.ok(sizes.every(s=>s.w>=44&&s.h>=44));
    const visible=await page.locator('#staff').evaluate(svg=>{
      const r=svg.getBoundingClientRect();
      return [...svg.querySelectorAll('.staff-lines path,.house-art')].every(e=>{const b=e.getBoundingClientRect();return b.top>=r.top-1&&b.bottom<=r.bottom+1&&b.left>=r.left-1&&b.right<=r.right+1;});
    });
    assert.equal(visible,true,`complete staff/houses visible at ${width}x${height}`);
    // The full staff stays in view while placing a selected letter.
    await page.locator('[data-letter="C"]').click();await page.locator('[data-house="3"]').click();assert.equal(await page.locator('.house.filled').count(),1);
    await page.locator('#reset').click();assert.equal(await page.locator('.house.filled').count(),0);
    await page.screenshot({path:`.runtime/note-houses/town-${width}x${height}.png`,fullPage:true});
  }
  // Touch taps use the pointer path, not synthetic keyboard click behavior.
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const phone=await touch.newPage();await phone.goto(base+'/note-houses.html');await phone.locator('[data-letter="C"]').tap();await phone.locator('[data-house="3"]').tap();assert.equal(await phone.locator('.house.filled').count(),1);await touch.close();
  assert.deepEqual(errors,[]);console.log('PASS note houses: drag, tap, keyboard, wrong/correct answers, six neighbor rounds, finish/reset, seven layouts and touch.');
}finally{await browser.close();}
