import { Effect } from "effect";
import { migrate } from "./schema";
import { createPost, publishPost } from "../services/posts";

const posts = [
  {
    slug: "parse-dont-validate",
    title: "Parse, don't validate",
    content: `There's a phrase that changed how I think about data flowing through a system: *parse, don't validate*.

The idea is simple. When data enters your system — from a user, an API, a database row — you have a choice. You can validate it (check that it looks right, then pass it along as the same untyped blob) or you can parse it (transform it into a typed structure that makes invalid states unrepresentable).

## Why it matters

Validation is a gate. Parsing is a transformation. After validation, you're still working with the same loosely-typed data. After parsing, you have a new value with stronger guarantees.

\`\`\`typescript
// Validation — you checked, but the type doesn't know that
function processUser(data: unknown) {
  if (typeof data !== 'object' || !data) throw new Error('Invalid');
  if (typeof (data as any).name !== 'string') throw new Error('Invalid');
  // data is still 'unknown' in the type system
}

// Parsing — the type reflects what you proved
import { Schema } from "effect";

const User = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
});

// After decoding, you have a User — not unknown
const user = Schema.decodeUnknownSync(User)(data);
\`\`\`

## In practice

In this site's codebase, every SQLite row goes through an Effect schema before it reaches a route handler. The database might return \`null\` for a column, or a JSON string where I expect an array. The schema layer catches that at the boundary, so the rest of the code never worries about it.

The cost is a few extra lines at the edge. The payoff is that every function downstream can trust its inputs completely.

## The deeper principle

Parse, don't validate is really about **pushing uncertainty to the edges**. The boundary between your system and the outside world is where things are messy. Handle the mess there. Once data is inside, it should be clean, typed, and trustworthy.

This applies beyond just data. Configuration, environment variables, feature flags — anything that enters from outside should be parsed into a typed structure at the point of entry.`,
    excerpt:
      "When data enters your system, you can validate it or parse it. One leaves you with the same untyped blob. The other gives you guarantees.",
    tags: ["typescript", "architecture", "effect"],
  },
  {
    slug: "layers-dont-leak",
    title: "Layers don't leak",
    content: `Every codebase I've worked on that became hard to maintain had the same disease: layer violations. The HTTP handler reaches into the database. The data layer formats an error message for the user. The service layer constructs HTML.

When layers leak, changes cascade. You can't swap the database without rewriting routes. You can't change the API response format without touching business logic. The code becomes a single interconnected mass where everything depends on everything.

## What clean layers look like

A well-layered system has clear boundaries:

- **Routes** handle HTTP — parsing requests, formatting responses, setting status codes
- **Services** handle business logic — validation, orchestration, decisions
- **Data** handles storage — queries, schema, migrations

Each layer talks only to the one below it. Routes call services. Services call data. Data talks to the database. Never the reverse.

\`\`\`typescript
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
\`\`\`

## Why this matters

When layers are clean, you can:

- **Test services** without spinning up an HTTP server
- **Change the database** without touching route handlers
- **Modify response formats** without rewriting business logic
- **Understand any layer** without understanding the others

## The discipline

The hard part isn't knowing the principle — it's maintaining it under pressure. When you're in a hurry, the fastest path from request to database is a straight line through all the layers. The shortcut works today and costs you next month.

The discipline is: even when it's more code, keep the layers separate. The payoff is a codebase that stays maintainable as it grows.`,
    excerpt:
      "Routes handle HTTP. Services handle logic. Data handles storage. When layers leak into each other, the codebase becomes unmaintainable.",
    tags: ["architecture", "software-design"],
  },
];

async function seed() {
  migrate();

  for (const post of posts) {
    const exit = Effect.runSyncExit(createPost(post));
    if (exit._tag === "Failure") {
      console.log(`Post "${post.slug}" already exists, skipping.`);
      continue;
    }
    Effect.runSync(publishPost(post.slug));
    console.log(`Created and published: ${post.title}`);
  }

  console.log("Seed complete.");
}

seed();
