// Nine internal staff positions, bottom to top. All occur once per page.
export function makePage(random = Math.random, previous = "") {
 let positions;
 do {
 positions = Array.from({length:9}, (_,i)=>i);
 for(let i=8;i>0;i--){ const j=Math.floor(random()*(i+1)); [positions[i],positions[j]]=[positions[j],positions[i]]; }
 } while(positions.join(",")===previous);
 return positions.map(position=>({position}));
}
export const answer = position => position % 2 ? "S" : "L";
