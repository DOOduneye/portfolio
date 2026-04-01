import { Effect } from "effect";
import { migrate } from "./schema";
import { createPost, publishPost } from "../services/posts";

const posts = [
  {
    slug: "parse-dont-validate",
    title: "Parse, don't validate",
    content: `Alexis King wrote a blog post in 2019 that changed how I think about data flowing through a system: [Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/). The distinction is sharp. Validation checks a property and throws the knowledge away. Parsing checks a property and *preserves it in the type*.

Consider the difference. You receive some data from an API. You check that it has the right shape, the right fields, the right types. If you validate, the data passes your checks — but the type system still sees it as \`unknown\` or \`Record<string, any>\`. Every function downstream either re-checks or trusts blindly. If you parse, you transform it into a typed structure. The function signature *is* the proof that parsing happened. No one downstream has to wonder.

\`\`\`typescript
// Validation — you checked, but the type doesn't know that
function processUser(data: unknown) {
  if (typeof data !== 'object' || !data) throw new Error('Invalid');
  if (typeof (data as any).name !== 'string') throw new Error('Invalid');
  // data is still 'unknown' — the check evaporated
}

// Parsing — the type reflects what you proved
import { Schema } from "effect";

const User = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
});

const user = Schema.decodeUnknownSync(User)(data);
// user is now typed. The schema IS the proof.
\`\`\`

## Push uncertainty to the edges

The deeper principle is about where mess lives in your system. The boundary between your code and the outside world is inherently messy. Users send garbage. APIs return unexpected shapes. Database rows might have nulls where you expect values. That's fine — the outside world is the outside world.

The mistake is letting that mess leak inward. If you find yourself writing \`data["user_id"]\` three layers deep, you failed to parse at the boundary. You carried raw, unstructured data into the heart of your system, and now every function has to be defensive.

In this site's codebase, every SQLite row goes through an Effect schema before it reaches a route handler. The database might return \`null\` for a column, or a string where I expect a date. The schema layer catches that at the boundary. Everything downstream operates on types that *cannot* represent invalid states.

## Make invalid states unrepresentable

This is the natural extension. Yaron Minsky at Jane Street coined the phrase: "make illegal states unrepresentable." Design your types so that wrong data literally cannot be constructed.

\`\`\`typescript
// Bad: permits enabled=true with no channel
type NotificationSettings = {
  enabled: boolean;
  channelId: string | null;
};

// Good: the type makes the impossible state impossible
type EnabledNotification = {
  readonly enabled: true;
  readonly channelId: string;
};
type DisabledNotification = {
  readonly enabled: false;
  readonly channelId: string | null;
};
type NotificationSettings = EnabledNotification | DisabledNotification;
\`\`\`

Same idea, different scale. A \`CreatePost\` schema has no \`id\` — it hasn't been assigned yet. A \`Post\` schema has a required \`id\`. A \`PostUpdate\` has all fields optional. Three schemas mean the type checker catches confusion between read and write models. You cannot pass a read model where a write model is expected. The compiler blocks it. This isn't ceremony — it's encoding business rules into the type system so humans don't have to remember them.

## The type chain

The highest-leverage consequence of parsing at the boundary is the type chain. A schema defines the shape. The schema generates an API spec. The spec generates TypeScript types. The types flow into components. If you get the schema right at the source, every downstream consumer inherits that correctness mechanically. Bertrand Meyer called this Design by Contract. The toolchain realizes it.

Breaking the chain is expensive. One \`any\` in a schema or one \`as unknown\` in TypeScript punctures the guarantee. You trade one line of convenience for an entire class of runtime bugs. The spectrum from tests to types to proofs: tests check specific cases, types check all cases for a specific property. Most teams dramatically underuse the middle option. A well-designed type is worth a hundred test cases, because it makes the wrong cases impossible rather than merely tested.

The cost is a few extra lines at the edge. The payoff is that every function downstream can trust its inputs completely.`,
    excerpt:
      "Validation checks a property and throws the knowledge away. Parsing checks it and preserves it in the type. One gives you guarantees. The other gives you hope.",
    tags: ["typescript", "architecture", "effect"],
  },
  {
    slug: "layers-dont-leak",
    title: "Layers don't leak",
    content: `Every codebase I've worked on that became hard to maintain had the same disease: layer violations. The HTTP handler queries the database directly. The data layer formats an error message for the user. The service layer constructs HTML. When layers leak, changes cascade. You can't swap the database without rewriting routes. You can't change the API response format without touching business logic. The code becomes a single interconnected mass where everything depends on everything.

Joel Spolsky wrote about the Law of Leaky Abstractions — all non-trivial abstractions leak. He's right. The practical response isn't to abandon abstraction. It's to contain the leaks within clear boundaries.

## Three layers, three jobs

The separation is straightforward:

- **Routes** handle HTTP — parsing requests, formatting responses, setting status codes. They know about \`Request\`, \`Response\`, and status codes. They don't know SQL exists.
- **Services** handle business logic — validation, orchestration, domain decisions. They don't know what HTTP is. They return typed data or typed errors.
- **Data** handles storage — queries, schema, migrations. It talks to the database. It returns rows or \`null\`. It has no opinion about what happens next.

Each layer talks only to the one below it. Routes call services. Services call data. Never the reverse.

\`\`\`typescript
// Route — knows about HTTP, not about SQL
export const APIRoute = createAPIFileRoute("/api/posts")({
  GET: async () => {
    const posts = Effect.runSync(listPublishedPosts);
    return json(posts);
  },
});

// Service — knows about business rules, not about HTTP or SQL
export const listPublishedPosts = Effect.sync(() => {
  const rows = db.prepare(
    "SELECT * FROM posts WHERE status = 'published'"
  ).all();
  return rows.map(rowToPost);
});
\`\`\`

The route doesn't know the posts come from SQLite. The service doesn't know its output becomes JSON over HTTP. Each layer has one job.

## The hexagonal architecture insight

Alistair Cockburn's hexagonal architecture formalizes this. The application core — your business logic — is protected from the outside world. Adapters absorb all technology-specific concerns. The HTTP adapter translates requests into service calls and service results into responses. The database adapter translates service queries into SQL. Multiple adapters can attach to the same core: a web handler, a CLI tool, a test harness, a background worker. The core doesn't change.

This is why I use Effect services. The service layer is the core. It doesn't import Express, Hono, or any HTTP framework. It doesn't import better-sqlite3. It operates on typed inputs and produces typed outputs. When I swap the web framework or the database driver, the services don't notice.

## Error translation at boundaries

Expected absence — the entity doesn't exist, the search returned nothing — gets handled differently at each layer. The data layer returns \`null\`. The service layer propagates that as a typed error. The route layer translates it into a 404.

\`\`\`typescript
// Data: returns null for missing
const row = db.prepare("SELECT * FROM posts WHERE slug = ?")
  .get(slug) as PostRow | undefined;

// Service: propagates as typed error
if (!row) return yield* Effect.fail(new PostNotFoundError(slug));

// Route: translates to HTTP
const exit = Effect.runSyncExit(getPostBySlug(slug));
if (exit._tag === "Failure") return new Response("Not found", { status: 404 });
\`\`\`

The data layer doesn't presume that "not found" means 404. Maybe the caller is a CLI and "not found" means print a message. Maybe it's a migration script and "not found" means create. The data layer just says "this doesn't exist" and lets the caller decide what that means.

## The discipline

The hard part isn't knowing the principle — it's maintaining it under pressure. When you're in a hurry, the fastest path from request to database is a straight line through all the layers. You write a route handler that opens a database connection, runs a query, and formats the response. It works. It ships. And it costs you next month when you need to change any of those three concerns independently.

The discipline is: even when it's more code, keep the layers separate. When layers are clean, you can test services without spinning up an HTTP server. You can change the database without touching route handlers. You can understand any layer without understanding the others. The payoff is a codebase that stays maintainable as it grows.`,
    excerpt:
      "Routes handle HTTP. Services handle logic. Data handles storage. When these layers bleed into each other, the codebase becomes unmaintainable.",
    tags: ["architecture", "software-design"],
  },
  {
    slug: "server-first-client-when-needed",
    title: "Server-first, client when needed",
    content: `Every component runs on the server unless it proves it needs a browser. That's the rule. Not "should this be a Server Component?" but "does this need \`useState\`, event handlers, or browser APIs?" If the answer is no, stop. You're done.

The W3C's Rule of Least Power applies directly here. Tim Berners-Lee and Noah Mendelsohn's principle: choose the least powerful language suitable for the purpose, because less power means more can be done with the output. Applied to React: if a component doesn't need interactivity, don't ship JavaScript for it.

## The cost of \`'use client'\`

The \`'use client'\` directive is not an annotation — it's a cost declaration. Everything below that boundary ships JavaScript to the browser. The browser has to download it, parse it, execute it, and hydrate it before the user sees anything. A Server Component skips all of that. It renders HTML on the server and streams it to the browser. The user sees content in the time it takes to receive bytes over the network.

This isn't a micro-optimization. It determines first-paint speed.

\`\`\`tsx
// Server Component — zero JavaScript shipped
async function RecentPosts() {
  const posts = await db.posts.findRecent();
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.slug}>{p.title} — {p.publishedAt}</li>
      ))}
    </ul>
  );
}

// Client Component — JavaScript shipped, parsed, hydrated
'use client';
function PostFilter({ tags }: { tags: string[] }) {
  const [selected, setSelected] = useState(tags[0]);
  return <Select value={selected} onValueChange={setSelected} />;
}
\`\`\`

The Server Component fetches data, renders HTML, sends the result. No \`useEffect\`, no loading spinner, no client-side fetch waterfall. The Client Component exists only because \`useState\` requires a browser. That's the justification bar.

## First-paint architecture

What the user sees in the first 100ms determines whether the app feels fast or loading. Nielsen's research and Google's RAIL model converge on the same thresholds: under 100ms feels instant, under 1 second feels responsive, over 1 second needs a progress indicator.

Architecture follows from this constraint. The pattern I use: prefetch on the server, hydrate on the client, suspend until ready.

\`\`\`tsx
// layout.tsx — Server Component
export default async function WritingLayout({
  children
}: { children: React.ReactNode }) {
  // Server fires all prefetches in parallel — no waterfall
  await prefetch(
    trpc.posts.list.queryOptions({ status: 'published' }),
    trpc.posts.tags.queryOptions(),
  );

  return (
    <HydrateClient>
      {children}
    </HydrateClient>
  );
}
\`\`\`

The server fires all data fetches in parallel. No waterfall. The data serializes into the page. On the client, \`useSuspenseQuery\` reads from cache with zero loading state. The user never sees a spinner for content that was already fetched on the server.

## The interleaving pattern

The key technique for keeping the client boundary small: a Server Component passes \`children\` to a Client Component. The server-rendered content passes *through* the client component without entering the client bundle.

\`\`\`tsx
// Server Component
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>        {/* Client — manages nav state */}
      <Navigation />     {/* Client — interactive */}
      <main>{children}</main>  {/* Server — children are server-rendered */}
    </NavProvider>
  );
}
\`\`\`

\`NavProvider\` is a Client Component because it uses context. But \`{children}\` can be a deeply nested tree of Server Components. React serializes them on the server and passes them through. Context providers sit at the boundary — the thinnest possible client wrapper around maximum server-rendered content.

The constraint to internalize: you cannot *import* a Server Component inside a Client Component. But you can *pass* one as a prop. This distinction drives the entire component tree design.

## Composition over configuration

When a component grows boolean props — \`showHeader\`, \`isCompact\`, \`hasFooter\` — that's a design smell. The fix is compound components: inversion of control where the consumer controls layout and the component owns behavior.

\`\`\`tsx
<Page.Root>
  <Page.Header>
    <Page.Header.Row>
      <Breadcrumb>Writing</Breadcrumb>
    </Page.Header.Row>
  </Page.Header>
  <Page.Content>
    <Page.Main>{children}</Page.Main>
  </Page.Content>
</Page.Root>
\`\`\`

Adding a new layout doesn't require new booleans. You rearrange children. The component is open for extension without modification.

## No loading spinners for static content

This site has no loading spinners. No skeleton screens for blog posts. No scroll-triggered animations. Content appears instantly because it's server-rendered HTML. The writing *is* the product — it doesn't need a reveal animation to be worth reading.

The question I ask for every component: does this need a browser? If not, it ships zero JavaScript. The default is the server. The client is the exception, justified by interactivity.`,
    excerpt:
      "Every component runs on the server unless it proves it needs a browser. The 'use client' directive is a cost declaration, not an annotation.",
    tags: ["react", "architecture", "performance"],
  },
  {
    slug: "own-your-primitives",
    title: "Own your primitives",
    content: `I run this site on a VPS. SQLite for the database. No managed Postgres, no Planetscale, no Vercel, no Netlify. Docker on a machine I control, deployed through Dokploy. The entire stack fits in my head.

This isn't a contrarian stance. It's a design decision about where complexity lives and who controls it.

## The abstraction tax

Every managed service is an abstraction over infrastructure you could run yourself. Some of those abstractions are worth paying for — I'm not building my own email delivery system. But each one introduces a dependency you don't control. Pricing changes. APIs deprecate. Rate limits tighten. Outages happen on someone else's schedule. The vendor's incentives and yours are aligned right up until they aren't.

The question I ask: what happens when this breaks at 2am? With a VPS and SQLite, the answer is straightforward. SSH in, check the logs, restart the process, read the database file directly if needed. With a managed service, the answer is: open a support ticket and wait.

## SQLite is enough

The industry defaults to Postgres or MySQL for everything. For a personal site — even one with an admin API, content management, and structured data — SQLite is more than enough. It's a single file. Backups are \`cp\`. Deployment is copying the file. There's no connection pool to configure, no separate database server to maintain, no network latency between your app and your data.

SQLite handles hundreds of concurrent reads without breaking a sweat. Write contention only matters at scale I'll never hit on a personal site. WAL mode gives me concurrent reads during writes. The entire database fits in memory.

\`\`\`typescript
// The entire data layer. No connection strings, no pools, no ORM.
import Database from "better-sqlite3";

const db = new Database("data/blog.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
\`\`\`

Three lines. The database is ready. Compare that to configuring a managed Postgres instance: connection strings, SSL certificates, connection pooling with PgBouncer, environment-specific credentials, migration tooling that handles remote connections. Each step is solvable, but they compound into operational complexity that doesn't serve the problem.

## VPS over platforms

Platform-as-a-service tools like Vercel and Railway solve real problems for teams that need to ship fast without devops expertise. But they come with constraints: cold starts, function duration limits, ephemeral filesystems, vendor-specific configuration formats, and pricing models that penalize success.

A VPS is a Linux box. Everything I know about Unix applies directly. Docker gives me reproducible builds. A reverse proxy handles TLS. The deployment is \`docker compose up -d\`. No build packs, no serverless adapters, no framework-specific deployment plugins.

The mental model is simpler. There's a server. It runs a process. The process serves HTTP. The database is a file on disk. When something goes wrong, I have \`ssh\`, \`journalctl\`, and \`sqlite3\`. The debugging tools are the same ones I've used for years.

## Control as a feature

Self-hosting is not about saving money — managed services are often cheaper when you factor in time. It's about control. When I own the infrastructure, I can:

- **Read the database directly** with the \`sqlite3\` CLI during an incident
- **Change anything** without checking if the platform supports it
- **Keep data local** — no third-party data processing agreements for a personal site
- **Understand the full stack** — there's no black box between my code and the user

This site is a portfolio piece. The stack is part of the statement. TanStack Start for server-first React. Effect for typed, composable services. SQLite for data. Docker for deployment. Every choice is deliberate, every layer is visible, and I can explain any part of it because I own all of it.

## When not to self-host

This philosophy doesn't scale to every problem. If I were building a product with a team, I'd use managed Postgres for replication and point-in-time recovery. I'd use a proper CI/CD platform. I'd pay for monitoring. The calculus changes when downtime costs real money and there are more important things to build than infrastructure.

But for a personal site — for a system where I'm the only engineer, the only user of the admin API, and the only person who needs to debug it — owning the primitives is the right call. The stack is small. The dependencies are minimal. The blast radius of any failure is me.`,
    excerpt:
      "A VPS, SQLite, and Docker. No managed databases, no platform abstractions. When you own the stack, you can explain every part of it.",
    tags: ["infrastructure", "philosophy", "self-hosting"],
  },
  {
    slug: "small-prs-real-reviews",
    title: "Small PRs, real reviews",
    content: `The SmartBear/Cisco study — the largest empirical study of code review at the time — found that review effectiveness sits at 80-90% for changes under 200 lines and drops below 70% past 400 lines. Google's internal data tells the same story: changelists under 100 lines had median review turnaround under 1 hour. Over 1,000 lines? 24+ hours, with fewer substantive comments. Microsoft Research found that reviews touching more than 20 files degrade in comment density and usefulness.

The mechanism is straightforward. A reviewer has a finite attention budget. A 50-line change fits in working memory. A 2,000-line change does not. When the diff exceeds what a reviewer can hold in their head, they shift from "does this logic handle the edge case?" to "what is this change even doing?" Defects hide in the gap between those two modes.

## Separate concerns, separate PRs

The practical discipline: separate refactors from features. Separate migrations from logic. Separate mechanical changes from behavioral changes. If a reviewer has to ask "why are there three unrelated things in this PR?", the PR is too big. Not because of a line count threshold, but because it mixes concerns.

A 500-line PR that renames a variable across 40 files is easy to review — it's one mechanical change, repeated. A 200-line PR that refactors a function, adds a feature, and fixes a bug is hard to review — the reviewer can't tell which changes preserve behavior and which introduce new behavior.

## Preparatory refactoring

Kent Beck: "Make the change easy (warning: this may be hard), then make the easy change."

This is the most underused technique I've seen in professional software engineering. The insight is that the hard part of a feature is rarely the feature itself — it's that the code isn't shaped to receive it. You want to add a new field to the blog post schema, but the rendering pipeline doesn't have a hook for metadata. You want to add tag filtering, but the query layer is tangled with response formatting.

The wrong move is to implement the feature and the restructuring in one PR. The right move is two PRs. First: pure refactoring. Behavior-preserving, green tests throughout, easy to review. Second: the feature, small and focused, building on the clean structure the first PR created.

Jessica Kerr's metaphor (cited by Martin Fowler): you want to go 100 miles east. You could trudge straight through the woods. Or you could drive 20 miles north to the highway, then 100 miles east at triple speed. The preparatory refactoring is the 20 miles north.

\`\`\`
PR 1: Refactor — extract query building from response formatting
  (behavior-preserving, easy to review, low risk)

PR 2: Feature — add tag filtering to the blog listing
  (small, focused, builds on clean structure)
\`\`\`

The reviewer can verify PR 1 preserves behavior. They can verify PR 2 introduces the right behavior. They can't do both at once — and asking them to is how bugs get through review.

## The boy scout rule

"Leave the code better than you found it." Not a grand refactoring project. Small, continuous improvements. Rename a confusing variable while you're fixing a bug nearby. Extract a helper while you're adding a feature to the same file. Delete dead code when you notice it.

Ward Cunningham's original technical debt metaphor — from his 1992 OOPSLA paper — is routinely misunderstood. He was *not* describing sloppy code. He was describing the decision to ship code that reflects your current, incomplete understanding of the domain. The debt is epistemic, not structural. You didn't know the domain well enough yet, so you shipped your best approximation. That's fine — as long as you pay it back by refactoring when you learn more.

What most teams call "technical debt" — missing tests, copy-pasted logic, unclear names — Cunningham would call something else entirely. That's not deliberate debt. That's just a mess.

## PR descriptions explain why

The diff shows *what* changed. The PR description explains *why*:

- What problem does this solve?
- Why this approach over the alternatives?
- What should the reviewer pay attention to?

If you can't explain why a change is correct in two paragraphs, you may not fully understand it yet. The PR description forces you to articulate your reasoning — which is itself a form of review.

## The compound effect

Small changes compound. Each well-reviewed 50-line PR is a brick. Each sloppy 1,000-line PR is a gamble. Over months, the team that ships small, well-separated changes has a codebase they can understand, extend, and debug. The team that ships big PRs has a codebase they're afraid to touch.

Smaller changes also reduce blast radius. A revert of 40 lines is surgical. A revert of 1,500 lines risks collateral damage — which means teams avoid reverting, which means broken code stays in production longer. The discipline of small PRs isn't about process for its own sake. It's about building confidence that you can change the system safely, one small step at a time.`,
    excerpt:
      "Review effectiveness drops below 70% past 400 lines. The fix isn't faster reviewers — it's smaller changes that separate concerns.",
    tags: ["process", "code-review", "craft"],
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
    console.log(`Created (draft): ${post.title}`);
  }

  console.log("Seed complete — all posts created as drafts.");
}

seed();
