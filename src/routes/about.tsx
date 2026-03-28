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
            I'm a software engineer focused on applied AI, automation, and the
            engineering that makes it dependable. I care about reliability, clean
            interfaces, and the details that make software feel effortless.
          </p>
          <p>
            Outside of work, I'm an avid powerlifter. I also love music,
            photography, travel, and film — anything that trains your eye and
            keeps you curious.
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
            period="Aug 2025 — present"
            description="Building AI-powered CRM infrastructure. Kai (Slack AI assistant), meeting intelligence pipelines, Temporal workflow optimization, full-stack product across Python/FastAPI and TypeScript/Next.js."
          />
          <ExperienceItem
            company="Google"
            role="Software Engineering Intern"
            location="New York City, NY"
            period="Aug 2024"
            description="Enhanced test visibility for ARM and x86 architectures."
          />
          <ExperienceItem
            company="Microsoft"
            role="Software Engineering Intern"
            location="Seattle, WA"
            period="May — Aug 2024"
            description="Developing performance tools for data ingestion of security information."
          />
          <ExperienceItem
            company="Boston Scientific"
            role="Software Engineer Co-op"
            location="Boston, MA"
            period="Jan — May 2024"
            description="Embedding Active Directory into arrhythmia software to aid application integration within hospital AD DC infrastructure."
          />
          <ExperienceItem
            company="Genentech"
            role="Machine Learning Co-op"
            location="San Francisco, CA"
            period="Jan — Jun 2023"
            description="Developed a drug data structuring system using Transformer models and rule-based matching to normalize unstructured text, improving data interoperability within gRED by 20%."
          />
          <ExperienceItem
            company="Generate"
            role="Technical Lead"
            location="Boston, MA"
            period="Aug 2022 — Jun 2024"
            description="Led a team of 6 developers to improve Northeastern's community engagement system."
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
            description="Platform for university organizations — app, website, and admin dashboards. Event management, applications, member tools."
            tags={["TypeScript", "React Native", "Redis", "Docker", "Nginx"]}
          />
          <ProjectItem
            title="Hydrate"
            href="https://pkg.go.dev/github.com/dooduneye/hydrate"
            description="Authentication utility for Go using JWT flow. Easy implementation, built for customizability."
            tags={["Go", "Open Source"]}
          />
          <ProjectItem
            title="Flow"
            description="Rule-based investment automation connecting bank and portfolio accounts for recurring deposits."
            tags={["Go", "TypeScript", "AWS", "React Native"]}
          />
          <ProjectItem
            title="SongGPT"
            href="https://github.com/dooduneye/song-gpt"
            description="Web app that generates songs from text using GPT-4."
            tags={["TypeScript", "Spotify API", "GPT-4"]}
          />
          <ProjectItem
            title="Jurni"
            description="Analyzed journal data for a mental health service. NLP techniques to find trigger points supporting experts. Tools for data scraping, preprocessing, and subject clustering."
            tags={["Python", "NLP", "Machine Learning", "Huggingface"]}
          />
          <ProjectItem
            title="Passover"
            description="Real-time chat with file sharing and code exchange built on git-style interactions."
            tags={["Rust", "AWS", "Redis", "Postgres"]}
          />
          <ProjectItem
            title="Legacy"
            description="End-of-life planning app. Fill out forms for wills, funeral arrangements, life insurance — store information to pass on to loved ones."
            tags={["Go", "TypeScript", "AWS", "React Native"]}
          />
          <ProjectItem
            title="Rate My Dorm"
            href="https://github.com/dooduneye/rate-my-dorm-web-app"
            description="Web app for students to rate and find the best dorms on campus."
            tags={["MongoDB", "Express", "Node.js", "React"]}
          />
          <ProjectItem
            title="davidoduneye.com"
            href="https://github.com/DOOduneye/portfolio"
            description="This site. Server-rendered, self-hosted, own my primitives."
            tags={["TanStack Start", "Effect TS", "SQLite", "Docker"]}
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
  const content = (
    <>
      <h3
        className={`font-medium text-text-primary ${href ? "transition-colors group-hover:text-accent" : ""}`}
      >
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
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
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
