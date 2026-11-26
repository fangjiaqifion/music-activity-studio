export const TOP = 8;
export const FINISH = 16;

export function staffPositionName(position) {
  const numbers = "一二三四五";
  const number = numbers[Math.floor(position / 2)];
  return `第${number}${position % 2 === 0 ? "线" : "间"}`;
}

export function rollMove(position, random = Math.random) {
  const directions = [-1, 1].filter((direction) => {
    const next = position + direction;
    return next >= 0 && next <= TOP;
  });
  const direction = directions[Math.floor(random() * directions.length)];
  const room = direction === 1 ? TOP - position : position;
  const distance = 1 + Math.floor(random() * Math.min(4, room));
  return { direction, distance, remaining: distance };
}

export function raceResult(scores) {
  if (Math.max(...scores) < FINISH) return null;
  if (scores[0] === scores[1]) return "tie";
  return scores[0] > scores[1] ? 0 : 1;
}
