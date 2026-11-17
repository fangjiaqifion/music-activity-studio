import test from 'node:test';
import assert from 'node:assert/strict';
import {createRetryState} from '../src/retry_hints.mjs';
test('assistance counts answered errors per question, preserves blanks, resets on success/new set',()=>{
 const s=createRetryState();
 assert.equal(s.check('a',null),0);
 for(let i=1;i<=6;i++) {
  assert.equal(s.check('a',true),i);
  assert.equal(s.check('b',null),0);
 }
 assert.equal(s.check('b',true),1);
 assert.equal(s.check('a',false),0);
 assert.equal(s.check('a',true),1);
 s.reset();assert.equal(s.check('b',true),1);
});
