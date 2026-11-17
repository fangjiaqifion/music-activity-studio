// Positions count consecutive staff lines/spaces, bottom line = 0.
export const TYPES = [
  { id: 'step', zh: '级进', en: 'Step', example: 1, hint: '走到相邻的线或间' },
  { id: 'skip', zh: '跳进', en: 'Skip', example: 2, hint: '中间隔一个音' },
  { id: 'leap', zh: '远跳', en: 'Leap', example: 4, hint: '中间隔两个或更多音' },
  { id: 'repeat', zh: '重复', en: 'Repeat', example: 0, hint: '两个音一样高' },
];
export function classify(a, b) {
  const d = Math.abs(b - a);
  return d === 0 ? 'repeat' : d === 1 ? 'step' : d === 2 ? 'skip' : 'leap';
}
export function makePage(serial = 0, random = Math.random) {
  const pools = TYPES.map(t => {
    const pairs = [];
    for (let a = 0; a < 9; a++)
      for (let b = 0; b < 9; b++)
        if (classify(a,b) === t.id) pairs.push({a,b});
    return pairs;
  });
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i+1));
      [items[i],items[j]] = [items[j],items[i]];
    }
    return items;
  }
  // Exactly three of each type. Non-repeats include both directions.
  const page = pools.flatMap((pool, type) => {
    shuffle(pool);
    if (TYPES[type].id === 'repeat') return pool.slice(0,3);
    const up = pool.filter(q=>q.b>q.a), down = pool.filter(q=>q.b<q.a);
    return (serial % 2 ? [down[0],up[0],down[1]] : [up[0],down[0],up[1]]);
  });
  return shuffle(page);
}
export function scorePage(page, answers) {
  let blank=0, errors=0;
  page.forEach((q,i)=>{if(!answers[i])blank++;else if(answers[i]!==classify(q.a,q.b))errors++;});
  return {blank,errors};
}
