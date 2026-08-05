---
name: frontend
description: Use when changing anything under src/pages, src/admin, or the styling. Covers this repo's React conventions, why the admin bundle is split, and how the CMS handles auth without a sign-in screen.
---

# Public site and CMS UI

React 19, Vite, Tailwind v4, React Router. Two surfaces in one bundle entry:
`src/pages/Home.tsx` is public, `src/admin/` is the CMS.

## Keep the admin bundle lazy

`src/App.tsx` loads `Admin` through `lazy()`, which keeps TipTap out of the
public site. The admin chunk is roughly 450 kB against 240 kB for the site, so
importing it eagerly nearly triples what a visitor downloads to read a page.

## The CMS has no sign-in screen

Cloudflare Access authenticates before the app renders, so if `Admin` mounts the
visitor is already authenticated. Do not add a login form, a token field, or
anything in `localStorage`. That is what this replaced.

On an auth failure, call `reauthenticate()` from `src/admin/api.ts`. It reloads
the page, which is the only way to hand the browser back to Access — an expired
session answers XHRs with a cross-origin redirect that `fetch` cannot follow.

`signOut()` clears two tokens, the per-application one on this domain and the
global SSO session on the team domain. Clearing only the first lets the next
request mint a fresh one silently, which looks like logout doing nothing.

## Degrade quietly on the public site

The public site renders nothing rather than an error when data is missing. The
Spotify footer returns `null` when the API is unreachable or the secrets are
unset, and `OnRepeat` renders nothing for a null track. Keep that shape for
anything else optional: a missing integration should be invisible, not broken.

## Colours come from tokens

`src/index.css` defines the palette as CSS variables grouped into surfaces, text
and accent. Use the token names (`bg-surface`, `text-muted`, `border-line`)
rather than literal Tailwind colours, so both surfaces stay consistent.

## Errors the user reads

Messages in `errorMessage()` are shown in production. Do not write anything that
only makes sense locally — it previously told visitors to check whether their dev
server was running.
