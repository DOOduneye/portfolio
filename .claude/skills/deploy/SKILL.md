---
name: deploy
description: CI, builds and deploys for this repo. Covers what runs on a pull request, how merging to main reaches production, the ordering guarantee between migrations and code, reading a failed check, and rolling back. Trigger on ci, build, deploy, release, ship, pipeline, workflow, actions, rollback, failing check, red build.
---

# Deploy

## Purpose

What runs when, what has to pass, and what to do when something is red.

## When to Use

- A check is failing on a pull request
- Changing `.github/workflows/ci.yml` or the build
- Shipping something that touches the schema
- A deploy did not appear in production
- Rolling back

## Architecture

Two independent systems respond to a push, and they do different jobs.

```
push to a branch
  ├─ GitHub Actions (.github/workflows/ci.yml)   verifies
  └─ Cloudflare Workers Builds                   builds a preview version

merge to main
  ├─ GitHub Actions                              verifies
  └─ Cloudflare Workers Builds                   deploys production
```

Actions never deploys. Workers Builds owns that, running `pnpm run deploy`.
Adding a deploy step to the workflow would race it.

## What CI Runs

In order, from `ci.yml`:

```
pnpm install --frozen-lockfile
pnpm run db:generate                              regenerate migrations
git add -N migrations && git diff --exit-code migrations    schema drift guard
pnpm run lint                                     oxlint
pnpm run format                                   oxfmt --check
pnpm run check                                    tsc --noEmit
pnpm test                                         vitest, real local D1
pnpm run build
```

Run the same set locally before pushing. Every one of them fails faster on your
machine than in a runner.

## The Job Name Is Load-Bearing

`main` has a ruleset requiring a status check called `check`, which is the job
id in `ci.yml`. GitHub reports a job's `name:` as the status context when one is
set, and the job id when it is not.

**Do not add a `name:` to that job.** The required check would stop reporting,
every pull request would wait forever on a check that cannot arrive, and the
only way through would be the bypass checkbox.

## Migrations Ship Before the Code That Needs Them

`pnpm run deploy` is `build && db:migrate && wrangler deploy`, in that order.
The build runs first so a compile error fails before the database is touched,
and the migration lands before the Worker that expects it.

This ordering only holds if Workers Builds is configured to run
`pnpm run deploy`. If its deploy command is ever set to `wrangler deploy`
directly, migrations silently stop running and the next schema change deploys
code against a database that lacks the table.

## Reading a Failed Check

```bash
gh pr checks <number>                    which check failed
gh run view <run-id> --log-failed        why
```

Failures map to fixes:

| Failure | Fix |
|---|---|
| `git diff --exit-code migrations` | `pnpm run db:generate`, commit what it writes |
| `oxlint` | `pnpm run fix` |
| `oxfmt --check` | `pnpm run fix` |
| `tsc` | a real type error; read it before changing anything |
| `vitest` | run `pnpm test` locally, the Workers pool reproduces it exactly |
| `pnpm/action-setup` version conflict | do not set `version:` alongside `packageManager` |

## Confirming a Deploy Reached Production

```bash
curl -sI https://davidoduneye.com/               200
curl -sI https://davidoduneye.com/admin          302 to Access
curl -s  https://davidoduneye.com/trpc/public.music.topTrack
pnpm exec wrangler deployments list --name davidoduneye-com
```

Cloudflare caches HTML at the edge, so add a unique query string when checking
something you just changed. A stale 200 looks exactly like a working deploy.

## Rolling Back

Revert the commit on `main` and let the pipeline deploy the revert. That keeps
the repo and production in agreement, which redeploying an old version by hand
does not.

A migration does not roll back with the code. If a deploy has to be undone and
the schema changed, write a forward migration that reverses it.

## Secrets

Secrets live on the Worker, set with `wrangler secret put`, never in
`wrangler.jsonc`. `vars` in that file are public — they ship in the deployed
config and are readable in the dashboard.

Two constraints worth knowing before touching them. Secrets cannot be modified
while the most recent version of a Worker is undeployed, which happens after a
preview build; deploy first, then change the secret. And renaming a Worker
creates a new one — routes follow on deploy, secrets do not, so every secret
must be set again before the rename is complete.

## Key Rules

- **Actions verifies, Workers Builds deploys**: never add a deploy step to CI.
- **Do not name the `check` job**: the ruleset requires that exact context.
- **Deploy through `pnpm run deploy`**: it is what orders migrations before code.
- **Run the CI set locally first**: all of it is faster on your machine.
- **Cache-bust when verifying**: a stale edge response mimics success.
- **Roll back by reverting**, and reverse a migration with a new one.
- **Secrets go through `wrangler secret put`**, never into `wrangler.jsonc`.
