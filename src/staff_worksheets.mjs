import { createSpeech } from "./balloon_speech.mjs";
import { readProfiles, saveProfiles, dateLabel } from "./balloon_profiles.mjs";
import { makeStaffPage, scoreStaffPage } from "./staff_worksheets_core.mjs";
const kind = document.body.dataset.activity;
const relative = ['treble','bass','alto'].includes(kind);
const clefInfo = {treble:['高音谱号','Treble clef','G',2,'\uE050'],bass:['低音谱号','Bass clef','F',6,'\uE062'],alto:['中音谱号','Alto clef','C',4,'\uE05C']};
const board = document.querySelector("#activity-board");
const feedback = document.querySelector("#feedback");
const celebration = document.querySelector("#celebration");
let items = [],
  answers = [],
  selected = "draw";
const speech = createSpeech(
  window.speechSynthesis,
  window.SpeechSynthesisUtterance,
  () => {
    document.querySelector("#speech-status").textContent =
      "当前语音不可用，请看上方文字提示。";
  },
);
function stopCelebration() {
  celebration.hidden = true;
}
function stop() {
  speech.stop();
  stopCelebration();
}
window.addEventListener("pagehide", stop);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
});
window.addEventListener("beforeprint", stop);
document.querySelector("#speak").onclick = () =>
  speech.speak(
    kind === "ladybirds"
      ? "请从下往上数线和间，在题目指定的位置点一下画出音符。可以用橡皮擦修改。完成后点打勾按钮。"
      : relative ? '先看每组红色已知音和它的音名。每升高一个线或间，音名就往后一个字母；降低就往前。根据已知音，选择黑色音符的音名。字母从A到G循环。' : '从左往右看两个音符，选择第二个音比第一个音高、相同还是低。不需要数第几线或第几间。',
  );
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
if (relative) document.querySelector("#next").textContent = "重新练习 · Try again ↻";
setInterval(showProfile, 60000);

const names = ["一", "二", "三", "四", "五"];
const positionLabel = (p) =>
  `${names[Math.floor(p / 2)]}${p % 2 ? "间" : "线"} · ${p % 2 ? "Space" : "Line"} ${Math.floor(p / 2) + 1}`;
