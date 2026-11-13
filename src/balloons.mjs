import { makePage, answer } from "./balloons_core.mjs";
let items = [], colors = [], selected = "red", signature = "", checked = false;
const board = document.querySelector("#balloons");
const feedback = document.querySelector("#feedback");
const fills = { red: "#f3a0a3", blue: "#a0c8ee" };
function render() {
  board.innerHTML = items.map((item, i) => {
    // Reuse original transparent PNGs. A flood filter colors only the opaque white
    // balloon interior while multiplying preserves the artist's black outlines.
    const offset = item.shape === 'bunny' ? 20 : 0;
    const y = 102 + offset - item.position * 5;
    return `<button class="balloon" data-index="${i}" aria-label="第 ${i+1} 个气球，${colors[i] === "red" ? "红色" : colors[i] === "blue" ? "蓝色" : "未涂色"}" data-error="${checked && colors[i] !== answer(item.position)}"><svg viewBox="0 0 150 245" aria-hidden="true"><defs><filter id="tint${i}" color-interpolation-filters="sRGB"><feFlood flood-color="${fills[colors[i]] || "#fffefb"}"/><feComposite in2="SourceAlpha" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><path d="M75 142 C110 165 38 185 76 230" fill="none" stroke="#5b625a" stroke-width="1.4"/><image href="assets/balloon_${item.shape}.png" x="9" y="6" width="132" height="148" preserveAspectRatio="none" filter="url(#tint${i})"/><g stroke="#343a36" stroke-width="1">${[62,72,82,92,102].map(y=>`<path d="M48 ${y + offset}h56"/>`).join("")}</g><ellipse cx="76" cy="${y}" rx="7.5" ry="4.7" fill="#242a25" transform="rotate(-12 76 ${y})"/></svg><span class="num">${i+1}</span>${checked ? `<span class="mark">${colors[i] === answer(item.position) ? "✓" : "再看看"}</span>` : ""}</button>`;
  }).join("");
  document.querySelector("#count").textContent = colors.filter(Boolean).length;
}
function next() {
  items = makePage(Math.random, signature);
  signature = items.map(x=>x.position).join(",");
  colors = Array(12).fill(null); checked = false;
  feedback.textContent = "慢慢观察：音符在线上，还是在两条线之间？";
  render();
}
document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => {
  selected = button.dataset.color;
  document.querySelectorAll("[data-color]").forEach(b=>b.setAttribute("aria-pressed", String(b === button)));
}));
board.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  const i = Number(button.dataset.index);
  colors[i] = selected === "erase" ? null : selected;
  checked = false; feedback.textContent = "涂好了就检查一下吧。";
  render(); board.children[i].focus({preventScroll:true});
});
document.querySelector("#check").addEventListener("click", () => {
  checked = true;
  const score = colors.filter((c,i)=>c === answer(items[i].position)).length;
  feedback.textContent = score === 12 ? "12 / 12 · 全部涂对啦！再换一张试试？" : `${score} / 12 · 涂对了！看看虚线圈出的气球，线上蓝色，间里红色。`;
  render();
});
document.querySelector("#next").addEventListener("click", next);
document.querySelector("#print").addEventListener("click", () => window.print());
next();
