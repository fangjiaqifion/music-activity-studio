export const pitches = ["G3", "A3", "B3", "C4", "D4", "E4", "F4"];
export const letters = ["C", "D", "E", "F", "G", "A", "B"];
export const staffGeometry = Object.freeze({
  spacing: 90,
  top: 120,
  houseHeight: 54,
  houseWidth: 74,
});
export function layoutGeometry(width, height) {
  const spacing = (height - 16) / 11.8,
    top = 1.5 * spacing,
    left = Math.max(90, 20 + 3.6 * spacing);
  return { width, height, spacing, top, left, step: (width - left - 26) / 6 };
}
export function neighborPrompt(question) {
  return `我是 ${pitches[question.home][0]} 音，住在我${question.delta > 0 ? "上" : "下"}${["", "一", "两", "三"][Math.abs(question.delta)]}层的音是谁？`;
}
export function houseCenter(
  index,
  layout = { spacing: 90, top: 120, left: 310, step: 135 },
) {
  return {
    x: layout.left + index * layout.step,
    y: layout.top + (6.5 - index * 0.5) * layout.spacing,
  };
}
export function neighborQuestions() {
  return pitches.flatMap((_, home) =>
    [-3, -2, -1, 1, 2, 3]
      .filter((delta) => home + delta >= 0 && home + delta < 7)
      .map((delta) => ({
        home,
        delta,
        target: home + delta,
        answer: pitches[home + delta][0],
      })),
  );
}
export function makeQuestions(random = Math.random) {
  const pool = neighborQuestions();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Include each direction/distance in every six-question round.
  return [-1, 1, -2, 2, -3, 3].map((delta) =>
    pool.find((q) => q.delta === delta),
  );
}
