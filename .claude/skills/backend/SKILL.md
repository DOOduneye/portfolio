---
name: backend
description: Use when changing anything under src/worker — tRPC routers, the Drizzle schema, migrations, or Cloudflare Access verification. Covers conventions and failure modes specific to this repo that generic Workers or D1 guidance does not.
---

# Worker, database and auth

For the platform itself use the `cloudflare`, `wrangler` and
`workers-best-practices` skills. This covers only what is specific here.

## The database has one source of truth

`src/worker/db/schema.ts` describes the tables. Migrations are generated from
it:

```bash
pnpm run db:generate
```

Never hand-write a file in `migrations/`. CI runs `db:generate` and fails if it
produces anything, so an edit to `schema.ts` without a generated migration will
not merge.

The baseline snapshot in `migrations/meta/` is renumbered to `0004` so generated
migrations start at `0005` and do not collide with the hand-written `0001`
through `0004`. Do not renumber it.

Two traps that already caused drift:

- `text("status", { enum: [...] })` is a TypeScript type only. Drizzle emits no
  CHECK constraint for it. If a value must be constrained in the database, that
  is a separate migration.
- Anything not declared in `schema.ts` is invisible to generation. Indexes and
  column defaults must be declared there or the snapshot describes a database
  that does not exist.

## tRPC routers

Procedures split by audience, and the split is load-bearing: `public.*` is
reachable by anyone, `admin.*` is gated. A new admin procedure must use
`protectedProcedure`, which both refuses an unauthenticated caller and writes
the mutation to `audit_log`.

Never answer a `/trpc/*` request with a hand-rolled error body. It is not a tRPC
envelope, so the client throws a parse error instead of a typed one, and the
reload-to-reauthenticate path never fires. Pass a null identity through and let
`protectedProcedure` raise `UNAUTHORIZED`.

The audit middleware reads the *raw* input, because tRPC runs middlewares before
input parsing. It drops any key named `content` so post bodies are not copied
into the log.

## Cloudflare Access

The Worker verifies the `Cf-Access-Jwt-Assertion` header itself rather than
trusting that Access was in front of it. It checks signature, issuer, audience
and expiry.

It does **not** check which email is allowed. That is the Access policy's
decision. An `ALLOWED_EMAIL` check used to exist here and locked the CMS out
when it disagreed with the policy. Do not reintroduce it.

The dev bypass matches `ENVIRONMENT === "development"` positively. Never invert
it to `!== "production"`, which fails *open* if the variable is unset or
mistyped.

Access application paths match exactly, not by prefix. `/admin` does not cover
`/admin/posts`, and `trpc/admin` does not cover `trpc/admin.posts.list`. Policies
are also per hostname, which is why `www` redirects to the apex in
`src/worker/index.ts` — two hostnames would mean every rule written twice.

## Tests

`src/worker/worker.test.ts` drives the real fetch handler against a real D1
through the Workers vitest pool. Prefer extending it over stubbing the database.
Asserting that a stubbed `insert()` was called proves the call happened, not
that a row landed.

`waitOnExecutionContext` is what makes an audit assertion real, since the write
is handed to `waitUntil`.
