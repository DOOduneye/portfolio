---
name: frontend
description: Building the public site and the CMS. Covers component API design, typing props and events, modelling state so illegal states cannot exist, accessibility for a client-routed SPA, forms, design tokens, and adding a page. Trigger on frontend, react, typescript, component, props, page, styling, tailwind, admin, cms, ui, editor, tiptap, accessibility, form, state.
---

# Frontend

## Purpose

How to build and change the public site and the CMS that edits it.

## When to Use

- Adding or changing a page, section, or component
- Typing props, state, or events
- Fetching data in a component
- Styling anything
- Anything involving forms, keyboard use, or screen readers

## Architecture

- **Router**: `src/App.tsx` — `/` to the site, `/admin/*` to a lazily loaded CMS
- **Public site**: `src/pages/Home.tsx`
- **CMS shell**: `src/admin/Admin.tsx` — nav and routes
- **CMS pages**: `src/admin/pages/{PostsList,PostEdit,Projects,Experiences}.tsx`
- **tRPC client**: `src/admin/api.ts`
- **Shared inputs**: `src/admin/components/ui.tsx`
- **Editor**: `src/admin/components/PostEditor.tsx`, styles in `editor.css`
- **Tokens**: `src/index.css`

React 19, Vite, Tailwind v4, React Router 7, TipTap v3. No `clsx`, no
`tailwind-merge`, no component library — conditional classes are template
literals and the shared styles are exported strings.

## Design Philosophy

Typography-first and quiet. The public site is one page of text with almost no
chrome, and the CMS is a working surface rather than a product. Density over
decoration: no cards around things that are already grouped, no headings
restating the nav, no illustrations.

Every element earns its place. If a control, label or container can be removed
without losing meaning, remove it.

Two vendored skills cover ground this file deliberately does not repeat.
`vercel-react-best-practices` for rendering performance: memoisation, re-render
causes, bundle splitting. `vercel-composition-patterns` for component API design:
avoiding boolean prop proliferation, compound components, lifting state into
providers, children over render props.

## Typing Components

Use `type` for props, not `interface`, and name it once it has more than one
field. Inline object types are fine for a single prop.

```tsx
// Correct
type ProjectRowProps = {
  project: Project;
  onEdit: (project: Project) => void;
};

export function ProjectRow({ project, onEdit }: ProjectRowProps) {}

// Wrong — inline object type with several fields
export function ProjectRow({ project, onEdit }: { project: Project; onEdit: (p: Project) => void }) {}
```

Do not use `React.FC`. It adds an implicit `children` and gets in the way of
generics. Type the parameter directly.

This is React 19, so **do not use `forwardRef`** — pass `ref` as an ordinary prop:

```tsx
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & React.ComponentProps<"input">) {
  return <input ref={ref} {...props} />;
}
```

Use a discriminated union when props are mutually exclusive, rather than making
everything optional and hoping callers pair them correctly. A component growing
boolean props to switch behaviour is the signal to compose instead — see
`vercel-composition-patterns`.

```tsx
// Anti-pattern — nothing stops href and onClick both being passed, or neither
interface ActionProps {
  href?: string;
  onClick?: () => void;
}

// Better — the compiler enforces exactly one shape
type ActionProps =
  | { as: "link"; href: string }
  | { as: "button"; onClick: () => void };
```

Type event handlers from the element, not by hand:

```tsx
const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  setValue(event.target.value);
```

Derive types from the source rather than restating them. The router already
knows the row shapes, so use `inferRouterOutputs<AppRouter>` instead of reaching
through the client with `Awaited<ReturnType<typeof api...query>>`.

## Modelling State

Make illegal states unrepresentable. Several booleans that cannot all be true
should be one union.

```tsx
// Anti-pattern — loading && error is meaningless but expressible
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [items, setItems] = useState<Project[]>([]);

// Better — one value, and the render is a switch over it
type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: Project[] };
```

