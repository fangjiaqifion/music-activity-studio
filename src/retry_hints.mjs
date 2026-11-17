// Session-only assistance. Blank submissions never consume an attempt.
export function createRetryState() {
  const failures = new Map();
  return {
    check(key, wrong) {
      if (wrong === null) return 0;
      if (!wrong) { failures.delete(key); return 0; }
      const count = (failures.get(key) || 0) + 1;
      failures.set(key, count);
      return count;
    },
    reset() { failures.clear(); },
  };
}
export function createRetryHints() {
  const state = createRetryState(), cues = new Map();
  function clear() {
    for (const { node, label } of cues.values()) { node.remove(); label?.remove(); }
    document.querySelector(".retry-answers")?.remove();
    cues.clear();
  }
  function position() {
    for (const [key, cue] of cues) {
      if (!cue.targets.every(t => t.isConnected)) { cue.node.remove(); cue.label?.remove(); cues.delete(key); continue; }
      const rects = cue.targets.map(t=>t.getBoundingClientRect());
      const left = Math.min(...rects.map(r=>r.left))-8, top = Math.min(...rects.map(r=>r.top))-8;
      const r = {left, top, width:Math.max(...rects.map(r=>r.right))-left+8, height:Math.max(...rects.map(r=>r.bottom))-top+8};
      cue.node.style.left = `${r.left}px`;
      cue.node.style.top = `${r.top}px`;
      cue.node.style.width = `${r.width}px`;
      cue.node.style.height = `${r.height}px`;

    }
  }
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
  window.addEventListener('pagehide', clear);
  window.addEventListener('beforeprint', clear);
  return {
    clear,
    reset() { clear(); state.reset(); },
    check(key, wrong, target, answer) {
      cues.get(key)?.node.remove(); cues.get(key)?.label?.remove(); cues.delete(key);
      const previousAnswers = document.querySelector('.retry-answers');
      if (previousAnswers && !previousAnswers.childElementCount) previousAnswers.remove();
      const count = state.check(key, wrong);
      if (count < 3 || !target) return count;
      const node = document.createElement('div');
      node.className = 'retry-hint';
      node.dataset.retryKey = key;
      node.style.cssText = 'position:fixed;pointer-events:none;z-index:1000;box-sizing:border-box;';
      node.innerHTML = '<svg width="100%" height="100%" style="overflow:visible" aria-label="请再观察圈出的位置"><ellipse cx="50%" cy="50%" rx="49%" ry="48%" fill="none" stroke="#d32030" stroke-width="3"/></svg>';
      let label;
      if (count >= 6) {
        label = document.createElement('span');
        label.className = 'retry-answer';
        label.setAttribute('role', 'status');
        label.textContent = `${typeof key === 'number' ? '第 '+(key+1)+' 题' : ''}正确答案：${answer}`;
        label.style.cssText = 'display:inline-block;max-width:100%;box-sizing:border-box;background:#fffdf4;color:#a41022;border:2px solid #d32030;border-radius:6px;padding:3px 6px;font-size:16px;line-height:1.4;overflow-wrap:anywhere;';
        let answers = document.querySelector('.retry-answers');
        if (!answers) {
          answers = document.createElement('div');
          answers.className = 'retry-answers';
          answers.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;';
          document.querySelector('#feedback, .feedback').after(answers);
        }
        answers.append(label);
      }
      document.body.append(node); cues.set(key, {node, label, targets:Array.isArray(target) ? target : [target]}); position();
      return count;
    },
  };
}
