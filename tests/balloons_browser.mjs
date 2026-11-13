import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import {mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
await mkdir(new URL("../.runtime/",import.meta.url),{recursive:true});
const b=await chromium.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
const p=await b.newPage({viewport:{width:1100,height:1000}});
const errors=[];p.on("pageerror",e=>errors.push(e.message));
await p.goto((process.env.BASE_URL || "http://127.0.0.1:8790")+"/balloons.html");
await p.locator(".profiles summary").click();
await p.locator("#student-name").fill("方方");await p.locator("#profile-form button").click();
assert.match(await p.locator("#student-label").innerText(),/方方 \d{8}/);
await p.reload();assert.equal(await p.locator("#student").inputValue(),"方方");
assert.equal(await p.locator("#speak").count(),1);
assert.match(await p.locator("#check").innerText(),/✓ 完成/);
const staffTops=await p.locator(".balloon svg g path:first-child").evaluateAll(els=>els.map(el=>el.getAttribute("d")));
assert.equal(new Set(staffTops).size,1);
await p.locator("#check").click();assert.match(await p.locator("#feedback").innerText(),/12 个气球没有/);
async function solve(wrong=false){
 const buttons=p.locator(".balloon");
 for(let i=0;i<12;i++){
  const data=await buttons.nth(i).evaluate(el=>{
   const svg=el.querySelector("svg"),staff=svg.querySelector("g path"),note=svg.querySelector("ellipse");
   const top=Number(staff.getAttribute("d").match(/M55 ([\d.]+)/)[1]);
   const position=Math.round((top+40-Number(note.getAttribute("cy")))/5);
   return position%2?"red":"blue";
  });
  await p.locator('[data-color="'+(wrong&&i===0?(data==="red"?"blue":"red"):data)+'"]').click();
  await buttons.nth(i).click();
 }
}
await solve(true);await p.locator("#check").click();
assert.equal(await p.locator("#feedback").innerText(),"有 1 个需要再想一想。");
assert.equal(await p.locator("[data-error],.mark").count(),0);
await p.screenshot({path:fileURLToPath(new URL("../.runtime/balloons_revision_wrong.png",import.meta.url)),fullPage:true});
await solve();await p.locator("#check").click();
assert.equal(await p.locator("#celebration").isVisible(),true);
assert.equal(await p.locator(".note-person").count(),5);
await p.waitForTimeout(4000);await p.screenshot({path:fileURLToPath(new URL("../.runtime/balloons_revision_dance.png",import.meta.url)),fullPage:true});
await p.locator("#next").click();assert.equal(await p.locator("#celebration").isVisible(),false);
await p.setViewportSize({width:390,height:844});await p.screenshot({path:fileURLToPath(new URL("../.runtime/balloons_revision_mobile.png",import.meta.url)),fullPage:true});
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.deepEqual(errors,[]);
console.log("PASS: profile persistence, blank/error counts without location hints, five dancers, reset, mobile overflow, no page errors.");
await b.close();
