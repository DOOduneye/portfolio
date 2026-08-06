import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { publicApi, type RouterOutputs } from "../api"
import { parseDocument, readingMinutes } from "../editor/document"
import { Prose } from "../editor/Prose"
import { formatDate } from "./Writing"

type PublishedPost = RouterOutputs["public"]["posts"]["bySlug"]

export function Post() {
  const { slug = "" } = useParams()
  const [post, setPost] = useState<PublishedPost | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    setPost(null)
    setMissing(false)

    publicApi.public.posts.bySlug
      .query({ slug })
      .then(loaded => !cancelled && setPost(loaded))
      .catch(() => !cancelled && setMissing(true))

    return () => {
      cancelled = true
    }
  }, [slug])

  const minutes = useMemo(() => (post ? readingMinutes(parseDocument(post.content)) : 0), [post])

  if (missing) {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold text-foreground">Not found</h1>
        <p className="mt-3 text-sm">
          That post does not exist, or it is not published.{" "}
          <Link to="/writing" className="text-accent hover:underline">
            See what is.
          </Link>
        </p>
      </Shell>
    )
  }

  if (!post) return <Shell />

  return (
    <Shell>
      <article>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mb-10 w-full rounded-xl border border-border"
          />
        )}

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}

        <p className="mt-6 font-mono text-xs text-subtle-foreground">
          {formatDate(post.publishedAt)} · {minutes} min read
        </p>

        <div className="mt-12">
          <Prose content={post.content} />
        </div>
      </article>

      <footer className="mt-20 border-t border-border pt-8">
        <Link
          to="/writing"
          className="font-mono text-xs text-subtle-foreground transition-colors hover:text-accent"
        >
          ← All writing
        </Link>
      </footer>
    </Shell>
  )
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28">
      <Link
        to="/"
        className="font-mono text-xs text-subtle-foreground transition-colors hover:text-accent"
      >
        ← David Oduneye
      </Link>
      <div className="mt-10">{children}</div>
    </div>
  )
}
