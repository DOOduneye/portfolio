import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect, Exit } from "effect";
import { getPublishedPostBySlug } from "~/services/posts";
import { renderMarkdown, estimateReadingTime } from "~/services/content";

const getPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const program = Effect.gen(function* () {
      const post = yield* getPublishedPostBySlug(slug);
      const readingTime = estimateReadingTime(post.content);
      const renderedContent = yield* renderMarkdown(post.content);
      return { ...post, readingTime, renderedContent };
    });

    const result = await Effect.runPromise(program);
    return result;
  });

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => getPost({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — David Oduneye` },
      ...(loaderData?.excerpt
        ? [{ name: "description", content: loaderData.excerpt }]
        : []),
    ],
  }),
  component: PostPage,
  errorComponent: PostNotFound,
});

function PostPage() {
  const post = Route.useLoaderData();

  return (
    <article>
      <Link
        to="/writing"
        className="text-sm text-text-muted transition-colors hover:text-text-secondary"
      >
        &larr; Back to writing
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-text-muted">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span>&middot;</span>
          <span>{post.readingTime} min read</span>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-3 flex gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-bg-muted px-2.5 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: post.renderedContent }}
      />
    </article>
  );
}

function PostNotFound() {
  return (
    <div>
      <Link
        to="/writing"
        className="text-sm text-text-muted transition-colors hover:text-text-secondary"
      >
        &larr; Back to writing
      </Link>
      <h1 className="mt-6 text-2xl font-bold">Post not found</h1>
      <p className="mt-2 text-text-secondary">
        The post you're looking for doesn't exist or has been removed.
      </p>
    </div>
  );
}
