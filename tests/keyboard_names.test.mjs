import {test} from 'node:test';
import assert from 'node:assert/strict';
import {letters,makePage,assignMatch} from '../src/keyboard_names_core.mjs';
test('keyboard naming covers every natural note with valid landmark groups',()=>{for(let i=0;i<500;i++)for(const matching of [true,false]){const qs=makePage(matching);assert.equal(qs.length,matching?7:15);assert.deepEqual([...new Set(qs.map(q=>q.note))].sort(),letters);for(const q of qs)assert.ok((q.group==='short'?'CDE':q.group==='long'?'FGAB':'CDEFGAB').includes(q.note));}});
test('matching moves, replaces and clears without mutating previous answers',()=>{const old=['A','B',null];assert.deepEqual(assignMatch(old,2,'A'),[null,'B','A']);assert.deepEqual(assignMatch(old,1,'A'),[null,'A',null]);assert.deepEqual(assignMatch(old,0,null),[null,'B',null]);assert.deepEqual(old,['A','B',null]);});
