import assert from "node:assert/strict";
import test from "node:test";
import { FINISH, POSITIONS, raceResult, rollMove } from "../src/staff_race_core.mjs";

test("staff and ledger positions alternate from lower ledger line three", () => {
  assert.deepEqual(POSITIONS, [
    "下加三线", "下加三间", "下加二线", "下加二间", "下加一线", "下加一间",
    "第一线", "第一间", "第二线", "第二间", "第三线", "第三间", "第四线",
    "第四间", "第五线", "上加一间",
  ]);
});

test("dice reach every legal destination without crossing the start or finish", () => {
  for (let position = 0; position < FINISH; position++) {
    const rolled = new Set();
    for (const direction of [0, 0.99]) {
      for (const distance of [0, 0.25, 0.5, 0.75, 0.99]) {
        const samples = position === 0 ? [distance] : [direction, distance];
        const move = rollMove(position, () => samples.shift());
        assert.equal(move.remaining, move.distance);
        rolled.add(move.direction * move.distance);
      }
    }
    const expected = [];
    for (let delta = -4; delta <= 4; delta++) {
      if (delta && position + delta >= 0 && position + delta <= FINISH) expected.push(delta);
    }
    assert.deepEqual([...rolled].sort((a, b) => a - b), expected);
  }
});

test("first arrival wins immediately; round ten compares height and allows ties", () => {
  assert.equal(raceResult([15, 12], 4), 0);
  assert.equal(raceResult([12, 15], 9), 1);
  assert.equal(raceResult([14, 12], 9), null);
  assert.equal(raceResult([14, 12], 10), 0);
  assert.equal(raceResult([12, 13], 10), 1);
  assert.equal(raceResult([14, 14], 10), "tie");
});
