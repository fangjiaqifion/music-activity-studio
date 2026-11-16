import test from 'node:test';
import assert from 'node:assert/strict';
import {createPiano,pianoNotes} from '../src/note_house_piano.mjs';
const fetchFile=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)});
function fakeContext(){
  const sources=[];
  return {state:'running',currentTime:0,destination:{},sources,resume:async()=>{},decodeAudioData:async()=>({duration:5}),
    createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}),
    createBufferSource(){const s={playbackRate:{value:1},connect(){},disconnect(){},start(){s.started=true;},stop(){s.stopped=(s.stopped||0)+1;}};sources.push(s);return s;}};
}
test('seven piano characters use their actual G3–F4 MIDI pitches and sample rates',async()=>{
  assert.deepEqual('GABCDEF'.split('').map(l=>pianoNotes[l].midi),[55,57,59,60,62,64,65]);
  const context=fakeContext(),piano=createPiano({makeContext:()=>context,fetchFile});
  for(const letter of 'GABCDEF'){
    assert.equal(await piano.play(letter),true);
    const source=context.sources.at(-1),n=pianoNotes[letter];
    assert.equal(source.playbackRate.value,2**((n.midi-n.base)/12));assert.ok(source.started);
  }
  piano.stop();assert.ok(context.sources.every(s=>s.stopped>=2));
});
test('piano navigation rejects stale asynchronous resume and reports unavailable audio',async()=>{
  const context=fakeContext();let resume;
  context.resume=()=>new Promise(resolve=>resume=resolve);
  const piano=createPiano({makeContext:()=>context,fetchFile});
  const pending=piano.play('C');piano.stop();resume();assert.equal(await pending,false);assert.equal(context.sources.length,0);
  let failures=0;const unavailable=createPiano({makeContext:()=>{throw Error('blocked');},fetchFile,onUnavailable:()=>failures++});
  assert.equal(await unavailable.play('C'),false);assert.equal(failures,1);
});
