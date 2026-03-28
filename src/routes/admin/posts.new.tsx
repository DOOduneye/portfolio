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
  createPost,
  PostAlreadyExistsError,
  type CreatePostInput,
} from "~/services/posts";

const createPostAction = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePostInput) => data)
  .handler(async ({ data }) => {
    const result = Effect.runSync(Effect.either(createPost(data)));
    if (Either.isLeft(result)) {
      const error = result.left;
      if (error instanceof PostAlreadyExistsError) {
        return {
          success: false as const,
          error: "A post with this slug already exists",
        };
      }
      return { success: false as const, error: "Failed to create post" };
    }
    return { success: true as const };
  });

export const Route = createFileRoute("/admin/posts/new")({
  beforeLoad: async () => {
    const { authenticated } = await checkAuth();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  component: NewPostPage,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function NewPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await createPostAction({
        data: {
          title,
          slug,
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
        navigate({ to: "/admin" });
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
      <h1 className="text-2xl font-bold">New post</h1>
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
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm text-text-secondary">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 font-mono text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
            placeholder="Comma-separated, e.g. typescript, react"
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
            {loading ? "Creating..." : "Create post"}
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
