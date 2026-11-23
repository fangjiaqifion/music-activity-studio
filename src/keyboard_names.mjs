import {createRetryHints,createRetryState} from './retry_hints.mjs';
import {createSpeech} from './balloon_speech.mjs';
import {readProfiles,saveProfiles,dateLabel} from './balloon_profiles.mjs';
import {makePage,assignMatch,letters} from './keyboard_names_core.mjs';
const retryHints=createRetryHints(),board=document.querySelector('#activity-board'),feedback=document.querySelector('#feedback'),celebration=document.querySelector('#celebration');
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

const matching=document.body.dataset.activity==='fish-keys';
let questions=[],answers=[],selected=null;
const fishRetries=createRetryState();
let fishCues=[];
function fishArt(note){return '<span class="matched-fish"><img src="assets/keyboard_fish.png" alt=""><strong>'+(note||'')+'</strong></span>';}
function keyboard(q){
 const names=q.group==='short'?['C','D','E']:q.group==='long'?['F','G','A','B']:['C','D','E','F','G','A','B'];
 const blacks=names.map((n,i)=>['C','D','F','G','A'].includes(n)?'<rect x="'+((i+1)*40+4-11)+'" y="8" width="22" height="68" rx="2" fill="#242525"/>':'').join('');
 return '<svg class="marked-keyboard" viewBox="0 0 '+(names.length*40+8)+' 132" role="img" aria-label="红点标记的琴键"><rect x="4" y="8" width="'+names.length*40+'" height="120" rx="3" fill="white" stroke="#242525" stroke-width="2"/>'+names.slice(1).map((n,i)=>'<path d="M'+((i+1)*40+4)+' 8v120" stroke="#242525"/>').join('')+blacks+'<circle cx="'+(names.indexOf(q.note)*40+24)+'" cy="106" r="7" fill="#d32030"/></svg>';
}
function render(focus){
 board.innerHTML=(matching?'<div class="fish-bank" role="group" aria-label="选择音名小鱼">'+letters.map(n=>'<button class="name-fish" data-fish="'+n+'" data-used="'+answers.includes(n)+'" aria-pressed="'+(selected===n)+'" aria-label="选择小鱼 '+n+'">'+fishArt(n)+'</button>').join('')+'<button data-erase aria-label="擦除" aria-pressed="'+(selected==='erase')+'"><img src="assets/eraser.svg" width="24" alt=""></button></div>':'')+'<div class="key-question-grid">'+questions.map((q,i)=>'<section class="key-question" data-question="'+i+'">'+(matching?'<button class="match-target" data-target="'+i+'" aria-label="第 '+(i+1)+' 题，'+(answers[i]?'已选 '+answers[i]:'未作答')+'"><span class="question-number">'+(i+1)+'</span>'+keyboard(q)+fishArt(answers[i])+(fishCues[i]>=3?'<span class="retry-answer" aria-label="正确答案 '+q.note+'">'+q.note+'</span>':'')+'</button>':'<h2>第 '+(i+1)+' 题</h2>'+keyboard(q)+'<div class="letter-choices" role="group" aria-label="第 '+(i+1)+' 题音名">'+letters.map(n=>'<button data-answer="'+n+'" data-index="'+i+'" aria-pressed="'+(answers[i]===n)+'">'+n+'</button>').join('')+'</div>')+'</section>').join('')+'</div>';
 if(matching)fishCues.forEach((count,i)=>{if(count>=2)board.querySelector('[data-target="'+i+'"] .matched-fish').classList.add('fish-error');});
 document.querySelector('#count').textContent=answers.filter(Boolean).length;
 if(focus)board.querySelector(focus)?.focus({preventScroll:true});
}
board.onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 const focused=b.matches(':focus-visible');let focus;
 stop();retryHints.clear();fishCues=[];
 if(b.dataset.fish){selected=b.dataset.fish;focus='[data-fish="'+selected+'"]';}
 else if(b.hasAttribute('data-erase')){selected='erase';focus='[data-erase]';}
 else if(b.dataset.target!==undefined){if(!selected){feedback.textContent='先选一条音名小鱼。';return;}const i=Number(b.dataset.target);answers=assignMatch(answers,i,selected==='erase'?null:selected);focus='[data-target="'+i+'"]';}
 else if(b.dataset.answer){answers[Number(b.dataset.index)]=b.dataset.answer;focus='[data-index="'+b.dataset.index+'"][data-answer="'+b.dataset.answer+'"]';}
 render(focused?focus:null);feedback.textContent='可以继续作答，完成后点打勾检查。';
};
document.querySelector('#check').onclick=()=>{
 stop();let blank=0,wrong=0;
 questions.forEach((q,i)=>{if(!answers[i])blank++;else if(answers[i]!==q.note)wrong++;const error=answers[i]?answers[i]!==q.note:null;if(matching)fishCues[i]=fishRetries.check(i,error);else retryHints.check(i,error,board.querySelector('[data-question="'+i+'"] .marked-keyboard'),q.note);});
 if(matching)render();
 feedback.textContent=blank?'还有 '+blank+' 题没有完成。'+(wrong?'另有 '+wrong+' 题需要再想一想。':''):wrong?'有 '+wrong+' 题需要再想一想。':'全部答对啦！你真棒！';
 if(!blank&&!wrong)celebration.hidden=false;
};
function next(){stop();retryHints.reset();fishRetries.reset();fishCues=[];questions=makePage(matching);answers=questions.map(()=>null);selected=null;render();feedback.textContent=matching?'先选音名小鱼，再配对红点琴键。':'看红点标记的白键，选择音名。';}
document.querySelector('#next').onclick=next;
document.querySelector('#print').onclick=()=>{stop();window.print();};
document.querySelector('#close-celebration').onclick=stopCelebration;
celebration.addEventListener('animationend',e=>{if(e.animationName==='parade')stopCelebration();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCelebration();});
next();
