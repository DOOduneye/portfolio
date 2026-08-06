# Agent instructions

`davidoduneye.com` — a personal site and the CMS that writes it, running as a
single Cloudflare Worker.

## Commands

```bash
pnpm dev                    # site + Worker + local D1 on :5173
pnpm run check              # tsc --noEmit
pnpm test                   # vitest
pnpm run build
pnpm run db:generate        # generate a migration from schema.ts
pnpm run db:migrate:local   # apply migrations to local D1
pnpm run db:migrate         # apply migrations to production D1
```

Local dev needs `.dev.vars` (copy `.dev.vars.example`). `ENVIRONMENT=development`
in there signs you into `/admin` without Cloudflare Access, which does not sit in
front of localhost. Values in `.dev.vars` override the `vars` block in
`wrangler.jsonc`.

Deploys happen on push to `main` through Cloudflare Workers Builds, whose deploy
command is `pnpm run deploy`. Do not run `wrangler deploy` by hand — it skips the
migration step that `pnpm run deploy` runs first.

## Architecture

One Worker answers every request. `run_worker_first` is `true`, so the Worker
sees all traffic and hands anything it does not handle to the assets binding.

```
request
  │
  ├─ www.davidoduneye.com/*   301 to the apex, then re-enters below
  │
  ├─ /trpc/public.*           no auth  ──> publicProcedure  ──> D1
  ├─ /trpc/admin.*            Access   ──> protectedProcedure ──> D1 + audit_log
  ├─ /admin, /admin/*         Access   ──> assets (the CMS bundle)
  └─ everything else                   ──> assets (the public site)
```

```
src/
  App.tsx            routes / to the site, /admin to the CMS
  pages/Home.tsx     the public site
  admin/             CMS UI, TipTap editor, tRPC client
  worker/
    index.ts         hostname and path routing, Access gate
    access.ts        Access JWT verification
    trpc.ts          context, publicProcedure, protectedProcedure, audit
    audit.ts         audit_log writes
    routers/         posts, projects, experiences, music
    db/schema.ts     the source of truth for the database
migrations/          generated SQL plus the drizzle snapshot in meta/
```

React 19, Vite, Tailwind v4 and React Router on the front. tRPC v11 between
front and Worker. Drizzle over D1 for storage. Cloudflare Access for identity.
Vitest with the Workers pool for tests.

## Rules that prevent real mistakes

- `src/worker/db/schema.ts` is the only source of truth for the database. Change
  it, then run `pnpm run db:generate`. Never hand-write a file in `migrations/`,
  and never run `drizzle-kit push` or `drizzle-kit migrate`.
- Only tRPC envelopes on `/trpc/*`. A hand-rolled error body is unparseable by
  the client.
- Admin mutations use `protectedProcedure`, which is what writes the audit row.
- Use the design tokens in `src/index.css`, never a literal Tailwind colour.
- Comment only what the code cannot express. Prefer a clearer name or a smaller
  function.
- Fix code smells you encounter as you work.

## Standards

Skills live in `.agents/skills/`, which is where the `skills` CLI installs and
what every other agent tool reads. `.claude/skills` is a symlink to it, so
there is one directory rather than two copies to keep in step.

Generic guidance for the stack is vendored there and pinned in
`skills-lock.json`: `drizzle`, `drizzle-migrations`, `trpc-router`,
`vercel-react-best-practices`, `vercel-composition-patterns`, `tdd`,
`frontend-design`, `find-skills`, `ci-cd-and-automation`, `tiptap`, and the
Cloudflare set. Restore them with `npx skills experimental_install`.

Three skills override those where this repo differs, and the overrides win:

| Touching | Skill | Overrides |
|---|---|---|
| `db/schema.ts`, `migrations/` | `database` | `drizzle`, `drizzle-migrations` |
| `worker/index.ts`, `trpc.ts`, `access.ts`, `routers/` | `worker` | `trpc-router` |
| `src/pages`, `src/admin`, styling | `frontend` | `vercel-react-best-practices`, `vercel-composition-patterns` |
| a PR or a commit message | `pr` | — |
| refactoring, reviewing, verifying before shipping | `code-quality` | — |
| CI, builds, deploys, a failing check | `deploy` | `ci-cd-and-automation` |

The vendored Drizzle skills never mention D1 or wrangler and recommend
`drizzle-kit push`, which would desync this repo. The React skill assumes
TanStack Query, which is not installed. Read the override before the vendored
one.

For the Cloudflare platform itself, the user-level `cloudflare`, `wrangler` and
`workers-best-practices` skills retrieve live docs and are more current than
anything written here. `context7` is wired up in `.mcp.json` for the same reason:
API signatures and config fields should be looked up, not remembered.

## Communication

Describe observed behaviour as observed. Call something a known bug only with a
citation — an unverified claim short-circuits debugging. When a check fails, read
the actual error before proposing a cause.
