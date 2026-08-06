import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, errorMessage, type RouterOutputs } from "../api"
import { StatusBadge } from "../components/ui"

type Post = RouterOutputs["admin"]["posts"]["list"][number]

export function PostsList() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    api.admin.posts.list
      .query()
      .then(loaded => !cancelled && setPosts(loaded))
      .catch(err => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  const createPost = async () => {
    setCreating(true)
    setError(null)
    try {
      // A placeholder slug keeps the draft addressable; the editor offers to
      // match it to the title before the post is published.
      const slug = `untitled-${Date.now().toString(36)}`
      await api.admin.posts.create.mutate({ slug, title: "Untitled" })
      navigate(`/admin/posts/${slug}`)
    } catch (err) {
      setError(errorMessage(err))
      setCreating(false)
    }
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">Posts</h1>
        <button
          onClick={createPost}
          disabled={creating}
          className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-page transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          New post
        </button>
      </header>

      {error && (
        <p className="mt-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {posts?.length === 0 && (
        <p className="mt-10 text-sm text-subtle">Nothing here yet. Write the first one.</p>
      )}

      <ul className="mt-4 divide-y divide-line">
        {posts?.map(post => (
          <li key={post.slug}>
            <Link to={`/admin/posts/${post.slug}`} className="group flex gap-4 py-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="truncate font-medium text-fg transition-colors group-hover:text-accent">
                    {post.title}
                  </span>
                  <StatusBadge status={post.status} />
                </div>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-2 font-mono text-xs text-subtle">
                  {post.publishedAt
                    ? `published ${formatDate(post.publishedAt)}`
                    : `edited ${formatDate(post.updatedAt)}`}
                </p>
              </div>
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt=""
                  className="h-20 w-32 shrink-0 rounded-lg border border-line object-cover"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}
