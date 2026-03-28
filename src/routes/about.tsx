import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About — David Oduneye" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
          <p>
            I'm David, a software engineer based in Brooklyn. I build
            product infrastructure at Agency, where I work on AI-powered
            meeting intelligence, Slack integrations, and the systems that
            connect them.
          </p>
          <p>
            I care about clean architecture, type safety, and building software
            that's safe to change. The best code makes invalid states
            unrepresentable, pushes uncertainty to the edges, and reads like
            the system it models.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
          Experience
        </h2>
        <div className="space-y-8">
          <ExperienceItem
            company="Agency"
            role="Software Engineer"
            location="New York, NY"
            period="Mar 2025 — present"
            description="Building AI-powered CRM infrastructure. Kai (Slack AI assistant), meeting intelligence pipelines, Temporal workflow optimization, and full-stack product features across Python/FastAPI and TypeScript/Next.js."
          />
          <ExperienceItem
            company="Microsoft"
            role="Software Engineering Intern"
            location="Seattle, WA"
            period="Summer 2024"
            description="Worked on internal tooling and engineering systems."
          />
          <ExperienceItem
            company="Northeastern University"
            role="B.S. Computer Science"
            location="Boston, MA"
            period="2021 — 2025"
            description=""
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
          Projects
        </h2>
        <div className="space-y-6">
          <ProjectItem
            title="SAC"
            href="https://github.com/GenerateNU/sac"
            description="Led a team building a platform for university organizations — app, website, and admin dashboards. Event management, applications, member tools."
            tags={["TypeScript", "React Native", "Redis", "Docker", "Nginx"]}
          />
          <ProjectItem
            title="Flow"
            href="https://github.com/DOOduneye/flow"
            description="Rule-based investment automation that connects bank and portfolio accounts for recurring deposits and financial management."
            tags={["Go", "TypeScript", "AWS", "React Native"]}
          />
          <ProjectItem
            title="Passover"
            description="Real-time chat application with file sharing, messaging, and code exchange built on git-style interactions. No third-party platforms."
            tags={["Rust", "AWS", "Redis", "Postgres", "Vite"]}
          />
          <ProjectItem
            title="davidoduneye.com"
            href="https://github.com/DOOduneye/portfolio"
            description="This site. Server-rendered, self-hosted, own my primitives."
            tags={["TanStack Start", "Effect TS", "SQLite", "Docker"]}
          />
          <ProjectItem
            title="Rate My Dorm"
            href="https://github.com/dooduneye/rate-my-dorm-web-app"
            description="Web app for students to rate and find the best dorms on campus."
            tags={["MongoDB", "Express", "Node.js", "React"]}
          />
          <ProjectItem
            title="Freelance Projects"
            href="https://github.com/Polaris-Freelance"
            description="Freelance web development work across multiple clients."
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
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
            Routes handle HTTP. Services handle logic. Data handles storage.
          </li>
          <li>
            <strong className="text-text-primary">Own your primitives.</strong>{" "}
            Self-hosted auth, SQLite, VPS. Rent less, control more.
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
            href="https://www.linkedin.com/in/davidoduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}

function ProjectItem({
  title,
  href,
  description,
  tags,
}: {
  title: string;
  href?: string;
  description: string;
  tags?: string[];
}) {
  const Wrapper = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper {...linkProps} className={href ? "group block" : "block"}>
      <h3 className={`font-medium text-text-primary ${href ? "transition-colors group-hover:text-accent" : ""}`}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-bg-subtle px-2 py-0.5 text-xs text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

function ExperienceItem({
  company,
  role,
  location,
  period,
  description,
}: {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium text-text-primary">{company}</h3>
        <span className="shrink-0 text-sm text-text-muted">{period}</span>
      </div>
      <p className="text-sm text-text-secondary">
        {role} · {location}
      </p>
      {description && (
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
