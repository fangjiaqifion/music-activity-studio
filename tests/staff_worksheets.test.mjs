import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeStaffPage,scoreStaffPage,relativeLetter,makeTreblePage} from '../src/staff_worksheets_core.mjs';
test('staff placement, pair-only comparison, and aggregate scoring',()=>{for(let n=0;n<1000;n++)for(const kind of ['ladybirds','sunshine']){const items=makeStaffPage(kind);assert.equal(items.length,12);if(kind==='ladybirds')assert.equal(new Set(items.slice(0,9).map(q=>q.position)).size,9);else {assert.ok(items.every(q=>q.type==='direction'));for(const direction of ['up','down','same'])assert.equal(items.filter(q=>q.expected===direction).length,4);for(const q of items)assert.equal(q.expected,q.b>q.a?'up':q.b<q.a?'down':'same');}assert.deepEqual(scoreStaffPage(items,items.map(q=>q.expected)),{blank:0,errors:0});assert.equal(scoreStaffPage(items,items.map(()=>null)).blank,12);const wrong=items.map(q=>q.expected);wrong[0]='wrong';assert.deepEqual(scoreStaffPage(items,wrong),{blank:0,errors:1});}});
test('relative-note worksheets preserve source groups and wrap letters in both directions',()=>{assert.equal(relativeLetter('G',1),'A');assert.equal(relativeLetter('A',-1),'G');assert.equal(relativeLetter('C',-8),'B');for(const kind of ['bass','alto']){const items=makeStaffPage(kind);assert.equal(items.length,24);assert.equal(new Set(items.map(q=>q.group)).size,4);assert.equal(scoreStaffPage(items,items.map(q=>q.expected)).errors,0);for(const q of items){const sequence='ABCDEFG';const expected=sequence[((sequence.indexOf(q.letter)+q.position-q.reference)%7+7)%7];assert.equal(q.expected,expected);}}});

test('O-009 daily sets contain nine unique pairs and avoid repeats for four days',()=>{
 const seen=new Set();
 for(let day=100;day<104;day++){
 const page=makeTreblePage(day);assert.equal(page.length,9);assert.deepEqual(page,makeTreblePage(day));
 for(const q of page){const key=`${q.clefPosition}:${q.position}`;assert.ok(!seen.has(key));seen.add(key);assert.equal(q.expected,relativeLetter('G',q.position-q.clefPosition));}
 assert.deepEqual(makeTreblePage(day,1),makeTreblePage(day+1));
 }
 assert.equal(seen.size,36);
});
