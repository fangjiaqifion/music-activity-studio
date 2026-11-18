import { createRetryHints } from "./retry_hints.mjs";
const retryHints = createRetryHints();
import { createSpeech } from './balloon_speech.mjs';
import { readProfiles, saveProfiles, dateLabel } from './balloon_profiles.mjs';
import { makePage, keyGroup, pitchLabel, fishLabel, staffPosition, makeFishBank, assignFish } from './pitch_notes_core.mjs';
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
  const sourceName=document.querySelector("[data-source-name]");if(sourceName)sourceName.textContent=profiles.active||"____________";
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


let page, answers=[], serial=0, fishBank=[], selectedFish=null;
const isKeys=kind==='key-notes';
function staff(q) {
 const p=staffPosition(q), y=106-p*10;
 const ledgers=[];
 if(p<0)for(let n=-2;n>=p;n-=2)ledgers.push(n);
 if(p>8)for(let n=10;n<=p;n+=2)ledgers.push(n);
 return `<svg class="note-staff" viewBox="0 -28 240 185" role="img" aria-label="${q.clef==='treble'?'高音谱号':'低音谱号'}，请辨认音符"><g stroke="currentColor" stroke-width="1.5">${[0,2,4,6,8].map(n=>`<path d="M20 ${106-n*10}H220"/>`).join('')}${ledgers.map(n=>`<path d="M135 ${106-n*10}H173"/>`).join('')}</g><text class="clef" x="22" y="106" font-size="100">${q.clef==='treble'?'\uE050':'\uE062'}</text><ellipse class="target-note" cx="154" cy="${y}" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="3"/></svg>`;
}
function keyboard(group,i,selected,enabled) {
 const names=group==='2'?'CDE':'FGAB';
 return `<div class="piano" data-black-keys="${group}" style="--keys:${names.length}" role="group" aria-label="第 ${i+1} 题白键">${[...names].map((name,k)=>`<button class="white-key" data-index="${i}" data-key="${name}" aria-label="从左数第 ${k+1} 个白键" aria-pressed="${selected===name}" ${enabled?'':'disabled'}>${selected===name?'<span class="key-mark" aria-hidden="true">●</span>':''}</button>`).join('')}<div class="black-keys" aria-hidden="true">${[...names].slice(1).map((_,k)=>`<span style="left:calc(${(k+1)/names.length*100}% - 28% / var(--keys))"></span>`).join('')}</div></div>`;
}
function card(q,i) {
 const a=answers[i];
 return `<article class="note-card" aria-label="第 ${i+1} 题"><h2>第 ${i+1} 题</h2>${staff(q)}<div class="group-options keyboard-area" role="group" aria-label="先圈选键组，再定位白键">${['2','3'].map(g=>`<section class="key-group" data-selected="${a.group===g}" aria-label="${g} 个黑键的键组"><button class="circle-group" data-index="${i}" data-group="${g}" aria-pressed="${a.group===g}">${a.group===g?'◉ 已圈选':'○ 圈选这组'}</button>${keyboard(g,i,a.group===g?a.key:null,a.group===g)}</section>`).join('<span class="key-or">或<br>OR</span>')}</div></article>`;
}

