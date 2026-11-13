import test from "node:test";
import assert from "node:assert/strict";
import {makePage,answer} from "../src/balloons_core.mjs";
test("balloon pages cover all staff positions and balance line/space questions",()=>{
 const seen = new Set();
 for(let n=0;n<1000;n++){
  const page=makePage();
  assert.equal(page.length,12);
  assert.equal(page.filter(x=>answer(x.position)==="red").length,6);
  page.forEach(x=>{assert.ok(x.position>=0&&x.position<=8);seen.add(x.position)});
 }
 assert.equal(seen.size,9);
});
