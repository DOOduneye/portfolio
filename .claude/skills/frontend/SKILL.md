---
name: frontend
description: Read before touching src/pages, src/admin or styling. This repo does not use TanStack Query, Server Components, or a login form, so parts of the vendored vercel-react-best-practices skill do not apply. This overrides it.
---

# Frontend

The vendored `vercel-react-best-practices` skill covers React 19 generally. Three
of its assumptions are wrong here: there is no React Query, no RSC, and no
authentication in the app at all.

## Data fetching is a vanilla tRPC client

`src/admin/api.ts` exports a plain `createTRPCClient`. There is no
`@trpc/react-query` and no TanStack Query. Do not reach for `useQuery` or
`useMutation` — they do not exist in this project.

The pattern is a `useCallback` fetcher, `useEffect` to run it, and explicit state:

```tsx
// Correct — matches every existing admin page
const [posts, setPosts] = useState<Post[] | null>(null);
const [error, setError] = useState<string | null>(null);

const refresh = useCallback(() => {
  api.admin.posts.list
    .query()
    .then(setPosts)
    .catch((err) => {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    });
}, [onAuthError]);

useEffect(refresh, [refresh]);
```

`null` means loading, an array means loaded. After a mutation, call `refresh()` —
there is no cache to invalidate.

Every catch must branch on `isUnauthorized` first. Skipping it turns an expired
session into a generic error message the user cannot act on.

## There is no login screen, and never should be

Cloudflare Access authenticates before the bundle loads, so if a component
renders the visitor is authenticated. Never add a login form, a token field, or
anything auth-related in `localStorage`. That is precisely what was removed.

Recovery from an expired session is a full page reload, via `reauthenticate()`.
Not a retry, not a token refresh — an expired Access session answers XHRs with a
cross-origin redirect that `fetch` cannot follow, so only a top-level navigation
hands the browser back to Access.

## Keep the admin chunk lazy

`src/App.tsx` loads `Admin` through `lazy()`. The admin chunk is ~450 kB against
~240 kB for the site, mostly TipTap. Importing it eagerly nearly triples what a
visitor downloads to read one page. Never import from `src/admin/` outside that
lazy boundary.

## Colours come from tokens

`src/index.css` defines the palette as CSS variables grouped into surfaces, text
and accent.

```tsx
// Correct
<div className="bg-surface text-muted border-line">

// Wrong — bypasses the palette, drifts from the rest of the app
<div className="bg-zinc-900 text-gray-400 border-gray-800">
```

## The public site degrades to nothing

Anything optional renders nothing rather than an error. The Spotify footer
returns `null` when the API is unreachable or its secrets are unset, and
`OnRepeat` renders nothing for a null track. Keep that shape: a missing
integration should be invisible to a visitor, never a broken state.

The admin UI is the opposite — it shows errors, because you are the only one who
sees them and you need to know.

## Error strings are read in production

`errorMessage()` output reaches real visitors. It once told them to check whether
their dev server was running. Write messages that make sense to someone who has
never seen the repo.
