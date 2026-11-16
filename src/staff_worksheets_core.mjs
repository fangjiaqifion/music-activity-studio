const shuffle=(values,random)=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
export function makeStaffPage(kind,random=Math.random){
 const positions=shuffle([0,1,2,3,4,5,6,7,8],random);
 if(kind==='ladybirds')return [...positions,...shuffle([1,3,5,7],random).slice(0,3)].map(position=>({type:'place',position,expected:String(position)}));
 if (['treble','bass','alto'].includes(kind)) return makeRelativePage(kind);
 const pairs=shuffle(['up','down','same','up','down','same','up','down','same','up','down','same'],random).map(direction=>{let a=Math.floor(random()*9),b=a;if(direction==='up'){a=Math.floor(random()*8);b=a+1+Math.floor(random()*(8-a));}if(direction==='down'){a=1+Math.floor(random()*8);b=Math.floor(random()*a);}return {type:'direction',a,b,expected:direction};});
 return pairs;
}
export function scoreStaffPage(items,answers){return {blank:items.filter((_,i)=>answers[i]==null).length,errors:items.filter((q,i)=>answers[i]!=null&&answers[i]!==q.expected).length};}

export function relativeLetter(letter, steps) {const letters='ABCDEFG';return letters[((letters.indexOf(letter)+steps)%7+7)%7];}

// A fixed permutation partitions 36 distinct clef/target pairs into four daily sets.
export function makeRelativePage(kind, day = Math.floor((Date.now()+8*3600000)/86400000), round = 0) {
 const letter = {treble:'G',bass:'F',alto:'C'}[kind];
 if (!letter) throw new RangeError('Unknown clef');
 const pool = [0,2,4,6].flatMap(clefPosition => Array.from({length:9},(_,position)=>({type:'clef-name',clef:kind,clefPosition,position,expected:relativeLetter(letter,position-clefPosition)})));
 let seed=9137;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const ordered=shuffle(pool,random);
 const start=((day+round)%4+4)%4*9;
 return ordered.slice(start,start+9);
}

export function makeTreblePage(day, round = 0) { return makeRelativePage('treble', day, round); }
