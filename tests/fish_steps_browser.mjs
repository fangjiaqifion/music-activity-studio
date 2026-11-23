import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:8847';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('.runtime/fish_steps',{recursive:true});
try{
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/fish-steps.html');
assert.equal(await page.locator('.step-fish').count(),12);
await page.locator('#check').click();assert.match(await page.locator('#feedback').innerText(),/12/);
await page.locator('[data-index="1"]').click();
for(let i=0;i<3;i++)await page.locator('#check').click();
assert.equal(await page.locator('.retry-hint').count(),1);assert.equal(await page.locator('.retry-answer').count(),0);
for(let i=0;i<3;i++)await page.locator('#check').click();assert.match(await page.locator('.retry-answer').innerText(),/红色/);
await page.locator('[data-brush="erase"]').click();await page.locator('[data-index="1"]').click();assert.equal(await page.locator('[data-index="1"]').getAttribute('data-color'),'');
const pairs=await page.locator('.fish-art strong').allTextContents();
for(let i=0;i<pairs.length;i++){await page.locator('[data-brush="'+(['B-C','E-F'].includes(pairs[i])?'red':'blue')+'"]').click();await page.locator('[data-index="'+i+'"]').click();}
await page.locator('#check').click();assert.equal(await page.locator('#celebration').isVisible(),true);await page.locator('#close-celebration').click();
for(const [width,height] of [[390,844],[844,390],[768,1024],[820,1180],[1180,820],[1440,900]]){await page.setViewportSize({width,height});await page.screenshot({path:'.runtime/fish_steps/'+width+'.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('.step-fish').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().width>=44&&e.getBoundingClientRect().height>=44)),true);}
await page.locator('#next').click();assert.equal(await page.locator('.step-fish[data-color=""]').count(),12);await page.locator('[data-index="0"]').focus();await page.keyboard.press('Enter');assert.notEqual(await page.locator('[data-index="0"]').getAttribute('data-color'),'');
const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const tp=await touch.newPage();await tp.goto(base+'/fish-steps.html');await tp.locator('[data-brush="red"]').tap();await tp.locator('[data-index="1"]').tap();assert.equal(await tp.locator('[data-index="1"]').getAttribute('data-color'),'red');await touch.close();
assert.deepEqual(errors,[]);console.log('PASS P-004 blank, third/sixth hints, erase, correction, completion/reset, keyboard, six viewports.');
}finally{await browser.close();}
