import test from "node:test";
import assert from "node:assert/strict";
import {
  GAMES,
  NOTES,
  PATTERNS,
  generate,
  validAnswer,
  hasBingo,
  recordAttempt,
} from "../src/core.mjs";
test("deterministic generation and valid answers across six games, two levels, 500 seeds", () => {
  for (let seed = 0; seed < 500; seed++)
    for (const level of ["starter", "challenge"])
      for (const game of GAMES) {
        const qs = generate(game.id, seed, level);
        assert.deepEqual(qs, generate(game.id, seed, level));
        assert.equal(qs.length, 6);
        for (const q of qs) {
          assert.ok(q.source.length);
          if (q.kind === "shop") {
            assert.ok(validAnswer(q, Array(q.target).fill(0)));
            assert.ok(!validAnswer(q, []));
            assert.ok(!validAnswer(q, [-1]));
            assert.ok(!validAnswer(q, [99]));
            assert.ok(!validAnswer(q, Array(q.target + 1).fill(0)));
          }
          if (q.kind === "builder") {
            assert.equal(new Set(q.keys).size, q.keys.length);
            assert.ok(q.keys.every((k) => k >= 0 && k <= 7));
            assert.ok(validAnswer(q, [...q.keys].reverse()));
            assert.ok(!validAnswer(q, [...q.keys, q.keys[0]]));
          }
          if (q.kind === "detective" || q.kind === "ocean") {
            assert.equal(q.options.filter((v) => v === q.answer).length, 1);
            assert.ok(validAnswer(q, q.answer));
            assert.ok(!validAnswer(q, "?"));
          }
          if (q.kind === "dice") {
            assert.equal(q.grid.length, 16);
            for (const p of q.grid)
              assert.equal(
                PATTERNS[p].durations.reduce((s, n) => s + n, 0),
                1,
              );
          }
          if (q.kind === "bingo") {
            assert.equal(
              new Set(q.board.map((n) => n.letter + n.octave)).size,
              9,
            );
            assert.deepEqual(
              [...q.board].sort((a, b) =>
                (a.letter + a.octave).localeCompare(b.letter + b.octave),
              ),
              [...q.calls].sort((a, b) =>
                (a.letter + a.octave).localeCompare(b.letter + b.octave),
              ),
            );
          }
        }
      }
});
test("duration combinations accept multiple answers and reject incorrect totals", () => {
  const q = { kind: "shop", target: 4 };
  for (const a of [[1, 1], [0, 0, 1], [3], [2, 0]])
    assert.ok(validAnswer(q, a));
  assert.ok(!validAnswer(q, [2, 1]));
  assert.deepEqual(
    NOTES.map((n) => n.beats),
    [1, 2, 3, 4],
  );
});
test("first attempt remains incorrect after correction including empty first submission", () => {
  let r = recordAttempt({}, [], false);
  r = recordAttempt(r, [1, 1], true);
  assert.deepEqual(r.firstAnswer, []);
  assert.equal(r.firstCorrect, false);
  assert.equal(r.attempts, 2);
  assert.equal(r.completed, true);
});
test("all eight Bingo lines and nonwinning sets", () => {
  for (const line of [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ])
    assert.ok(hasBingo(line));
  for (const a of [[], [0, 1], [0, 1, 3, 5]]) assert.ok(!hasBingo(a));
});

test("empty scalar answers survive JSON serialization after correction", () => {
  const r = recordAttempt(recordAttempt({}, null, false), "Do", true);
  assert.equal(JSON.parse(JSON.stringify(r)).firstAnswer, null);
  assert.equal(r.firstCorrect, false);
});

test("unsupported question kinds cannot validate an absent answer", () => {
  for (const kind of ["dice", "bingo", "unknown"])
    assert.equal(validAnswer({ kind }, undefined), false);
});
