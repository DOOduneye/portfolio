# davidoduneye.com

Personal site for David Oduneye — software engineer. One project:

- `/` — public site (experience + projects)
- `/admin` — CMS: posts managed with a TipTap v3 editor
- `/trpc/public.*` — public tRPC v11 API for display data
- `/trpc/admin.*` — admin tRPC v11 API for CMS writes/private reads

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
pnpm install
pnpm run db:migrate:local   # once
pnpm dev                    # app + Worker + local D1 on :5173
```

Admin token for local dev comes from `.dev.vars` (`ADMIN_TOKEN=dev-token`).

## Deploy

The full site is meant to run as a Cloudflare Worker app:

- `/` serves the built React site.
- `/admin` serves the CMS UI.
- `/trpc/public.*` serves public display data, including Spotify.
- `/trpc/admin.*` serves authenticated CMS reads and writes.
- D1 stores CMS content and the Spotify cache.

```bash
pnpm exec wrangler login
pnpm exec wrangler d1 create portfolio-cms   # paste database_id into wrangler.jsonc
pnpm run db:migrate
pnpm exec wrangler secret put ADMIN_TOKEN
pnpm exec wrangler secret put SPOTIFY_CLIENT_ID
pnpm exec wrangler secret put SPOTIFY_CLIENT_SECRET
pnpm exec wrangler secret put SPOTIFY_REFRESH_TOKEN
pnpm run deploy
```

To get the Spotify refresh token:

```bash
node scripts/spotify-auth.mjs <client_id> <client_secret>
```

Create the Spotify app at <https://developer.spotify.com/dashboard> and add
this redirect URI exactly:

```text
http://127.0.0.1:8888/callback
```

GitHub Pages is still available as a static fallback on pushes to `v1`, but the
CMS and Spotify API only work on the Cloudflare Worker deployment.
