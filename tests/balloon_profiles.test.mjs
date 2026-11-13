import test from "node:test";
import assert from "node:assert/strict";
import {readProfiles,saveProfiles,dateLabel} from "../src/balloon_profiles.mjs";
test("profiles retain active student and tolerate unavailable or corrupt storage",()=>{
 let bytes;
 const storage={getItem:()=>bytes,setItem:(_,v)=>{bytes=v;}};
 assert.equal(saveProfiles(storage,{names:["方方"],active:"方方"}),true);
 assert.deepEqual(readProfiles(storage),{names:["方方"],active:"方方"});
 bytes='{"names":["方方","方方",null],"active":"unknown"}';
 assert.deepEqual(readProfiles(storage),{names:["方方"],active:""});
 bytes="invalid"; assert.deepEqual(readProfiles(storage),{names:[],active:""});
 assert.equal(saveProfiles(null,{}),false);
});
test("date uses Shanghai calendar day across UTC midnight boundaries",()=>{
 assert.equal(dateLabel(new Date("2026-11-12T16:30:00Z")),"20261113");
});
