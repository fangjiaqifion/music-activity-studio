import { createRetryHints } from './retry_hints.mjs';
import { createSpeech } from './balloon_speech.mjs';
import { readProfiles, saveProfiles, dateLabel } from './balloon_profiles.mjs';
import { contour, leafChoices, leafMatches, leafQuestions, stairQuestions } from './pitch_direction_core.mjs';

import { LETTERS, SOLFEGE } from './core.mjs';

const params = new URLSearchParams(location.search);
const stairs = params.get('exercise') === 'stairs';
const useSolfege = stairs && params.get('notation') === 'solfege';
const formatNotes = notes => [...notes].map(letter =>
  useSolfege ? SOLFEGE[LETTERS.indexOf(letter)].toLowerCase() : letter);
const questions = stairs ? stairQuestions : leafQuestions;
const directionLabels = { up: '上行', down: '下行' };

if (stairs) {
  const title = useSolfege ? '唱名版上行还是下行' : '上行还是下行';
  const subtitle = useSolfege ? 'Up or down the stairs with solfège' : 'Up or down the stairs';
  document.title = title + ' · ' + subtitle;
  document.querySelector('header span').textContent = 'P-011 · 电子练习';
  document.querySelector('h1').textContent = title;
  document.querySelector('.subtitle').textContent = subtitle;
  document.querySelector('.instructions p').textContent = useSolfege ? '从左到右读三个唱名，选上行或下行的台阶。' : '从左到右读三个音名，选上行或下行的台阶。';
  document.querySelector('.instructions p[lang=en]').textContent = useSolfege
    ? 'Read the three solfège syllables from left to right. Pick the stairs that go up or down.'
    : 'Read the three note names from left to right. Pick the stairs that go up or down.';
}

const retryHints = createRetryHints();
const board = document.querySelector('#activity-board');
const feedback = document.querySelector('#feedback');
const celebration = document.querySelector('#celebration');
const speech = createSpeech(window.speechSynthesis, window.SpeechSynthesisUtterance, () => {
  document.querySelector('#speech-status').textContent = '当前语音不可用，请看文字提示。';
});

function stopCelebration() {
  celebration.hidden = true;
}

function stop() {
  speech.stop();
  stopCelebration();
}
window.addEventListener('pagehide',stop);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
});
window.addEventListener('beforeprint',stop);
document.querySelector('#speak').onclick = () => speech.speak(document.querySelector('.instructions p').textContent);
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

const example = document.querySelector('#direction-example');
example.textContent = stairs
  ? '例：' + formatNotes('CDE').join(' → ') + ' 选上行台阶。'
  : '例：C → D → C，先上一步，再下一步。';

const make = (tag, className, value = '') => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = value;
  return element;
};

function picture(name) {
  const image = new Image();
  image.src = `assets/direction_${name}.png`;
  image.alt = '';
  return image;
}

function leaves({ heights, art }) {
  const group = make('span', 'leaf-contour');
  group.setAttribute('aria-hidden', 'true');
  heights.forEach(height => {
    const image = picture(art);
    image.style.setProperty('--height', height);
    group.append(image);
  });
  return group;
}

example.append(stairs ? picture('up') : leaves({ heights: [0, 1, 0], art: 'round' }));

const directions = { 1: '上一步', 0: '保持不动', '-1': '下一步' };
const describe = steps => steps.map(step => directions[step]).join('，');
const rows = [];
const options = [];
let answers = questions.map(() => null);
let selected = null;

board.classList.add(stairs ? 'stair-grid' : 'leaf-board');

questions.forEach((notes, index) => {
  const row = make('div', stairs ? 'stair-question' : 'leaf-question');
  const caption = make('strong', 'direction-notes', formatNotes(notes).join(' '));
  const controls = make('div', 'direction-controls');
  const buttons = [];

  if (stairs) {
    Object.entries(directionLabels).forEach(([value, name]) => {
      const button = make('button', 'stair-choice', name);
      button.prepend(picture(value));
      button.setAttribute('aria-label', `第 ${index + 1} 题 ${formatNotes(notes).join(useSolfege ? ' ' : '')}：${name}`);
      button.onclick = () => {
        answers[index] = value;
        edited();
      };
      controls.append(button);
      buttons.push({ button, value });
    });
  } else {
    const match = make('button', 'leaf-match leaf-dot');
    const clear = make('button', 'leaf-clear', '×');
    clear.setAttribute('aria-label', `清除第 ${index + 1} 题的连线`);
    match.onclick = () => pickEndpoint('notes', index);
    clear.onclick = () => {
      answers[index] = null;
      edited();
      match.focus();
    };
    controls.append(caption, match, clear);
    buttons.push({ button: match, clear });
  }

  row.append(...(stairs ? [caption, controls] : [controls]));
  rows.push({ row, caption, buttons });
  if (!stairs) {
    const choice = leafChoices[index];
    const group = make('div', 'leaf-option');
    const button = make('button', 'leaf-choice leaf-dot');
    const label = contourLabel(choice);
    button.setAttribute('aria-label', `树叶组 ${index + 1}：${label}`);
    button.onclick = () => pickEndpoint('leaves', index);
    group.append(button, leaves(choice));
    options.push(button);
    board.append(row, group);
  } else {
    board.append(row);
  }
});

