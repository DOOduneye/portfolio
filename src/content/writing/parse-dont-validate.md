---
title: "Parse, don't validate"
description: "When data enters your system, you can validate it or parse it. One leaves you with the same untyped blob. The other gives you guarantees."
pubDate: 2026-03-30
---

There's a phrase that changed how I think about data flowing through a system: *parse, don't validate*.

The idea is simple. When data enters your system — from a user, an API, a database row — you have a choice. You can validate it (check that it looks right, then pass it along as the same untyped blob) or you can parse it (transform it into a typed structure that makes invalid states unrepresentable).

## Why it matters

Validation is a gate. Parsing is a transformation. After validation, you're still working with the same loosely-typed data. After parsing, you have a new value with stronger guarantees.

```typescript
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
```

## In practice

In a recent build of this site, every SQLite row went through an Effect schema before it reached a route handler. The database might return `null` for a column, or a JSON string where I expect an array. The schema layer catches that at the boundary, so the rest of the code never worries about it.

The cost is a few extra lines at the edge. The payoff is that every function downstream can trust its inputs completely.

## The deeper principle

Parse, don't validate is really about **pushing uncertainty to the edges**. The boundary between your system and the outside world is where things are messy. Handle the mess there. Once data is inside, it should be clean, typed, and trustworthy.

This applies beyond just data. Configuration, environment variables, feature flags — anything that enters from outside should be parsed into a typed structure at the point of entry.
