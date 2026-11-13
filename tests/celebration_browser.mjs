import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{const p=await b.newPage({viewport:{width:1100,height:900}});
for(const name of ['balloons','cheesecake']){
await p.goto((process.env.BASE_URL||'http://127.0.0.1:8793')+'/'+name+'.html');await p.locator('.runner').first().waitFor({state:'attached'});
await p.evaluate(()=>{const c=document.querySelector('#celebration');c.hidden=false;c.classList.add('playing');});
assert.equal(await p.locator('.clapper').count(),3);assert.equal(await p.locator('.banner-bearer').count(),2);
const gaps=await p.evaluate(()=>{
for(const a of document.getAnimations()){a.pause();a.currentTime=a.effect.getTiming().delay+a.effect.getTiming().duration*1.5;}
const parade=document.querySelector('.parade');parade.style.left='180px';parade.style.animation='none';
return [...document.querySelectorAll('.clapper')].map(el=>{const left=el.querySelector('.clap-left .clap-palm').getBoundingClientRect(),right=el.querySelector('.clap-right .clap-palm').getBoundingClientRect();return right.left-left.right;});});
assert.ok(gaps.every(g=>g<=1),JSON.stringify(gaps));
await p.screenshot({path:'.runtime/'+name+'_runners.png',fullPage:true});
await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.parade').evaluate(el=>getComputedStyle(el).animationName),'none');await p.emulateMedia({reducedMotion:'no-preference'});
}
console.log('PASS: both celebrations, five runners, two banner bearers, three touching palm pairs, reduced motion.');
}finally{await b.close();}
