# Problem 4 — Three Ways to Sum to `n`

Three TypeScript implementations of `sum_to_n(n)`.

```
sum_to_n( 5) =>  15     sum_to_n(0) =>   0
sum_to_n(-5) => -15     sum_to_n(1) =>   1
```

For `n > 0`: `1 + 2 + ... + n`. For `n < 0`: the mirrored negative sum.
Results are assumed to fit in `Number.MAX_SAFE_INTEGER`.

## Setup & run

Requires **Node ≥ 22.6** (for native TS stripping).

```bash
cd src/problem4
npm install
npm start        # runs the demo table
npm test         # runs node:test suite (31 tests)
npm run typecheck
```

## Implementations (`src/sum_to_n.ts`)

| Fn             | Technique        | Time | Space | Notes                                        |
| -------------- | ---------------- | ---- | ----- | -------------------------------------------- |
| `sum_to_n_a`   | Iterative loop   | O(n) | O(1)  | Simple baseline.                             |
| `sum_to_n_b`   | `k(k+1)/2`       | O(1) | O(1)  | Gauss's formula — production choice.         |
| `sum_to_n_c`   | Recursion        | O(n) | O(n)  | Stack-bound; risks overflow for large `|n|`. |

All three normalise on `|n|` and flip the sign at the end, so behaviour is
identical across the full integer range.

## Structure

```
src/problem4/
├── src/sum_to_n.ts       # the three implementations
├── src/sum_to_n.test.ts  # node:test suite
├── src/index.ts          # demo
├── package.json
└── tsconfig.json
```
