import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, errorMessage, isUnauthorized } from "../api";
import { StatusBadge } from "../components/ui";

type Post = Awaited<ReturnType<typeof api.posts.list.query>>[number];

export function PostsList({ onAuthError }: { onAuthError: () => void }) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    api.posts.list
      .query()
      .then(setPosts)
      .catch((err) => {
        if (isUnauthorized(err)) onAuthError();
        else setError(errorMessage(err));
      });
  }, [onAuthError]);

  useEffect(refresh, [refresh]);

  const createPost = async () => {
    const slug = `untitled-${Date.now().toString(36)}`;
    try {
      await api.posts.create.mutate({ slug, title: "Untitled", content: "" });
      navigate(`/admin/posts/${slug}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">Posts</h1>
        <button
          onClick={createPost}
          className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-page transition-colors hover:bg-accent-strong"
        >
          New post
        </button>
      </header>

      {error && (
        <p className="mt-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {posts && posts.length === 0 && (
        <p className="mt-10 text-sm text-subtle">
          Nothing here yet. Write the first one.
        </p>
      )}

      <ul className="mt-6 divide-y divide-line">
        {posts?.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/admin/posts/${post.slug}`}
              className="group flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <span className="block truncate font-medium text-fg transition-colors group-hover:text-accent">
                  {post.title}
                </span>
                <span className="text-xs text-subtle">/{post.slug}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={post.status} />
                <span className="text-xs tabular-nums text-subtle">
                  {new Date(post.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
