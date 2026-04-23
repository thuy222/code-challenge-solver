import { strict as assert } from "node:assert";
import { test } from "node:test";
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum_to_n.ts";

const implementations = [
  ["sum_to_n_a", sum_to_n_a],
  ["sum_to_n_b", sum_to_n_b],
  ["sum_to_n_c", sum_to_n_c],
] as const;

const cases: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [2, 3],
  [5, 15],
  [10, 55],
  [100, 5050],
  [1000, 500500],
  [-1, -1],
  [-5, -15],
  [-10, -55],
];

for (const [name, fn] of implementations) {
  for (const [input, expected] of cases) {
    test(`${name}(${input}) === ${expected}`, () => {
      assert.equal(fn(input), expected);
    });
  }
}

test("all three implementations agree across a range", () => {
  for (let n = -50; n <= 50; n++) {
    const a = sum_to_n_a(n);
    const b = sum_to_n_b(n);
    const c = sum_to_n_c(n);
    assert.equal(a, b, `mismatch at n=${n}: a=${a}, b=${b}`);
    assert.equal(b, c, `mismatch at n=${n}: b=${b}, c=${c}`);
  }
});