function staff(notes = [], interactive = false, index = 0, clef = null) {
  return `<svg viewBox="${clef ? "0 -10 240 155" : "0 0 240 130"}" aria-label="五线谱，从下往上数"><g stroke="#35312b" stroke-width="2">${[0, 2, 4, 6, 8].map((p) => `<path d="M20 ${106 - p * 10}H220"/>`).join("")}</g>${clef ? `<text class="clef" x="22" y="106" font-size="100">${clefInfo[clef][4]}</text>` : ""}${notes.map(([p, x], n) => `<ellipse cx="${x}" cy="${106 - p * 10}" rx="12" ry="8" fill="white" fill-opacity="0" stroke="${clef && n === 0 ? "#bf443c" : "#26221e"}" stroke-width="3" transform="rotate(-15 ${x} ${106 - p * 10})"/>`).join("")}${interactive ? Array.from({ length: 9 }, (_, p) => `<g class="staff-target" tabindex="0" role="button" data-index="${index}" data-value="${p}" aria-label="第 ${index + 1} 题，${positionLabel(p)}"><rect x="18" y="${101 - p * 10}" width="204" height="10" fill="transparent"/><title>${positionLabel(p)}</title></g>`).join("") : ""}</svg>`;
}
function sunshineGuide() {
 return '<section class="sunshine-guide"><h2>两个音，比高低 · Compare two notes</h2><div class="example-grid">'+[['up',1,6,'↗ 更高 · Higher'],['same',4,4,'→ 一样高 · Same'],['down',7,2,'↘ 更低 · Lower']].map(([_,a,b,label])=>'<div>'+staff([[a,80],[b,160]])+'<p>'+label+'</p></div>').join('')+'</div><p>从左往右看，比较第二个音和第一个音。<br>Compare the second note with the first.</p></section>';
}
function relativeGuide() {
 const [zh,en,letter,p] = clefInfo[kind];
 return '<section class="sunshine-guide"><h2>'+zh+' · '+en+'</h2>'+staff([[p,140]],false,0,kind)+'<p>'+letter+' 谱号 · '+letter+' clef</p><p>红色音符是已知音。按相邻线、间一步一步推算音名。<br>Use the red reference note. Move one letter for each step.</p><p>A → B → C → D → E → F → G → A</p><p>已知音是每组的起点，请按给定字母推算。<br>Each group supplies its own starting letter.</p></section>';
}
function render() {
  board.innerHTML =
    (kind === "sunshine" ? sunshineGuide() : relative ? relativeGuide() : "") +
    items
      .map(
        (q, i) =>
          `${relative && i % 6 === 0 ? `<h2 class="part-title">第 ${q.group+1} 组 · Group ${q.group+1} · 已知 ${q.letter}</h2>` : ""}<article class="staff-card"><span class="question-id">${i + 1}</span>${i === 0 ? `<img class="theme-art" src="assets/${kind === "ladybirds" ? "ladybird" : "sun"}.png" alt="">` : ""}${
            q.type === "place"
              ? `<p>${positionLabel(q.position)}</p>${staff(answers[i] == null ? [] : [[Number(answers[i]), 120]], true, i)}`
              : q.type === "relative"
                ? `<p class="reference-label">已知 · Given <strong>${q.letter}</strong></p>${staff([[q.reference,100],[q.position,180]],false,0,q.clef)}<p>黑色音符是什么音？<br>Name the black note.</p><div class="choices note-choices">${[...'ABCDEFG'].map(value=>`<button data-index="${i}" data-value="${value}" aria-label="音名 ${value}" aria-pressed="${answers[i]===value}">${value}</button>`).join('')}</div>`
              : `${staff([
                    [q.a, 80],
                    [q.b, 160],
                  ])}<div class="choices">${[
                    ["up", "↗", "升高"],
                    ["same", "→", "相同"],
                    ["down", "↘", "降低"],
                  ]
                    .map(
                      ([value, arrow, label]) =>
                        `<button data-index="${i}" data-value="${value}" aria-label="${label}" aria-pressed="${answers[i] === value}">${arrow}</button>`,
                    )
                    .join("")}</div>`
          }</article>`,
      )
      .join("");
  document.querySelector("#count").textContent = answers.filter(
    (a) => a != null,
  ).length;
}
function next() {
  stop();
  items = makeStaffPage(kind);
  answers = items.map(() => null);
  feedback.textContent = kind === "ladybirds" ? "在指定的线或间画音符。" : relative ? "根据红色已知音，选择黑色音符的音名。" : "比较两个音，选好了就点打勾吧。";
  render();
}
function choose(b, keyboard = false) {
  if (!b) return;
  const restoreFocus = keyboard && document.activeElement === b;
  const { index, value } = b.dataset;
  answers[Number(b.dataset.index)] =
    selected === "erase" ? null : b.dataset.value;
  stopCelebration();
  feedback.textContent = "选好了就点打勾吧。";
  render();
  if (restoreFocus)
    board
      .querySelector(`[data-index="${index}"][data-value="${value}"]`)
      ?.focus({ preventScroll: true });
}
board.onclick = (e) => choose(e.target.closest("[data-index]"), e.detail === 0);
board.onkeydown = (e) => {
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches(".staff-target")
  ) {
    e.preventDefault();
    choose(e.target, true);
  }
};
document.querySelectorAll("[data-tool]").forEach(
  (b) =>
    (b.onclick = () => {
      selected = b.dataset.tool;
      speech.stop();
      document
        .querySelectorAll("[data-tool]")
        .forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
    }),
);
document.querySelector("#check").onclick = () => {
  stop();
  const { blank, errors } = scoreStaffPage(items, answers);
  feedback.textContent = blank
    ? `还有 ${blank} 处没有填写。${errors ? `另有 ${errors} 个需要再想一想。` : ""}`
    : errors
      ? `有 ${errors} 个需要再想一想。`
      : "全部答对啦！你真棒！";
  if (!blank && !errors) {
    celebration.hidden = false;
    void celebration.offsetWidth;
  }
};
document.querySelector("#next").onclick = next;
document.querySelector("#print")?.addEventListener("click", () => {
  stop();
  window.print();
});
document.querySelector("#close-celebration").onclick = stopCelebration;
celebration.addEventListener("animationend", (e) => {
  if (e.animationName === "parade") stopCelebration();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") stopCelebration();
});
next();
