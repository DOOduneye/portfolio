# davidoduneye.com

Personal site for David Oduneye — software engineer. One repo, two apps:

```
site/   # public site — React + Vite + Tailwind, static build → GitHub Pages
cms/    # admin + API — Cloudflare Workers, tRPC v11, D1, TipTap v3 editor
```

## Site

```bash
cd site
npm install
npm run dev       # dev server
npm run build     # static build to site/dist
```

Pushes to the `v1` branch that touch `site/` build and deploy to the
`gh-pages` branch via GitHub Actions. Content (experience, projects) currently
lives in `site/src/App.tsx`; wiring it to the CMS's public tRPC procedures at
build time is the next step.

## CMS

See [`cms/README.md`](cms/README.md) for setup, development, and deploy. It
runs entirely on Cloudflare's free tier and publishes content changes by
firing a `repository_dispatch` (`content-published`) that rebuilds the site.

Note: GitHub only triggers `repository_dispatch` workflows from the default
branch, so for the publish hook to work the deploy workflow needs to exist on
`main` too (or make `v1` the default branch).
