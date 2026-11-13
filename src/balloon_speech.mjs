export const instructions = "请用红色涂间音气球。请用蓝色涂线音气球。完成后，请点打勾按钮。";
export function createSpeech(synth, Utterance, onUnavailable = () => {}) {
  let pending = null;
  function stop() { pending = null; try { synth?.cancel(); } catch {} }
  function speak(text) {
    stop();
    if (!synth || !Utterance) { onUnavailable(); return; }
    try {
      const utterance = new Utterance(text);
      utterance.lang = "zh-CN"; utterance.rate = .85;
      const voice = synth.getVoices().find(v=>/^zh[-_]CN/i.test(v.lang))
        || synth.getVoices().find(v=>/^zh/i.test(v.lang));
      if (voice) utterance.voice = voice;
      pending = utterance;
      utterance.onerror = () => { if(pending === utterance) onUnavailable(); };
      synth.speak(utterance);
    } catch { onUnavailable(); }
  }
  return {speak,stop};
}
