import { createRetryHints } from "./retry_hints.mjs";
const retryHints = createRetryHints();
import { createSpeech } from './balloon_speech.mjs';
import { readProfiles, saveProfiles, dateLabel } from './balloon_profiles.mjs';
import { makePage, keyGroup, pitchLabel, fishLabel, staffPosition } from './pitch_notes_core.mjs';
const kind=document.body.dataset.activity;
const board=document.querySelector('#activity-board'), feedback=document.querySelector('#feedback'), celebration=document.querySelector('#celebration');
const speech=createSpeech(window.speechSynthesis,window.SpeechSynthesisUtterance,()=>document.querySelector('#speech-status').textContent='当前语音不可用，请看文字提示。');
function stopCelebration(){celebration.hidden=true;}
function stop(){speech.stop();stopCelebration();}
window.addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('beforeprint',stop);
document.querySelector('#speak').onclick=()=>speech.speak(document.querySelector('.instructions p').textContent);
let profileStorage;
try {
  profileStorage = window.localStorage;
} catch {
  profileStorage = null;
}
let profiles = readProfiles(profileStorage);
function showProfile() {
  const select = document.querySelector("#student");
  select.replaceChildren(
    new Option("选择学生", ""),
    ...profiles.names.map((name) => new Option(name, name)),
  );
  select.value = profiles.active;
  document.querySelector("#student-label").textContent =
    `${profiles.active || "未选择学生"} ${dateLabel()}`;
}
function persistProfile() {
  const saved = saveProfiles(profileStorage, profiles);
  document.querySelector("#profile-status").textContent = saved
    ? ""
    : "当前浏览器无法保存档案，本次仍可练习。";
  showProfile();
}
document.querySelector("#student").addEventListener("change", (event) => {
  profiles.active = event.target.value;
  persistProfile();
});
document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#student-name");
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  if (!profiles.names.includes(name)) {
    if (profiles.names.length >= 50) {
      document.querySelector("#profile-status").textContent =
        "本机最多保存 50 个学生档案。";
      return;
    }
    profiles.names.push(name);
  }
  profiles.active = name;
  input.value = "";
  persistProfile();
});
showProfile();
setInterval(showProfile, 60000);