The current pages use `null` for loading and a value for loaded, which is the
smaller version of the same idea and acceptable for two states. Reach for the
union as soon as a third appears.

Derive rather than store. If a value can be computed from props or state during
render, compute it — do not mirror it into another `useState` and keep it in
sync with an effect.

## Rendering Patterns

For several mutually exclusive branches in JSX, use an inline IIFE rather than
nested ternaries:

```tsx
{(() => {
  if (state === "loading") return <Spinner />;
  if (state === "error") return <ErrorNote message={message} />;
  return <ProjectList items={items} />;
})()}
```

For per-variant icons, labels or styles, use a metadata map rather than a render
helper with a switch:

```tsx
const STATUS_META: Record<Status, { label: string; className: string }> = {
  draft: { label: "Draft", className: "text-subtle" },
  published: { label: "Published", className: "text-ok" },
};
```

## Accessibility

Client-side routing breaks screen readers by default: the DOM changes, the
browser does not navigate, and nothing is announced. Focus also stays on the
link that was clicked.

**Neither is handled in this app today.** When adding or reworking routing,
move focus to the new page's `h1` on route change, and give it `tabIndex={-1}`
so it can receive focus programmatically without entering the tab order. A
polite live region announcing the new page title is the belt-and-braces version.

Beyond routing:

- Every interactive element is a real `<button>` or `<a>`. Never an `onClick`
  on a `div` — it loses keyboard access and screen-reader semantics for free.
- Every input has a label. `Field` in `components/ui.tsx` wraps its child in a
  `<label>`, which associates them implicitly. Use it rather than a bare input
  with a styled `<span>` beside it.
- Icon-only controls need an accessible name via `aria-label`.
- Never remove a focus outline without replacing it with a visible alternative.
- Colour is never the only signal. `StatusBadge` carries text as well as colour,
  which is why it works.

## Forms

Validate on the server. Zod on the procedure is the boundary that matters; the
client should prevent obvious mistakes and give fast feedback, not be trusted.

Disable the submit control while a mutation is in flight and show that state, so
a double-click cannot fire two writes. Reset local draft state only after the
mutation resolves.

Confirmations for destructive actions currently use the native `confirm()`,
which cannot be styled or made consistent with the rest of the UI. Prefer a
dialog built from the same components as everything else when touching this.

## Design

The palette lives once in `src/index.css` as Tailwind v4 theme tokens. Use the
token, never a literal colour:

| Token | Use for |
|---|---|
| `page` | The base background |
| `surface` | Anything sitting on the page |
| `raised` | Anything sitting on a surface |
| `line` | Borders and dividers |
| `fg` | Headings and primary text |
| `muted` | The workhorse — body text |
| `subtle` | Helper and secondary text |
| `accent` / `accent-strong` | Primary actions, links |
| `ok` / `danger` | Published state, destructive actions |

```tsx
// Correct
<div className="bg-surface text-muted border border-line">

// Wrong
<div className="bg-zinc-900 text-gray-400 border border-gray-800">
```

UI text is sentence case. "Save changes", not "Save Changes".

Group class families across lines rather than one long string, so a diff shows
which family changed:

```tsx
className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
  isActive ? "bg-raised text-fg" : "text-muted hover:bg-surface hover:text-fg"
}`}
```

Dates render through `toLocaleDateString` with an explicit locale and options,
never a hand-rolled format.

Reuse `components/ui.tsx` — `StatusBadge`, `Field`, `inputClass`,
`primaryButton`, `ghostButton`, `dangerButton` — before writing new Tailwind.
A style repeated in a third place belongs there instead.

## Adding a Section to the Public Site

`Home.tsx` composes `<Section>` blocks. Add one there rather than a new route;
the public site is deliberately one page.

Anything backed by an external API renders nothing when unavailable, rather than
an error or a skeleton. `OnRepeat` is the pattern: the procedure returns `null`
when its secrets are unset or the call fails, and the component returns `null`
for a null value. A visitor should never see a broken integration.

## Adding an Admin Page

### 1. Create the page

```tsx
export function Projects({ onAuthError }: { onAuthError: () => void }) {
  const [items, setItems] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    api.admin.projects.list
      .query()
      .then(setItems)
      .catch((err) => {
        if (isUnauthorized(err)) onAuthError();
        else setError(errorMessage(err));
      });
  }, [onAuthError]);

  useEffect(refresh, [refresh]);
