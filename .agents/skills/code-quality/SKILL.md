---
name: code-quality
description: Development lifecycle and code quality standards for this repo. Covers the verify-before-shipping loop, where cross-cutting concerns belong, boundary conversions, deriving types instead of restating them, commenting standards, and the anti-patterns currently present in the codebase. Trigger on refactor, clean up, code quality, review, lint, format, verify, before committing, tidy.
---

# Code Quality

## Purpose

How work moves from a change to a deploy in this repo, and the standards that
apply while it does.

## When to Use

- Starting any change
- Refactoring or cleaning up
- Before committing or opening a PR
- Reviewing a diff
- Deciding whether something belongs in a component or a layer below it

## Core Principle: Clean Up As You Work

Leave the code cleaner than you found it. Fix a smell when you are already in
the file, rather than filing it for later. Rename something unclear when you had
to read it twice to understand it.

The exception is scope: a cleanup that makes the diff hard to review belongs in
its own commit, or its own PR.

## The Development Lifecycle

### 1. Start

Branch from `main`. Never branch from another open PR's branch — merging the
child after the parent has merged leaves the work on a dead branch that looks
merged but never reaches `main`.

Read the skill for the area first: `database`, `worker`, or `frontend`.

### 2. Develop

```bash
pnpm dev
```

Serves the site, the Worker, and a local D1 on `:5173`.

### 3. Verify before claiming anything works

```bash
pnpm run lint     # oxlint
pnpm run format   # oxfmt --check
pnpm run check    # tsc --noEmit
pnpm test         # vitest, Worker against a real local D1
pnpm run build
```

`pnpm run fix` applies both the lint autofixes and the formatter.

If `src/worker/db/schema.ts` changed, also:

```bash
pnpm run db:generate
```

Run all of these locally. CI runs the same set, and discovering a type error
from a failed CI run costs a push and a wait for something `tsc` reports in a
second.

### 4. Ship

Commit as `type: what changed`, with a body explaining *why*. Open the PR with a
title of two to five plain words and a one-line body — see the `pr` skill.

CI runs the schema drift guard, then lint, format, check, test, and build. The
`deploy` skill covers what each failure means and how production is reached.

### 5. Deploy

Merging to `main` deploys through Cloudflare Workers Builds, which runs
`pnpm run deploy` — migrations first, then the Worker.

### 6. Confirm

```bash
curl -sI https://davidoduneye.com/
curl -sI https://davidoduneye.com/admin        # expect 302 to Access
pnpm exec wrangler tail davidoduneye-com --format pretty
```

## Cross-Cutting Concerns Belong in One Place

A concern that is identical everywhere is not the caller's job. When the same
handling appears in several places, move it down a layer rather than extracting
a helper for the repeated lines.

The admin pages currently show the anti-pattern. This block appears **nine
times** across four files:

```tsx
// Anti-pattern — auth policy re-implemented per handler
catch (err) {
  if (isUnauthorized(err)) onAuthError();
  else setError(errorMessage(err));
}
```

`onAuthError` is `reauthenticate` at all four call sites, so a global concern is
also prop-drilled through every page. Handled once at the client layer, pages
would not mention auth at all.

**Duplicated display code is untidy. Duplicated policy is a latent bug** — it
fails silently in the copy someone forgot, and nothing tells you which copy that
is until a user hits it.

Signals you are looking at this: the same `catch` shape in several files, a prop
passed with an identical value everywhere it appears, or a rule that has to be
"remembered" when adding a file.

## Push Conversions to the Boundary That Knows the Shape

Every manual conversion at a call site means a boundary is under-specified.

```tsx
// Anti-pattern — the same conversion at four call sites
visible: draft.visible ? 1 : 0     // writing
visible: item.visible === 1        // reading
```

This exists because `schema.ts` declares `integer("visible")`. Drizzle can own
it, and then nothing above the schema converts:

```ts
visible: integer("visible", { mode: "boolean" }).notNull().default(true),
```

Same rule for parsing, validation, and serialisation: do it once where the data
enters, not at each use.

## Derive Types, Do Not Restate Them

A type written by hand next to a type the system already knows will drift.

```tsx
// Anti-pattern — restates the server's Zod input, with a deliberate mismatch
interface Draft {
  name: string;
  visible: boolean;   // the wire carries a number
}
```

The router already defines that shape. Derive from the source instead, and the
mismatch that forces the conversion above disappears.

Prefer `inferRouterOutputs<AppRouter>` over
`Awaited<ReturnType<typeof api.admin.projects.list.query>>[number]`, which
appears three times and reaches through the client to describe a server type.

## Comments

Comment only what the code cannot express. Prefer a clearer name, a smaller
function, or an extracted named condition first.

Worth a comment: a non-obvious constraint from outside the file, a workaround
with a reason, an ordering that matters, a deliberate omission someone would
otherwise "fix".

```ts
// Good — states a constraint the reader cannot see
// Middlewares run before input parsing, so the parsed input is unavailable here.
const rawInput = await getRawInput();

// Bad — restates the line
// Get the raw input
const rawInput = await getRawInput();
```

Delete a comment when it stops being true. An outdated comment is worse than
none, because it is trusted.

## Escape Hatches

Non-null assertions and casts are claims the compiler cannot check. Three `!`
and eighteen `as` currently exist; test fixtures are a fair use, production
paths less so.

```ts
// Anti-pattern — an index access asserted non-null
return segments.length > 1 ? segments[segments.length - 2]! : path;

// Better — narrow it, and the assertion is unnecessary
const [, resource] = path.split(".").reverse();
return resource ?? path;
```

When a cast is genuinely needed, keep it as narrow as possible and adjacent to
the reason.

## Anti-Patterns Present Today

These are real and worth fixing when you are next in the file:

- Auth handling duplicated nine times across the admin pages
- `onAuthError` prop-drilled with the same value to four pages
- Boolean/integer conversion at four call sites
- A hand-written `Draft` interface restating a Zod input
- Native `confirm()` in three pages, in a UI that has a component file
- Server row types derived through the client in three places

## Toolchain

`oxlint` and `oxfmt`, configured in `.oxlintrc.json` and `.oxfmtrc.json` to match
the agency repo so one style covers both. Formatting is not a matter of taste
here — run `pnpm run fix` rather than arguing with the formatter.

`tsconfig` runs `strict` plus `noUncheckedIndexedAccess`, `noUnusedLocals` and
`noUnusedParameters`. The first is why an index access needs narrowing rather
than a non-null assertion.

Lint warnings that remain are non-null assertions in test fixtures and the React
entry point. `scripts/` is excluded, since `spotify-auth.mjs` is a CLI whose
console output is the point.

## Key Rules

- **Verify locally before saying it works**: `lint`, `format`, `check`, `test`,
  `build`.
- **Branch from `main`**: never from another PR's branch.
- **Move a repeated concern down a layer**: do not extract a helper for the
  repeated lines and call it done.
- **Convert at the boundary**: a manual conversion at a call site means the
  boundary is under-specified.
- **Derive types from the source**: never hand-write a shape the system knows.
- **Comment the constraint, not the line**: and delete comments that go stale.
- **Narrow instead of asserting**: `!` and `as` are unchecked claims.
- **Fix the smell you are standing next to**: unless it makes the diff unreviewable.
