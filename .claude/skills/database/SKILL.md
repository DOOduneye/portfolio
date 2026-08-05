---
name: database
description: Database schema and migration workflow using Drizzle ORM on Cloudflare D1. Covers changing the schema, generating migrations, applying them locally and in production, declaring indexes and defaults, and constraints Drizzle cannot express. Trigger on migration, migrate, drizzle, schema change, add column, add table, alter table, d1, db:generate.
---

# Database

## Purpose

Guide for changing the schema and managing migrations with Drizzle ORM against Cloudflare D1.

## When to Use

- Adding or modifying tables, columns, or indexes
- Generating or applying a migration
- Verifying that the repo reproduces the deployed schema
- Adding a constraint Drizzle cannot express in TypeScript

## Architecture

- **Schema**: `src/worker/db/schema.ts` — the source of truth
- **Drizzle config**: `drizzle.config.ts` — `dialect: "sqlite"`, `out: "./migrations"`
- **Migration SQL**: `migrations/*.sql` — applied by wrangler, not by Drizzle
- **Snapshots**: `migrations/meta/` — what generation diffs against
- **Binding**: `DB` in `wrangler.jsonc`, referenced by binding name in scripts

Two tools split the work. Drizzle generates SQL by diffing `schema.ts` against
the snapshot. Wrangler applies that SQL and tracks what has run in its own
`d1_migrations` table. Drizzle's own runner is not used.

## Standard Workflow (Schema Changes)

### 1. Edit the schema

```ts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
});
```

### 2. Generate the migration

```bash
pnpm run db:generate
```

Writes a numbered `.sql` file plus a new snapshot. Never write the SQL by hand —
generation is the only thing that keeps the snapshot in step.

### 3. Apply locally

```bash
pnpm run db:migrate:local
```

### 4. Verify the change landed

```bash
pnpm exec wrangler d1 execute DB --local \
  --command "SELECT sql FROM sqlite_master WHERE name = 'posts'"
```

### 5. Commit the SQL and the snapshot together

CI runs `db:generate` and fails if it produces anything, so a schema change
committed without its generated migration will not merge.

Production is migrated by the deploy, since `pnpm run deploy` runs
`db:migrate` before `wrangler deploy`.

## Declaring Indexes and Defaults

Generation only sees what `schema.ts` declares. An index or default that exists
only in SQL is invisible to it, and the next generated migration will be diffed
against a schema that does not match the database.

```ts
export const auditLog = sqliteTable(
  "audit_log",
  {
    actorEmail: text("actor_email").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_audit_log_actor_time").on(table.actorEmail, table.createdAt),
  ]
);
```

Column defaults use `sql` for expressions:

```ts
createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
```

## Constraints Drizzle Cannot Express

`text("status", { enum: ["draft", "published"] })` is a TypeScript type only. It
emits no CHECK constraint. The database will accept any string.

To constrain a value in the database, write the SQL yourself — and note that
SQLite cannot add or drop a constraint in place. It needs a table rebuild:

```sql
CREATE TABLE posts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);
INSERT INTO posts_new SELECT id, status FROM posts;
DROP TABLE posts;
ALTER TABLE posts_new RENAME TO posts;
CREATE UNIQUE INDEX posts_slug_unique ON posts (slug);
```

Recreate every index after the rename — they are dropped with the old table.
Match Drizzle's shape: it models a unique column as a *named* index, not an
inline `UNIQUE`, so a rebuild that uses inline `UNIQUE` will not match the
snapshot.

## The Baseline Snapshot

`migrations/meta/` holds one snapshot with its journal entry at `idx: 4`, sitting
after the four hand-written migrations so generated files begin at `0005`.

Do not renumber or delete it. Without a snapshot, generation treats the database
as empty and emits `CREATE TABLE` for tables that already exist.

## Verifying Against Production

Rebuilding local D1 from nothing and diffing against production is the only
check that the repo reproduces the deployed schema:

```bash
pnpm run db:migrate:local
pnpm exec wrangler d1 execute DB --local  --command "SELECT sql FROM sqlite_master ORDER BY tbl_name" --json
pnpm exec wrangler d1 execute DB --remote --command "SELECT sql FROM sqlite_master ORDER BY tbl_name" --json
```

`_cf_KV` and `_cf_METADATA` differ between local and remote. They belong to
Cloudflare, not to this schema.

## Commands Reference

| Command | What it does |
|---|---|
| `pnpm run db:generate` | Diff `schema.ts` against the snapshot and write SQL |
| `pnpm run db:migrate:local` | Apply pending migrations to local D1 |
| `pnpm run db:migrate` | Apply pending migrations to production D1 |
| `pnpm exec wrangler d1 migrations list DB --remote` | Show what is pending |
| `pnpm exec wrangler d1 execute DB --local --command "..."` | Run SQL locally |

## Key Rules

- **`schema.ts` is the source of truth**: change it, then generate.
- **Never hand-write a migration**: the snapshot will not match and CI will fail.
- **Never run `drizzle-kit push`**: it writes the schema straight to the database,
  skipping both the migration file and wrangler's bookkeeping.
- **Never run `drizzle-kit migrate`**: wrangler is the runner. Two runners
  double-track the same migrations.
- **Declare indexes and defaults in `schema.ts`**: anything else is invisible to
  generation.
- **Never edit a migration that has been applied**: add a new one.
- **Address the database by binding (`DB`), not by name**: the scripts stay
  correct if the database is renamed.
