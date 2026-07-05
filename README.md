# davidoduneye.com

Personal site for David Oduneye — software engineer. One project:

- `/` — public site (experience + projects)
- `/admin` — CMS: posts managed with a TipTap v3 editor
- `/trpc` — tRPC v11 API (posts, projects, experiences) backed by D1

React 19 + Vite + Tailwind v4 on the front, a Cloudflare Worker serving the
API and the built app. Runs on Cloudflare's free tier.

```
src/
  pages/Home.tsx     # public site
  admin/             # CMS UI + TipTap editor
  worker/            # Cloudflare Worker: tRPC routers, drizzle schema, auth
migrations/          # D1 SQL migrations
```

## Development

```bash
npm install
npm run db:migrate:local   # once
npm run dev:api            # worker + local D1 on :8787
npm run dev                # app on :5173 (proxies /trpc to :8787)
```

Admin token for local dev comes from `.dev.vars` (`ADMIN_TOKEN=dev-token`).

## Deploy

The public site deploys to GitHub Pages automatically on pushes to `v1`
(static build; the `/admin` route needs the worker, so it only works where
the worker serves the app).

To run the full app (site + admin + API) on Cloudflare:

```bash
npx wrangler d1 create portfolio-cms   # paste database_id into wrangler.jsonc
npm run db:migrate
npx wrangler secret put ADMIN_TOKEN
npm run deploy
```

Publishing content fires a `repository_dispatch` (`content-published`) to
rebuild the Pages site. Note GitHub only fires repository_dispatch workflows
from the default branch — mirror deploy.yml on `main` or make `v1` default.
