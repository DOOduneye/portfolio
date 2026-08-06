import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PenLine, Plus } from "lucide-react"
import { api, errorMessage, type RouterOutputs } from "../api"
import { PageHeader } from "../components/PageHeader"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from "@/components/ui/item"

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
    <Button onClick={createPost} disabled={creating}>
      <Plus data-icon="inline-start" />
      New post
    </Button>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Posts" description={summarise(posts)} action={newPost} />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      {posts?.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PenLine />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>Drafts stay private until you publish them.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{newPost}</EmptyContent>
        </Empty>
      ) : (
        <Card className="p-0">
          <ItemGroup>
            {posts?.map(post => (
              <Item key={post.slug} render={<Link to={`/admin/posts/${post.slug}`} />}>
                {post.coverImage && (
                  <ItemMedia variant="image">
                    <img src={post.coverImage} alt="" width={64} height={44} loading="lazy" />
                  </ItemMedia>
                )}
                <ItemContent>
                  <ItemTitle>
                    {post.title}
                    {post.status === "draft" && <Badge variant="outline">Draft</Badge>}
                  </ItemTitle>
                  {post.excerpt && <ItemDescription>{post.excerpt}</ItemDescription>}
                </ItemContent>
                <span className="shrink-0 font-mono text-xs tabular-nums text-subtle-foreground">
                  {formatDate(post.publishedAt ?? post.updatedAt)}
                </span>
              </Item>
            ))}
          </ItemGroup>
        </Card>
      )}
    </div>
  )
}

function summarise(posts: Post[] | null): string | undefined {
  if (!posts) return undefined
  if (posts.length === 0) return "Nothing written yet."

  const drafts = posts.filter(post => post.status === "draft").length
  const live = posts.length - drafts
  return drafts ? `${live} live · ${drafts} in draft` : `${live} live`
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}
