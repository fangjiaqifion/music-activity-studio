const shuffle=(values,random)=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
export function makeStaffPage(kind,random=Math.random){
 const positions=shuffle([0,1,2,3,4,5,6,7,8],random);
 if(kind==='ladybirds')return [...positions,...shuffle([1,3,5,7],random).slice(0,3)].map(position=>({type:'place',position,expected:String(position)}));
 if (kind === 'treble') return RELATIVE_SOURCES.treble.flatMap((row, group) => row.positions.slice(1).map(position => ({type:'treble-name', group, position, clefPosition:[4,6,0,2][group], expected:relativeLetter('G', position-[4,6,0,2][group])})));
 if (RELATIVE_SOURCES[kind]) return RELATIVE_SOURCES[kind].flatMap((row, group) => row.positions.slice(1).map(position => ({type:'relative', group, reference:row.positions[0], letter:row.letter, position, clef:kind, expected:relativeLetter(row.letter, position-row.positions[0])})));
 const pairs=shuffle(['up','down','same','up','down','same','up','down','same','up','down','same'],random).map(direction=>{let a=Math.floor(random()*9),b=a;if(direction==='up'){a=Math.floor(random()*8);b=a+1+Math.floor(random()*(8-a));}if(direction==='down'){a=1+Math.floor(random()*8);b=Math.floor(random()*a);}return {type:'direction',a,b,expected:direction};});
 return pairs;
}
export function scoreStaffPage(items,answers){return {blank:items.filter((_,i)=>answers[i]==null).length,errors:items.filter((q,i)=>answers[i]!=null&&answers[i]!==q.expected).length};}

// Source rows preserve the supplied anchor, contour, and seven-note sequence.
export const RELATIVE_SOURCES = {
 treble: [{letter:'E',positions:[2,5,7,4,-1,2,8]},{letter:'C',positions:[2,5,7,4,-1,2,8]},{letter:'B',positions:[2,5,7,4,-1,2,8]},{letter:'G',positions:[2,5,7,4,-1,2,8]}],
 bass: [{letter:'A',positions:[8,5,1,4,-1,6,9]},{letter:'G',positions:[2,4,7,3,-1,6,8]},{letter:'C',positions:[4,5,2,8,-1,6,9]},{letter:'B',positions:[0,9,3,6,2,1,8]}],
 alto: [{letter:'A',positions:[2,5,7,4,-1,2,8]},{letter:'E',positions:[8,5,3,4,6,1,-1]},{letter:'F',positions:[7,2,8,0,9,5,3]},{letter:'D',positions:[0,8,4,9,1,3,6]}],
};
export function relativeLetter(letter, steps) {const letters='ABCDEFG';return letters[((letters.indexOf(letter)+steps)%7+7)%7];}
