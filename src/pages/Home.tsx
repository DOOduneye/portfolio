import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { publicApi, type RouterOutputs } from "../api"

const experience = [
  {
    role: "Member of Technical Staff",
    org: "Agency",
    orgUrl: "https://www.agency.inc",
    dates: "Jan 2025 - Present",
    description: "Early engineer building the core product."
  },
  {
    role: "Software Engineering Intern",
    org: "Google",
    orgUrl: "https://about.google",
    dates: "Aug - Nov 2024",
    description:
      "Worked on Google's CI tooling for the onArm initiative, adding multi-architecture (ARM and x86) test visibility for internal developers."
  },
  {
    role: "Software Engineering Intern",
    org: "Microsoft",
    orgUrl: "https://www.microsoft.com",
    dates: "May - Aug 2024",
    description:
      "Improved a synthetic data generator with multithreading and a move to cloud VMs, added tests in production for pipeline validation, and built a dashboard for monitoring test runs across production regions."
  },
  {
    role: "Technical Lead",
    org: "Generate",
    orgUrl: "https://generatenu.com",
    dates: "Jul 2023 - Jun 2024",
    description:
      "Led a team of 5 to 10 engineers building four full-stack applications for student clubs and events."
  }
]

const projects = [
  {
    name: "Student Activity Calendar",
    url: null,
    description:
      "A campus events platform serving 15,000+ students, with a Go backend, web and mobile apps, admin dashboards, and a development CLI.",
    stack: "Go · React · React Native · Redis · AWS · Postgres"
  },
  {
    name: "brain-kit",
    url: "https://github.com/DOOduneye/brain-kit",
    description:
      "A CLI, vault skeleton, and set of skills for developing out of a personal knowledge base with Claude Code.",
    stack: "TypeScript · Claude Code"
  },
  {
    name: "monkey",
    url: "https://github.com/DOOduneye/monkey",
    description: "An interpreter and compiler for the Monkey language, from Thorsten Ball's books.",
    stack: "Go"
  },
  {
    name: "hydrate",
    url: "https://github.com/DOOduneye/hydrate",
    description: "A token-based authentication utility for Go.",
    stack: "Go"
  },
  {
    name: "davidoduneye.com",
    url: "https://github.com/DOOduneye/portfolio",
    description:
      "This site. A React app with a built-in CMS, using tRPC on Cloudflare Workers, D1, and a TipTap editor.",
    stack: "React · tRPC · Cloudflare · TipTap"
  }
]

const links = [
  { label: "GitHub", url: "https://github.com/DOOduneye" },
  { label: "LinkedIn", url: "https://linkedin.com/in/dooduneye" },
  {
    label: "Spotify",
    url: "https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy"
  }
]

type TopTrack = RouterOutputs["public"]["music"]["topTrack"]

function OnRepeat() {
  const [track, setTrack] = useState<TopTrack | null>(null)

  useEffect(() => {
    publicApi.public.music.topTrack
      .query()
      .then(setTrack)
      .catch(() => setTrack(null))
  }, [])

  if (!track) return null

  return (
    <p className="mb-6">
      on repeat:{" "}
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground transition-colors hover:text-brand"
      >
        {track.name}
      </a>{" "}
      · {track.artist}
    </p>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-24">
      <div className="mb-10 flex items-baseline gap-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-subtle-foreground">
          {title}
        </h2>
        <div className="h-px flex-1 self-center bg-border" />
      </div>
      {children}
    </section>
  )
}

function RecentWriting() {
  const [posts, setPosts] = useState<RouterOutputs["public"]["posts"]["published"]>([])

  useEffect(() => {
    publicApi.public.posts.published
      .query()
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [])

  if (posts.length === 0) return null

  return (
    <Section title="Writing">
      <ul>
        {posts.slice(0, 4).map(post => (
          <li key={post.slug} className="border-b border-border last:border-b-0">
            <Link to={`/writing/${post.slug}`} className="group block py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium text-foreground transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-subtle-foreground">
                  {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric"
                    })}
                </span>
              </div>
              {post.excerpt && (
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed">{post.excerpt}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {posts.length > 4 && (
        <Link
          to="/writing"
          className="mt-6 inline-block font-mono text-xs text-subtle-foreground transition-colors hover:text-brand"
        >
          All writing →
        </Link>
      )}
    </Section>
  )
}

export function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28">
      <header>
        <p className="font-mono text-xs tracking-wide text-subtle-foreground">New York, NY</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          David Oduneye
        </h1>
        <p className="mt-5 max-w-lg leading-relaxed">
          Software engineer, member of technical staff at{" "}
          <a
            href="https://www.agency.inc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-colors hover:text-brand"
          >
            Agency
          </a>
          . Computer science at <span className="text-foreground">Northeastern University</span>,
          class of 2025.
        </p>
        <nav className="mt-8 flex gap-6 font-mono text-xs">
          {links.map(link => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-subtle-foreground underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <Section title="Experience">
        <ol className="space-y-12">
          {experience.map(job => (
            <li key={job.org + job.role} className="grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <span className="whitespace-nowrap pt-0.5 font-mono text-xs leading-6 text-subtle-foreground">
                {job.dates}
              </span>
              <div>
                <h3 className="font-medium text-foreground">
                  {job.role}
                  <span className="text-subtle-foreground"> · </span>
                  {job.orgUrl ? (
                    <a
                      href={job.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-brand"
                    >
                      {job.org}
                    </a>
                  ) : (
                    <span>{job.org}</span>
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed">{job.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Projects">
        <ul>
          {projects.map(project => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-foreground transition-colors group-hover:text-brand">
                    {project.name}
                  </h3>
                  {project.url && (
                    <span className="font-mono text-xs text-subtle-foreground transition-colors group-hover:text-brand">
                      ↗
                    </span>
                  )}
                </div>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed">{project.description}</p>
                <p className="mt-2.5 font-mono text-xs text-subtle-foreground">{project.stack}</p>
              </>
            )

            return (
              <li key={project.name} className="border-b border-border last:border-b-0">
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
            )
          })}
        </ul>
      </Section>

      <RecentWriting />

      <footer className="mt-16 border-t border-border pt-8 font-mono text-xs text-subtle-foreground">
        <OnRepeat />
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} David Oduneye</span>
          <div className="flex gap-5">
            {links.map(link => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
