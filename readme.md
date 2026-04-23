# Code Challenge #1

Problem statements live in [`src/problems.md`](src/problems.md). Each solved
problem has its own folder under `src/` with a dedicated README.

## Status

| # | Title                              | Status   | Folder                                |
| - | ---------------------------------- | -------- | ------------------------------------- |
| 4 | Three ways to sum to `n`           | ✅ Solved | [`src/problem4`](src/problem4)        |
| 5 | A crude server (user management)   | ✅ Solved | [`src/problem5`](src/problem5)        |
| 6 | Architecture (live scoreboard)     | ✅ Solved | [`src/problem6`](src/problem6)        |

## Quick pointers

- **Problem 4** — three TypeScript implementations of `sum_to_n(n)` (iterative,
  closed-form, recursive) with tests. See
  [`src/problem4/README.md`](src/problem4/README.md).
- **Problem 5** — Express + TypeScript + Sequelize + Postgres CRUD API, module
  layout, runs via `docker compose up`. See
  [`src/problem5/README.md`](src/problem5/README.md).
- **Problem 6** — architecture spec for a live-scoreboard module: data model,
  API contract, single-use action-token scheme, SSE + Pub/Sub live updates,
  threat model, Mermaid flow diagrams, and a list of v2 improvements. See
  [`src/problem6/README.md`](src/problem6/README.md).
