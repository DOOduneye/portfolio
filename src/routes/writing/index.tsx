import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { listPublishedPosts, type Post } from "~/services/posts";
import { PostCard } from "~/components/writing/post-card";

const getAllPosts = createServerFn({ method: "GET" }).handler(async () => {
  return Effect.runSync(listPublishedPosts);
});

export const Route = createFileRoute("/writing/")({
  loader: () => getAllPosts(),
  head: () => ({
    meta: [{ title: "Writing — David Oduneye" }],
  }),
  component: WritingIndexPage,
});

function WritingIndexPage() {
  const posts = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Writing</h1>
      <p className="mt-2 text-text-secondary">
        Thoughts on software engineering, architecture, and building things that
        last.
      </p>
      <div className="mt-10 space-y-4">
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
            />
          ))
        ) : (
          <p className="text-sm text-text-muted">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
