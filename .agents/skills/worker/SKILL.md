---
name: worker
description: Cloudflare Worker patterns for this repo. Covers adding public and admin tRPC procedures, the audit trail, Cloudflare Access verification, hostname and path routing, and debugging a rejected request. Trigger on worker, trpc, router, procedure, endpoint, api, auth, access, jwt, route, audit.
---

# Worker

## Purpose

Guide for adding routes to the Worker and for how requests are authenticated
before they reach one.

## When to Use

- Adding or modifying a tRPC procedure
- Adding a path that should be public or gated
- Changing how identity is verified
- Debugging a request the Worker refused

## Architecture

- **Entry**: `src/worker/index.ts` — canonical host redirect, path routing, Access gate
- **tRPC setup**: `src/worker/trpc.ts` — context, `publicProcedure`, `protectedProcedure`
- **Identity**: `src/worker/access.ts` — Access JWT verification
- **Audit**: `src/worker/audit.ts` — writes to `audit_log`
- **Routers**: `src/worker/routers/*.ts`, composed in `routers/index.ts`

Every request reaches the Worker first (`run_worker_first` is `true`); anything
it does not handle is passed to `env.ASSETS.fetch`.

```
/trpc/public.*     no identity   →  publicProcedure
/trpc/admin.*      Access        →  protectedProcedure  →  audit_log
/admin, /admin/*   Access        →  assets
everything else                  →  assets
```

## Adding a Procedure

Each router file exports a public router and an admin router. Which one you
extend is the security boundary, not a naming preference — `index.ts` decides
whether to require an identity by matching `/trpc/admin.` on the path.

### Public read

```ts
export const publicProjectsRouter = router({
  visible: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(projects)
      .where(and(eq(projects.visible, 1), isNull(projects.deletedAt)))
      .orderBy(asc(projects.sortOrder))
  ),
});
```

### Admin write

```ts
export const adminProjectsRouter = router({
  update: protectedProcedure
    .input(projectInput.partial().extend({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...changes } = input;
      const [updated] = await ctx.db
        .update(projects)
        .set({ ...changes, updatedAt: now() })
        .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),
});
```

`protectedProcedure` does two things: refuses a caller without a verified
identity, and writes every mutation to `audit_log` with the actor, the path, and
the input minus any `content` field. Hand-rolling an auth check on a procedure
gives you the refusal without the audit trail.

Register it under the matching key in `routers/index.ts`. Validate input with
Zod on every procedure that takes one, and throw `TRPCError` for expected
failures so the client receives a typed code.

## Error Shape on /trpc Routes

Responses on `/trpc/*` must be tRPC envelopes. A hand-rolled body is
unparseable by the client, which throws a transform error instead of a typed one
and cannot tell an auth failure from a network failure.

```ts
// Wrong
return Response.json({ error: { code: "FORBIDDEN" } }, { status: 403 });

// Correct — pass a null identity and let protectedProcedure raise UNAUTHORIZED
return fetchRequestHandler({
  endpoint: "/trpc",
  req: request,
  router: appRouter,
  createContext: () => createContext({ req: request, env, executionCtx, identity }),
});
```

## Identity

`access.ts` verifies that a token is genuine: signature against the team's
cached JWKS, plus issuer, audience and expiry. It does not decide *who* is
allowed — the Access policy does that, and the audience check already confines
the Worker to tokens minted for this application. Do not add an allowlist in
application config; two places to keep in sync will drift.

The development bypass matches positively, so a missing or misspelled value
fails closed:

```ts
// Correct
if (env.ENVIRONMENT !== "development") return null;

// Wrong — fails open in production when the variable is unset
if (env.ENVIRONMENT !== "production") return devIdentity();
```

## Adding a Gated Path

Access application paths match exactly, not by prefix, and policies are per
hostname. `/admin` does not cover `/admin/posts`; `trpc/admin` does not cover
`trpc/admin.posts.list`.

Adding a new gated path prefix means adding a destination to the Access
application, or every request to it arrives without a token and the Worker
refuses. Serve one hostname so each rule is written once.

## Debugging a Rejected Request

The 403 body deliberately carries no detail, so the log is the only source. The
reason names the fault:

```bash
pnpm exec wrangler tail davidoduneye-com --format pretty
```

| Reason | Meaning |
|---|---|
| `Missing Cloudflare Access token` | Access did not gate that hostname or path |
| `Invalid Cloudflare Access token` | Audience, issuer, or signature mismatch |
| `Cloudflare Access is not configured` | `CF_ACCESS_TEAM_DOMAIN` or `CF_ACCESS_AUD` unset |

## Commands Reference

| Command | What it does |
|---|---|
| `pnpm dev` | Worker plus site plus local D1 on `:5173` |
| `pnpm exec wrangler tail davidoduneye-com --format pretty` | Live production logs |
| `pnpm test` | Vitest, including the Worker against a real local D1 |
| `curl -sI https://davidoduneye.com/trpc/admin.posts.list` | Expect a 302 to Access |

## Key Rules

- **Extend the right router**: `public.*` is reachable by anyone.
- **Admin mutations use `protectedProcedure`**: it is what produces the audit row.
- **Only tRPC envelopes on `/trpc/*`**: never a hand-rolled error body.
- **The Access policy owns membership**: the Worker only proves the token is real.
- **Match the dev bypass positively**: negative checks fail open.
- **A new gated path needs an Access destination**: paths match exactly.
- **Read the tail before theorising**: the rejection reason is the diagnosis.
