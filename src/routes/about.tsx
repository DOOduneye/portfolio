import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About — David Oduneye" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <div className="mt-6 space-y-4 text-text-secondary">
          <p>
            I'm David Oduneye, a software engineer focused on building
            thoughtful, well-crafted software. I care about clean architecture,
            type safety, and systems that are simple enough to reason about but
            robust enough to rely on.
          </p>
          <p>
            I think the best software is built with strong opinions, loosely
            held. I gravitate toward tools that make the right thing easy and the
            wrong thing hard — TypeScript with strict mode, Effect for
            composable error handling, SQLite for data that doesn't need a
            distributed database.
          </p>
          <p>
            When I'm not writing code, I'm usually reading about systems design,
            thinking about developer experience, or writing about what I've
            learned.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Engineering philosophy
        </h2>
        <ul className="space-y-3 text-text-secondary">
          <li>
            <strong className="text-text-primary">Parse, don't validate.</strong>{" "}
            Data gets typed at the boundary. After that, the types do the work.
          </li>
          <li>
            <strong className="text-text-primary">
              Composition over configuration.
            </strong>{" "}
            Small pieces that fit together beat large pieces with many knobs.
          </li>
          <li>
            <strong className="text-text-primary">
              Server-first, client when needed.
            </strong>{" "}
            Ship HTML. Hydrate only what moves.
          </li>
          <li>
            <strong className="text-text-primary">Layers don't leak.</strong>{" "}
            Routes handle HTTP. Services handle logic. Data handles storage. They
            don't reach into each other.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Links
        </h2>
        <div className="flex gap-4 text-text-secondary">
          <a
            href="https://github.com/DOOduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/davidoduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="mailto:david@oduneye.com"
            className="transition-colors hover:text-accent"
          >
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
