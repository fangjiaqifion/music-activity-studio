import {createSpeech,instructions} from "./balloon_speech.mjs";
import { makePage, answer } from "./balloons_core.mjs";
import { readProfiles, saveProfiles, dateLabel } from "./balloon_profiles.mjs";
let items = [], colors = [], selected = "red", signature = "";
const board = document.querySelector("#balloons");
const feedback = document.querySelector("#feedback");
const celebration = document.querySelector("#celebration");
const fills = { red: "#f3a0a3", blue: "#a0c8ee" };
const speech = createSpeech(window.speechSynthesis, window.SpeechSynthesisUtterance, () => { document.querySelector("#speech-status").textContent = "当前语音不可用，请看上方文字提示。"; });
window.addEventListener("pagehide", speech.stop);
document.addEventListener("visibilitychange", () => {if(document.hidden) speech.stop();});
document.querySelector("#speak").addEventListener("click", () => speech.speak(instructions));
const geometry = {
  round: {w:111,h:141,top:63},
  heart: {w:147,h:134,top:52},
  star: {w:131,h:127,top:51},
  bunny: {w:99,h:153,top:91},
};
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
    const g = geometry[item.shape];
    const scale = Math.min(160/g.w,180/g.h);
    const width = g.w*scale, height = g.h*scale;
    const x = (180-width)/2, top = 110-g.top*scale;
    const staffTop = 110;
    const bottom = staffTop+40, y = bottom-item.position*5;
    // Only the enclosed body mask receives color. Original outline and bubble
    // highlights remain unfiltered; native aspect ratios are preserved.
    return `<button class="balloon" data-index="${i}" aria-label="第 ${i+1} 个气球，${colors[i] === "red" ? "红色" : colors[i] === "blue" ? "蓝色" : "未涂色"}"><svg viewBox="0 0 180 260" aria-hidden="true"><defs><mask id="body${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="260"><image href="assets/balloon_${item.shape}_mask.png" x="${x}" y="${top}" width="${width}" height="${height}"/></mask></defs><path d="M90 ${top+height-3} q16 10 0 19 t0 17" fill="none" stroke="#5b625a" stroke-width="1.4"/><image href="assets/balloon_${item.shape}.png" x="${x}" y="${top}" width="${width}" height="${height}"/><rect width="180" height="230" fill="${fills[colors[i]] || "#fffefb"}" mask="url(#body${i})"/><g stroke="#343a36" stroke-width="1">${[0,10,20,30,40].map(d=>`<path d="M55 ${staffTop+d}h70"/>`).join("")}</g><ellipse cx="90" cy="${y}" rx="10" ry="4.8" fill="#242a25" transform="rotate(-12 90 ${y})"/></svg><span class="num">${i+1}</span></button>`;
  }).join("");
  document.querySelector("#count").textContent = colors.filter(Boolean).length;
}
function next() {
  speech.stop();
  stopCelebration();
  items = makePage(Math.random, signature);
  signature = items.map(x=>x.position).join(",");
  colors = Array(12).fill(null);
  feedback.textContent = "慢慢观察：音符在线上，还是在两条线之间？";
  render();
}
document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => {
  selected = button.dataset.color;
  if(selected === "red") speech.speak("请用红色涂间音气球");
  else if(selected === "blue") speech.speak("请用蓝色涂线音气球");
  else speech.stop();
  document.querySelectorAll("[data-color]").forEach(b=>b.setAttribute("aria-pressed", String(b === button)));
}));
board.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  const i = Number(button.dataset.index);
  colors[i] = selected === "erase" ? null : selected;
  stopCelebration(); feedback.textContent = "涂好了就检查一下吧。";
  render(); board.children[i].focus({preventScroll:true});
});
document.querySelector("#check").addEventListener("click", () => {
  speech.stop();
  const blank = colors.filter(c=>!c).length;
  const errors = colors.filter((c,i)=>c && c !== answer(items[i].position)).length;
  if (blank) {
    feedback.textContent = `还有 ${blank} 个气球没有涂色。${errors ? `另有 ${errors} 个需要再想一想。` : ""}`;
    stopCelebration();
  } else if (errors) {
    feedback.textContent = `有 ${errors} 个需要再想一想。`;
    stopCelebration();
  } else {
    feedback.textContent = "全部涂对啦！你真棒！";
    celebrate();
  }
});
document.querySelector("#next").addEventListener("click", next);
document.querySelector("#print").addEventListener("click", () => { speech.stop(); window.print(); });
celebration.addEventListener("animationend", event => { if(event.animationName === "parade") stopCelebration(); });
document.querySelector("#close-celebration").addEventListener("click", stopCelebration);
document.addEventListener("keydown", event => { if(event.key === "Escape") stopCelebration(); });
next();