function fishPicture(pitch){
 return '<span class="fish-portrait '+(fishBank.indexOf(pitch)%2?'fish-right':'')+'"><img src="assets/'+(fishBank.indexOf(pitch)%2?'pitch_fish_right.png':'pitch_fish.png')+'" alt=""><span class="fish-letter">'+fishLabel(pitch)+'</span></span>';
}
const fishPositions=[[43,7],[78,15],[18,24],[80,32],[52,47],[81,56],[18,60],[77,68],[18,75]];
function drawFishLines(){
 const stage=board.querySelector('.fish-match-layout'),svg=board.querySelector('.fish-connections');
 if(!stage||!svg)return;
 const r=stage.getBoundingClientRect();svg.setAttribute('viewBox','0 0 '+r.width+' '+r.height);
 svg.innerHTML=answers.map((answer,i)=>{
  if(answer.pitch===undefined)return '';
  const fish=stage.querySelector('[data-fish="'+answer.pitch+'"] .fish-portrait').getBoundingClientRect(),target=stage.querySelector('[data-target="'+i+'"]').getBoundingClientRect();
  const x1=fish.right-r.left,y1=(fish.top+fish.bottom)/2-r.top,x2=target.left-r.left,y2=(target.top+target.bottom)/2-r.top;
  return '<path data-connection="'+i+'" d="M'+x1+' '+y1+' L'+x2+' '+y2+'"/>';
 }).join('');
}
const fishResizeObserver=new ResizeObserver(drawFishLines);
window.addEventListener('resize',drawFishLines);
document.fonts?.ready.then(drawFishLines);
function renderFish(focusSelector){
 fishResizeObserver.disconnect();
 board.innerHTML='<div class="fish-match-layout"><svg class="fish-connections" aria-hidden="true"></svg><aside class="fish-tray" aria-label="音名小鱼"><div class="fish-bank">'+fishBank.map((p,i)=>{
  const at=answers.findIndex(a=>a.pitch===p),[x,y]=fishPositions[i];
  return '<button class="fish-token" style="--fish-x:'+x+'%;--fish-y:'+y+'%" data-fish="'+p+'" aria-label="小鱼 '+fishLabel(p)+'，'+(at<0?'未配对':'已配到第 '+(at+1)+' 题')+'" aria-pressed="'+(selectedFish===p)+'">'+fishPicture(p)+'<small>'+(at<0?'':'→ '+(at+1))+'</small></button>';
 }).join('')+'<div class="fish-source-name">姓名 Name:<br><span data-source-name></span><br><small>已配对 '+answers.filter(complete).length+' / 9</small></div></div><img class="fish-seaweed" src="assets/fish_seaweed.png" alt=""><img class="fish-seaweed fish-seaweed-two" src="assets/fish_seaweed.png" alt=""><img class="fish-seaweed fish-seaweed-three" src="assets/fish_seaweed.png" alt=""></aside><section class="fish-staves" aria-label="五线谱配对位置">'+page.map((q,i)=>'<article class="note-card fish-staff-card"><h2>'+(i+1)+'</h2><button class="match-target" data-target="'+i+'" aria-label="第 '+(i+1)+' 题，'+(q.clef==='treble'?'高音谱号':'低音谱号')+'，'+(answers[i].pitch===undefined?'等待配对':'已配 '+fishLabel(answers[i].pitch))+'">'+staff(q)+'</button><button class="unmatch" data-unmatch="'+i+'" aria-label="清除第 '+(i+1)+' 题配对" '+(answers[i].pitch===undefined?'disabled':'')+'>×</button></article>').join('')+'</section>'+['top','middle','bottom','left'].map(place=>'<div class="fish-perimeter fish-reef-'+place+'" aria-hidden="true"><img src="assets/fish_seaweed.png" alt=""></div>').join('')+'</div><p class="practice-label">请根据鱼身上的音名连接相应的五线谱位置<br><span lang="en">Please match the fish and the note.</span></p><p class="fish-selection" role="status">'+(selectedFish===null?'先选小鱼，再点谱面。':'已选 '+fishLabel(selectedFish)+'，请点对应的谱面。')+'</p>';
 board.querySelector('[data-source-name]').textContent=profiles.active||'____________';
 if(focusSelector)board.querySelector(focusSelector)?.focus({preventScroll:true});
 fishResizeObserver.observe(board.querySelector('.fish-match-layout'));
 requestAnimationFrame(drawFishLines);
}

function handleFishClick(e){
 const b=e.target.closest('button');if(!b)return;
 stop();retryHints.clear();
 const keyboardFocus=b.matches(':focus-visible');
 let focus;
 if(b.dataset.fish!==undefined){selectedFish=Number(b.dataset.fish);focus='[data-fish="'+selectedFish+'"]';}
 else if(b.dataset.target!==undefined){
  const i=Number(b.dataset.target);focus='[data-target="'+i+'"]';
  if(selectedFish===null){feedback.textContent='请先选一条小鱼，再点五线谱。';return;}
  answers=assignFish(answers,i,selectedFish);selectedFish=null;
 }else if(b.dataset.unmatch!==undefined){const i=Number(b.dataset.unmatch);answers[i]={};focus='[data-target="'+i+'"]';}
 else return;
 renderFish(keyboardFocus?focus:null);
 document.querySelector('#count').textContent=answers.filter(complete).length;
 feedback.textContent='配好后点打勾检查，也可以重新配对。';
}
function render(){
 retryHints.clear();
 if(!isKeys){renderFish();return;}
 const guide='<aside class="note-guide"><strong>① 读谱认音 → ② 圈选键组 → ③ 点出白键</strong><p>先自己判断音名，再看黑键的位置，找到对应的白键。</p></aside>';
 board.innerHTML=guide+`<p class="practice-label">9 题小练习 · 点另一项就能改选</p><section class="note-grid">${page.map(card).join('')}</section>`;
}
function complete(a){return isKeys?Boolean(a.group&&a.key):a.pitch!==undefined;}
board.addEventListener('click',e=>{
 if(!isKeys){handleFishClick(e);return;}
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
function next(){retryHints.reset();stop();page=makePage(kind,serial++);fishBank=isKeys?[]:makeFishBank(page);selectedFish=null;answers=page.map(()=>({}));document.querySelector('#count').textContent='0';feedback.textContent='慢慢看，找一找音符的位置。';render();}
document.querySelector('#check').onclick=()=>{
 stop();let blank=0,errors=0;
 page.forEach((q,i)=>{
  const a=answers[i],card=board.querySelectorAll('.note-card')[i];
  if(!complete(a))blank++;
  if(isKeys){
   const groupWrong=a.group?a.group!==keyGroup(q.pitch):null;
   const keyWrong=a.key?a.group!==keyGroup(q.pitch)||a.key!==pitchLabel(q.pitch)[0]:null;
   retryHints.check(`${i+1}题键组`,groupWrong,[...card.querySelectorAll('.circle-group')],`${keyGroup(q.pitch)} 个黑键的键组`);
   retryHints.check(`${i+1}题琴键`,keyWrong,card.querySelector('.key-group[data-selected="true"] .piano'),`${pitchLabel(q.pitch)[0]}，${keyGroup(q.pitch)} 黑键组从左数第 ${q.pitch%7-(keyGroup(q.pitch)==='2'?0:3)+1} 个白键`);
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
