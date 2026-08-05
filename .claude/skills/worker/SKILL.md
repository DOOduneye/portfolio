---
name: worker
description: Read before touching src/worker/index.ts, trpc.ts, access.ts or routers/. Covers how a route gets added, how auth actually works here, and the two mistakes that have taken the CMS down.
---

# Worker

The vendored `trpc-router` skill covers router composition and input validation.
This covers what is specific to this Worker: the public/admin split, Cloudflare
Access, and the error shape the client depends on.

## Adding a procedure

Every router exports two: a public one and an admin one. Which you extend
decides whether the world can call it.

```ts
// Public read — anyone, no identity
export const publicProjectsRouter = router({
  visible: publicProcedure.query(({ ctx }) =>
    ctx.db.select().from(projects).where(eq(projects.visible, 1))
  ),
});

// Admin write — requires a verified Access identity, and is audited
export const adminProjectsRouter = router({
  remove: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => { ... }),
});
```

`protectedProcedure` does two things, and the second is easy to forget: it
refuses an unauthenticated caller, and it writes every mutation to `audit_log`.
Never hand-roll an auth check on a procedure — you get the refusal without the
audit trail.

Register it under the right key in `routers/index.ts`. `public.*` and `admin.*`
are not naming convention, they are the security boundary: `src/worker/index.ts`
decides whether to require an identity by matching `/trpc/admin.` on the path.

## Never hand-roll an error on a /trpc route

```ts
// Wrong — not a tRPC envelope. The client throws "unable to transform response
// from server" and the reload-to-reauthenticate path never fires.
return Response.json({ error: { code: "FORBIDDEN" } }, { status: 403 });

// Correct — pass a null identity through and let protectedProcedure raise it
const identity = await resolveIdentity(request, env, url.pathname);
return fetchRequestHandler({ ..., createContext: () => createContext({ identity, ... }) });
```

This shipped and broke the CMS. The client reads `error.data.code` to decide it
must reauthenticate; a bare JSON body gives it nothing to read.

## Access decides who, the Worker decides whether the token is real

`access.ts` verifies signature, issuer, audience and expiry against a cached
JWKS. It does **not** check which email is allowed.

Do not add an allowlist here. One existed, disagreed with the Access policy, and
locked the CMS out with `Email is not allowed` on a token that was otherwise
valid. Membership belongs to the policy; the audience check already confines the
Worker to tokens minted for this application.

```ts
// Correct — fails closed when the value is missing or misspelled
if (env.ENVIRONMENT !== "development") return null;

// Wrong — fails OPEN in production if ENVIRONMENT is unset or mistyped
if (env.ENVIRONMENT !== "production") return devIdentity();
```

## Routing facts that are not obvious

`run_worker_first` is `true`, so the Worker sees every request and hands anything
it does not handle to `env.ASSETS.fetch`. That is what makes the `www` to apex
redirect unbypassable.

Access application paths match **exactly**, not by prefix. `/admin` does not
cover `/admin/posts`; `trpc/admin` does not cover `trpc/admin.posts.list`. Adding
a new admin path prefix means adding a destination to the Access application, or
the Worker will refuse every request to it for lack of a token.

Policies are per hostname, which is why `www` redirects rather than getting its
own set of rules.

## Debugging a refusal

The Worker logs why it refused, and the reason is the whole diagnosis:

```bash
pnpm exec wrangler tail davidoduneye-com --format pretty
```

`Missing Cloudflare Access token` means Access did not gate that path or
hostname. `Invalid` means audience or issuer. The 403 body deliberately says
nothing, so the log is the only source.
