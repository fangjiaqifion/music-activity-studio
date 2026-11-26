export const START = 0;
export const FINISH = 15;
export const MAX_ROUNDS = 10;
export const POSITIONS = [
  "下加三线", "下加三间", "下加二线", "下加二间", "下加一线", "下加一间",
  "第一线", "第一间", "第二线", "第二间", "第三线", "第三间", "第四线",
  "第四间", "第五线", "上加一间",
];

export function rollMove(position, random = Math.random) {
  const direction = position === START || random() >= 0.5 ? 1 : -1;
  const room = direction === 1 ? FINISH - position : position - START;
  const distance = 1 + Math.floor(random() * Math.min(4, room));
  return { direction, distance, remaining: distance };
}

export function raceResult(positions, completedRounds) {
  const finisher = positions.indexOf(FINISH);
  if (finisher !== -1) return finisher;
  if (completedRounds < MAX_ROUNDS) return null;
  if (positions[0] === positions[1]) return "tie";
  return positions[0] > positions[1] ? 0 : 1;
}
