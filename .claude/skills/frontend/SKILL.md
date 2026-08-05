---
name: frontend
description: Frontend patterns for the public site and the CMS. Covers design tokens, adding a section to the site, adding an admin page, the data fetching pattern, shared inputs and buttons, code splitting, and how auth surfaces in the UI. Trigger on frontend, react, component, page, styling, tailwind, admin, cms, ui, editor, tiptap.
---

# Frontend

## Purpose

Guide for building the public site and the CMS that edits it.

## When to Use

- Adding or changing a section of the public site
- Adding or changing an admin page
- Fetching data in a component
- Styling anything
- Touching routing or the code-split boundary

## Architecture

- **Router**: `src/App.tsx` — `/` to the site, `/admin/*` to a lazily loaded CMS
- **Public site**: `src/pages/Home.tsx`
- **CMS shell**: `src/admin/Admin.tsx` — nav and routes
- **CMS pages**: `src/admin/pages/{PostsList,PostEdit,Projects,Experiences}.tsx`
- **tRPC client**: `src/admin/api.ts`
- **Shared inputs**: `src/admin/components/ui.tsx`
- **Editor**: `src/admin/components/PostEditor.tsx`, styles in `editor.css`
- **Tokens**: `src/index.css`

React 19, Vite, Tailwind v4, React Router 7. TipTap v3 for the editor.

## Design

The palette is defined once in `src/index.css` as Tailwind v4 theme tokens.
Always use the token, never a literal colour, so both surfaces stay consistent:

```
--color-page      --color-fg       --color-accent
--color-surface   --color-muted    --color-accent-strong
--color-raised    --color-subtle   --color-ok
--color-line                       --color-danger
```

```tsx
// Correct
<div className="bg-surface text-muted border border-line">

// Wrong
<div className="bg-zinc-900 text-gray-400 border border-gray-800">
```

`--color-page` is the base, `surface` sits on it, `raised` sits on surface. Text
descends `fg` → `muted` → `subtle`. Use `danger` for destructive actions and `ok`
for published state.

## Adding a Section to the Public Site

`Home.tsx` composes `<Section>` blocks. Add one there rather than creating a new
route — the public site is deliberately a single page.

Anything depending on an external API renders nothing when unavailable, rather
than an error or a skeleton. `OnRepeat` is the pattern: the procedure returns
`null` when its secrets are unset or the API fails, and the component returns
`null` for a null value. A visitor should never see a broken integration.

## Adding an Admin Page

### 1. Create the page

It takes `onAuthError` and owns its own loading and error state.

```tsx
export function Projects({ onAuthError }: { onAuthError: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    api.admin.projects.list
      .query()
      .then(setProjects)
      .catch((err) => {
        if (isUnauthorized(err)) onAuthError();
        else setError(errorMessage(err));
      });
  }, [onAuthError]);

  useEffect(refresh, [refresh]);
```

### 2. Register the route and nav link

Both live in `src/admin/Admin.tsx`. Pass `reauthenticate` as `onAuthError`.

```tsx
<NavLink to="/admin/projects" className={navClass}>Projects</NavLink>
<Route path="projects" element={<Projects onAuthError={reauthenticate} />} />
```

### 3. Use the shared inputs

`src/admin/components/ui.tsx` exports `StatusBadge`, `Field`, `inputClass`,
`primaryButton`, `ghostButton`, `dangerButton`. Reuse them before writing new
Tailwind — they are what keeps the CMS visually coherent.

## Data Fetching

The client is a plain `createTRPCClient`. There is no `@trpc/react-query` and no
TanStack Query, so `useQuery` and `useMutation` do not exist here.

The shape is a `useCallback` fetcher, `useEffect` to run it, and explicit state.
`null` means loading, a value means loaded. After a mutation, call `refresh()` —
there is no cache to invalidate.

Every `catch` branches on `isUnauthorized` before anything else. Skipping it
turns an expired session into a message the user cannot act on.

## Auth in the UI

There is no login screen. Cloudflare Access authenticates before the bundle
loads, so a rendered component means an authenticated visitor. Never add a login
form, a token field, or credentials in `localStorage`.

Recovery from an expired session is a full page reload via `reauthenticate()`,
not a retry and not a token refresh. An expired Access session answers XHRs with
a cross-origin redirect that `fetch` cannot follow, so only a top-level
navigation hands the browser back to Access.

`signOut()` clears the per-application token and the team-domain SSO session.
Clearing one leaves the other able to mint a replacement silently.

## Code Splitting

`App.tsx` loads `Admin` through `lazy()`. The admin chunk is roughly 450 kB
against 240 kB for the site, most of it TipTap, so a visitor reading one page
should never download it. Never import from `src/admin/` outside that boundary.

## Error Messages

`errorMessage()` output reaches real visitors. Write for someone who has never
seen the repo and cannot act on internals.

## Key Rules

- **Use design tokens**: never a literal Tailwind colour.
- **Reuse `components/ui.tsx`**: before writing new input or button styles.
- **No `useQuery` or `useMutation`**: the client is vanilla tRPC.
- **Branch on `isUnauthorized` first** in every catch.
- **Never add a login screen** or store credentials client-side.
- **Recover from auth failure with a reload**, never a retry.
- **Keep the admin chunk lazy**: no imports from `src/admin/` outside `App.tsx`.
- **Optional integrations render nothing** when unavailable, never an error.
