import test from 'node:test';
import assert from 'node:assert/strict';
import { TYPES, classify, makePage, scorePage } from '../src/pitch_motion_core.mjs';
test('P-031 uses staff distance, balances four types, and includes both directions without duplicates',()=>{
 for(let a=0;a<9;a++) for(let b=0;b<9;b++) {
  const d=Math.abs(a-b);
  assert.equal(classify(a,b),d===0?'repeat':d===1?'step':d===2?'skip':'leap');
 }
 for(let i=0;i<1000;i++) {
  const page=makePage(i), answers=page.map(q=>classify(q.a,q.b));
  assert.equal(page.length,12);
  assert.equal(new Set(page.map(q=>q.a+','+q.b)).size,12);
  for(const t of TYPES){
   const pairs=page.filter((q,j)=>answers[j]===t.id);
   assert.equal(pairs.length,3);
   if(t.id!=='repeat') {assert(pairs.some(q=>q.a<q.b));assert(pairs.some(q=>q.a>q.b));}
  }
  assert.deepEqual(scorePage(page,[]),{blank:12,errors:0});
  assert.deepEqual(scorePage(page,answers),{blank:0,errors:0});
  answers[0]='invalid';answers[1]=null;
  assert.deepEqual(scorePage(page,answers),{blank:1,errors:1});
 }
});
