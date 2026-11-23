// Source P-004 pairs, arranged in a fixed reading order rather than random positions.
export const pairs = ['A-B','E-F','E-F','B-C','C-D','G-A','D-E','G-A','B-C','D-E','F-G','E-F'];
export const answer = pair => pair === 'E-F' || pair === 'B-C' ? 'red' : 'blue';
