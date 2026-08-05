# davidoduneye.com

My personal site. Live at [davidoduneye.com](https://davidoduneye.com).

## Running it

```bash
pnpm install
pnpm run db:migrate:local
pnpm dev
```

Copy `.dev.vars.example` to `.dev.vars` before `pnpm dev`.

```bash
pnpm test
pnpm run check
```

## Spotify

The footer shows whatever I've had on repeat. To get that working on your own
copy, create an app on the
[Spotify dashboard](https://developer.spotify.com/dashboard), add
`http://127.0.0.1:8888/callback` as a redirect URI, then run:

```bash
node scripts/spotify-auth.mjs <client_id> <client_secret>
```

It prints a refresh token. Put that and the client id and secret in
`.dev.vars`.
