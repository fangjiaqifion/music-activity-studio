import { createRetryHints } from "./retry_hints.mjs";
import { FINISH, MAX_ROUNDS, POSITIONS, START, raceResult, rollMove } from "./staff_race_core.mjs";

const characters = [
  { id: "rabbit", name: "耳朵兔", icon: "🐰" },
  { id: "cat", name: "三角猫", icon: "🐱" },
  { id: "frog", name: "圆眼蛙", icon: "🐸" },
  { id: "robot", name: "方脸机器人", icon: "🤖" },
];
const roles = ["学生", "老师 / 家长"];
const query = (selector) => document.querySelector(selector);
const staff = query("#staff");
const roll = query("#roll");
const die = query("#die");
const turn = query("#turn");
const feedback = query("#feedback");
const direction = query("#direction");
const distance = query("#distance");
const roundLabel = query("#round");
const guide = query("#guide");
const cards = roles.map((_, player) => query(`#score-${player}`));
const setup = query("#setup");
const picker = query("#characters");
const start = query("#start");
const reset = query("#reset");
const hints = createRetryHints();
const rows = [];
const tokens = roles.map((_, player) => {
  const token = document.createElement("span");
  token.className = `token lane-${player}`;
  token.innerHTML = '<span class="crest"></span><span class="face"></span>';
  token.setAttribute("aria-hidden", "true");
  return token;
});
const selected = [0, 1];
let selecting = 0;
let positions;
let active;
let starter = 1;
let completedRounds;
let move;
let result;

const options = characters.map((character, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `character ${character.id}`;
  button.innerHTML = `<span class="portrait" aria-hidden="true"><span class="crest"></span><span class="face"></span></span>${character.name}`;
  button.addEventListener("click", () => {
    if (selected[1 - selecting] === index) selected[1 - selecting] = selected[selecting];
    selected[selecting] = index;
    renderPicker();
    render();
  });
  picker.append(button);
  return button;
});

function renderPicker() {
  query("#choose-player").textContent = `为${roles[selecting]}选棋子`;
  query("#choices").textContent = `学生：${characters[selected[0]].name}　·　老师 / 家长：${characters[selected[1]].name}`;
  options.forEach((option, index) => option.setAttribute("aria-pressed", String(index === selected[selecting])));
  for (const button of setup.querySelectorAll("[data-player]")) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.player) === selecting));
  }
}

for (const button of setup.querySelectorAll("[data-player]")) {
  button.addEventListener("click", () => {
    selecting = Number(button.dataset.player);
    renderPicker();
  });
}

for (let position = FINISH; position >= START; position--) {
  const name = POSITIONS[position];
  const button = document.createElement("button");
  button.type = "button";
  button.className = position % 2 ? "row line" : "row space";
  if (position === FINISH) button.classList.add("endpoint", "finish");
  if (position === START) button.classList.add("endpoint", "start");
  button.dataset.position = position;
  const endpoint = position === FINISH ? "终点" : position === START ? "起点" : "";
  button.innerHTML = `<span class="cell-name">${name}</span><span class="target"></span><span class="endpoint-label">${endpoint}</span>`;
  button.addEventListener("click", (event) => place(position, event.detail === 0));
  staff.append(button);
  rows[position] = button;
}

const playerName = (player) => characters[selected[player]].name;

function prepare() {
  active = 1 - starter;
  positions = [START, START];
  completedRounds = 0;
  move = null;
  result = null;
  setup.hidden = false;
  selecting = 0;
  hints.reset();
  renderPicker();
  feedback.textContent = "选好角色后，按开始游戏。";
  render();
}

