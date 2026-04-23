# Problem 5 — User Management API

A CRUD REST API for a `User` resource, built with **Express + TypeScript +
Sequelize + Postgres**. Runs end-to-end with a single `docker compose up`.

- Create / list (with filters + pagination) / get / update / delete users
- Module-based layout (routes → controller → service → repository → model)
- Zod validation for body, query, and path params
- Typed Sequelize model with UUID primary key
- Centralised `AppError` + consistent JSON error shape
- Helmet + CORS enabled
- Dockerised Postgres + API with healthcheck-gated startup

## Tech stack

| Layer       | Tool          |
| ----------- | ------------- |
| Runtime     | Node.js 22    |
| Language    | TypeScript 5  |
| HTTP        | Express 4     |
| ORM         | Sequelize 6   |
| DB          | Postgres 16   |
| Validation  | Zod 3         |
| TS runner   | tsx           |

## Prerequisites

- **Docker** + **Docker Compose** (for the single-command path), **or**
- **Node.js ≥ 22** + a running **Postgres ≥ 13** (for bare-metal local dev)

## Quick start — Docker

```bash
cd src/problem5
docker compose up --build
```

That boots Postgres, waits for it to pass `pg_isready`, then starts the API on
`http://localhost:3000`. Health check:

```bash
curl -s localhost:3000/health
# {"status":"ok"}
```

Stop + remove volumes (e.g. to reset the DB):

```bash
docker compose down -v
```

## Local development — without Docker

```bash
cd src/problem5
npm install
cp .env.example .env             # point DB_* at your local Postgres
npm run dev                      # watch mode (tsx)
```

A quick way to get a Postgres locally if you don't have one:

```bash
docker run -d --name pg-problem5 -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=users_db \
  postgres:16-alpine
```

### Scripts

| Script              | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `npm start`         | Run the server with `tsx`                   |
| `npm run dev`       | Watch mode — restarts on file changes       |
| `npm run typecheck` | `tsc --noEmit` — type-only check            |
| `npm run build`     | Emit JavaScript to `dist/` (optional)       |

## Configuration

All configuration is env-driven. Defaults are safe for local use; a `.env` file
is optional.

| Env var       | Default        | Notes                                             |
| ------------- | -------------- | ------------------------------------------------- |
| `NODE_ENV`    | `development`  | `development` logs SQL; also enables `sync({ alter })` |
| `PORT`        | `3000`         | HTTP port                                         |
| `DB_HOST`     | `localhost`    | Overridden to `db` inside docker compose          |
| `DB_PORT`     | `5432`         |                                                   |
| `DB_USER`     | `postgres`     |                                                   |
| `DB_PASSWORD` | `postgres`     |                                                   |
| `DB_NAME`     | `users_db`     |                                                   |
| `DB_HOST_PORT`| `5432`         | *Compose only* — host-side port for the Postgres container. Override if `5432` is already taken on your host. |

Schema management uses `sequelize.sync({ alter: true })` in development —
convenient for the single-command docker flow. For production, swap to
migrations.

## Data model

