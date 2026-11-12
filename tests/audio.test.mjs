import test from "node:test";
import assert from "node:assert/strict";
import { createAudio } from "../src/audio.mjs";
test("navigation cancels pending playback and stops all scheduled oscillators", async () => {
  let resume,
    starts = 0,
    stops = 0,
    cancelled = 0;
  class Context {
    currentTime = 0;
    destination = {};
    resume() {
      return new Promise((r) => (resume = r));
    }
    createOscillator() {
      return {
        frequency: { value: 0 },
        connect() {},
        disconnect() {},
        start() {
          starts++;
        },
        stop() {
          stops++;
        },
      };
    }
    createGain() {
      return {
        connect() {},
        disconnect() {},
        gain: {
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
      };
    }
  }
  globalThis.window = {
    AudioContext: Context,
    speechSynthesis: {
      cancel() {
        cancelled++;
      },
    },
  };
  const audio = createAudio();
  const pending = audio.play([{ midi: 60 }]);
  audio.stop();
  resume();
  await pending;
  assert.equal(starts, 0);
  const active = audio.play([{ midi: 60 }, { midi: 64 }]);
  resume();
  await active;
  assert.equal(starts, 2);
  const scheduled = stops;
  audio.stop();
  assert.equal(stops, scheduled + 2);
  assert.ok(cancelled >= 4);
  delete globalThis.window;
});

test("speech failures and silent-voice timeouts fall back, canceled callbacks cannot affect a new view", () => {
  let utterance,
    timer,
    fallbacks = 0;
  const callbacks = new Set();
  globalThis.window = {
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
      }
    },
    speechSynthesis: {
      cancel() {},
      speak(u) {
        utterance = u;
      },
    },
    setTimeout(fn) {
      timer = fn;
      callbacks.add(fn);
      return fn;
    },
    clearTimeout(fn) {
      callbacks.delete(fn);
    },
  };
  const audio = createAudio();
  audio.speak("C4", () => fallbacks++);
  utterance.onerror();
  assert.equal(fallbacks, 1);
  assert.equal(callbacks.size, 0);
  audio.speak("D4", () => fallbacks++);
  const stale = utterance;
  audio.stop();
  stale.onerror();
  assert.equal(fallbacks, 1);
  audio.speak("E4", () => fallbacks++);
  timer();
  assert.equal(fallbacks, 2);
  utterance.onend();
  assert.equal(fallbacks, 2);
  delete globalThis.window;
});
