# davidoduneye.com v2

Personal website for David Oduneye — software engineer. This is not a portfolio template. It's a window into how David thinks about building software.

## Stack

- **TanStack Start** — React, full-stack, file-based routing, server-first rendering
- **Effect TS** — data layer, error handling, service composition. Not decorative — used for real domain logic.
- **Better Auth** — self-hosted auth, admin-only (no public user accounts)
- **SQLite** (better-sqlite3) — blog posts, content, metadata
- **pnpm** — package manager
- **Docker** — containerized for deployment via Dokploy on a VPS
- **Tailwind CSS v4** — semantic design tokens, no hardcoded colors

## Architecture

### Server-first rendering
Every component runs on the server unless it proves it needs a browser. No `'use client'` without justification. Content appears instantly — no loading spinners, no skeleton screens for static content, no scroll-triggered animations.

### Parse at boundaries
All data entering the system goes through typed schemas. SQLite rows → Effect schemas → typed responses → React components. The type chain is unbroken. No `as any`. No `as unknown`.

### Composition over configuration
No boolean prop flags. Compound components where layout flexibility is needed. Keep component APIs small.

### Layers don't leak
- **Routes** — HTTP semantics, request parsing, response handling
- **Services** — business logic, content management (Effect services)
- **Data** — SQLite access, schema definitions

Routes never touch SQLite directly. Data layer never knows about HTTP.

## Pages

### `/` — Home
- Short intro: name, title, one-liner about what he does
- Latest 3 writing posts (title + date + one-line excerpt)
- Selected projects (2-3, with one sentence each)
- Links: GitHub (DOOduneye), email, LinkedIn
- No hero image. No animations. Typography and whitespace do the work.

### `/writing` — Blog index
- List of all posts, newest first
- Each entry: title, date, excerpt (first ~150 chars or explicit excerpt field)
- No pagination initially (SQLite can handle hundreds of posts in one query)
- Tags/categories if posts have them, but not required for v1

### `/writing/[slug]` — Individual post
- Server-rendered MDX
- Clean typography — the writing IS the product
- Code blocks with syntax highlighting (shiki)
- Reading time estimate
- Back link to /writing
- No comments, no reactions, no share buttons

### `/about` — About
- Bio: who David is, what he does, where he works
- Engineering philosophy in brief (distilled from his brain docs — not the full docs, just the vibe)
- Links: GitHub, LinkedIn, email
- Resume/CV download link (optional, can add later)

## Admin — Local HTTP API

A REST API bound to `127.0.0.1` only. No public-facing admin UI needed.

### Endpoints
```
POST   /api/admin/posts          — create a post
GET    /api/admin/posts           — list all posts (including drafts)
GET    /api/admin/posts/:slug     — get a single post
PUT    /api/admin/posts/:slug     — update a post
DELETE /api/admin/posts/:slug     — delete a post (soft delete)
POST   /api/admin/posts/:slug/publish   — publish a draft
POST   /api/admin/posts/:slug/unpublish — unpublish
```

### Post schema
```typescript
{
  slug: string           // URL-safe identifier
  title: string
  content: string        // MDX content
  excerpt: string | null // manual excerpt, or auto-generated
  tags: string[]
  status: 'draft' | 'published'
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

### Auth
Better Auth with a single admin user. API key or session-based auth for the local endpoints. Keep it simple — this is loopback only.

## Design System

### Principles
- **Dark default** with light mode support via CSS custom properties
- **Semantic tokens only** — `--color-text-primary`, `--color-bg-base`, never `gray-700`
- **Sentence case** on all UI text. "Latest writing" not "Latest Writing"
- **Typography-focused** — generous line height, readable measure (~65ch), system font stack or Inter/Geist
- **Minimal color** — near-monochrome with one accent color for links/interactive elements
- **No animations on content**. Transitions only on interactive elements (hover, focus) and only if they serve a purpose.

### Spacing
Use a consistent scale. Tailwind's default works — just use it consistently. Don't mix `p-3` and `p-[13px]`.

### Code blocks
Shiki for syntax highlighting. Support for multiple languages. Dark theme that matches the site.

## Project Structure

```
src/
  routes/
    index.tsx              # home page
    writing/
      index.tsx            # blog listing
      $slug.tsx            # individual post
    about.tsx              # about page
    api/
      admin/               # admin API routes
  components/
    layout/                # shell, nav, footer
    writing/               # post card, post content
    ui/                    # primitives (if needed)
  services/
    posts.ts               # Effect service for post CRUD
    content.ts             # MDX processing
  db/
    schema.ts              # SQLite schema
    client.ts              # database connection
    migrations/            # schema migrations
  styles/
    tokens.css             # design tokens
    global.css             # global styles
```

## Docker

```dockerfile
FROM node:22-alpine AS builder
# ... build steps

FROM node:22-alpine AS runner
# ... production image
EXPOSE 3000
```

Include a `docker-compose.yml` for local dev and a `Dockerfile` optimized for production.

## What NOT to build

- No analytics integration (can add later)
- No RSS feed (can add later, good candidate for v1.1)
- No comments system
- No newsletter signup
- No social share buttons
- No scroll animations or page transitions
- No client-side routing transitions
- No search (for now — SQLite FTS can be added later)
- No i18n
- No CMS UI — admin is API-only

## Content for launch

The brain docs from David's Obsidian vault will be adapted into the first blog posts. Don't copy them verbatim — they're written for an AI agent context. Adapt them into standalone engineering essays. But that's a separate step — for now, build the site with 1-2 placeholder posts so the layout works.

## Development

```bash
pnpm install
pnpm dev        # starts dev server
pnpm build      # production build
pnpm start      # production server
```

## Quality bar

- TypeScript strict mode, no `any`
- Effect TS used meaningfully — not just wrapping synchronous code
- All data flows through typed schemas
- Server components by default
- Clean, readable code — this site IS a portfolio piece
- Mobile responsive from day one
- Lighthouse performance score > 95