```ts
interface User {
  id: string;              // UUID v4, server-generated
  email: string;           // unique, validated as email, ≤ 255 chars
  name: string;            // 1..100 chars
  age: number | null;      // optional, 0..150
  role: "user" | "admin";  // defaults to "user"
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

## API reference

All endpoints are mounted under `/api/users`. Request/response bodies are JSON;
remember `Content-Type: application/json` on POST/PATCH.

### `POST /api/users` — create

Request:

```json
{ "email": "alice@example.com", "name": "Alice", "age": 30, "role": "user" }
```

Response `201 Created`:

```json
{
  "id": "c1a3…",
  "email": "alice@example.com",
  "name": "Alice",
  "age": 30,
  "role": "user",
  "createdAt": "2026-04-23T12:00:00.000Z",
  "updatedAt": "2026-04-23T12:00:00.000Z"
}
```

Errors: `400 VALIDATION_ERROR`, `409 EMAIL_TAKEN`.

### `GET /api/users` — list

Query params (all optional):

| Param     | Type                                                             | Default         |
| --------- | ---------------------------------------------------------------- | --------------- |
| `email`   | partial ILIKE match                                              |                 |
| `name`    | partial ILIKE match                                              |                 |
| `role`    | `user` \| `admin`                                                |                 |
| `minAge`  | integer ≥ 0                                                      |                 |
| `maxAge`  | integer ≥ 0                                                      |                 |
| `limit`   | 1..100                                                           | `20`            |
| `offset`  | ≥ 0                                                              | `0`             |
| `sort`    | one of `createdAt`, `-createdAt`, `name`, `-name`, `email`, `-email` | `-createdAt` |

Example:

```bash
curl -s 'localhost:3000/api/users?role=user&minAge=18&limit=5&sort=name'
```

Response `200`:

```json
{
  "data": [ /* User[] */ ],
  "pagination": { "total": 42, "limit": 5, "offset": 0 }
}
```

### `GET /api/users/:id` — get one

Response `200`: the `User`. Errors: `400 VALIDATION_ERROR` (non-UUID),
`404 USER_NOT_FOUND`.

### `PATCH /api/users/:id` — update

Request (any subset of the create body; at least one field required):

```json
{ "name": "Alice B.", "age": 31 }
```

Response `200`: the updated `User`. Errors: `400`, `404 USER_NOT_FOUND`,
`409 EMAIL_TAKEN`.

### `DELETE /api/users/:id` — delete

Response `204 No Content`. Errors: `400`, `404 USER_NOT_FOUND`.

### Error shape

All non-2xx responses use this envelope:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User c1a3... not found",
    "details": [ /* present only for VALIDATION_ERROR — Zod issues */ ]
  }
}
```

Codes: `VALIDATION_ERROR`, `USER_NOT_FOUND`, `EMAIL_TAKEN`, `CONFLICT`,
`NOT_FOUND`, `INTERNAL_ERROR`.

## Smoke test

```bash
# create
ID=$(curl -s -X POST localhost:3000/api/users \
  -H 'content-type: application/json' \
  -d '{"email":"a@b.com","name":"Alice","age":30}' | jq -r .id)

# list
curl -s 'localhost:3000/api/users?limit=5'

# get
curl -s "localhost:3000/api/users/$ID"

# update
curl -s -X PATCH "localhost:3000/api/users/$ID" \
  -H 'content-type: application/json' -d '{"name":"Alice B."}'

# delete
curl -i -X DELETE "localhost:3000/api/users/$ID"   # 204
```

## Project structure

```
src/problem5/
├── docker-compose.yml        # Postgres + API, health-gated startup
├── Dockerfile                # node:22-alpine, runs via tsx
├── package.json
├── tsconfig.json
├── .env.example
├── .dockerignore
└── src/
    ├── index.ts              # bootstrap: connect → sync → listen
    ├── app.ts                # express app + middleware wiring
    ├── config/index.ts       # env → typed config
    ├── db/sequelize.ts       # Sequelize instance
    ├── shared/AppError.ts    # status + code + message
    ├── middlewares/
    │   ├── errorHandler.ts   # AppError / ZodError / Sequelize → JSON
    │   └── validate.ts       # generic Zod validator for body/query/params
    └── modules/users/
        ├── users.routes.ts       # Router; DI service + controller
        ├── users.controller.ts   # req/res shaping
        ├── users.service.ts      # business logic; throws AppError
        ├── users.repository.ts   # only file touching Sequelize
        ├── dto/user.dto.ts       # Zod schemas
        └── models/user.model.ts  # Sequelize model
```

## Troubleshooting

- **API container exits with "connection refused"** — make sure you ran
  `docker compose up` (not just `docker compose start`); the healthcheck only
  runs on a fresh `up`. Check `docker compose logs db` if it persists.
- **"Port 5432 is already allocated"** — another Postgres is running on the
  host. Either stop it, or set `DB_HOST_PORT` (e.g. `DB_HOST_PORT=5435
  docker compose up`) — the API itself always talks to the `db` container on
  5432 internally, so this only affects host access.
- **Schema doesn't pick up a model change** — dev uses
  `sync({ alter: true })`, but some alterations (e.g. column type changes)
  don't back-migrate cleanly. Reset the volume: `docker compose down -v`.
- **`VALIDATION_ERROR` with no body** — the request is missing
  `Content-Type: application/json`; `express.json()` silently leaves `req.body`
  as `{}` otherwise, which then fails Zod validation.
- **`EMAIL_TAKEN` on update even though you're only renaming** — the service
  pre-checks email uniqueness across all users; if another record happens to
  have the same email, you'll see this. The DB-level unique constraint also
  enforces it.
