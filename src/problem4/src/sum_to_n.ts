/**
 * Three unique implementations of `sum_to_n`.
 *
 * Contract
 * --------
 *   Input : n — any integer (positive, zero, or negative).
 *   Output: the summation from 1..n when n > 0, 0 when n === 0,
 *           and the mirrored negative sum (-1 + -2 + ... + n) when n < 0.
 *
 *   Examples:
 *     sum_to_n( 5) ===  1 + 2 + 3 + 4 + 5   ===  15
 *     sum_to_n( 0) === 0
 *     sum_to_n(-5) === -1 + -2 + -3 + -4 + -5 === -15
 *
 *   The caller guarantees the result stays within Number.MAX_SAFE_INTEGER.
 */

/**
 * Implementation A — iterative loop.
 *
 * Walks every integer from 1 to |n| and accumulates the total, flipping the
 * sign at the end when n is negative.
 *
 * Time : O(n) — one addition per integer.
 * Space: O(1) — a single accumulator.
 *
 * Straightforward and branch-free inside the loop; a reliable baseline.
 */
export function sum_to_n_a(n: number): number {
  const limit = Math.abs(n);
  let total = 0;
  for (let i = 1; i <= limit; i++) {
    total += i;
  }
  return n < 0 ? -total : total;
}

/**
 * Implementation B — closed-form arithmetic series (Gauss's formula).
 *
 * Uses the identity  1 + 2 + ... + k = k * (k + 1) / 2.
 *
 * Time : O(1) — a constant number of arithmetic operations.
 * Space: O(1).
 *
 * The most efficient of the three and the right choice in practice. The sign
 * handling mirrors implementation A so behaviour is identical for every n.
 */
export function sum_to_n_b(n: number): number {
  const k = Math.abs(n);
  const total = (k * (k + 1)) / 2;
  return n < 0 ? -total : total;
}

/**
 * Implementation C — tail-style recursion.
 *
 * Recurses from |n| down to 0, carrying the running total as an accumulator.
 * The sign is applied once at the boundary.
 *
 * Time : O(n) — one call per integer.
 * Space: O(n) — every call consumes a stack frame. JavaScript engines do not
 *        reliably perform tail-call optimisation, so large |n| can blow the
 *        call stack (~10k frames on V8). For that reason this variant is kept
 *        as an illustrative alternative rather than a production choice.
 */
export function sum_to_n_c(n: number): number {
  const limit = Math.abs(n);
  const total = recur(limit, 0);
  return n < 0 ? -total : total;
}

function recur(i: number, acc: number): number {
  if (i === 0) return acc;
  return recur(i - 1, acc + i);
}
