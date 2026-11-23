export const letters=['A','B','C','D','E','F','G'];
function shuffle(items,random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function makePage(matching,random=Math.random){
 const notes=matching?shuffle(letters,random):[...shuffle(letters,random),...shuffle(letters,random),letters[Math.floor(random()*7)]];
 return notes.map(note=>({note,group:matching?('CDE'.includes(note)?'short':'long'):'full'}));
}
// A fish has only one destination. Replacing a match releases the previous fish.
export function assignMatch(answers,index,note){return answers.map((value,i)=>i===index?note:note&&value===note?null:value);}
