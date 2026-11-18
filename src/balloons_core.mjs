// Staff positions 0,2,4,6,8 are lines; odd positions are spaces.
export function makePage(random = Math.random, previous = "") {
  let positions;
  do {
    positions = Array.from({ length: 9 }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  } while (positions.join(",") === previous);
  return positions.map((position, i) => ({ position, shape: ["round","heart","bunny","star"][i % 4] }));
}
export const answer = position => position % 2 ? "red" : "blue";
