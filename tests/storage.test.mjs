import test from "node:test";
import assert from "node:assert/strict";
import { createHistoryStore } from "../src/storage.mjs";
function memory() {
  let raw = null;
  return { getItem: () => raw, setItem: (key, value) => (raw = value) };
}
test("successive tab saves retain both sessions and cap history at 100", () => {
  const data = memory(),
    a = createHistoryStore(() => data),
    b = createHistoryStore(() => data);
  a.append({ id: 1 });
  b.append({ id: 2 });
  assert.deepEqual(a.read(), [{ id: 1 }, { id: 2 }]);
  for (let i = 3; i <= 102; i++) a.append({ id: i });
  assert.equal(a.read().length, 100);
  assert.equal(a.read()[0].id, 3);
});
test("invalid history and denied storage are preserved and report unsaved", () => {
  let writes = 0;
  const broken = { getItem: () => "{", setItem: () => writes++ };
  assert.equal(createHistoryStore(() => broken).append({}).stored, false);
  assert.equal(writes, 0);
  const denied = createHistoryStore(() => {
    throw Error("denied");
  });
  assert.deepEqual(denied.read(), []);
  assert.equal(denied.append({}).stored, false);
  const quota = createHistoryStore(() => ({
    getItem: () => null,
    setItem: () => {
      throw Error("quota");
    },
  }));
  assert.equal(quota.append({}).stored, false);
});
