import {cowRegions} from './cow_regions.mjs';
function shuffled(values,random){const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function makeHands(random=Math.random,previous=''){const value=shuffled(['left','right'],random);if(value.join(',')===previous)value.reverse();return value;}
export function makeClefs(random=Math.random,previous=''){const value=shuffled(Array.from({length:cowRegions.length},(_,i)=>i%2?'bass':'treble'),random);if(value.join(',')===previous)value.push(value.shift());return value;}
export function expectedAnswers(kind,items){return kind==='hands'?items.flatMap(hand=>[hand,'1','2','3','4','5']):items.map(c=>c==='treble'?'black':'brown');}
export function countAnswers(kind,items,answers){const expected=expectedAnswers(kind,items);return {blank:expected.filter((_,i)=>!answers[i]).length,errors:expected.filter((a,i)=>answers[i]&&answers[i]!==a).length};}
