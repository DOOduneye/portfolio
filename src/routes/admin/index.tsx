import { useState } from "react";
import {
  createFileRoute,
  Link,
  useRouter,
  redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Effect, Either } from "effect";
import { checkAuth, logoutAction } from "~/services/auth";
import {
  listAllPosts,
  publishPost,
  unpublishPost,
  deletePost,
  type Post,
} from "~/services/posts";

const getAllPosts = createServerFn({ method: "GET" }).handler(async () => {
  return Effect.runSync(listAllPosts);
});

const publishPostAction = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const result = Effect.runSync(Effect.either(publishPost(slug)));
    if (Either.isLeft(result)) return { success: false as const };
    return { success: true as const };
  });

const unpublishPostAction = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const result = Effect.runSync(Effect.either(unpublishPost(slug)));
    if (Either.isLeft(result)) return { success: false as const };
    return { success: true as const };
  });

const deletePostAction = createServerFn({ method: "POST" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const result = Effect.runSync(Effect.either(deletePost(slug)));
    if (Either.isLeft(result)) return { success: false as const };
    return { success: true as const };
  });

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAuth();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  loader: () => getAllPosts(),
  component: AdminDashboard,
});

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AdminDashboard() {
  const posts = Route.useLoaderData();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handlePublish(slug: string) {
    setActionLoading(slug);
    await publishPostAction({ data: slug });
    router.invalidate();
    setActionLoading(null);
  }

  async function handleUnpublish(slug: string) {
    setActionLoading(slug);
    await unpublishPostAction({ data: slug });
    router.invalidate();
    setActionLoading(null);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post?")) return;
    setActionLoading(slug);
    await deletePostAction({ data: slug });
    router.invalidate();
    setActionLoading(null);
  }

  async function handleLogout() {
    await logoutAction();
    router.navigate({ to: "/admin/login" });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts/new"
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            New post
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Log out
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-text-muted">No posts yet.</p>
      ) : (
        <div className="mt-8 space-y-2">
          {posts.map((post: Post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-lg border border-border bg-bg-surface px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin/posts/$slug/edit"
                    params={{ slug: post.slug }}
                    className="truncate font-medium text-text-primary transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-2">
                {post.status === "draft" ? (
                  <button
                    onClick={() => handlePublish(post.slug)}
                    disabled={actionLoading === post.slug}
                    className="rounded px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary disabled:opacity-50"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(post.slug)}
                    disabled={actionLoading === post.slug}
                    className="rounded px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.slug)}
                  disabled={actionLoading === post.slug}
                  className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
