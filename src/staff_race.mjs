import { createRetryHints } from "./retry_hints.mjs";
import { FINISH, TOP, raceResult, rollMove, staffPositionName } from "./staff_race_core.mjs";

const names = ["绿音符", "紫音符"];
const staff = document.querySelector("#staff");
const roll = document.querySelector("#roll");
const die = document.querySelector("#die");
const turn = document.querySelector("#turn");
const feedback = document.querySelector("#feedback");
const direction = document.querySelector("#direction");
const distance = document.querySelector("#distance");
const scores = names.map((_, player) => document.querySelector(`#score-${player}`));
const hints = createRetryHints();
const rows = [];
const tokens = names.map((name, player) => {
  const token = document.createElement("span");
  token.className = `token ${player === 0 ? "mint" : "plum"}`;
  token.innerHTML = '<span class="stem"></span><span class="face"></span>';
  token.setAttribute("aria-hidden", "true");
  return token;
});

let players;
let active;
let starter = 1;
let move;
let result;

for (let position = TOP; position >= 0; position--) {
  const name = staffPositionName(position);
  const button = document.createElement("button");
  button.type = "button";
  button.className = position % 2 === 0 ? "row line" : "row space";
  button.dataset.position = position;
  button.innerHTML = `<span class="cell-name">${name}</span><span class="target"></span>`;
  button.addEventListener("click", (event) => place(position, event.detail === 0));
  staff.append(button);
  rows[position] = button;
}

function openRound() {
  starter = 1 - starter;
  active = starter;
  players = names.map(() => ({ position: TOP / 2, score: 0 }));
  move = null;
  result = null;
  hints.reset();
  feedback.textContent = "两枚音符都在第三线。掷骰子开始！";
  render();
}

function render() {
  const finished = result !== null;
  staff.classList.toggle("moving", Boolean(move));
  die.hidden = !move;
  roll.setAttribute("aria-disabled", String(finished || Boolean(move)));
  turn.textContent = finished
    ? (result === "tie" ? "平局！" : `${names[result]}赢了！`)
    : `轮到${names[active]}`;
  if (move) {
    direction.textContent = move.direction > 0 ? "↑ 向上" : "↓ 向下";
    distance.textContent = `${move.distance} 步`;
  }
  for (const [index, player] of players.entries()) {
    const current = !finished && index === active;
    scores[index].classList.toggle("active", current);
    tokens[index].classList.toggle("active", current);
    scores[index].querySelector("strong").textContent = `${player.score} 步`;
    scores[index].querySelector("progress").value = Math.min(FINISH, player.score);
    const row = rows[player.position];
    if (tokens[index].parentElement !== row) row.append(tokens[index]);
  }
  for (const [position, row] of rows.entries()) {
    const occupants = names.filter((_, index) => players[index].position === position);
    const label = [staffPositionName(position), ...occupants].join("，");
    row.setAttribute("aria-label", label);
    row.setAttribute("aria-disabled", String(!move));
    row.tabIndex = move ? 0 : -1;
  }
}

roll.addEventListener("click", (event) => {
  if (move || result !== null) return;
  const { position } = players[active];
  move = rollMove(position);
  render();
  feedback.textContent = `从${staffPositionName(position)}${direction.textContent.slice(2)}走 ${move.distance} 步。请点下一格。`;
  if (event.detail === 0) rows[position].focus();
});

staff.addEventListener("keydown", (event) => {
  if (!move || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
  const position = Number(event.target.dataset.position);
  if (!Number.isInteger(position)) return;
  event.preventDefault();
  const next = position + (event.key === "ArrowUp" ? 1 : -1);
  rows[next]?.focus();
});

function place(position, keyboard) {
  if (!move) return;
  const player = players[active];
  const expected = player.position + move.direction;
  if (position !== expected) {
    feedback.textContent = `从${staffPositionName(player.position)}继续${move.direction > 0 ? "向上" : "向下"}，一次只走相邻的一格。`;
    hints.check("下一步", true, rows[position].querySelector(".target"), staffPositionName(expected));
    return;
  }
  hints.reset();
  player.position = position;
  move.remaining--;
  if (move.remaining > 0) {
    feedback.textContent = `到了${staffPositionName(position)}，还要走 ${move.remaining} 步。`;
    render();
    return;
  }
  player.score += move.distance;
  move = null;
  const last = active !== starter;
  result = last ? raceResult(players.map(({ score }) => score)) : null;
  active = 1 - active;
  render();
  if (result !== null) {
    feedback.textContent = `${turn.textContent} 绿音符走了 ${players[0].score} 步，紫音符走了 ${players[1].score} 步。`;
  } else {
    feedback.textContent = `走到${staffPositionName(position)}了！${turn.textContent}掷骰子。`;
  }
  if (keyboard) document.querySelector(result === null ? "#roll" : "#reset").focus();
}

document.querySelector("#reset").addEventListener("click", openRound);
openRound();
