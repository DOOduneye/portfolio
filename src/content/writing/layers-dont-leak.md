---
title: "Layers don't leak"
description: "Routes handle HTTP. Services handle logic. Data handles storage. When layers leak into each other, the codebase becomes unmaintainable."
pubDate: 2026-03-30
---

Every codebase I've worked on that became hard to maintain had the same disease: layer violations. The HTTP handler reaches into the database. The data layer formats an error message for the user. The service layer constructs HTML.

When layers leak, changes cascade. You can't swap the database without rewriting routes. You can't change the API response format without touching business logic. The code becomes a single interconnected mass where everything depends on everything.

## What clean layers look like

A well-layered system has clear boundaries:

- **Routes** handle HTTP — parsing requests, formatting responses, setting status codes
- **Services** handle business logic — validation, orchestration, decisions
- **Data** handles storage — queries, schema, migrations

Each layer talks only to the one below it. Routes call services. Services call data. Data talks to the database. Never the reverse.

```typescript
// Route — knows about HTTP, not about SQL
export const APIRoute = createAPIFileRoute("/api/posts")({
  GET: async () => {
    const posts = Effect.runSync(listPublishedPosts);
    return json(posts);
  },
});

// Service — knows about business rules, not about HTTP
export const listPublishedPosts = Effect.sync(() => {
  const db = getDb();
  const rows = db.prepare(
    "SELECT * FROM posts WHERE status = 'published'"
  ).all();
  return rows.map(rowToPost);
});
```

## Why this matters

When layers are clean, you can:

- **Test services** without spinning up an HTTP server
- **Change the database** without touching route handlers
- **Modify response formats** without rewriting business logic
- **Understand any layer** without understanding the others

## The discipline

The hard part isn't knowing the principle — it's maintaining it under pressure. When you're in a hurry, the fastest path from request to database is a straight line through all the layers. The shortcut works today and costs you next month.

The discipline is: even when it's more code, keep the layers separate. The payoff is a codebase that stays maintainable as it grows.
