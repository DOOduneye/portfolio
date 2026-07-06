const experience = [
  {
    role: "Member of Technical Staff",
    org: "Agency",
    orgUrl: "https://www.agency.inc",
    dates: "Jan 2025 - Present",
    description: "Early engineer building the core product.",
  },
  {
    role: "Software Engineering Intern",
    org: "Google",
    orgUrl: "https://about.google",
    dates: "Aug - Nov 2024",
    description:
      "Worked on Google's CI tooling for the onArm initiative, adding multi-architecture (ARM and x86) test visibility for internal developers.",
  },
  {
    role: "Software Engineering Intern",
    org: "Microsoft",
    orgUrl: "https://www.microsoft.com",
    dates: "May - Aug 2024",
    description:
      "Improved a synthetic data generator with multithreading and a move to cloud VMs, added tests in production for pipeline validation, and built a dashboard for monitoring test runs across production regions.",
  },
  {
    role: "Technical Lead",
    org: "Generate",
    orgUrl: "https://generatenu.com",
    dates: "Jul 2023 - Jun 2024",
    description:
      "Led a team of 5 to 10 engineers building four full-stack applications for student clubs and events.",
  },
];

const projects = [
  {
    name: "Student Activity Calendar",
    url: null,
    description:
      "A campus events platform serving 15,000+ students, with a Go backend, web and mobile apps, admin dashboards, and a development CLI.",
    stack: "Go · React · React Native · Redis · AWS · Postgres",
  },
  {
    name: "brain-kit",
    url: "https://github.com/DOOduneye/brain-kit",
    description:
      "A CLI, vault skeleton, and set of skills for developing out of a personal knowledge base with Claude Code.",
    stack: "TypeScript · Claude Code",
  },
  {
    name: "monkey",
    url: "https://github.com/DOOduneye/monkey",
    description:
      "An interpreter and compiler for the Monkey language, from Thorsten Ball's books.",
    stack: "Go",
  },
  {
    name: "hydrate",
    url: "https://github.com/DOOduneye/hydrate",
    description: "A token-based authentication utility for Go.",
    stack: "Go",
  },
  {
    name: "davidoduneye.com",
    url: "https://github.com/DOOduneye/portfolio",
    description:
      "This site. A React app with a built-in CMS, using tRPC on Cloudflare Workers, D1, and a TipTap editor.",
    stack: "React · tRPC · Cloudflare · TipTap",
  },
];

const links = [
  { label: "GitHub", url: "https://github.com/DOOduneye" },
  { label: "LinkedIn", url: "https://linkedin.com/in/dooduneye" },
  {
    label: "Spotify",
    url: "https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy",
  },
];

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-24">
      <div className="mb-10 flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{index}</span>
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
          {title}
        </h2>
        <div className="h-px flex-1 self-center bg-line" />
      </div>
      {children}
    </section>
  );
}

export function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28">
      {/* Header */}
      <header>
        <p className="font-mono text-xs tracking-wide text-subtle">
          New York, NY
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg">
          David Oduneye
        </h1>
        <p className="mt-5 max-w-lg leading-relaxed">
          Software engineer, member of technical staff at{" "}
          <a
            href="https://www.agency.inc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg transition-colors hover:text-accent"
          >
            Agency
          </a>
          . Computer science at{" "}
          <span className="text-fg">Northeastern University</span>, class of
          2025.
        </p>
        <nav className="mt-8 flex gap-6 font-mono text-xs">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-subtle underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Experience */}
      <Section index="01" title="Experience">
        <ol className="space-y-12">
          {experience.map((job) => (
            <li
              key={job.org + job.role}
              className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
            >
              <span className="pt-0.5 font-mono text-xs leading-6 text-subtle">
                {job.dates}
              </span>
              <div>
                <h3 className="font-medium text-fg">
                  {job.role}
                  <span className="text-subtle"> · </span>
                  {job.orgUrl ? (
                    <a
                      href={job.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {job.org}
                    </a>
                  ) : (
                    <span>{job.org}</span>
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Projects */}
      <Section index="02" title="Projects">
        <ul>
          {projects.map((project) => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-fg transition-colors group-hover:text-accent">
                    {project.name}
                  </h3>
                  {project.url && (
                    <span className="font-mono text-xs text-subtle transition-colors group-hover:text-accent">
                      ↗
                    </span>
                  )}
                </div>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed">
                  {project.description}
                </p>
                <p className="mt-2.5 font-mono text-xs text-subtle">
                  {project.stack}
                </p>
              </>
            );

            return (
              <li
                key={project.name}
                className="border-b border-line last:border-b-0"
              >
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block py-6"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="py-6">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Footer */}
      <footer className="mt-16 flex items-center justify-between border-t border-line pt-8 font-mono text-xs text-subtle">
        <span>© {new Date().getFullYear()} David Oduneye</span>
        <div className="flex gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
