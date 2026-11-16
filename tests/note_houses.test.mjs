import test from 'node:test';
import assert from 'node:assert/strict';
import {pitches,staffGeometry,houseCenter,layoutGeometry,neighborQuestions,makeQuestions,neighborPrompt} from '../src/note_houses_core.mjs';
test('house centers follow actual grand-staff pitches with bounded ink clearance',()=>{
  const {spacing:S,top,houseHeight}=staffGeometry;
  const staffLines=[0,1,2,3,4,6,7,8,9,10].map(n=>top+n*S);
  for(let i=0;i<7;i++){
    const {y}=houseCenter(i);
    assert.equal(y,top+6.5*S-i*S/2);
    if(i%2===0)assert.equal(Math.min(...staffLines.map(line=>Math.abs(y-line)))-houseHeight/2,18);
    else if(i!==3)assert.ok(staffLines.includes(y));
  }
  assert.equal(houseCenter(3).y,top+5*S);
  for(const [width,height] of [[368,440],[720,580],[1230,440],[800,150]]){
    const g=layoutGeometry(width,height);
    assert.ok(g.top+10*g.spacing<height);
    assert.ok(g.top+4*g.spacing-1078*g.spacing/200>0,'treble glyph stays visible');
    assert.ok(houseCenter(0,g).x-37*g.spacing/90>32+547*g.spacing/200,'first house clears bass clef');
    for(let i=0;i<7;i++)assert.equal(Math.round((houseCenter(i,g).y-g.top)/g.spacing*2),13-i);
  }
});
test('neighbor questions count diatonic steps, never leave the seven houses',()=>{
  const pool=neighborQuestions();assert.equal(pool.length,30);
  for(const q of pool){assert.ok(q.target>=0&&q.target<7);assert.equal(q.target,q.home+q.delta);assert.equal(q.answer,pitches[q.target][0]);}
  for(let i=0;i<100;i++){const q=makeQuestions();assert.equal(q.length,6);assert.deepEqual(new Set(q.map(q=>q.delta)),new Set([-3,-2,-1,1,2,3]));}
  assert.equal(neighborPrompt({home:3,delta:2}),'我是 C 音，住在我上两层的音是谁？');
  assert.equal(neighborPrompt({home:3,delta:-3}),'我是 C 音，住在我下三层的音是谁？');
});
