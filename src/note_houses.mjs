import {clefGlyphs} from './cow_regions.mjs';
import {braceGlyph} from './note_house_glyphs.mjs';
import {createSpeech} from './balloon_speech.mjs';
import {pitches,letters,houseCenter,layoutGeometry,makeQuestions,neighborPrompt} from './note_houses_core.mjs';
const $=s=>document.querySelector(s), art='assets/note_house_characters.png';
const crops={C:[16,74,222,340],D:[240,74,225,340],E:[476,74,205,340],F:[685,74,206,340],G:[900,74,215,340],A:[1121,74,218,340],B:[1340,74,225,340]};
let level=1, selected=null, residents=Array(7).fill(null), questions=makeQuestions(), round=0, solved=false, drag=null;
function portrait(letter,extra=''){const [x,y,w,h]=crops[letter];return `<svg ${extra} viewBox="0 0 ${w} ${h}" aria-hidden="true"><svg width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" overflow="hidden"><image href="${art}" width="1568" height="1003"/></svg></svg>`;}
let geometry={spacing:90,top:120,width:1200,height:1120,left:310,step:135};
function center(index){return houseCenter(index,geometry);}
function house(index){
  const {x,y}=center(index),scale=geometry.spacing/90,resident=level===1?residents[index]:(questions[round].home===index?pitches[index][0]:null);
  const body=`<path class="house-body" d="M-31 -5 Q-33 12 -30 22 Q-29 25 -22 25 H22 Q31 25 31 18 V-5 Q14 -13 0 -23 Q-14 -13 -31 -5Z" fill="#fffdf7" stroke="black" stroke-width="3"/><path d="M-35 -6 Q-22 -11 -13 -15 Q-5 -18 0 -23 Q5 -18 13 -15 Q22 -11 35 -6" fill="none" stroke="black" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const detail=resident?portrait(resident,'class="resident-picture" x="-19" y="-12" width="38" height="36"'):`<path d="M-9 24 V9 A9 9 0 0 1 9 9 V24 M-25 7 V0 A5 5 0 0 1 -15 0 V7Z M15 7 V0 A5 5 0 0 1 25 0 V7Z" fill="none" stroke="black" stroke-width="2"/>`;
  const hit=Math.max(44,88*scale);
  return `<g class="house ${resident?'filled':''} ${level===2&&resident?'speaker':''}" data-house="${index}" role="button" tabindex="0" aria-label="第 ${index+1} 座房屋${resident?'，住着 '+resident:''}" transform="translate(${x} ${y})"><rect class="hit" x="${-hit/2}" y="${-hit/2}" width="${hit}" height="${hit}" rx="9"/><g class="house-art" transform="scale(${scale})">${body}${detail}</g></g>`;
}
function renderStaff(){
  const rect=$('#staff').getBoundingClientRect(),width=Math.max(280,rect.width),height=Math.max(120,rect.height);
  geometry=layoutGeometry(width,height);
  const {spacing:S,top}=geometry,clefX=32,clefScale=S/200;
  const [bx,by,bx2,by2]=braceGlyph.bounds,scaleX=14/(bx2-bx),scaleY=10*S/(by2-by);
  $('#staff').setAttribute('viewBox',`0 0 ${width} ${height}`);
  $('#staff').innerHTML=`<path class="grand-brace" d="${braceGlyph.path}" transform="translate(${8-bx*scaleX} ${top+by2*scaleY}) scale(${scaleX} ${-scaleY})"/><g class="staff-lines" stroke="#262820" stroke-width="1.3">${[0,1,2,3,4,6,7,8,9,10].map(n=>`<path d="M30 ${top+n*S}H${width-12}"/>`).join('')}<path d="M30 ${top}V${top+10*S}"/></g><g transform="translate(${clefX} ${top+4*S}) scale(${clefScale} ${-clefScale})"><path d="${clefGlyphs.treble.path}"/></g><g transform="translate(${clefX} ${top+10*S}) scale(${clefScale} ${-clefScale})"><path d="${clefGlyphs.bass.path}"/></g><path d="M${center(3).x-.55*S} ${top+5*S}H${center(3).x+.55*S}" stroke="black" stroke-width="1.3"/>${pitches.map((_,i)=>house(i)).join('')}`;
  if(level===2){
    const {x,y}=center(questions[round].home),tip=y-.3*S-5;
    // A persistent visual cue identifies the speaker without marking the answer house.
    $('#staff').insertAdjacentHTML('beforeend',`<g class="speaker-arrow" aria-label="正在说话的音符在这里" pointer-events="none"><path d="M${x} ${tip-30}V${tip}m-8 -9 8 9 8 -9" fill="none" stroke="#fffdf7" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} ${tip-30}V${tip}m-8 -9 8 9 8 -9" fill="none" stroke="#b64b2d" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  }
}
function renderTray(){
  $('#characters').innerHTML=letters.map(letter=>`<button class="character" data-letter="${letter}" aria-label="音符 ${letter}" aria-pressed="${selected===letter}" ${level===1&&residents.includes(letter)?'disabled':''}>${portrait(letter)}<span class="letter">${letter}</span></button>`).join('');
}
function prompt(){
  if(level===1)return '送七位音符朋友回家';
  return neighborPrompt(questions[round]);
}
function render(){
  $('#level1').setAttribute('aria-pressed',String(level===1));$('#level2').setAttribute('aria-pressed',String(level===2));
  $('#prompt').textContent=prompt();
  $('#instruction').textContent=level===1?'拖音符到小屋，或先点音符，再点它的家。':'从住着音符的小屋出发，每经过一个线或间算一层。点选你的答案。';
  $('#progress').textContent=level===1?`${residents.filter(Boolean).length} / 7`:`${round+1} / 6`;
  $('#dock-label').textContent=level===1?'谁要回家？':'邻居是谁？';$('#next').hidden=!(level===2&&solved);
  renderStaff();renderTray();
}
function feedback(text){$('#feedback').textContent=text;}
let mismatchTimer,mismatchIndex=null;
function clearMismatch(){clearTimeout(mismatchTimer);mismatchIndex=null;$('.mismatch-cue')?.remove();$('#feedback').classList.remove('mismatch-feedback');}
function showMismatch(index,message='还没到家，再试一次'){
  clearMismatch();mismatchIndex=index;
  const cue=document.createElement('div');cue.className='mismatch-cue';cue.setAttribute('aria-hidden','true');
  cue.innerHTML=`<span class="mismatch-cross">×</span><strong>${message}</strong>`;
  document.body.append(cue);positionMismatch();
  feedback('✕ '+message);$('#feedback').classList.add('mismatch-feedback');
  mismatchTimer=setTimeout(()=>{clearMismatch();feedback(level===1&&selected?`选好了 ${selected}，点它的小屋吧。`:'再沿着线和间找一找。');},2000);
}
function positionMismatch(){
  const cue=$('.mismatch-cue'),home=level===2?$(`[data-letter="${selected}"]`):$(`[data-house="${mismatchIndex}"] .house-body`);
  if(!cue||!home)return;
  const r=home.getBoundingClientRect();cue.style.left=Math.max(105,Math.min(innerWidth-105,r.x+r.width/2))+'px';cue.style.top=Math.max(110,r.y-20)+'px';
}
const speech=createSpeech(window.speechSynthesis,window.SpeechSynthesisUtterance,()=>feedback('暂时无法自动朗读，请点“听题干”重听，或看上方题目。'));
function cancelSpeech(){speech.stop();}
function readQuestion(){speech.speak(level===2?prompt():prompt()+'。'+$('#instruction').textContent);}
let confettiTimer;
function stopConfetti(){clearTimeout(confettiTimer);$('.confetti-layer')?.remove();}
function celebrateAnswer(){
  stopConfetti();
  const layer=document.createElement('div');layer.className='confetti-layer';layer.setAttribute('aria-hidden','true');
  const colors=['#e9ad37','#d85c65','#5f987d','#648db7','#b17db6'];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){layer.classList.add('quiet');layer.innerHTML='<span class="quiet-spark">✦ 答对啦！ ✦</span>';}
  else for(let burst=0;burst<3;burst++)for(let i=0;i<28;i++){
    const angle=Math.PI*2*i/28,spread=65+Math.random()*95,piece=document.createElement('i');
    piece.style.cssText=`left:${25+burst*25}%;top:${35+burst%2*15}%;background:${colors[i%colors.length]};--dx:${Math.cos(angle)*spread}px;--dy:${Math.sin(angle)*spread+80}px;--turn:${Math.random()*720-360}deg;animation-delay:${burst*.08}s;border-radius:${i%3===0?'50%':'1px'}`;
    layer.append(piece);
  }
  document.body.append(layer);confettiTimer=setTimeout(stopConfetti,1900);
}
function start(nextLevel=level){cancelSpeech();stopConfetti();clearMismatch();clearDrag();$('#celebration').close();level=nextLevel;selected=null;residents=Array(7).fill(null);questions=makeQuestions();round=0;solved=false;feedback('');render();focusScene(level===1?3:questions[0].home);if(level===2)readQuestion();}
function focusScene(){/* The complete grand staff remains visible; navigation never pans it. */}
function finish(){cancelSpeech();$('#finish-copy').textContent=level===1?'七位朋友都找到了自己的家！接下来，听听他们想找哪位邻居。':'六次邻居挑战完成！你已经会沿着线和间，上下找朋友了。';$('#continue').hidden=level===2;$('#celebration').showModal();}
function place(index){
  if(level!==1||!selected)return;
  if(mismatchIndex!==null)return;
  if(pitches[index][0]!==selected){showMismatch(index);return;}
  residents[index]=selected;selected=null;feedback('找到家啦！');render();celebrateAnswer();
  if(residents.every(Boolean))finish();
}
function choose(letter){
  if(mismatchIndex!==null)return;
  if(level===1){selected=letter;renderTray();feedback(`选好了 ${letter}，点它的小屋吧。`);$(`[data-letter="${letter}"]`).focus({preventScroll:true});return;}
  if(solved)return;
  selected=letter;
  if(letter===questions[round].answer){solved=true;cancelSpeech();feedback('答对啦，找到邻居了！');renderTray();celebrateAnswer();$('#next').hidden=false;$('#next').focus({preventScroll:true});}
  else{cancelSpeech();renderTray();showMismatch(questions[round].home,'找错了，再找找');$(`[data-letter="${letter}"]`).focus({preventScroll:true});}
}
$('#characters').addEventListener('click',e=>{if(e.detail!==0)return;const b=e.target.closest('[data-letter]');if(b&&!b.disabled)choose(b.dataset.letter);});
// Pointer capture supports touch drags and tap-to-select without native HTML drag behavior.
$('#characters').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-letter]');if(drag||mismatchIndex!==null||!b||b.disabled||e.button!==0)return;drag={id:e.pointerId,letter:b.dataset.letter,x:e.clientX,y:e.clientY,moved:false,button:b};b.setPointerCapture(e.pointerId);});
document.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(level===2)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8&&!drag.moved){drag.moved=true;const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML=portrait(drag.letter);document.body.append(ghost);drag.ghost=ghost;drag.button.classList.add('dragging');document.body.classList.add('drag-active');}if(drag.ghost){drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';}});
function clearDrag(){if(!drag)return;drag.ghost?.remove();drag.button.classList.remove('dragging');document.body.classList.remove('drag-active');drag=null;}
document.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const {moved,letter}=drag;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-house]');clearDrag();if(moved){selected=letter;renderTray();if(target)place(Number(target.dataset.house));else feedback('点选一座小屋，或再拖一次。');}else choose(letter);});
document.addEventListener('pointercancel',clearDrag);
$('#characters').addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId)clearDrag();});
$('#staff').addEventListener('click',e=>{const g=e.target.closest('[data-house]');if(g)place(Number(g.dataset.house));});
$('#staff').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('[data-house]');if(g){e.preventDefault();place(Number(g.dataset.house));$(`[data-house="${g.dataset.house}"]`)?.focus({preventScroll:true});}}});
$('#level1').onclick=()=>start(1);$('#level2').onclick=()=>start(2);$('#reset').onclick=()=>start();
$('#next').onclick=()=>{if(!solved)return;stopConfetti();if(round===5){finish();return;}cancelSpeech();round++;solved=false;selected=null;feedback('');render();focusScene(questions[round].home);readQuestion();};
$('#again').onclick=()=>start();$('#continue').onclick=()=>start(2);$('#close-finish').onclick=()=>$('#celebration').close();
$('#sound').onclick=readQuestion;
window.addEventListener('pagehide',()=>{cancelSpeech();stopConfetti();clearMismatch();clearDrag();});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelSpeech();stopConfetti();clearMismatch();clearDrag();}});
start(1);
new ResizeObserver(()=>{renderStaff();positionMismatch();}).observe($('.staff-scroll'));
