import test from "node:test";
import assert from "node:assert/strict";
import {createSpeech,instructions} from "../src/balloon_speech.mjs";
test("Chinese instructions replace pending speech and select a Chinese voice",()=>{
 const spoken=[];let cancels=0,failures=0;
 const voice={lang:"zh-CN"};
 const synth={cancel(){cancels++;},getVoices:()=>[voice],speak:u=>spoken.push(u)};
 class Utterance{constructor(text){this.text=text;}}
 const speech=createSpeech(synth,Utterance,()=>failures++);
 speech.speak(instructions);speech.speak("请用蓝色涂线音气球");
 assert.equal(spoken[0].lang,"zh-CN");assert.equal(spoken[0].voice,voice);
 assert.equal(spoken[1].text,"请用蓝色涂线音气球");
 spoken[0].onerror();assert.equal(failures,0);
 speech.stop();assert.equal(cancels,3);
});
test("unavailable speech reports a readable fallback",()=>{
 let failures=0;createSpeech(null,null,()=>failures++).speak(instructions);
 assert.equal(failures,1);
});
