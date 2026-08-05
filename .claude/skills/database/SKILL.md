---
name: database
description: Read before touching src/worker/db/schema.ts or migrations/. This repo runs Drizzle on Cloudflare D1, where the vendored drizzle and drizzle-migrations skills give advice that will break things. This overrides them.
---

# Database

The vendored `drizzle` and `drizzle-migrations` skills never mention D1, wrangler
or Cloudflare. Where they disagree with this file, this file wins.

## Never push

```bash
pnpm run db:generate        # generate SQL from schema.ts
pnpm run db:migrate:local   # apply to local D1
pnpm run db:migrate         # apply to production D1
```

`drizzle-kit push` writes the schema straight to the database. It skips the
migration file, so the repo can no longer reproduce production, and it skips
wrangler's `d1_migrations` bookkeeping, so the next `migrations apply` disagrees
about what has run. Never run it. There is no `db:push` script and there should
not be one.

`drizzle-kit migrate` is Drizzle's own runner. Wrangler is the runner here.
Using both double-tracks the same migrations.

## Changing the schema

Edit `src/worker/db/schema.ts`, then generate. Never write a file in
`migrations/` by hand.

```bash
# Correct
vim src/worker/db/schema.ts
pnpm run db:generate
pnpm run db:migrate:local

# Wrong — CI fails, and the snapshot no longer matches the database
vim migrations/0005_add_column.sql
```

CI runs `db:generate` and fails if it produces anything, so a schema change
without its generated migration cannot merge.

## The snapshot baseline is pinned

`migrations/meta/` holds one snapshot, `0004_snapshot.json`, with the journal
entry renumbered to `idx: 4`. That is deliberate: migrations `0001` through
`0004` were hand-written before Drizzle owned the schema, and the baseline is
numbered to sit after them so generated files start at `0005` instead of
colliding. Do not renumber it, and do not delete it — without it, generate
treats the database as empty and emits `CREATE TABLE` for tables that exist.

## Two things Drizzle will not tell you

`text("status", { enum: ["draft", "published"] })` is a TypeScript type only. It
emits no CHECK constraint. If a value must be constrained in the database that
is separate SQL, and note that SQLite cannot add or drop a constraint in place —
it needs a table rebuild, as `0004` does.

Anything not declared in `schema.ts` is invisible to generation. Indexes and
column defaults must be declared there:

```ts
// Correct — the index exists in the snapshot, so it survives
export const auditLog = sqliteTable("audit_log", { ... }, (table) => [
  index("idx_audit_log_actor_time").on(table.actorEmail, table.createdAt),
]);

// Wrong — the index exists in the database but not the snapshot, and a future
// generated migration is diffed against a schema that does not match reality
```

Production had timestamp defaults and two audit indexes that `schema.ts` did not
declare. That drift is why the baseline had to be reconciled against a schema
dump rather than trusted.

## Verifying a migration

Rebuilding local D1 from nothing and diffing against production is the only real
check that the repo reproduces the database:

```bash
pnpm run db:migrate:local
pnpm exec wrangler d1 execute DB --local  --command "SELECT sql FROM sqlite_master" --json
pnpm exec wrangler d1 execute DB --remote --command "SELECT sql FROM sqlite_master" --json
```

`_cf_KV` and `_cf_METADATA` differ between local and remote. They are
Cloudflare's own tables, not yours.
