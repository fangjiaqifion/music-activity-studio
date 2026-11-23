import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=(process.env.BASE_URL||'http://127.0.0.1:8861').replace(/\/+$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const slug of ['fish-keys','key-names']){
 await page.goto(base+'/'+slug+'.html');const matching=slug==='fish-keys',count=matching?7:15;
 assert.equal(await page.locator('.key-question').count(),count);
 const notes=await page.locator('.marked-keyboard').evaluateAll(es=>es.map(e=>{const x=Number(e.querySelector('circle').getAttribute('cx'));return (e.viewBox.baseVal.width===128?'CDE':e.viewBox.baseVal.width===168?'FGAB':'CDEFGAB')[Math.round((x-24)/40)];}));
 async function answer(i,n){if(matching){await page.locator('[data-fish="'+n+'"]').tap();await page.locator('[data-target="'+i+'"]').tap();}else await page.locator('[data-index="'+i+'"][data-answer="'+n+'"]').tap();}
 await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),new RegExp(String(count)));
 const wrong=notes[0]==='A'?'B':'A';await answer(0,wrong);
 for(let i=0;i<3;i++)await page.locator('#check').click();assert.equal(await page.locator('.retry-hint').count(),1);assert.equal(await page.locator('.retry-answer').count(),0);
 for(let i=0;i<3;i++)await page.locator('#check').click();assert.match(await page.locator('.retry-answer').innerText(),new RegExp(notes[0]));
 if(matching){await answer(1,wrong);assert.match(await page.locator('[data-target="0"]').innerText(),/点这里/);await page.locator('[data-erase]').click();await page.locator('[data-target="1"]').click();assert.equal(await page.locator('#count').innerText(),'0');}
 for(let i=0;i<count;i++)await answer(i,notes[i]);await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);await page.locator('#close-celebration').click();
 await page.locator('#next').click();assert.equal(await page.locator('#count').innerText(),'0');
 if(matching){await page.locator('[data-fish="A"]').focus();await page.keyboard.press('Enter');await page.locator('[data-target="0"]').focus();await page.keyboard.press('Enter');}else{await page.locator('[data-index="0"][data-answer="A"]').focus();await page.keyboard.press('Enter');}assert.equal(await page.locator('#count').innerText(),'1');
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'BUTTON');
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS P-005/P-006 independent keyboard geometry, touch, keyboard focus, matching reassignment/erase, blank/third/sixth hints, full completion and reset');
}finally{await browser.close();}
