export const letters = 'ABCDEFG';

export function sequence(start) {
  const first = letters.indexOf(start);
  return Array.from({length: 3}, (_, offset) => letters[(first + offset) % letters.length]);
}

// Source triples, grouped by creature and ordered from top to bottom within each kind.
export const species = [
  {id: 'seahorse', name: '海马', exercises: [
    {start: 'A', blanks: [0, 2]},
    {start: 'F', blanks: [1]},
    {start: 'F', blanks: [2]},
    {start: 'A', blanks: [1]},
  ]},
  {id: 'round', name: '圆身鱼', exercises: [
    {start: 'G', blanks: [1]},
    {start: 'C', blanks: [1]},
    {start: 'D', blanks: [0, 2]},
  ]},
  {id: 'angled', name: '尖鳍鱼', exercises: [
    {start: 'A', blanks: [1]},
    {start: 'B', blanks: [1]},
    {start: 'E', blanks: [1]},
  ]},
];