```

### 2. Register the route and nav link

Both in `src/admin/Admin.tsx`, passing `reauthenticate` as `onAuthError`.

```tsx
<NavLink to="/admin/projects" className={navClass}>Projects</NavLink>
<Route path="projects" element={<Projects onAuthError={reauthenticate} />} />
```

## Data Fetching

The client is a plain `createTRPCClient`. tRPC v11's React integration is
`@trpc/tanstack-react-query`, which is not installed, so there are no query
hooks and each page owns its state. Adopting it would remove that boilerplate;
until then match the existing pattern rather than mixing two.

A `useCallback` fetcher, `useEffect` to run it, explicit state. `null` is
loading. After a mutation, call `refresh()` — there is no cache to invalidate.

Every `catch` branches on `isUnauthorized` first, because an expired session
must trigger re-authentication rather than an error message. That branch is
currently repeated in nine handlers; when touching this area, prefer moving it
into the client over adding a tenth copy.

## Auth in the UI

Cloudflare Access authenticates before the bundle loads, so a rendered component
means an authenticated visitor. There is no login screen and should never be
one, and no credentials belong in `localStorage`. Recovery from an expired
session is `reauthenticate()`, which reloads. The `worker` skill covers why.

## Error Messages

`errorMessage()` output reaches real visitors. Write for someone who has never
seen the repo.

## Anti-Patterns

- **`interface` for props** — use `type`
- **`React.FC`** — type the parameter directly
- **`forwardRef`** — React 19 passes `ref` as an ordinary prop
- **Arbitrary Tailwind colours** — use the tokens
- **Title Case in UI text** — sentence case
- **Boolean props to switch behaviour** — compose instead
- **Parallel booleans for one state** — use a union
- **`useState` mirroring something derivable** — compute it in render
- **`onClick` on a `div`** — use a real `<button>`
- **An input without a label** — use `Field`
- **Nested ternaries in JSX** — inline IIFE
- **A render helper switching on a variant** — metadata map
- **Native `confirm()`** — currently used in three pages, should be a dialog
- **A style written a third time** — move it into `components/ui.tsx`
- **An error state for an optional integration** — render nothing
- **Importing from `src/admin/` outside `App.tsx`** — breaks the lazy boundary

## Reference Implementations

Read these before writing something similar:

- `src/admin/pages/PostsList.tsx` — the simplest list page; fetch, error, render
- `src/admin/pages/Projects.tsx` — list plus inline draft editing and delete
- `src/admin/pages/PostEdit.tsx` — detail page wrapping the TipTap editor
- `src/pages/Home.tsx` — public composition, and `OnRepeat` for a degrading integration
- `src/admin/components/ui.tsx` — the shared primitives

## Known Gaps

Marked so they are not mistaken for decisions:

- **Route changes are not announced and focus is not moved.** No `aria-live` or
  focus handling exists in `Admin.tsx` or `App.tsx`.
- **Auth error handling is duplicated in nine handlers.** Moving it into the
  client is the fix; do not add a tenth copy.
- **No form abstraction.** Each page hand-rolls draft state and submission. A
  canonical pattern should replace this section when one exists.
- **No dialog component.** Destructive confirmations use native `confirm()`.

## Related Skills

- `vercel-composition-patterns` — compound components, avoiding boolean props
- `vercel-react-best-practices` — re-renders, bundle size, memoisation
- `frontend-design` — visual direction when building something new
- `worker` — the API these pages call, and how auth works
- `code-quality` — the lifecycle and the verify loop
