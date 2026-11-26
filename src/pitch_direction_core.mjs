import { LETTERS } from './core.mjs';

export const leafQuestions = ['CCD', 'GAB', 'EFE', 'FED', 'GGG', 'AGA', 'BAG'];
export const stairQuestions = ['DEF', 'GFE', 'BAG', 'ABC', 'FED', 'GAB', 'EFG', 'AGF', 'EDC', 'CBA', 'DCB', 'FED'];

export const leafChoices = [
  { heights: [1, 0, 1], art: 'maple' },
  { heights: [2, 1, 0], art: 'round' },
  { heights: [0, 1, 2], art: 'maple' },
  { heights: [0, 1, 0], art: 'round' },
  { heights: [2, 1, 0], art: 'maple' },
  { heights: [0, 0, 1], art: 'round' },
  { heights: [0, 0, 0], art: 'maple' },
];

export function contour(notes) {
  return Array.from(notes.slice(1), (note, index) => {
    const distance = (LETTERS.indexOf(note) - LETTERS.indexOf(notes[index]) + LETTERS.length) % LETTERS.length;
    return { 0: 0, 1: 1, 6: -1 }[distance];
  });
}

export function leafMatches(notes, heights) {
  return contour(notes).every((step, index) => step === heights[index + 1] - heights[index]);
}
