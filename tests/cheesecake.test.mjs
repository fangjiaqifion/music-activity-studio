import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makePage,answer} from '../src/cheesecake_core.mjs';
test('cheesecake pages cover all nine staff positions and change between pages',()=>{
 let previous='';
 for(let i=0;i<1000;i++){
 const page=makePage(Math.random,previous);const signature=page.map(x=>x.position).join(',');
 assert.notEqual(signature,previous);assert.deepEqual(page.map(x=>x.position).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
 assert.equal(page.filter(x=>answer(x.position)==='S').length,4);previous=signature;
 }
});
