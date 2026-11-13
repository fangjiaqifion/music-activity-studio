const shuffle=(values,random)=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
export function makeStaffPage(kind,random=Math.random){
 const positions=shuffle([0,1,2,3,4,5,6,7,8],random);
 if(kind==='ladybirds')return [...positions,...shuffle([1,3,5,7],random).slice(0,3)].map(position=>({type:'place',position,expected:String(position)}));
 const numbers=positions.map(position=>({type:'number',position,expected:String(Math.floor(position/2)+1)}));
 const pairs=shuffle(['up','down','same','up','down','same','up','down','same','up','down','same'],random).map(direction=>{let a=Math.floor(random()*9),b=a;if(direction==='up'){a=Math.floor(random()*8);b=a+1+Math.floor(random()*(8-a));}if(direction==='down'){a=1+Math.floor(random()*8);b=Math.floor(random()*a);}return {type:'direction',a,b,expected:direction};});
 return [...numbers,...pairs];
}
export function scoreStaffPage(items,answers){return {blank:items.filter((_,i)=>answers[i]==null).length,errors:items.filter((q,i)=>answers[i]!=null&&answers[i]!==q.expected).length};}
