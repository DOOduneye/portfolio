import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { listPublishedPosts, type Post } from "~/services/posts";
import { PostCard } from "~/components/writing/post-card";

const getLatestPosts = createServerFn({ method: "GET" }).handler(async () => {
  const posts = Effect.runSync(listPublishedPosts);
  return posts.slice(0, 3);
});

export const Route = createFileRoute("/")({
  loader: () => getLatestPosts(),
  component: HomePage,
});

function ProjectLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      <h3 className="font-medium text-text-primary transition-colors group-hover:text-accent">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </a>
  );
}

function HomePage() {
  const posts = Route.useLoaderData();

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">David Oduneye</h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Software engineer focused on building products people actually want
          to use. I care about clean interfaces, reliability, and the small
          details that make software feel right.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
          Latest writing
        </h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post: Post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No posts yet.</p>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
          Selected projects
        </h2>
        <div className="space-y-6">
          <ProjectLink
            href="https://github.com/DOOduneye/portfolio"
            title="davidoduneye.com"
            description="This site. TanStack Start, Effect TS, SQLite. Server-rendered, self-hosted on my own VPS."
          />
          <ProjectLink
            href="https://github.com/GenerateNU/sac"
            title="SAC"
            description="Platform for university organizations — app, website, and admin dashboards. Led a team building event management, applications, and member tools. Redis, TypeScript, React Native, Docker."
          />

        </div>
      </section>
    </div>
  );
}
