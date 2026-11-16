import { createSpeech } from './balloon_speech.mjs';
import { readProfiles, saveProfiles, dateLabel } from './balloon_profiles.mjs';
import { makePage, completeGroups, scorePage } from './keyboard_core.mjs';
const board=document.querySelector('#activity-board'),feedback=document.querySelector('#feedback'),celebration=document.querySelector('#celebration');
const speech=createSpeech(window.speechSynthesis,window.SpeechSynthesisUtterance,()=>document.querySelector('#speech-status').textContent='当前语音不可用，请看文字提示。');
function stopCelebration(){celebration.hidden=true;}
function stop(){speech.stop();stopCelebration();}
window.addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('beforeprint',stop);
document.querySelector('#speak').onclick=()=>speech.speak('第一题，点击黑键，把它涂成黑色。再点一次可以擦除。第二题，圈出每一组从C到B的完整音组。先点首键，再点末键，就能画圈。点击圈可以取消。最后选择完整音组的数量。左右滑动可以查看整条键盘。完成后请点打勾。');
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


let page,paint=new Set(),ranges=[[],[]],counts=[null,null],pending=[null,null],serial=0;
function keyboard(model,task){
 const n=model.length;
 return '<button class="zoom-keyboard" aria-pressed="false">⊕ 放大键盘</button><div class="keyboard-scroll" tabindex="0" aria-label="键盘，可左右滑动"><div class="piano" style="width:'+n*44+'px">'+Array.from({length:n},(_,i)=>'<button class="white key" style="left:'+i*44+'px" data-task="'+task+'" data-key="'+i+'" aria-label="第 '+(i+1)+' 个白键" aria-pressed="false"></button>').join('')+Array.from({length:n-1},(_,i)=>[0,1,3,4,5].includes((model.start+i)%7)?'<button class="black key" style="left:'+((i+1)*44-13)+'px" data-task="'+task+'" data-black="'+i+'" aria-label="第 '+(i+1)+' 处短键" aria-pressed="false" '+(task!=='paint'?'disabled':'')+'></button>':'').join('')+'<div class="rings"></div></div></div>';
}
function render(){
 board.innerHTML='<section class="exercise"><h2>① 给黑键涂色</h2><p>点一下涂黑，再点一下擦除。白键保持白色。</p><p lang="en">Tap to color the black keys. Tap again to erase.</p>'+keyboard(page.paint,'paint')+'</section><section class="exercise"><h2>② 圈一圈，数一数</h2><p>圈出每一组完整音组（C–B）：先点首键，再点末键。点圈可以取消，然后选择总数。</p><p lang="en">Circle each complete C–B group by tapping its first and last white keys. Then choose the total.</p><p class="scroll-hint">↔ 左右滑动，查看整条键盘</p>'+page.rows.map((m,r)=>'<article class="count-card"><h3>键盘 '+(r+1)+'</h3>'+keyboard(m,String(r))+'<div class="choices" aria-label="键盘 '+(r+1)+' 的完整音组数量"><span>完整音组有几组？</span>'+[0,1,2,3,4,5,6,7,8].map(v=>'<button data-row="'+r+'" data-count="'+v+'" aria-pressed="false">'+v+'</button>').join('')+'</div></article>').join('')+'</section>';
 update();
}
function update(){
 board.querySelectorAll('[data-task="paint"]').forEach(b=>{const id=b.hasAttribute('data-black')?'b'+b.dataset.black:'w'+b.dataset.key;b.classList.toggle('filled',paint.has(id));b.setAttribute('aria-pressed',String(paint.has(id)));});
 page.rows.forEach((m,r)=>{
 const piano=board.querySelector('[data-task="'+r+'"]').parentElement;
 piano.querySelectorAll('.white').forEach(b=>{const i=Number(b.dataset.key);b.classList.toggle('pending',pending[r]===i);b.setAttribute('aria-pressed',String(pending[r]===i));});
 piano.querySelector('.rings').innerHTML=ranges[r].map(([a,b],j)=>'<button class="group-ring" data-remove-row="'+r+'" data-remove="'+j+'" style="left:'+(a*44+2)+'px;width:'+((b-a+1)*44-4)+'px" aria-label="取消第 '+(j+1)+' 个圈"></button>').join('');
 board.querySelectorAll('[data-row="'+r+'"]').forEach(b=>b.setAttribute('aria-pressed',String(counts[r]===Number(b.dataset.count))));
 });
 document.querySelector('#count').textContent=paint.size+ranges.flat().length+counts.filter(v=>v!==null).length;
}
function changed(){stop();feedback.textContent='选好了就点打勾吧。';update();}
board.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.classList.contains('zoom-keyboard')){const expanded=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(expanded));b.nextElementSibling.classList.toggle('enlarged',expanded);return;}
 if(b.hasAttribute('data-remove')){ranges[Number(b.dataset.removeRow)].splice(Number(b.dataset.remove),1);}
 else if(b.hasAttribute('data-count'))counts[Number(b.dataset.row)]=Number(b.dataset.count);
 else if(b.dataset.task==='paint'){const id=b.hasAttribute('data-black')?'b'+b.dataset.black:'w'+b.dataset.key;paint.has(id)?paint.delete(id):paint.add(id);}
 else if(b.hasAttribute('data-key')){const r=Number(b.dataset.task),i=Number(b.dataset.key);if(pending[r]===null)pending[r]=i;else{const range=[Math.min(i,pending[r]),Math.max(i,pending[r])];if(!ranges[r].some(v=>v[0]===range[0]&&v[1]===range[1]))ranges[r].push(range);pending[r]=null;}}
 changed();
});
function next(){stop();page=makePage(serial++);paint=new Set();ranges=[[],[]];counts=[null,null];pending=[null,null];feedback.textContent='慢慢观察，选好了就点打勾吧。';render();}
document.querySelector('#check').onclick=()=>{stop();const {blank,errors}=scorePage(page,paint,ranges,counts);feedback.textContent=blank?'还有 '+blank+' 处没有完成。'+(errors?'另有 '+errors+' 个需要再想一想。':''):errors?'有 '+errors+' 个需要再想一想。':'全部答对啦！你真棒！';if(!blank&&!errors)celebration.hidden=false;};
document.querySelector('#next').onclick=next;
document.querySelector('#print').onclick=()=>{stop();window.print();};
document.querySelector('#close-celebration').onclick=stopCelebration;
celebration.addEventListener('animationend',e=>{if(e.animationName==='parade')stopCelebration();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCelebration();});
next();
