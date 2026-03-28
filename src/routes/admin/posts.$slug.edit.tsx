import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect, Either } from "effect";
import { checkAuth } from "~/services/auth";
import {
  getPostBySlug,
  updatePost,
  type UpdatePostInput,
} from "~/services/posts";

const getPost = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return Effect.runSync(
      Effect.catchAll(getPostBySlug(slug), () => Effect.succeed(null))
    );
  });

const updatePostAction = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string } & UpdatePostInput) => data)
  .handler(async ({ data }) => {
    const { slug, ...input } = data;
    const result = Effect.runSync(Effect.either(updatePost(slug, input)));
    if (Either.isLeft(result)) {
      return { success: false as const, error: "Failed to update post" };
    }
    return { success: true as const };
  });

export const Route = createFileRoute("/admin/posts/$slug/edit")({
  beforeLoad: async () => {
    const { authenticated } = await checkAuth();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  loader: ({ params }) => getPost({ data: params.slug }),
  component: EditPostPage,
});

function EditPostPage() {
  const post = Route.useLoaderData();
  const navigate = useNavigate();

  if (!post) {
    return (
      <div>
        <Link
          to="/admin"
          className="text-sm text-text-muted transition-colors hover:text-text-secondary"
        >
          &larr; Back to admin
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <EditPostForm post={post} onDone={() => navigate({ to: "/admin" })} />
  );
}

function EditPostForm({
  post,
  onDone,
}: {
  post: NonNullable<Awaited<ReturnType<typeof getPost>>>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [tags, setTags] = useState(post.tags.join(", "));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await updatePostAction({
        data: {
          slug: post.slug,
          title,
          content,
          excerpt: excerpt || null,
          tags: tags
            ? tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        },
      });
      if (result.success) {
        onDone();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit post</h1>
      <p className="mt-1 font-mono text-sm text-text-muted">{post.slug}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div>
          <label
            htmlFor="title"
            className="block text-sm text-text-secondary"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm text-text-secondary"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Optional — auto-generated from content if empty"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm text-text-secondary">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Comma-separated"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm text-text-secondary"
          >
            Content (MDX)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 font-mono text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <Link
            to="/admin"
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
