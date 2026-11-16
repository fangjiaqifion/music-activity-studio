// White-key positions use C=0 through B=6. Partial edge groups never count.
export function completeGroups({start,length}) {
 const result=[];
 for(let i=0;i+6<length;i++)if((start+i)%7===0)result.push([i,i+6]);
 return result;
}
export function makePage(serial=0,random=Math.random){
 const variants=[4,5,6],first=(Math.floor(random()*3)+serial)%3;
 return {paint:{start:0,length:28},rows:[0,1].map((_,i)=>({start:1+Math.floor(random()*6),length:variants[(first+i)%3]*7}))};
}
export function scorePage(page,paint,ranges,counts){
 let blank=0,errors=0;
 for(let i=0;i<page.paint.length-1;i++)if([0,1,3,4,5].includes((page.paint.start+i)%7)&&!paint.has('b'+i))blank++;
 errors += [...paint].filter(k=>k.startsWith('w')).length;
 page.rows.forEach((m,r)=>{
 const expected=completeGroups(m).map(v=>v.join(',')),actual=ranges[r].map(v=>v.join(','));
 blank+=expected.filter(v=>!actual.includes(v)).length;
 errors+=actual.filter(v=>!expected.includes(v)).length;
 if(counts[r]===null)blank++;else if(counts[r]!==expected.length)errors++;
 });return {blank,errors};
}
