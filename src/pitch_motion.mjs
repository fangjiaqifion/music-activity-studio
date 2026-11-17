import { createSpeech } from './balloon_speech.mjs';
import { readProfiles, saveProfiles, dateLabel } from './balloon_profiles.mjs';
import { TYPES, makePage, scorePage } from './pitch_motion_core.mjs';
const board=document.querySelector('#activity-board'), feedback=document.querySelector('#feedback'), celebration=document.querySelector('#celebration');
const speech=createSpeech(window.speechSynthesis,window.SpeechSynthesisUtterance,()=>document.querySelector('#speech-status').textContent='当前语音不可用，请看文字提示。');
function stopCelebration(){celebration.hidden=true;}
function stop(){speech.stop();stopCelebration();}
window.addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('beforeprint',stop);
document.querySelector('#speak').onclick=()=>speech.speak('从左往右看两个音。级进：走到相邻的线或间。跳进：中间隔一个音。远跳：中间隔两个或更多音。重复：两个音一样高。请为每组音选择一种，再点打勾。');
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
function staff(a,b){
 return '<svg class="pair-staff" viewBox="0 0 240 120" role="img" aria-label="从左往右的两个音"><g stroke="currentColor" stroke-width="1.5">'+[0,1,2,3,4].map(i=>'<path d="M24 '+(100-i*20)+'H216"/>').join('')+'</g>'+[a,b].map((p,i)=>'<ellipse data-position="'+p+'" cx="'+(88+i*64)+'" cy="'+(100-p*10)+'" rx="12" ry="8.5" fill="none" stroke="currentColor" stroke-width="3"/>').join('')+'</svg>';
}
function render(){
 board.innerHTML='<section class="motion-guide" aria-label="四种音型的例子">'+TYPES.map(t=>'<article><h2>'+t.zh+' <small>'+t.en+'</small></h2>'+staff(2,2+t.example)+'<p>'+t.hint+'</p></article>').join('')+'</section><p class="practice-label">试一试 · 选好后可以直接改选</p><section class="motion-grid">'+page.map((q,i)=>'<article class="motion-card" aria-label="第 '+(i+1)+' 题"><h2>第 '+(i+1)+' 题</h2>'+staff(q.a,q.b)+'<div class="motion-options" role="group" aria-label="第 '+(i+1)+' 题音型">'+TYPES.map(t=>'<button data-index="'+i+'" data-answer="'+t.id+'" aria-pressed="false">'+t.zh+'<small>'+t.en+'</small></button>').join('')+'</div></article>').join('')+'</section>';
}
board.addEventListener('click',e=>{
 const b=e.target.closest('[data-answer]'); if(!b)return;
 stop(); const i=Number(b.dataset.index); answers[i]=b.dataset.answer;
 b.closest('.motion-options').querySelectorAll('button').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));
 document.querySelector('#count').textContent=answers.filter(Boolean).length;
 feedback.textContent='选好了就点打勾吧。';
});
function next(){stop();page=makePage(serial++);answers=Array(page.length).fill(null);document.querySelector('#count').textContent='0';feedback.textContent='慢慢观察，选好了就点打勾吧。';render();}
document.querySelector('#check').onclick=()=>{stop();const {blank,errors}=scorePage(page,answers);feedback.textContent=blank?'还有 '+blank+' 题没有完成。'+(errors?'另有 '+errors+' 个需要再想一想。':''):errors?'有 '+errors+' 个需要再想一想。':'全部答对啦！你真棒！';if(!blank&&!errors)celebration.hidden=false;};
document.querySelector('#next').onclick=next;
document.querySelector('#print').onclick=()=>{stop();window.print();};
document.querySelector('#close-celebration').onclick=stopCelebration;
celebration.addEventListener('animationend',e=>{if(e.animationName==='parade')stopCelebration();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCelebration();});
next();
