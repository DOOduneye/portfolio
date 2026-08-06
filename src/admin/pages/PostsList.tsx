import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PenLine, Plus } from "lucide-react"
import { api, errorMessage, type RouterOutputs } from "../api"
import { Alert, Button, Card, EmptyState, PageHeader, Status } from "../components/ui"

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

  const newPost = (
    <Button variant="primary" icon={Plus} onClick={createPost} disabled={creating}>
      New post
    </Button>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Posts" description={summarise(posts)} action={newPost} />

      {error && <Alert message={error} />}

      {posts?.length === 0 ? (
        <Card>
          <EmptyState
            icon={PenLine}
            title="No posts yet"
            description="Drafts stay private until you publish them."
            action={newPost}
          />
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {posts?.map(post => (
            <Link
              key={post.slug}
              to={`/admin/posts/${post.slug}`}
              className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              {/* No placeholder box: an empty frame is a slot for nothing. */}
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt=""
                  className="h-11 w-16 shrink-0 rounded border border-border object-cover"
                />
              )}

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{post.title}</span>
                  <Status status={post.status} />
                </span>
                {post.excerpt && (
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {post.excerpt}
                  </span>
                )}
              </span>

              <span className="shrink-0 text-xs tabular-nums text-subtle-foreground">
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.updatedAt)}
              </span>
            </Link>
          ))}
        </Card>
      )}
    </div>
  )
}

/** Says what is live and what is still open, rather than restating the title. */
function summarise(posts: Post[] | null): string | undefined {
  if (!posts) return undefined
  if (posts.length === 0) return "Nothing written yet."

  const drafts = posts.filter(post => post.status === "draft").length
  const live = posts.length - drafts
  const parts = [`${live} live`]
  if (drafts) parts.push(`${drafts} in draft`)
  return parts.join(" · ")
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}
