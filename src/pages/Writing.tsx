import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { trpc } from "../api"

export function Writing() {
  const { data: posts } = useQuery(trpc.public.posts.published.queryOptions())

  return (
    <div className="mx-auto max-w-2xl px-6 py-28">
      <Link
        to="/"
        className="font-mono text-xs text-subtle-foreground transition-colors hover:text-brand"
      >
        ← David Oduneye
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">Writing</h1>

      {posts?.length === 0 && (
        <p className="mt-10 text-sm text-subtle-foreground">Nothing published yet.</p>
      )}

      <ul className="mt-14 divide-y divide-border">
        {posts?.map(post => (
          <li key={post.slug}>
            <Link to={`/writing/${post.slug}`} className="group flex gap-6 py-8">
              <div className="min-w-0 flex-1">
                <h2 className="font-medium text-foreground transition-colors group-hover:text-brand">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-2 text-sm leading-relaxed">{post.excerpt}</p>}
                <p className="mt-3 font-mono text-xs text-subtle-foreground">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt=""
                  width={128}
                  height={96}
                  loading="lazy"
                  className="h-24 w-32 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function formatDate(value: string | null): string {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}
