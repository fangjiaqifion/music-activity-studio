import { createSpeech } from "./balloon_speech.mjs";
import { readProfiles, saveProfiles, dateLabel } from "./balloon_profiles.mjs";
import { makeStaffPage, scoreStaffPage } from "./staff_worksheets_core.mjs";
const kind = document.body.dataset.activity;
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
      : "请从下往上数线和间，选择对应的数字。再从左往右看每对音符，选择向上、向下或相同高度的箭头。完成后点打勾按钮。",
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
setInterval(showProfile, 60000);

const names = ["一", "二", "三", "四", "五"];
const positionLabel = (p) =>
  `${names[Math.floor(p / 2)]}${p % 2 ? "间" : "线"} · ${p % 2 ? "Space" : "Line"} ${Math.floor(p / 2) + 1}`;
function staff(notes = [], interactive = false, index = 0) {
  return `<svg viewBox="0 0 240 130" aria-label="五线谱，从下往上数"><g stroke="#35312b" stroke-width="2">${[0, 2, 4, 6, 8].map((p) => `<path d="M20 ${106 - p * 10}H220"/>`).join("")}</g>${notes.map(([p, x]) => `<ellipse cx="${x}" cy="${106 - p * 10}" rx="12" ry="8" fill="white" fill-opacity="0" stroke="#26221e" stroke-width="3" transform="rotate(-15 ${x} ${106 - p * 10})"/>`).join("")}${interactive ? Array.from({ length: 9 }, (_, p) => `<g class="staff-target" tabindex="0" role="button" data-index="${index}" data-value="${p}" aria-label="第 ${index + 1} 题，${positionLabel(p)}"><rect x="18" y="${101 - p * 10}" width="204" height="10" fill="transparent"/><title>${positionLabel(p)}</title></g>`).join("") : ""}</svg>`;
}
function sunshineGuide() {
  return (
    '<section class="sunshine-guide"><h2>先看一看 · Examples</h2><div class="example-grid"><div>' +
    staff([[0, 120]]) +
    "<p>第一线 · Line 1</p></div><div>" +
    staff([[1, 120]]) +
    '<p>第一间 · Space 1</p></div><div class="direction-example"><span>↗ 升高 · Up</span><span>→ 相同 · Same</span><span>↘ 降低 · Down</span></div></div><p>↑ 从下往上数 · Count from the bottom</p></section><h2 class="part-title">① 线与间 · Lines and spaces</h2>'
  );
}
function render() {
  board.innerHTML =
    (kind === "sunshine" ? sunshineGuide() : "") +
    items
      .map(
        (q, i) =>
          `${i === 9 && kind === "sunshine" ? '<h2 class="part-title">↗ → ↘ 音高走向 · Pitch direction</h2>' : ""}<article class="staff-card"><span class="question-id">${i + 1}</span>${i === 0 ? `<img class="theme-art" src="assets/${kind === "ladybirds" ? "ladybird" : "sun"}.png" alt="">` : ""}${
            q.type === "place"
              ? `<p>${positionLabel(q.position)}</p>${staff(answers[i] == null ? [] : [[Number(answers[i]), 120]], true, i)}`
              : q.type === "number"
                ? `${staff([[q.position, 120]])}<p>${q.position % 2 ? "第几间？ Space number?" : "第几线？ Line number?"}</p><div class="choices">${Array.from({ length: q.position % 2 ? 4 : 5 }, (_, n) => `<button data-index="${i}" data-value="${n + 1}" aria-pressed="${answers[i] === String(n + 1)}">${n + 1}</button>`).join("")}</div>`
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
  feedback.textContent = "从下往上数线和间，选好了就点打勾吧。";
  render();
}
function choose(b) {
  if (!b) return;
  const restoreFocus = document.activeElement === b;
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
board.onclick = (e) => choose(e.target.closest("[data-index]"));
board.onkeydown = (e) => {
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches(".staff-target")
  ) {
    e.preventDefault();
    choose(e.target);
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
