import {
  GAMES,
  NOTES,
  LETTERS,
  PATTERNS,
  generate,
  validAnswer,
  hasBingo,
  recordAttempt,
} from "./core.mjs";
import { createAudio } from "./audio.mjs";
import { createHistoryStore } from "./storage.mjs";
const app = document.querySelector("#app"),
  audio = createAudio();
let game = null,
  questions = [],
  index = 0,
  seed = 0,
  level = "starter",
  answer = [],
  records = [],
  feedback = "",
  solved = false,
  marks = [],
  call = 0,
  line = 0,
  showCall = false;
const historyStore = createHistoryStore();
let history = historyStore.read();
const el = (selector) => document.querySelector(selector);
const button = (text, action, cls = "", extra = "") =>
  `<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
function shell(content) {
  app.innerHTML = `<header class="topbar"><button class="brand" data-action="home"><span class="brandmark">m<span>·</span></span><span>音乐游乐工坊<small>MUSIC ACTIVITY STUDIO</small></span></button><span class="prototype">试玩版 <span>01</span></span></header>${content}<footer><span>从纸上的小练习，到可以玩的音乐世界。</span><span>WORKSHEET COLLECTION / FANG, JIAQI</span></footer>`;
}
function home() {
  audio.stop();
  game = null;
  shell(
    `<main class="home"><section class="intro"><div><p class="eyebrow">PLAY. DISCOVER. MAKE MUSIC.</p><h1>今天，想去哪里<span>玩音乐？</span></h1><p class="lead">六个小世界，把熟悉的练习变成新的发现。<br>选一个喜欢的地方，开始今天的音乐冒险。</p></div><aside class="intro-note"><span class="hand-star">✳</span><span>每次打开<br><strong>都有新题目</strong></span><small>你的音乐小小实验室</small></aside></section><section class="toolbar" aria-label="游戏设置"><span>选择你的探索难度</span><div>${button("初次探索", "starter", level === "starter" ? "selected" : "")}${button("多一点挑战", "challenge", level === "challenge" ? "selected" : "")}</div><span class="session-note">${history.length ? `已完成 ${history.length} 次探索` : "不计时，慢慢想。"}</span></section><section class="game-grid" aria-label="六个子游戏">${GAMES.map((g, i) => `<button class="game-card" data-action="open" data-id="${g.id}" style="--accent:${g.color};--tint:${g.bg}"><div class="card-meta"><span>0${i + 1} / ${g.en}</span><span class="card-arrow">↗</span></div><div class="illustration ${g.id}"><div class="art-circle"></div><img src="assets/${g.image}.png" alt=""><span class="art-spark">${i % 2 ? "✦" : "✳"}</span></div><div class="card-copy"><span class="tag">${g.tag}</span><h2>${g.name}</h2><p>${g.desc}</p><span class="enter">进去玩一会儿 <span>→</span></span></div></button>`).join("")}</section><p class="home-tip">小提示：每个世界都可以重新出题。节奏工坊与 Bingo 也适合和老师一起玩。</p></main>`,
  );
}
function start(id, newSeed = true) {
  audio.stop();
  game = GAMES.find((g) => g.id === id);
  if (newSeed) seed = crypto.getRandomValues(new Uint32Array(1))[0];
  questions = generate(id, seed, level);
  index = 0;
  records = [];
  reset();
  render();
}
function reset() {
  audio.stop();
  answer = [];
  feedback = "";
  solved = false;
  marks = [];
  call = 0;
  line = 0;
  showCall = false;
}
function glyph(n) {
  return `<span class="music" aria-hidden="true">${n.glyph}</span><span>${n.label}</span>`;
}
function render() {
  const focused = document.activeElement?.closest("button[data-action]");
  const focusAction = focused?.dataset.action;
  const focusValue = focused?.dataset.value;
  const q = questions[index];
  shell(
    `<main class="play" style="--accent:${game.color};--tint:${game.bg}"><nav class="play-nav">${button("← 返回游乐工坊", "home", "back")}<span>${game.en} / ${level === "starter" ? "初次探索" : "多一点挑战"}</span>${button("↻ 重新出题", "restart", "text-button")}</nav><section class="play-title"><div><p class="eyebrow">${game.tag}</p><h1>${game.name}</h1></div><div class="round">${game.id === "dice" ? "创作模式" : game.id === "bingo" ? "课堂模式" : `第 ${index + 1} / 6 题`}<small>题组 ${seed}</small></div></section><div class="workspace"><aside class="mascot"><img src="assets/${game.image}.png" alt=""><p>${mascotText(q)}</p><span>灵感来自你的原创练习纸<br>${q.source.join(" / ")}</span></aside><section class="activity">${activity(q)}<p class="feedback ${solved ? "success" : ""}" role="status" aria-live="polite">${feedback || "慢慢来，想好了再试。"}</p>${!["dice", "bingo"].includes(game.id) ? `<div class="actions">${solved ? button(index === 5 ? "看看探索成果 →" : "下一题 →", "next", "primary") : button("检查一下 ✓", "check", "primary")}${button("清空选择", "clear", "secondary")}</div>` : ""}</section></div><div class="play-bottom"><span>规则生成 · 可重复探索</span>${button("打印这组练习", "print", "text-button")}<span>不采集姓名 · 记录仅在本机</span></div></main>`,
  );
  if (focusAction) {
    const selector =
      `[data-action="${CSS.escape(focusAction)}"]` +
      (focusValue === undefined
        ? ""
        : `[data-value="${CSS.escape(focusValue)}"]`);
    const next =
      app.querySelector(selector) ||
      (solved ? app.querySelector('[data-action="next"]') : null);
    if (next && !next.disabled) next.focus({ preventScroll: true });
  }
}
function mascotText(q) {
  return {
    shop: `把音符装进篮子，凑够 ${q.target} 拍！`,
    detective: "线索已经留下了，缺少的是哪个音？",
    dice: "每一格都是一拍，选一条路线来听听。",
    ocean: "我是用固定唱名唱歌的小鲸鱼。",
    builder: "点选琴键，拼出题目里的音。",
    bingo: "先听音名，再找对应的字母和音区。",
  }[game.id];
}
function activity(q) {
  if (game.id === "shop")
    return `<p class="task-kicker">今日订单</p><h2>请装入 <strong>${q.target} 拍</strong> 的音符</h2><p class="hint">以四分音符为一拍。可重复选择，也可以有不同组合。</p><div class="note-shelf">${NOTES.map((n, i) => button(glyph(n), "note", "note-card", `data-value="${i}" aria-label="添加${n.label}" ${solved ? "disabled" : ""}`)).join("")}</div><div class="basket"><span class="basket-label">我的音乐篮子</span><div class="basket-items">${answer.length ? answer.map((i, j) => button(NOTES[i].glyph, "remove", "music basket-note", `data-value="${j}" aria-label="移除${NOTES[i].label}" ${solved ? "disabled" : ""}`)).join("") : '<span class="empty">点选上方音符，把它放进来</span>'}</div><span class="total">${answer.reduce((s, i) => s + NOTES[i].beats, 0)} / ${q.target} 拍</span></div>`;
  if (game.id === "detective")
    return `<p class="task-kicker">音名字母的秘密</p><h2>谁藏在问号后面？</h2><p class="hint">按 C → D → E → F → G → A → B 循环，${q.direction === 1 ? "向前" : "向后"}每次走一步。</p><div class="sequence">${q.letters.map((l, i) => `<span class="letter-tile ${i === q.missing ? "missing" : ""}">${i === q.missing ? answer[0] || "?" : l}</span>`).join('<span class="seq-arrow">→</span>')}</div><div class="choices">${q.options.map((v) => button(v, "choose", answer[0] === v ? "choice active" : "choice", `data-value="${v}" ${solved ? "disabled" : ""}`)).join("")}</div>`;
  if (game.id === "ocean")
    return `<p class="task-kicker">找到音乐伙伴</p><h2>音名 ${q.letter} 的固定唱名是什么？</h2><p class="hint">这里使用固定唱名：C = Do，D = Re……</p><div class="ocean-target"><img src="assets/whale.png" alt="小鲸鱼"><span>${q.letter}</span></div><div class="choices">${q.options.map((v) => button(v, "choose", answer[0] === v ? "choice active" : "choice", `data-value="${v}" ${solved ? "disabled" : ""}`)).join("")}</div>`;
  if (game.id === "builder")
    return `<p class="task-kicker">建造任务</p><h2>${q.name}</h2><p class="hint">选择 ${q.keys.length} 个音。C4 是中央 C；点选已选琴键可取消。</p><div class="piano">${Array.from({ length: 8 }, (_, i) => `<div class="piano-column">${[0, 1, 3, 4, 5].includes(i) ? '<span class="black-key" aria-hidden="true"></span>' : ""}${button(`${LETTERS[i % 7]}<small>${i === 7 ? "5" : "4"}</small>`, "key", answer.includes(i) ? "white-key active" : "white-key", `data-value="${i}" aria-label="${LETTERS[i % 7]}${i === 7 ? "5" : "4"}" aria-pressed="${answer.includes(i)}" ${solved ? "disabled" : ""}`)}</div>`).join("")}</div><p class="selected-notes">已选：${answer.length ? answer.map((i) => LETTERS[i % 7] + (i === 7 ? "5" : "4")).join(" · ") : "等待你的第一颗音符"}</p>${button("听听我的组合", "chord", "secondary")}`;
  if (game.id === "dice")
    return `<p class="task-kicker">你的十六宫格乐谱</p><h2>掷一张地图，听一条节奏路线</h2><p class="hint">每格一拍：四分音符或两个八分音符。选择行、列或对角线。</p><div class="routes">${["第一行", "第二行", "第三行", "第四行", "第一列", "第二列", "第三列", "第四列", "↘ 对角线", "↙ 对角线"].map((v, i) => button(v, "route", line === i ? "route selected" : "route", `data-value="${i}"`)).join("")}</div><div class="rhythm-grid">${q.grid.map((v, i) => button(`<span class="music">${PATTERNS[v].glyph}</span>`, "cell", routeIndices().includes(i) ? "rhythm-cell on" : "rhythm-cell", `data-value="${i}" aria-label="第${i + 1}格：${PATTERNS[v].label}，点击切换节奏"`)).join("")}</div><div class="actions">${button("▶ 听这四拍", "rhythm", "primary")}${button("掷出新地图", "reroll", "secondary")}</div><p class="hint">也可以点选格子，自己改变节奏。跟读和拍手由你或老师判断。</p>`;
  if (game.id === "bingo") {
    const c = q.calls[call];
    return `<p class="task-kicker">听音名，找格子</p><h2>${solved ? "Bingo！连成一条线了" : "先听提示，再找到对应的音"}</h2><p class="hint">3 × 3 题板，横、竖、斜都可以。C4 是中央 C，C5 高一个八度。</p><div class="bingo-tools">${button("▶ 播放本轮音名", "call", "primary")}${button(showCall ? "隐藏文字提示" : "查看文字提示", "reveal", "secondary")}<span>第 ${call + 1} 次提示${showCall ? `：${c.letter}${c.octave}` : ""}</span></div><div class="bingo-grid">${q.board.map((v, i) => button(`${v.letter}<small>${v.octave}</small>${marks.includes(i) ? '<span class="stamp">✓</span>' : ""}`, "mark", marks.includes(i) ? "bingo-cell marked" : "bingo-cell", `data-value="${i}" aria-label="${v.letter}${v.octave}${marks.includes(i) ? " 已标记" : ""}" ${solved ? "disabled" : ""}`)).join("")}</div>${solved ? button("再来一张题板 →", "restart", "primary") : ""}`;
  }
}
function routeIndices() {
  if (line < 4) return Array.from({ length: 4 }, (_, i) => line * 4 + i);
  if (line < 8) return Array.from({ length: 4 }, (_, i) => i * 4 + line - 4);
  return line === 8 ? [0, 5, 10, 15] : [3, 6, 9, 12];
}
function save() {
  const saved = historyStore.append(
    {
      game: game.id,
      seed,
      level,
      date: new Date().toISOString(),
      records,
    },
    history,
  );
  history = saved.history;
  return saved.stored;
}

function result() {
  audio.stop();
  const first = records.filter((r) => r?.firstCorrect).length;
  const stored = save();
  shell(
    `<main class="result"><p class="eyebrow">LITTLE STEPS, LOVELY DISCOVERIES</p><span class="result-star">✳</span><h1>又发现了一点音乐！</h1><p>${game.name} · 完成 6 个小任务</p><div class="result-score"><strong>${first}<small> / 6</small></strong><span>首次尝试就答对</span></div><p>${stored ? "这次探索已保存在本机。" : "本机存储不可用，这次成果未保存。"}</p><div class="actions">${button("再探索一次", "restart", "primary")}${button("回到游乐工坊", "home", "secondary")}</div>${button("重玩同一组题", "replay", "text-button")}</main>`,
  );
}
function check() {
  if (solved) return;
  const q = questions[index],
    value = ["detective", "ocean"].includes(game.id)
      ? (answer[0] ?? null)
      : answer;
  const correct = validAnswer(q, value);
  records[index] = recordAttempt(records[index] || {}, value, correct);
  solved = correct;
  feedback = correct
    ? "✓ 做到了！这是一个正确的答案。"
    : !answer.length
      ? "先选择一个答案，再检查吧。"
      : game.id === "shop"
        ? "看看篮子里的拍数，再调整一下。"
        : "再想一想，你也可以调整选择。";
  render();
}
function speakCall(q) {
  const called = call;
  const c = q.calls[called];
  audio.speak(`字母 ${c.letter}，数字${c.octave === 4 ? "四" : "五"}`, () => {
    if (game?.id !== "bingo" || questions[index] !== q || call !== called)
      return;
    feedback = "语音暂时不可用，请看文字提示继续。";
    showCall = true;
    render();
  });
}

function printSheet() {
  audio.stop();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const q = questions[index];
  const items =
    game.id === "dice" ? [q] : game.id === "bingo" ? [q] : questions;
  const rows = items.map((x, i) => {
    let prompt = "",
      solution = "";
    if (x.kind === "shop") {
      prompt = `用音符组合出 ${x.target} 拍（四分音符为一拍）`;
      solution = `示例：${Array(x.target).fill("♩").join(" + ")}，其他等值组合也正确。`;
    }
    if (x.kind === "detective") {
      prompt =
        x.letters.map((v, n) => (n === x.missing ? "___" : v)).join(" → ") +
        `（${x.direction === 1 ? "正向" : "反向"}音名循环）`;
      solution = x.answer;
    }
    if (x.kind === "ocean") {
      prompt = `音名 ${x.letter} 的固定唱名：_______`;
      solution = x.answer;
    }
    if (x.kind === "builder") {
      prompt = x.name + "：________________";
      solution = x.keys
        .map((n) => LETTERS[n % 7] + (n === 7 ? "5" : "4"))
        .join("、");
    }
    if (x.kind === "dice") {
      prompt = `<div class="print-grid">${x.grid.map((v) => `<span>${PATTERNS[v].glyph}</span>`).join("")}</div>`;
      solution = "每格一拍。创作与跟读活动，由教师观察。";
    }
    if (x.kind === "bingo") {
      prompt = `<div class="print-grid bingo-print">${x.board.map((v) => `<span>${v.letter}${v.octave}</span>`).join("")}</div>`;
      solution =
        "教师呼叫顺序：" + x.calls.map((v) => v.letter + v.octave).join(" → ");
    }
    return { prompt, solution };
  });
  const p = document.createElement("section");
  p.id = "print-sheet";
  p.innerHTML = `<h1>${game.name}</h1><p>姓名：________________　日期：________________</p><p>题组：${seed} · ${level === "starter" ? "初次探索" : "多一点挑战"}</p>${rows.map((r, i) => `<article><b>${i + 1}.</b> ${r.prompt}<div class="writing-space"></div></article>`).join("")}<section class="answer-page"><h1>参考答案 · ${game.name}</h1>${rows.map((r, i) => `<p>${i + 1}. ${r.solution}</p>`).join("")}<p>题组 ${seed} · Music Activity Studio</p></section>`;
  el("#print-sheet")?.remove();
  document.body.append(p);
  window.print();
}
app.addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-action]");
  if (!b || b.disabled) return;
  const a = b.dataset.action,
    v = b.dataset.value;
  const owner = questions[index];
  try {
    if (a === "home") {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      home();
      return;
    }
    if (a === "starter" || a === "challenge") {
      level = a;
      home();
      return;
    }
    if (a === "open") {
      start(b.dataset.id);
      return;
    }
    if (a === "restart" || a === "replay") {
      start(game.id, a !== "replay");
      return;
    }
    if (a === "print") {
      printSheet();
      return;
    }
    const q = questions[index];
    if (a === "next") {
      if (!solved) return;
      if (index === 5) {
        result();
        return;
      }
      index++;
      reset();
      render();
      return;
    }
    if (a === "check") {
      check();
      return;
    }
    if (a === "clear" && !solved) {
      answer = [];
      feedback = "";
    }
    if (a === "note" && !solved) {
      if (answer.length < 12) answer.push(Number(v));
    }
    if (a === "remove" && !solved) answer.splice(Number(v), 1);
    if (a === "choose" && !solved) answer = [v];
    if (a === "key" && !solved) {
      const n = Number(v);
      answer = answer.includes(n)
        ? answer.filter((k) => k !== n)
        : [...answer, n];
    }
    if (a === "chord") {
      await audio.play(
        answer.map((n) => ({
          midi: [60, 62, 64, 65, 67, 69, 71, 72][n],
          duration: 0.8,
        })),
      );
      return;
    }
    if (a === "route") {
      audio.stop();
      line = Number(v);
    }
    if (a === "cell") {
      audio.stop();
      q.grid[Number(v)] = (q.grid[Number(v)] + 1) % PATTERNS.length;
    }
    if (a === "reroll") {
      start(game.id);
      return;
    }
    if (a === "rhythm") {
      let t = 0;
      const events = [];
      for (const i of routeIndices())
        for (const d of PATTERNS[q.grid[i]].durations) {
          events.push({ at: t, duration: d * 0.45, midi: 76 });
          t += d * 0.6;
        }
      const played = await audio.play(events);
      if (!played || !game || questions[index] !== q) return;
      feedback = "这条路线共四拍。可以跟着读，也可以拍拍手。";
    }
    if (a === "call") {
      speakCall(q);
      return;
    }
    if (a === "reveal") showCall = !showCall;
    if (a === "mark" && !solved) {
      const n = Number(v),
        c = q.calls[call];
      if (marks.includes(n)) {
        feedback = "这个格子已经找到啦。";
      } else if (
        q.board[n].letter === c.letter &&
        q.board[n].octave === c.octave
      ) {
        marks.push(n);
        if (hasBingo(marks)) {
          solved = true;
          feedback = "✓ Bingo！你找到了一条完整的线。";
          records = [{ completed: true, calls: call + 1 }];
          if (!save()) feedback += " 本机记录未能保存，这局仍已完成。";
        } else {
          call++;
          showCall = false;
          feedback = "✓ 找到了！播放下一轮音名吧。";
        }
        if ("speechSynthesis" in window) speechSynthesis.cancel();
      } else feedback = "再听一次音名，也留意一下是第几组。";
    }
    render();
  } catch (error) {
    if (!game || questions[index] !== owner) return;
    feedback = ["chord", "rhythm", "call"].includes(a)
      ? "声音暂时无法播放。你可以继续做题，稍后再试。"
      : "这次操作未能完成，请重试。";
    render();
    console.warn("Activity operation failed", error);
  }
});
window.addEventListener("pagehide", () => {
  audio.stop();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
});
home();
