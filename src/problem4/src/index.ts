import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum_to_n.ts";

const cases: number[] = [0, 1, 5, 10, 100, -5];

console.log("n".padEnd(6), "| sum_to_n_a", "| sum_to_n_b", "| sum_to_n_c");
console.log("-".repeat(48));
for (const n of cases) {
  const a = sum_to_n_a(n);
  const b = sum_to_n_b(n);
  const c = sum_to_n_c(n);
  console.log(
    String(n).padEnd(6),
    "|",
    String(a).padEnd(10),
    "|",
    String(b).padEnd(10),
    "|",
    String(c).padEnd(10),
  );
}