let page, answers=[], serial=0;
const isKeys=kind==='key-notes';
function staff(q) {
 const p=staffPosition(q), y=106-p*10;
 const ledgers=[];
 if(p<0)for(let n=-2;n>=p;n-=2)ledgers.push(n);
 if(p>8)for(let n=10;n<=p;n+=2)ledgers.push(n);
 return `<svg class="note-staff" viewBox="0 -28 240 185" role="img" aria-label="${q.clef==='treble'?'高音谱号':'低音谱号'}，请辨认音符"><g stroke="currentColor" stroke-width="1.5">${[0,2,4,6,8].map(n=>`<path d="M20 ${106-n*10}H220"/>`).join('')}${ledgers.map(n=>`<path d="M135 ${106-n*10}H173"/>`).join('')}</g><text class="clef" x="22" y="106" font-size="100">${q.clef==='treble'?'\uE050':'\uE062'}</text><ellipse class="target-note" cx="154" cy="${y}" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="3"/></svg>`;
}
function keyboard(group,i,selected) {
 const names=group==='2'?'CDE':'FGAB';
 return `<div class="piano" style="--keys:${names.length}" role="group" aria-label="第 ${i+1} 题白键">${[...names].map((name,k)=>`<button class="white-key" data-index="${i}" data-key="${name}" aria-label="从左数第 ${k+1} 个白键" aria-pressed="${selected===name}">${selected===name?name:''}</button>`).join('')}<div class="black-keys" aria-hidden="true">${[...names].slice(1).map((_,k)=>`<span style="left:calc(${(k+1)/names.length*100}% - 7%)"></span>`).join('')}</div></div>`;
}
function card(q,i) {
 const a=answers[i];
 return `<article class="note-card" aria-label="第 ${i+1} 题"><h2>第 ${i+1} 题</h2>${staff(q)}${isKeys?`<div class="group-options" role="group" aria-label="选择键组">${['2','3'].map(g=>`<button data-index="${i}" data-group="${g}" aria-pressed="${a.group===g}"><span class="key-symbol" aria-hidden="true">${'▰ '.repeat(Number(g))}</span>${g==='2'?'两':'三'}个黑键</button>`).join('')}</div><div class="keyboard-area">${a.group?keyboard(a.group,i,a.key):'<p>先选键组，再找白键 ↑</p>'}</div>`:`<div class="fish-options" role="group" aria-label="选择音名和八度">${q.choices.map(n=>`<button class="fish-choice" data-index="${i}" data-pitch="${n}" aria-label="${pitchLabel(n)}，${fishLabel(n)}" aria-pressed="${a.pitch===n}"><img src="assets/pitch_fish.png" alt=""><span>${pitchLabel(n)}<small>${fishLabel(n)}</small></span></button>`).join('')}</div>`}</article>`;
}
function render(){
 retryHints.clear();
 board.innerHTML=`<aside class="note-guide">${isKeys?'<strong>黑键帮你找位置</strong><p>两黑键左边的白键是 C，三黑键左边的白键是 F。</p><div class="guide-keyboards"><div><b>C · D · E</b>'+keyboard('2',-1,'C')+'</div><div><b>F · G · A · B</b>'+keyboard('3',-1,'F')+'</div></div>':'<strong>同一个字母，不一定是同一个音高</strong><p>C4 = 中央 C（c¹） · C5 = 高一个八度的 C（c²）<br>先看谱号，再找位置，最后比较音名与八度。</p>'}</aside><p class="practice-label">9 题小练习 · 点另一项就能改选</p><section class="note-grid">${page.map(card).join('')}</section>`;
 // Worked keyboard anchors are illustrations, not answer controls.
 board.querySelectorAll('.note-guide button').forEach(b=>{b.disabled=true;b.removeAttribute('data-index');});
}
function complete(a){return isKeys?Boolean(a.group&&a.key):a.pitch!==undefined;}
board.addEventListener('click',e=>{
 const b=e.target.closest('button[data-index]');if(!b)return;
 const i=Number(b.dataset.index),a=answers[i];stop();retryHints.clear();
 if(b.dataset.group){if(a.group!==b.dataset.group)a.key=null;a.group=b.dataset.group;}
 else if(b.dataset.key)a.key=b.dataset.key;
 else a.pitch=Number(b.dataset.pitch);
 // Replace only this question and restore the chosen control for keyboard users.
 const selector=b.dataset.group?`[data-group="${b.dataset.group}"]`:b.dataset.key?`[data-key="${b.dataset.key}"]`:`[data-pitch="${b.dataset.pitch}"]`;
 const keyboardFocus=b.matches(':focus-visible');
 const old=b.closest('.note-card');old.outerHTML=card(page[i],i);
 if(keyboardFocus)board.querySelectorAll('.note-card')[i].querySelector(selector).focus();
 document.querySelector('#count').textContent=answers.filter(complete).length;
 feedback.textContent='选好了就点打勾吧。';
});
function next(){retryHints.reset();stop();page=makePage(kind,serial++);answers=page.map(()=>({}));document.querySelector('#count').textContent='0';feedback.textContent='慢慢看，找一找音符的位置。';render();}
document.querySelector('#check').onclick=()=>{
 stop();let blank=0,errors=0;
 page.forEach((q,i)=>{
  const a=answers[i],card=board.querySelectorAll('.note-card')[i];
  if(!complete(a))blank++;
  if(isKeys){
   const groupWrong=a.group?a.group!==keyGroup(q.pitch):null;
   const keyWrong=a.key?a.group!==keyGroup(q.pitch)||a.key!==pitchLabel(q.pitch)[0]:null;
   retryHints.check(`${i+1}题键组`,groupWrong,card.querySelector('.group-options'),`${keyGroup(q.pitch)} 个黑键的键组`);
   retryHints.check(`${i+1}题琴键`,keyWrong,card.querySelector('.keyboard-area'),`${pitchLabel(q.pitch)[0]}，${keyGroup(q.pitch)} 黑键组从左数第 ${q.pitch%7-(keyGroup(q.pitch)==='2'?0:3)+1} 个白键`);
   if(groupWrong||keyWrong)errors++;
  }else{
   const wrong=a.pitch===undefined?null:a.pitch!==q.pitch;
   retryHints.check(i,wrong,card.querySelector('.target-note'),`${pitchLabel(q.pitch)}（${fishLabel(q.pitch)}）`);
   if(wrong)errors++;
  }
 });
 feedback.textContent=blank?`还有 ${blank} 题没有完成。${errors?`另有 ${errors} 题需要再想一想。`:''}`:errors?`有 ${errors} 题需要再想一想。`:'全部答对啦！你真棒！';
 if(!blank&&!errors)celebration.hidden=false;
};
document.querySelector('#next').onclick=next;
document.querySelector('#print').onclick=()=>{stop();window.print();};
document.querySelector('#close-celebration').onclick=stopCelebration;
celebration.addEventListener('animationend',e=>{if(e.animationName==='parade')stopCelebration();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCelebration();});
next();
