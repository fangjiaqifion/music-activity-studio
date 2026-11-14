import { cowRegions, clefGlyphs } from "./cow_regions.mjs";
import { createSpeech } from "./balloon_speech.mjs";
import { readProfiles, saveProfiles, dateLabel } from "./balloon_profiles.mjs";
import { makeHands, makeClefs, countAnswers } from "./activities_core.mjs";
const kind = document.body.dataset.activity;
const board = document.querySelector("#activity-board");
const feedback = document.querySelector("#feedback");
const celebration = document.querySelector("#celebration");
let items = [],
  answers = [],
  selected = kind === "hands" ? "1" : "black",
  last = "";
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
    kind === "hands"
      ? "先选择左手或右手。再选择一个指号，点击对应手指上的圆圈填写。钢琴指号从大拇指一指到小指五指。完成后请点打勾按钮。"
      : "请用黑色涂高音谱号的斑纹，用棕色涂低音谱号的斑纹。先选择颜色，再点击斑纹中的谱号。完成后请点打勾按钮。",
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

const points = [
  [85, 64],
  [80, 23],
  [64, 14],
  [49, 16],
  [26, 23],
];
function render() {
  if (kind === "hands") {
    board.innerHTML = items
      .map((hand, h) => {
        const mirrored = hand === "right";
        return (
          '<article class="hand-card"><div class="hand-art"><img src="assets/hand_' +
          hand +
          '.png" alt="待辨认的手，第 ' +
          (h + 1) +
          ' 题">' +
          points
            .map(
              ([x, y], f) =>
                '<button class="finger" style="left:' +
                (mirrored ? 100 - x : x) +
                "%;top:" +
                y +
                '%" data-index="' +
                (h * 6 + f + 1) +
                '" aria-label="第 ' +
                (h + 1) +
                " 只手，第 " +
                (f + 1) +
                ' 个填写位置">' +
                (answers[h * 6 + f + 1] || "·") +
                "</button>",
            )
            .join("") +
          '</div><div class="hand-labels">' +
          ["left", "right"]
            .map(
              (v) =>
                '<button data-index="' +
                h * 6 +
                '" data-value="' +
                v +
                '" aria-pressed="' +
                (answers[h * 6] === v) +
                '">' +
                (v === "left" ? "左手 · Left" : "右手 · Right") +
                "</button>",
            )
            .join("") +
          "</div></article>"
        );
      })
      .join("");
  } else {
    board.innerHTML =
      '<div class="cow-art"><img class="cow-base" src="assets/cow_activity.svg" alt="奶牛，十九块带谱号的涂色区域">' +
      items
        .map((clef, i) => {
          const region = cowRegions[i],
            glyph = clefGlyphs[clef];
          return (
            '<div class="spot-fill" style="background:' +
            (answers[i] === "black"
              ? "#24201e"
              : answers[i] === "brown"
                ? "#986744"
                : "transparent") +
            ";mask-image:url(assets/" +
            region.mask +
            ')"></div><button class="cow-clef ' +
            (answers[i] ? "painted " : "") +
            (clef === "bass" ? "bass" : "") +
            '" data-index="' +
            i +
            '" style="left:' +
            (region.x / 1060) * 100 +
            "%;top:" +
            (region.y / 620) * 100 +
            "%;width:" +
            (region.width / 1060) * 100 +
            "%;height:" +
            (region.height / 620) * 100 +
            '%" aria-label="第 ' +
            (i + 1) +
            ' 块斑纹" aria-pressed="' +
            !!answers[i] +
            '"><svg viewBox="' +
            glyph.viewBox +
            '" aria-hidden="true"><path transform="scale(1,-1)" d="' +
            glyph.path +
            '"/></svg></button>'
          );
        })
        .join("") +
      "</div>" +
      '<section class="cow-details" aria-label="放大斑纹"><h2>放大看，点一下填色 · Larger spots</h2><div class="cow-detail-grid">' +
      items
        .map((clef, i) => {
          const r = cowRegions[i],
            g = clefGlyphs[clef],
            w = Math.max(120, r.width * 2.5),
            h = Math.max(100, r.height * 2.5);
          const color =
            answers[i] === "black"
              ? "#24201e"
              : answers[i] === "brown"
                ? "#986744"
                : "transparent";
          return (
            '<button class="cow-detail" data-detail-index="' +
            i +
            '" aria-label="第 ' +
            (i + 1) +
            ' 块斑纹，放大作答" aria-pressed="' +
            !!answers[i] +
            '"><span>' +
            (i + 1) +
            '</span><svg viewBox="' +
            [r.x - w / 2, r.y - h / 2, w, h].join(" ") +
            '" aria-hidden="true"><image href="assets/cow_activity.svg" width="1060" height="620"/><rect x="0" y="0" width="1060" height="620" fill="' +
            color +
            '" mask="url(#detail-mask-' +
            i +
            ')"/><defs><mask id="detail-mask-' +
            i +
            '"><image href="assets/' +
            r.mask +
            '" width="1060" height="620"/></mask></defs><svg x="' +
            (r.x - r.width / 2) +
            '" y="' +
            (r.y - r.height / 2) +
            '" width="' +
            r.width +
            '" height="' +
            r.height +
            '" viewBox="' +
            g.viewBox +
            '"><path transform="scale(1,-1)" fill="' +
            (answers[i] ? "white" : "#24201e") +
            '" d="' +
            g.path +
            '"/></svg></svg></button>'
          );
        })
        .join("") +
      "</div></section>";
  }
  document.querySelector("#count").textContent = answers.filter(Boolean).length;
}
function next() {
  stop();
  const make = kind === "hands" ? makeHands : makeClefs;
  items = make(Math.random, last);
  last = items.join(",");
  answers = Array(kind === "hands" ? 12 : cowRegions.length).fill(null);
  feedback.textContent = "慢慢观察，选好了就点打勾吧。";
  render();
}
document.querySelectorAll("[data-tool]").forEach(
  (b) =>
    (b.onclick = () => {
      selected = b.dataset.tool;
      speech.stop();
      document
        .querySelectorAll("[data-tool]")
        .forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
      if (selected === "black" || selected === "brown")
        speech.speak(
          selected === "black"
            ? "请用黑色涂高音谱号。"
            : "请用棕色涂低音谱号。",
        );
    }),
);
board.onclick = (event) => {
  const b = event.target.closest("[data-index],[data-detail-index]");
  if (!b) return;
  const detail = b.hasAttribute("data-detail-index");
  const i = Number(detail ? b.dataset.detailIndex : b.dataset.index);
  if (kind === "hands" && i % 6 === 0 && selected !== "erase")
    answers[i] = b.dataset.value;
  else answers[i] = selected === "erase" ? null : selected;
  stopCelebration();
  feedback.textContent = "选好了就点打勾吧。";
  render();
  board
    .querySelector(
      "[" + (detail ? "data-detail-index" : "data-index") + '="' + i + '"]',
    )
    ?.focus({ preventScroll: true });
};
document.querySelector("#check").onclick = () => {
  stop();
  const { blank, errors } = countAnswers(kind, items, answers);
  feedback.textContent = blank
    ? "还有 " +
      blank +
      " 处没有填写。" +
      (errors ? "另有 " + errors + " 个需要再想一想。" : "")
    : errors
      ? "有 " + errors + " 个需要再想一想。"
      : "全部答对啦！你真棒！";
  if (!blank && !errors) {
    celebration.hidden = false;
    void celebration.offsetWidth;
  }
};
document.querySelector("#next").onclick = next;
document.querySelector("#print").onclick = () => {
  stop();
  window.print();
};
document.querySelector("#close-celebration").onclick = stopCelebration;
celebration.addEventListener("animationend", (e) => {
  if (e.animationName === "parade") stopCelebration();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") stopCelebration();
});
next();
