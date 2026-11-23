import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=(process.env.BASE_URL||'http://127.0.0.1:8861').replace(/\/+$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of ['fish-keys','key-names']){
 await page.goto(base+'/'+slug+'.html');const matching=slug==='fish-keys',count=matching?9:15;
 assert.equal(await page.locator('.key-question').count(),count);
 const notes=await page.locator('.marked-keyboard').evaluateAll(es=>es.map(e=>{const x=Number(e.querySelector('circle').getAttribute('cx'));return (e.viewBox.baseVal.width===128?'CDE':e.viewBox.baseVal.width===168?'FGAB':'CDEFGAB')[Math.round((x-24)/40)];}));
 async function answer(i,n){if(matching){await page.locator('[data-fish="'+n+'"]').tap();await page.locator('[data-target="'+i+'"]').tap();}else await page.locator('[data-index="'+i+'"][data-answer="'+n+'"]').tap();}
 await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),new RegExp(String(count)));
 const wrong=notes[0]==='A'?'B':'A';await answer(0,wrong);
 if(matching){
 await page.locator('#check').click();assert.equal(await page.locator('.fish-error').count(),0);assert.equal(await page.locator('.retry-answer').count(),0);
 await answer(1,notes[1]==='A'?'B':'A');
 await page.locator('#check').click();assert.equal(await page.locator('.fish-error').count(),2);assert.equal(await page.locator('.retry-answer').count(),0);await page.screenshot({path:'.runtime/p005-second-error.png'});
 await page.locator('#check').click();assert.deepEqual(await page.locator('.retry-answer').allTextContents(),notes.slice(0,2));
 assert.equal(await page.locator('.fish-error').first().evaluate(e=>getComputedStyle(e).borderTopStyle),'dashed');
 }else{
 for(let i=0;i<3;i++)await page.locator('#check').click();assert.equal(await page.locator('.retry-hint').count(),1);assert.equal(await page.locator('.retry-answer').count(),0);
 for(let i=0;i<3;i++)await page.locator('#check').click();assert.match(await page.locator('.retry-answer').innerText(),new RegExp(notes[0]));
 }
 if(matching){await answer(1,wrong);assert.equal(await page.locator('#count').innerText(),'2');assert.equal(await page.locator('[data-fish="'+wrong+'"]').getAttribute('data-used'),'true');assert.equal(await page.locator('[data-fish="'+wrong+'"]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 223, 107)');await page.locator('[data-fish="'+notes[0]+'"]').tap();assert.equal(await page.locator('[data-fish="'+wrong+'"]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(198, 233, 186)');assert.equal(await page.locator('.name-fish small').count(),0);await page.locator('[data-erase]').click();for(const i of [0,1])await page.locator('[data-target="'+i+'"]').click();assert.equal(await page.locator('#count').innerText(),'0');}
 for(let i=0;i<count;i++)await answer(i,notes[i]);await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);await page.locator('#close-celebration').click();
 await page.locator('#next').click();assert.equal(await page.locator('#count').innerText(),'0');assert.equal(await page.locator('.fish-error,.retry-answer').count(),0);
 if(matching){await page.locator('[data-fish="A"]').focus();await page.keyboard.press('Enter');await page.locator('[data-target="0"]').focus();await page.keyboard.press('Enter');}else{await page.locator('[data-index="0"][data-answer="A"]').focus();await page.keyboard.press('Enter');}assert.equal(await page.locator('#count').innerText(),'1');
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'BUTTON');
 if(matching)for(const [width,height] of [[320,568],[390,844],[844,390],[768,1024],[820,1180],[1180,820],[1440,900]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>{window.scrollTo(0,0);return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight+1),false,'No vertical page scrolling '+width);
 const bounds=await page.locator('[data-fish],[data-target],#check,#next').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1&&r.width>=44&&r.height>=44;}));assert.equal(bounds,true,'All choices and targets visible, 44px '+width);
 await page.evaluate(()=>document.fonts.ready);
 const contained=await page.locator('.fish-illustration text').evaluateAll(es=>es.every(e=>{if(!e.textContent)return true;const r=e.getBBox();return r.x>=24&&r.x+r.width<=117&&r.y>=85&&r.y+r.height<=131;}));assert.equal(contained,true,'Fish lettering stays inside belly '+width);
 await page.screenshot({path:'.runtime/p005-'+width+'.png'});
 }
 await page.setViewportSize({width:390,height:844});
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS P-005/P-006 independent keyboard geometry, touch, keyboard focus, repeatable choices/erase, P-005 first/second/third and P-006 third/sixth hints, seven same-screen viewport checks, full completion and reset');
}finally{await browser.close();}
