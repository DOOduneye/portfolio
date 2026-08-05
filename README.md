# davidoduneye.com

Personal site for David Oduneye. It is a small React app with a built-in CMS
and a Cloudflare Worker API behind it.

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

## Auth

`/admin` and `/trpc/admin.*` sit behind a Cloudflare Access application, so
there is no sign-in screen in the app. The Worker verifies the
`Cf-Access-Jwt-Assertion` header and refuses the request if
`CF_ACCESS_TEAM_DOMAIN` or `CF_ACCESS_AUD` is unset. Who may enter is the
Access policy's decision; the Worker checks that the token is genuine and was
minted for this application. Every admin mutation writes a row to
`audit_log`.

The Access application needs two public destinations — `davidoduneye.com/admin`
and `davidoduneye.com/trpc/admin*` — plus `davidoduneye.com/admin/*` for the
CMS subroutes. Access paths are exact, not prefixes, which is why the
wildcards matter.

## Development

```bash
pnpm install
pnpm run db:migrate:local   # once
pnpm dev                    # app + Worker + local D1 on :5173
```

Access does not sit in front of localhost. Copy `.dev.vars.example` to
`.dev.vars`; `ENVIRONMENT=development` signs you in as a local identity
without Access. Values in `.dev.vars` override the `vars` block in
`wrangler.jsonc`.

```bash
pnpm test
pnpm run check
```

## Deploy

The full site runs as one Cloudflare Worker:

- `/` serves the built React site.
- `/admin` serves the CMS UI.
- `/trpc/public.*` serves public display data, including Spotify.
- `/trpc/admin.*` serves authenticated CMS reads and writes.
- D1 stores CMS content, the Spotify cache, and the audit log.

```bash
pnpm exec wrangler login
pnpm run db:migrate
pnpm exec wrangler secret put SPOTIFY_CLIENT_ID
pnpm exec wrangler secret put SPOTIFY_CLIENT_SECRET
pnpm exec wrangler secret put SPOTIFY_REFRESH_TOKEN
pnpm run deploy
```

Create the Access application before deploying, or the CMS locks out.
Deploys run from Cloudflare Workers Builds on push to `main`; the commands
above are for the first-time setup and for deploying by hand.

To get the Spotify refresh token:

```bash
node scripts/spotify-auth.mjs <client_id> <client_secret>
```

Create the Spotify app at <https://developer.spotify.com/dashboard> and add
this redirect URI exactly:

```text
http://127.0.0.1:8888/callback
```
