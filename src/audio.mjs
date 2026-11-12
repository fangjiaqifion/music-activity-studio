// One owner for scheduled audio; navigation always cancels the previous activity.
export function createAudio(){let ctx,generation=0;const nodes=new Set();
 const stop=()=>{generation++;if('speechSynthesis'in window)window.speechSynthesis.cancel();for(const n of nodes){try{n.stop();}catch{}}nodes.clear();};
 async function play(events){stop();const token=generation;ctx??=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume();if(token!==generation)return;const origin=ctx.currentTime+.04;
 for(const {at=0,duration=.35,midi=72} of events){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.value=440*2**((midi-69)/12);osc.connect(gain);gain.connect(ctx.destination);const t=origin+at;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.13,t+.012);gain.gain.exponentialRampToValueAtTime(.001,t+duration);osc.start(t);osc.stop(t+duration+.03);nodes.add(osc);osc.onended=()=>{nodes.delete(osc);osc.disconnect();gain.disconnect();};}}
 return {play,stop};}
