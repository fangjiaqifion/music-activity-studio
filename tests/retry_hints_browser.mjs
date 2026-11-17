import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {generate} from '../src/core.mjs';
import {mkdir} from 'node:fs/promises';
const base=(process.env.BASE_URL||'http://127.0.0.1:8820').replace(/\/$/,'');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1180,height:900}}), errors=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('.runtime/retry_hints',{recursive:true});
async function threshold(submit,start=1){
 for(let n=start;n<=6;n++){
  await submit();
  assert.equal(await page.locator('.retry-hint').count(),n>=3?1:0,`ellipse ${n} on ${page.url()}`);
  assert.equal(await page.locator('.retry-answer').count(),n>=6?1:0,`answer ${n}`);
 }
 assert.match(await page.locator('.retry-answer').innerText(),/正确答案：.+/);
}
try{
 for(const kind of ['balloons','cheesecake','hands','cows','ladybirds','sunshine','treble','bass','alto','pitch-motion','keyboard']){
  await page.goto(`${base}/${kind}.html`);await page.locator('#check').click();
  assert.equal(await page.locator('.retry-hint').count(),0);
  if(kind==='balloons'){
   const y=+(await page.locator('.balloon svg > ellipse').first().getAttribute('cy')),p=Math.round((150-y)/5);
   await page.locator(`[data-color="${p%2?'blue':'red'}"]`).click();await page.locator('.balloon').first().click();
  }else if(kind==='cheesecake'){
   const y=+(await page.locator('.cake svg > ellipse').first().getAttribute('cy')),p=Math.round((80-y)/6.5);
   await page.locator(`.cake [data-answer="${p%2?'L':'S'}"]`).first().click();
  }else if(kind==='hands'){
   const src=await page.locator('.hand-card img').first().getAttribute('src');
   await page.locator(`.hand-card [data-value="${src.includes('left')?'right':'left'}"]`).first().click();
  }else if(kind==='cows'){
   const cls=await page.locator('.cow-clef').first().getAttribute('class');
   await page.locator(`[data-tool="${cls.includes('bass')?'black':'brown'}"]`).click();await page.locator('.cow-clef').first().click();
  }else if(kind==='ladybirds'){
   const label=await page.locator('.staff-card p').first().innerText();
   await page.locator(`.staff-card [data-value="${label.includes('Line 1')?8:0}"]`).first().click();
  }else if(kind==='sunshine'){
   const ys=await page.locator('.staff-card').first().locator('ellipse').evaluateAll(es=>es.map(e=>+e.getAttribute('cy')));
   await page.locator(`.staff-card [data-value="${ys[1]<ys[0]?'down':'up'}"]`).first().click();
  }else if(['treble','bass','alto'].includes(kind)){
   const card=page.locator('.staff-card').first(),y=+(await card.locator('ellipse').getAttribute('cy')),cy=+(await card.locator('.clef').getAttribute('y'));
   const anchor={treble:2,bass:6,alto:4}[kind]+(106-cy)/10;
   const expected='ABCDEFG'[(('ABCDEFG'.indexOf({treble:'G',bass:'F',alto:'C'}[kind])+(106-y)/10-anchor)%7+7)%7];
   await card.locator(`[data-value="${expected==='A'?'B':'A'}"]`).click();
  }else if(kind==='pitch-motion'){
   const ps=await page.locator('.motion-card').first().locator('[data-position]').evaluateAll(es=>es.map(e=>+e.dataset.position));
   const d=Math.abs(ps[0]-ps[1]);await page.locator(`.motion-card [data-answer="${d===0?'step':'repeat'}"]`).first().click();
  }else await page.locator('[data-task="paint"][data-key="0"]').click();
  await threshold(()=>page.locator('#check').click());
  if(kind==='pitch-motion')for(const [w,h] of [[390,844],[844,390],[768,1024],[1180,820],[1440,900]]){
    await page.setViewportSize({width:w,height:h});await page.locator('.motion-card').first().scrollIntoViewIfNeeded();
    await page.screenshot({path:`.runtime/retry_hints/${w}x${h}.png`});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('.retry-answer').scrollIntoViewIfNeeded();
    await page.screenshot({path:`.runtime/retry_hints/answer-${w}x${h}.png`});
    assert.equal(await page.locator('.retry-answer').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),true);
  }
  await page.setViewportSize({width:1180,height:900});await page.locator('#next').click();assert.equal(await page.locator('.retry-hint').count(),0);
  console.log('PASS thresholds/reset',kind);
 }
 for(const id of ['shop','detective','ocean','builder','bingo']){
  await page.goto(base+'/index.html');await page.locator(`[data-action="open"][data-id="${id}"]`).click();
  const seed=Number((await page.locator('.round small').innerText()).match(/\d+/)[0]),q=generate(id,seed,'starter')[0];
  let submit;
  if(id==='bingo'){
   const c=q.calls[0],i=q.board.findIndex(v=>v.letter!==c.letter||v.octave!==c.octave);
   submit=()=>page.locator(`[data-action="mark"][data-value="${i}"]`).click();
  }else{
   if(id==='shop')await page.locator('[data-action="note"][data-value="0"]').click();
   else if(id==='builder')await page.locator('[data-action="key"]').first().click();
   else await page.locator(`[data-action="choose"]:not([data-value="${q.answer}"])`).first().click();
   submit=()=>page.locator('[data-action="check"]').click();
  }
  await threshold(submit);await page.locator('[data-action="restart"]').click();assert.equal(await page.locator('.retry-hint').count(),0);
  console.log('PASS thresholds/reset',id);
 }
 await page.goto(base+'/note-houses.html');await page.clock.install();
 for(const level of [1,2]){
  await page.locator('#level'+level).click();
  if(level===1){await page.locator('[data-letter="C"]').click();
   await threshold(async()=>{await page.locator('[data-house="0"]').click();await page.clock.fastForward(2100);});
  }else{
   let wrong;
   for(const letter of 'ABCDEFG'){
    await page.locator(`[data-letter="${letter}"]`).click();
    if(await page.locator('.mismatch-cue').count()){wrong=letter;await page.clock.fastForward(2100);break;}
    await page.locator('#level2').click();
   }
   assert.ok(wrong);
   await threshold(async()=>{await page.locator(`[data-letter="${wrong}"]`).click();await page.clock.fastForward(2100);},2);
  }
  await page.locator('#reset').click();assert.equal(await page.locator('.retry-hint').count(),0);
  console.log('PASS thresholds/reset neighborhood',level);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
