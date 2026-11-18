import test from 'node:test';
import assert from 'node:assert/strict';
import {makePage,pitchLabel,keyGroup,staffPosition,fishLabel} from '../src/pitch_notes_core.mjs';
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
  for(const q of page){assert.equal(new Set(q.choices).size,3);assert.ok(q.choices.includes(q.pitch));assert.ok(q.choices.some(p=>p!==q.pitch&&pitchLabel(p)[0]===pitchLabel(q.pitch)[0]));}
 }
 assert.equal(fishLabel(28),'c¹');assert.equal(fishLabel(35),'c²');assert.equal(fishLabel(17),'F');
});
