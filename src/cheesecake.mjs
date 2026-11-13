import {createSpeech} from "./balloon_speech.mjs";
import { makePage, answer } from "./cheesecake_core.mjs";
import { readProfiles, saveProfiles, dateLabel } from "./balloon_profiles.mjs";
let items = [], colors = [], selected = "choose", signature = "";
const board = document.querySelector("#cakes");
const feedback = document.querySelector("#feedback");
const celebration = document.querySelector("#celebration");
const speech = createSpeech(window.speechSynthesis, window.SpeechSynthesisUtterance, () => { document.querySelector("#speech-status").textContent = "当前语音不可用，请看上方文字提示。"; });
window.addEventListener("pagehide", speech.stop);
document.addEventListener("visibilitychange", () => {if(document.hidden) speech.stop();});
document.querySelector("#speak").addEventListener("click", () => speech.speak("观察蛋糕上的音符。间音请圈 S，线音请圈 L。点选蛋糕上的字母，完成后请点打勾按钮。"));
let profileStorage;
try { profileStorage = window.localStorage; } catch { profileStorage = null; }
let profiles = readProfiles(profileStorage);
function showProfile() {
  const select = document.querySelector("#student");
  select.replaceChildren(new Option("选择学生", ""), ...profiles.names.map(name => new Option(name, name)));
  select.value = profiles.active;
  document.querySelector("#student-label").textContent = `${profiles.active || "未选择学生"} ${dateLabel()}`;
}
function persistProfile() {
  const saved = saveProfiles(profileStorage, profiles);
  document.querySelector("#profile-status").textContent = saved ? "" : "当前浏览器无法保存档案，本次仍可练习。";
  showProfile();
}
document.querySelector("#student").addEventListener("change", event => {
  profiles.active = event.target.value; persistProfile();
});
document.querySelector("#profile-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#student-name");
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  if (!profiles.names.includes(name)) {
    if (profiles.names.length >= 50) { document.querySelector("#profile-status").textContent = "本机最多保存 50 个学生档案。"; return; }
    profiles.names.push(name);
  }
  profiles.active = name; input.value = ""; persistProfile();
});
showProfile();
setInterval(showProfile, 60000);
function stopCelebration() { celebration.hidden = true; celebration.classList.remove("playing"); }
function celebrate() {
  stopCelebration();
  celebration.hidden = false;
  void celebration.offsetWidth;
  celebration.classList.add("playing");
}
function render() {
  board.innerHTML = items.map((item, i) => {
    const y = 86 - item.position * 6;
    return `<div class="cake"><span class="cake-number">${i+1}</span><svg viewBox="0 0 360 260" aria-hidden="true"><image href="assets/cheesecake.png" x="10" y="8" width="340" height="234"/><g stroke="#343a36" stroke-width="1.4">${[0,12,24,36,48].map(d=>'<path d="M158 '+(38+d)+'h82"/>').join('')}</g><ellipse cx="199" cy="${y}" rx="8.5" ry="4.5" fill="white" stroke="#242a25" stroke-width="2.3"/></svg><button class="letter line-choice" data-index="${i}" data-answer="L" aria-pressed="${colors[i]==='L'}" aria-label="第 ${i+1} 块蛋糕，选择 L">L</button><button class="letter space-choice" data-index="${i}" data-answer="S" aria-pressed="${colors[i]==='S'}" aria-label="第 ${i+1} 块蛋糕，选择 S">S</button></div>`;
  }).join("");
  document.querySelector("#count").textContent = colors.filter(Boolean).length;
}
function next() {
  speech.stop();
  stopCelebration();
  items = makePage(Math.random, signature);
  signature = items.map(x=>x.position).join(",");
  colors = Array(9).fill(null);
  feedback.textContent = "慢慢观察：音符在线上，还是在两条线之间？";
  render();
}
document.querySelector("#erase").addEventListener("click", event => {
 selected = selected === "erase" ? "choose" : "erase";
 event.currentTarget.setAttribute("aria-pressed",String(selected === "erase"));
 speech.stop();
});
board.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  const i = Number(button.dataset.index);
  colors[i] = selected === "erase" ? null : button.dataset.answer;
  stopCelebration(); feedback.textContent = "选好了就点打勾吧。";
  render(); board.children[i].querySelector(`[data-answer="${button.dataset.answer}"]`).focus({preventScroll:true});
});
document.querySelector("#check").addEventListener("click", () => {
  speech.stop();
  const blank = colors.filter(c=>!c).length;
  const errors = colors.filter((c,i)=>c && c !== answer(items[i].position)).length;
  if (blank) {
    feedback.textContent = `还有 ${blank} 块蛋糕还没有选择。${errors ? `另有 ${errors} 个需要再想一想。` : ""}`;
    stopCelebration();
  } else if (errors) {
    feedback.textContent = `有 ${errors} 个需要再想一想。`;
    stopCelebration();
  } else {
    feedback.textContent = "全部选对啦！你真棒！";
    celebrate();
  }
});
document.querySelector("#next").addEventListener("click", next);
document.querySelector("#print").addEventListener("click", () => { speech.stop(); window.print(); });
celebration.addEventListener("animationend", event => { if(event.animationName === "parade") stopCelebration(); });
document.querySelector("#close-celebration").addEventListener("click", stopCelebration);
document.addEventListener("keydown", event => { if(event.key === "Escape") stopCelebration(); });
next();
