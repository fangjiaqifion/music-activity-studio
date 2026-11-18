import test from 'node:test';
import assert from 'node:assert/strict';
import {makePage,pitchLabel,keyGroup,staffPosition,fishLabel,makeFishBank,assignFish} from '../src/pitch_notes_core.mjs';
test('P-002 covers all seven letters and both clefs; key group follows black-key geometry',()=>{
 for(let n=0;n<500;n++){
  const page=makePage('key-notes',n);assert.equal(page.length,9);
  assert.equal(new Set(page.map(q=>pitchLabel(q.pitch)[0])).size,7);
  assert.equal(new Set(page.map(q=>q.clef)).size,2);
  for(const q of page)assert.equal(keyGroup(q.pitch),'CDE'.includes(pitchLabel(q.pitch)[0])?'2':'3');
 }
 assert.equal(staffPosition({pitch:28,clef:'treble'}),-2);
 assert.equal(staffPosition({pitch:28,clef:'bass'}),10);
});
test('P-003 corrects source ambiguity with nine exact pitches and explicit octaves',()=>{
 for(let n=0;n<500;n++){
  const page=makePage('fish-notes',n);assert.equal(page.length,9);
  assert.deepEqual(page.map(q=>pitchLabel(q.pitch)).sort(),['A3','A4','B3','C3','C4','C5','D4','F2','G5']);
  const bank=makeFishBank(page);assert.equal(new Set(bank).size,9);assert.deepEqual([...bank].sort(),page.map(q=>q.pitch).sort());assert.notDeepEqual(bank,page.map(q=>q.pitch));
 }
 assert.equal(fishLabel(28),'c¹');assert.equal(fishLabel(35),'c²');assert.equal(fishLabel(17),'F');
});

test('fish matching keeps one-to-one pairs when moving, replacing and clearing fish',()=>{
 const initial=[{pitch:28},{pitch:35},{}];
 const moved=assignFish(initial,2,28);assert.deepEqual(moved,[{},{pitch:35},{pitch:28}]);
 assert.deepEqual(initial,[{pitch:28},{pitch:35},{}]);
 assert.deepEqual(assignFish(moved,1,28),[{},{pitch:28},{}]);
});
