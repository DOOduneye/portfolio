# portfolio-cms

The CMS behind davidoduneye.com. One Cloudflare Worker serves both a tRPC v11
API (`/trpc/*`) and the admin SPA (React + TipTap v3). Content lives in D1
(SQLite). Runs entirely on Cloudflare's free tier.

The public site stays static: it fetches published content from the public
tRPC procedures at build time, and publishing content fires a
`repository_dispatch` that triggers the site's GitHub Actions rebuild.

## Architecture

```
src/
  worker/            # Cloudflare Worker
    index.ts         # fetch handler: /trpc → tRPC, everything else → admin SPA
    trpc.ts          # context, bearer-token auth middleware
    rebuild.ts       # repository_dispatch hook (publish → site rebuild)
    db/schema.ts     # drizzle schema: posts, projects, experiences
    routers/         # posts, projects, experiences — zod-validated, soft deletes
  admin/             # React SPA (Vite), TipTap v3 editor
migrations/          # D1 SQL migrations
```

Auth is a single bearer token (`ADMIN_TOKEN` secret) checked by
`protectedProcedure` — per the original spec: single admin, keep it simple.
Public procedures (`posts.published`, `projects.visible`,
`experiences.visible`) are what the static site consumes.

## Setup (one-time)

```bash
npm install
npx wrangler d1 create portfolio-cms   # paste database_id into wrangler.jsonc
npm run db:migrate:local
npx wrangler secret put ADMIN_TOKEN    # any long random string
npx wrangler secret put GITHUB_TOKEN   # fine-grained PAT, contents:write on DOOduneye/portfolio (optional)
```

## Development

```bash
npm run dev:api    # worker + local D1 on :8787
npm run dev        # admin SPA on :5173, proxies /trpc to :8787
```

## Deploy

```bash
npm run db:migrate   # apply migrations to remote D1
npm run deploy       # build admin + deploy worker
```

Then add a custom domain (e.g. `admin.davidoduneye.com`) in the Cloudflare
dashboard under the worker's settings.

## TODO

- [ ] Site integration: fetch `posts.published` etc. in the Astro build, and
      add a `repository_dispatch: content-published` trigger to the site's
      deploy workflow
- [ ] Editor: pick HTML (current) vs markdown storage; add code-block syntax
      highlighting (`@tiptap/extension-code-block-lowlight`) and link editing
- [ ] Projects/experiences admin screens (routers are done; UI is posts-only)
- [ ] Upgrade auth to better-auth if sessions ever beat a static token
