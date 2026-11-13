// Staff positions 0,2,4,6,8 are lines; odd positions are spaces.
export function makePage(random = Math.random, previous = "") {
  let positions;
  do {
    positions = Array.from({ length: 12 }, (_, i) =>
      i < 6 ? Math.floor(random() * 5) * 2 : Math.floor(random() * 4) * 2 + 1,
    );
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  } while (positions.join(",") === previous);
  return positions.map((position, i) => ({ position, shape: ["round","heart","bunny","star"][i % 4] }));
}
export const answer = position => position % 2 ? "red" : "blue";
