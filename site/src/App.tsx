const experience = [
  {
    role: "Technical Lead",
    org: "Generate",
    orgUrl: "https://generatenu.com",
    dates: "Jul 2023 — 2024",
    description:
      "Led a team of six building a cross-platform mobile app in React Native and Go that personalizes end-of-life planning.",
    stack: ["React Native", "Go"],
  },
  {
    role: "Software Engineering Intern, ML",
    org: "Genentech",
    orgUrl: "https://www.gene.com",
    dates: "Jan — Jun 2023",
    description:
      "Built a drug-data structuring system with transformer models and rule-based matching to normalize unstructured text across gRED, hitting 93% accuracy.",
    stack: ["Python", "Transformers", "spaCy"],
  },
  {
    role: "Teaching Assistant",
    org: "Khoury College of Computer Sciences",
    orgUrl: "https://www.khoury.northeastern.edu",
    dates: "Fall 2022",
    description:
      "Ran 4+ hours of weekly office hours and assisted faculty with grading and feedback.",
    stack: [],
  },
];

const projects = [
  {
    name: "brain-kit",
    url: "https://github.com/DOOduneye/brain-kit",
    description:
      "A knowledge-base workflow for Claude Code — CLI, vault skeleton, and skills for developing out of a personal knowledge base.",
    stack: ["TypeScript", "Claude Code"],
  },
  {
    name: "monkey",
    url: "https://github.com/DOOduneye/monkey",
    description:
      "An interpreter and compiler for the Monkey language, from Thorsten Ball's books.",
    stack: ["Go"],
  },
  {
    name: "hydrate",
    url: "https://github.com/DOOduneye/hydrate",
    description: "A token-based authentication utility for Go.",
    stack: ["Go"],
  },
  {
    name: "Jurni",
    url: null,
    description:
      "NLP over 50,000+ journal entries for a mental health service — sentiment analysis and topic modeling to surface trigger points for clinicians.",
    stack: ["Python", "TensorFlow", "spaCy"],
  },
  {
    name: "RateMyDorm",
    url: "https://github.com/DOOduneye/rmd",
    description:
      "A full-stack app where students rate and compare campus dorms, backed by the College Scorecard API.",
    stack: ["Next.js", "MongoDB", "Express"],
  },
  {
    name: "davidoduneye.com",
    url: "https://github.com/DOOduneye/portfolio",
    description:
      "This site, plus the tRPC + Cloudflare Workers CMS that will power it.",
    stack: ["React", "tRPC", "Cloudflare"],
  },
];

const links = [
  { label: "GitHub", url: "https://github.com/DOOduneye" },
  { label: "LinkedIn", url: "https://linkedin.com/in/davidoduneye" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {children}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
    </div>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
      {children}
    </span>
  );
}

export function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-24">
        {/* Hero */}
        <header>
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-400">
            Boston, MA
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            David{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Oduneye
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
            Software engineer. Computer science at Northeastern University.
            This is what I've built and where I've worked.
          </p>
          <div className="mt-7 flex gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>

        {/* Experience */}
        <section className="mt-24">
          <SectionLabel>Experience</SectionLabel>
          <ol className="space-y-12">
            {experience.map((job) => (
              <li
                key={job.org + job.role}
                className="grid gap-1 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
              >
                <span className="text-sm font-medium tabular-nums text-zinc-500">
                  {job.dates}
                </span>
                <div>
                  <h3 className="font-semibold text-white">
                    {job.role}
                    <span className="text-zinc-500"> · </span>
                    <a
                      href={job.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 underline-offset-4 transition-colors hover:text-blue-400 hover:underline"
                    >
                      {job.org}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {job.description}
                  </p>
                  {job.stack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.stack.map((item) => (
                        <Pill key={item}>{item}</Pill>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Projects */}
        <section className="mt-24">
          <SectionLabel>Projects</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => {
              const card = (
                <article
                  className={`group h-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition-all ${
                    project.url
                      ? "hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-900/80"
                      : ""
                  }`}
                >
                  <h3 className="font-semibold text-white transition-colors group-hover:text-blue-400">
                    {project.name}
                    {project.url && (
                      <span className="ml-1.5 inline-block text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-400">
                        ↗
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </article>
              );

              return project.url ? (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card}
                </a>
              ) : (
                <div key={project.name}>{card}</div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 flex items-center justify-between border-t border-zinc-900 pt-8 text-sm text-zinc-600">
          <span>© {new Date().getFullYear()} David Oduneye</span>
          <div className="flex gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
