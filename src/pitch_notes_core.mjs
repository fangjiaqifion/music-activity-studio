// Diatonic index: C0 = 0. Scientific pitch labels remove source octave ambiguity.
const letters = 'CDEFGAB';
export const pitchLabel = n => letters[((n % 7) + 7) % 7] + Math.floor(n / 7);
export const keyGroup = n => n % 7 < 3 ? '2' : '3';
export const staffPosition = q => q.pitch - (q.clef === 'treble' ? 30 : 18); // E4 / G2
export const fishLabel = n => {
  const octave = Math.floor(n / 7), letter = letters[n % 7];
  return octave < 3 ? letter : letter.toLowerCase() + (octave === 3 ? '' : ['','','','','¹','²'][octave]);
};
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function makePage(kind, serial = 0, random = Math.random) {
  if (kind === 'fish-notes') {
    // The source's ten staves contain nine distinct pitches; C4 occurs in both clefs.
    const notes = [[26,'bass'],[28,serial % 2 ? 'treble':'bass'],[33,'treble'],[27,'bass'],[39,'treble'],[17,'bass'],[35,'treble'],[21,'bass'],[29,'treble']];
    return shuffle(notes, random).map(([pitch,clef]) => ({pitch,clef}));
  }
  const order = shuffle([0,1,2,3,4,5,6], random);
  return shuffle([...order,...order.slice(0,2)].map((letter,i) => {
    const clef = (i + serial) % 2 ? 'bass' : 'treble';
    return {pitch:(clef==='bass'?21:28)+letter,clef};
  }),random);
}

export function makeFishBank(page, random=Math.random) {
 const pitches=page.map(q=>q.pitch),bank=shuffle(pitches,random);
 if(bank.every((pitch,i)=>pitch===pitches[i]))bank.push(bank.shift());
 return bank;
}
export function assignFish(answers,index,pitch) {
 return answers.map((a,i)=>i===index?{pitch}:a.pitch===pitch?{}:a);
}