function pickEndpoint(side, index) {
  if (selected && selected.side !== side) {
    const row = side === 'notes' ? index : selected.index;
    const leaf = side === 'leaves' ? index : selected.index;
    answers = answers.map((choice, rowIndex) => {
      if (rowIndex === row) return leaf;
      return choice === leaf ? null : choice;
    });
    selected = null;
    edited();
    return;
  }

  selected = selected?.side === side && selected.index === index ? null : { side, index };
  render();
}

function contourLabel({ heights }) {
  return describe(heights.slice(1).map((value, index) => value - heights[index]));
}

const svgNamespace = 'http://www.w3.org/2000/svg';
const lines = document.createElementNS(svgNamespace, 'svg');
if (!stairs) {
  lines.classList.add('leaf-lines');
  lines.setAttribute('aria-hidden', 'true');
  board.append(lines);
  new ResizeObserver(drawLines).observe(board);
}

function drawLines() {
  const bounds = board.getBoundingClientRect();
  lines.replaceChildren();
  answers.forEach((choice, index) => {
    if (choice === null) return;
    const start = rows[index].buttons[0].button.getBoundingClientRect();
    const end = options[choice].getBoundingClientRect();
    const line = document.createElementNS(svgNamespace, 'line');
    line.setAttribute('x1', (start.left + start.right) / 2 - bounds.left);
    line.setAttribute('y1', (start.top + start.bottom) / 2 - bounds.top);
    line.setAttribute('x2', (end.left + end.right) / 2 - bounds.left);
    line.setAttribute('y2', (end.top + end.bottom) / 2 - bounds.top);
    lines.append(line);
  });
}

function render() {
  rows.forEach(({ buttons }, index) => {
    const answer = answers[index];
    if (stairs) {
      buttons.forEach(({ button, value }) => button.setAttribute('aria-pressed', answer === value));
    } else {
      const [{ button, clear }] = buttons;
      button.setAttribute('aria-pressed', selected?.side === 'notes' && selected.index === index);
      button.classList.toggle('used', answer !== null);
      button.setAttribute('aria-label', `第 ${index + 1} 题 ${questions[index]}：${answer === null ? '音名圆点' : '已连树叶组 ' + (answer + 1)}`);
      clear.style.visibility = answer === null ? 'hidden' : 'visible';
    }
  });
  options.forEach((button, index) => {
    button.setAttribute('aria-pressed', selected?.side === 'leaves' && selected.index === index);
    button.classList.toggle('used', answers.includes(index));
  });
  if (!stairs) drawLines();
  document.querySelector('#count').textContent = answers.filter(answer => answer !== null).length;
}

function edited() {
  stop();
  retryHints.clear();
  feedback.textContent = '';
  render();
}

document.querySelector('#blank-total').textContent = questions.length;
document.querySelector('#check').onclick = () => {
  stop();
  let blank = 0;
  let errors = 0;
  questions.forEach((notes, index) => {
    const answer = answers[index];
    const steps = contour(notes);
    const direction = steps[0] === 1 ? 'up' : 'down';
    const wrong = answer === null ? null : stairs
      ? answer !== direction
      : !leafMatches(notes, leafChoices[answer].heights);
    if (wrong === null) blank++;
    if (wrong) errors++;
    retryHints.check(index, wrong, rows[index].caption, stairs ? directionLabels[direction] : describe(steps));
  });
  const messages = [];
  if (blank) messages.push(`还有 ${blank} 题没有选。`);
  if (errors) messages.push(`有 ${errors} 题需要再想一想。`);
  if (!messages.length) {
    messages.push('全部答对啦！你真棒！');
    celebration.hidden = false;
  }
  feedback.textContent = messages.join('');
};
document.querySelector('#next').onclick = () => {
  retryHints.reset();
  answers = questions.map(() => null);
  selected = null;
  edited();
};
document.querySelector('#print').onclick = () => { stop(); window.print(); };
document.querySelector('#close-celebration').onclick = stopCelebration;
celebration.addEventListener('animationend', event => {
  if (event.animationName === 'parade') stopCelebration();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') stopCelebration();
});
render();
