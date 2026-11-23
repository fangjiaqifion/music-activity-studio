import {createRetryHints} from './retry_hints.mjs';
import {createSpeech} from './balloon_speech.mjs';
import {readProfiles,saveProfiles,dateLabel} from './balloon_profiles.mjs';
import {pairs,answer} from './fish_steps_core.mjs';
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
let colors=[],brush='blue';
function render(focus){
 board.innerHTML='<section class="step-fish-grid" aria-label="十二条音程小鱼">'+pairs.map((pair,i)=>'<button class="step-fish" data-index="'+i+'" data-color="'+(colors[i]||'')+'" aria-label="第 '+(i+1)+' 条小鱼，'+pair+'，'+({red:'红色',blue:'蓝色'}[colors[i]]||'未涂色')+'"><span class="fish-number">'+(i+1)+'</span><span class="fish-art"><span class="fish-fill"></span><img src="assets/pitch_fish.png" alt=""><strong>'+pair+'</strong></span></button>').join('')+'</section><div class="seabed" aria-hidden="true"><img src="assets/fish_seaweed.png" alt=""></div>';
 document.querySelector('#count').textContent=colors.filter(Boolean).length;
 if(focus!==undefined)board.querySelector('[data-index="'+focus+'"]').focus({preventScroll:true});
}
document.querySelectorAll('[data-brush]').forEach(b=>b.onclick=()=>{stop();brush=b.dataset.brush;document.querySelectorAll('[data-brush]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
board.onclick=e=>{const b=e.target.closest('[data-index]');if(!b)return;const i=Number(b.dataset.index),focus=b.matches(':focus-visible');stop();retryHints.clear();colors[i]=brush==='erase'?null:brush;render(focus?i:undefined);feedback.textContent='涂好后点打勾检查，也可以换画笔改色。';};
document.querySelector('#check').onclick=()=>{stop();let blank=0,errors=0;pairs.forEach((pair,i)=>{const wrong=colors[i]?colors[i]!==answer(pair):null;if(!colors[i])blank++;if(wrong)errors++;retryHints.check(i,wrong,board.querySelector('[data-index="'+i+'"] .fish-art'),answer(pair)==='red'?'红色（半音）':'蓝色（全音）');});feedback.textContent=blank?'还有 '+blank+' 条小鱼没有涂色。'+(errors?'另有 '+errors+' 条需要再想一想。':''):errors?'有 '+errors+' 条需要再想一想。':'全部答对啦！你真棒！';if(!blank&&!errors)celebration.hidden=false;};
function next(){stop();retryHints.reset();colors=pairs.map(()=>null);render();feedback.textContent='全音涂蓝色，半音涂红色。';}
document.querySelector('#next').onclick=next;
document.querySelector('#print').onclick=()=>{stop();window.print();};
document.querySelector('#close-celebration').onclick=stopCelebration;
celebration.addEventListener('animationend',e=>{if(e.animationName==='parade')stopCelebration();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCelebration();});
next();
