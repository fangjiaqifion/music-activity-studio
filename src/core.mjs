export const GAMES = [
  {
    id: "shop",
    name: "节奏商店",
    en: "RHYTHM SHOP",
    tag: "时值 · 组合",
    color: "#e9b55f",
    bg: "#f8e9cb",
    image: "shop",
    desc: "挑选音符，装满一篮子的节奏。",
  },
  {
    id: "detective",
    name: "侦探猫事务所",
    en: "DETECTIVE CAT",
    tag: "音名 · 规律",
    color: "#a695c9",
    bg: "#eee7f6",
    image: "cat",
    desc: "跟着线索，找回消失的音名。",
  },
  {
    id: "dice",
    name: "骰子节奏工坊",
    en: "RHYTHM LAB",
    tag: "节奏 · 创作",
    color: "#d98d74",
    bg: "#f7e3dc",
    image: "dice",
    desc: "掷出一张新地图，把节奏连成音乐。",
  },
  {
    id: "ocean",
    name: "海底音乐派对",
    en: "OCEAN MATCH",
    tag: "音名 · 唱名",
    color: "#74b3bf",
    bg: "#e1f0f1",
    image: "whale",
    desc: "帮小鲸鱼找到自己的音乐伙伴。",
  },
  {
    id: "builder",
    name: "和声建造屋",
    en: "HARMONY BUILDER",
    tag: "音程 · 和弦",
    color: "#92ad7c",
    bg: "#e9efdf",
    image: "mushroom",
    desc: "一颗一颗音符，搭出音程与和弦。",
  },
  {
    id: "bingo",
    name: "音乐 Bingo",
    en: "MUSIC BINGO",
    tag: "听辨 · 课堂",
    color: "#c99c6d",
    bg: "#f2e7d8",
    image: "lock",
    desc: "听听音名，找一找，连成一条线！",
  },
];
export const NOTES = [
  { id: "quarter", label: "四分音符", glyph: "♩", beats: 1 },
  { id: "half", label: "二分音符", glyph: "𝅗𝅥", beats: 2 },
  { id: "dotted", label: "附点二分音符", glyph: "𝅗𝅥·", beats: 3 },
  { id: "whole", label: "全音符", glyph: "𝅝", beats: 4 },
];
export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
export const SOLFEGE = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
export const PATTERNS = [
  { label: "四分音符", glyph: "♩", durations: [1] },
  { label: "两个八分音符", glyph: "♪ ♪", durations: [0.5, 0.5] },
];
export function rng(seed) {
  let a = Number(seed) >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(a, r) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function generate(id, seed, level = "starter") {
  const r = rng(seed),
    pick = (a) => a[Math.floor(r() * a.length)];
  return Array.from({ length: 6 }, (_, i) => {
    const base = { id: `${id}:${seed}:${i}`, kind: id };
    if (id === "shop")
      return {
        ...base,
        target: pick(level === "starter" ? [2, 3, 4] : [4, 5, 6, 7, 8]),
        source: ["R-020", "R-033"],
      };
    if (id === "detective") {
      const direction = pick([1, -1]),
        start = Math.floor(r() * 7),
        missing = 1 + Math.floor(r() * 3);
      const letters = Array.from(
        { length: 5 },
        (_, n) => LETTERS[(start + n * direction + 14) % 7],
      );
      return {
        ...base,
        letters,
        missing,
        direction,
        answer: letters[missing],
        options: shuffle(LETTERS, r),
        source: ["P-039"],
      };
    }
    if (id === "ocean") {
      const n = Math.floor(r() * 7);
      return {
        ...base,
        letter: LETTERS[n],
        answer: SOLFEGE[n],
        options: shuffle(SOLFEGE, r),
        source: ["P-048"],
      };
    }
    if (id === "builder") {
      if (i % 2) {
        const chord = pick([
          { name: "C 大三和弦", keys: [0, 2, 4] },
          { name: "D 小三和弦", keys: [1, 3, 5] },
          { name: "E 小三和弦", keys: [2, 4, 6] },
          { name: "F 大三和弦", keys: [3, 5, 7] },
        ]);
        return { ...base, ...chord, source: ["P-098"] };
      }
      const degree = pick(level === "starter" ? [2, 3] : [2, 3, 4, 5]),
        root = Math.floor(r() * (9 - degree));
      return {
        ...base,
        name: `从 ${LETTERS[root % 7]}${root === 7 ? "5" : "4"} 向上搭出${["", "", "二", "三", "四", "五"][degree]}度（只计算度数）`,
        keys: [root, root + degree - 1],
        source: ["P-080"],
      };
    }
    if (id === "dice")
      return {
        ...base,
        grid: Array.from({ length: 16 }, () =>
          Math.floor(r() * PATTERNS.length),
        ),
        source: ["R-041"],
      };
    if (id === "bingo") {
      const tokens = Array.from({ length: 9 }, (_, n) => ({
        letter: LETTERS[n % 7],
        octave: n > 6 ? 5 : 4,
      }));
      return {
        ...base,
        board: shuffle(tokens, r),
        calls: shuffle(tokens, r),
        source: ["O-025"],
      };
    }
    throw Error("Unknown game");
  });
}
export function validAnswer(q, answer) {
  if (q.kind === "shop")
    return (
      Array.isArray(answer) &&
      answer.length > 0 &&
      answer.every((i) => Number.isInteger(i) && NOTES[i]) &&
      answer.reduce((sum, i) => sum + NOTES[i].beats, 0) === q.target
    );
  if (q.kind === "builder")
    return (
      Array.isArray(answer) &&
      answer.length === q.keys.length &&
      new Set(answer).size === answer.length &&
      q.keys.every((k) => answer.includes(k))
    );
  if (["detective", "ocean"].includes(q.kind))
    return typeof answer === "string" && answer === q.answer;
  return false;
}
export function hasBingo(marked) {
  return [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ].some((line) => line.every((i) => marked.includes(i)));
}
export function recordAttempt(record, answer, correct) {
  return {
    ...record,
    attempts: (record.attempts || 0) + 1,
    firstAnswer: record.attempts ? record.firstAnswer : structuredClone(answer),
    firstCorrect: record.attempts ? record.firstCorrect : correct,
    completed: correct,
  };
}