function render() {
  const finished = result !== null;
  staff.classList.toggle("moving", Boolean(move));
  staff.dataset.player = active;
  const guidedPosition = move && guide.checked ? positions[active] + move.direction : null;
  die.hidden = !move;
  roll.setAttribute("aria-disabled", String(!setup.hidden || finished || Boolean(move)));
  turn.textContent = finished
    ? (result === "tie" ? "平局！" : `${playerName(result)}赢了！`)
    : setup.hidden ? `轮到${playerName(active)}` : "准备出发";
  const round = Math.min(MAX_ROUNDS, completedRounds + 1);
  roundLabel.textContent = `第 ${round} / ${MAX_ROUNDS} 轮`;
  if (move) {
    direction.textContent = move.direction > 0 ? "↑ 向上" : "↓ 向下";
    distance.textContent = `${move.distance} 步`;
  }
  for (const [index, position] of positions.entries()) {
    const character = characters[selected[index]];
    const current = setup.hidden && !finished && index === active;
    cards[index].className = `score ${character.id}${current ? " active" : ""}`;
    cards[index].querySelector("span").textContent = `${character.icon} ${character.name}`;
    cards[index].querySelector("strong").textContent = POSITIONS[position];
    tokens[index].className = `token lane-${index} ${character.id}${current ? " active" : ""}`;
    const row = rows[position];
    if (tokens[index].parentElement !== row) row.append(tokens[index]);
  }
  for (const [position, row] of rows.entries()) {
    const occupants = positions.flatMap((value, index) => value === position ? [playerName(index)] : []);
    const endpoint = row.querySelector(".endpoint-label").textContent;
    row.setAttribute("aria-label", [POSITIONS[position], endpoint, ...occupants].filter(Boolean).join("，"));
    row.classList.toggle("guided", position === guidedPosition);
    row.setAttribute("aria-disabled", String(!move));
    row.tabIndex = move ? 0 : -1;
  }
}

start.addEventListener("click", () => {
  if (setup.hidden) return;
  starter = active;
  setup.hidden = true;
  feedback.textContent = "两枚棋子在下加一间。掷骰子出发！";
  render();
  roll.focus();
});

roll.addEventListener("click", (event) => {
  if (!setup.hidden || move || result !== null) return;
  const position = positions[active];
  move = rollMove(position);
  render();
  feedback.textContent = `从${POSITIONS[position]}${direction.textContent.slice(2)}走 ${move.distance} 步。请点下一格。`;
  if (event.detail === 0) rows[position].focus();
  else {
    const bounds = rows[position].getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > innerHeight) {
      rows[position].scrollIntoView({ block: "center" });
    }
  }
});

staff.addEventListener("keydown", (event) => {
  if (!move || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
  const position = Number(event.target.dataset.position);
  if (!Number.isInteger(position)) return;
  event.preventDefault();
  rows[position + (event.key === "ArrowUp" ? 1 : -1)]?.focus();
});

function place(position, keyboard) {
  if (!move) return;
  const previous = positions[active];
  const expected = previous + move.direction;
  if (position !== expected) {
    feedback.textContent = `从${POSITIONS[previous]}继续${move.direction > 0 ? "向上" : "向下"}，一次只走相邻的一格。`;
    hints.check("下一步", true, rows[position].querySelector(".target"), POSITIONS[expected]);
    return;
  }
  hints.reset();
  positions[active] = position;
  move.remaining--;
  if (move.remaining > 0) {
    feedback.textContent = `到了${POSITIONS[position]}，还要走 ${move.remaining} 步。`;
    render();
    return;
  }
  move = null;
  if (active !== starter) completedRounds++;
  result = raceResult(positions, completedRounds);
  active = 1 - active;
  render();
  if (position === FINISH) {
    feedback.textContent = `${playerName(result)}先到达上加一间！`;
  } else if (result !== null) {
    feedback.textContent = `十轮结束。学生在${POSITIONS[positions[0]]}，老师 / 家长在${POSITIONS[positions[1]]}。`;
  } else {
    feedback.textContent = `走到${POSITIONS[position]}了！${turn.textContent}掷骰子。`;
  }
  if (keyboard) (result === null ? roll : reset).focus();
}

guide.addEventListener("change", render);
reset.addEventListener("click", prepare);
prepare();
