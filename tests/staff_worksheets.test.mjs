import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeStaffPage,scoreStaffPage,relativeLetter,makeTreblePage,makeRelativePage} from '../src/staff_worksheets_core.mjs';
test('staff placement, pair-only comparison, and aggregate scoring',()=>{for(let n=0;n<1000;n++)for(const kind of ['ladybirds','sunshine']){const items=makeStaffPage(kind);assert.equal(items.length,12);if(kind==='ladybirds')assert.equal(new Set(items.slice(0,9).map(q=>q.position)).size,9);else {assert.ok(items.every(q=>q.type==='direction'));for(const direction of ['up','down','same'])assert.equal(items.filter(q=>q.expected===direction).length,4);for(const q of items)assert.equal(q.expected,q.b>q.a?'up':q.b<q.a?'down':'same');}assert.deepEqual(scoreStaffPage(items,items.map(q=>q.expected)),{blank:0,errors:0});assert.equal(scoreStaffPage(items,items.map(()=>null)).blank,12);const wrong=items.map(q=>q.expected);wrong[0]='wrong';assert.deepEqual(scoreStaffPage(items,wrong),{blank:0,errors:1});}});
test('O-009 daily sets contain nine unique pairs and avoid repeats for four days',()=>{
 const seen=new Set();
 for(let day=100;day<104;day++){
 const page=makeTreblePage(day);assert.equal(page.length,9);assert.deepEqual(page,makeTreblePage(day));
 for(const q of page){const key=`${q.clefPosition}:${q.position}`;assert.ok(!seen.has(key));seen.add(key);assert.equal(q.expected,relativeLetter('G',q.position-q.clefPosition));}
 assert.deepEqual(makeTreblePage(day,1),makeTreblePage(day+1));
 }
 assert.equal(seen.size,36);
});

for (const [kind,letter] of [['bass','F'],['alto','C']]) test(kind+' movable clef daily coverage and scoring',()=>{
 const seen=new Set();
 for(let day=100;day<104;day++){const page=makeRelativePage(kind,day);assert.equal(page.length,9);assert.deepEqual(page,makeRelativePage(kind,day));assert.deepEqual(makeRelativePage(kind,day,1),makeRelativePage(kind,day+1));
 for(const q of page){const key=q.clefPosition+':'+q.position;assert.ok(!seen.has(key));seen.add(key);assert.equal(q.expected,relativeLetter(letter,q.position-q.clefPosition));}
 assert.deepEqual(scoreStaffPage(page,page.map(q=>q.expected)),{blank:0,errors:0});assert.deepEqual(scoreStaffPage(page,[]),{blank:9,errors:0});}
 assert.equal(seen.size,36);assert.deepEqual(makeRelativePage(kind,100),makeRelativePage(kind,104));
});
