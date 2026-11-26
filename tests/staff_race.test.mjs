import assert from "node:assert/strict";
import test from "node:test";
import { raceResult, rollMove, staffPositionName } from "../src/staff_race_core.mjs";

test("staff rows alternate lines and spaces from the lowest line", () => {
  assert.deepEqual(Array.from({ length: 9 }, (_, i) => staffPositionName(i)), [
    "第一线", "第一间", "第二线", "第二间", "第三线",
    "第三间", "第四线", "第四间", "第五线",
  ]);
});

test("both dice fields stay legal at every staff position", () => {
  for (let position = 0; position <= 8; position++) {
    const rolled = new Set();
    for (const direction of [0, 0.99]) {
      for (const distance of [0, 0.25, 0.5, 0.75, 0.99]) {
        const samples = [direction, distance];
        const move = rollMove(position, () => samples.shift());
        assert.ok(move.distance >= 1 && move.distance <= 4);
        assert.equal(move.remaining, move.distance);
        rolled.add(move.direction * move.distance);
      }
    }
    const expected = [];
    for (let delta = -4; delta <= 4; delta++) {
      if (delta && position + delta >= 0 && position + delta <= 8) expected.push(delta);
    }
    assert.deepEqual([...rolled].sort((a, b) => a - b), expected);
  }
});

test("completed rounds below the threshold continue and ties remain possible", () => {
  assert.equal(raceResult([15, 15]), null);
  assert.equal(raceResult([16, 12]), 0);
  assert.equal(raceResult([16, 17]), 1);
  assert.equal(raceResult([16, 16]), "tie");
});
