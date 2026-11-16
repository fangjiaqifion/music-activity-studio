// Salamander Grand Piano recordings by Alexander Holm, CC BY 3.0.
// Neighboring samples are transposed by at most two semitones using playback rate.
export const pianoNotes = Object.freeze({
  G:{pitch:'G3',midi:55,sample:'A3',base:57},
  A:{pitch:'A3',midi:57,sample:'A3',base:57},
  B:{pitch:'B3',midi:59,sample:'C4',base:60},
  C:{pitch:'C4',midi:60,sample:'C4',base:60},
  D:{pitch:'D4',midi:62,sample:'Ds4',base:63},
  E:{pitch:'E4',midi:64,sample:'Ds4',base:63},
  F:{pitch:'F4',midi:65,sample:'Fs4',base:66},
});
export function createPiano({makeContext=()=>new (window.AudioContext||window.webkitAudioContext)(),fetchFile=fetch,onUnavailable=()=>{}}={}){
  let context,generation=0;
  const buffers=new Map(),files=new Map(),active=new Set();
  // Fetch local sample bytes early; create/resume audio only during a user gesture.
  for(const name of ['A3','C4','Ds4','Fs4']){
    const promise=fetchFile(`assets/piano_${name}.mp3`).then(r=>{if(!r.ok)throw Error('Piano sample unavailable');return r.arrayBuffer();});
    promise.catch(()=>{});files.set(name,promise);
  }
  function stop(){
    generation++;
    for(const item of active){try{item.source.stop();}catch{}item.source.disconnect();item.gain.disconnect();}
    active.clear();
  }
  async function play(letter){
    if(!pianoNotes[letter])return false;
    stop();const token=generation,note=pianoNotes[letter];
    try{
      context??=makeContext();
      await context.resume();
      if(token!==generation)return false;
      if(context.state!=='running')throw Error('Piano audio is blocked');
      if(!buffers.has(note.sample))buffers.set(note.sample,files.get(note.sample).then(bytes=>context.decodeAudioData(bytes.slice(0))));
      const buffer=await buffers.get(note.sample);
      if(token!==generation)return false;
      const source=context.createBufferSource(),gain=context.createGain(),now=context.currentTime;
      source.buffer=buffer;source.playbackRate.value=2**((note.midi-note.base)/12);
      gain.gain.setValueAtTime(.72,now);gain.gain.setValueAtTime(.72,now+.7);gain.gain.exponentialRampToValueAtTime(.001,now+1.25);
      source.connect(gain);gain.connect(context.destination);
      const item={source,gain};active.add(item);
      source.onended=()=>{active.delete(item);source.disconnect();gain.disconnect();};
      source.start(now);source.stop(now+1.3);return true;
    }catch{if(token===generation)onUnavailable();return false;}
  }
  return {play,stop};
}
