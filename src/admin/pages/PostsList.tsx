import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { ArrowUpRight, Eye, EyeOff, MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react"
import { api, errorMessage, type RouterOutputs } from "../api"
import { PageHeader } from "../components/PageHeader"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

type Post = RouterOutputs["admin"]["posts"]["list"][number]

export function PostsList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const posts = useQuery(api.admin.posts.list.queryOptions())
  const listKey = api.admin.posts.list.queryKey()

  const create = useMutation(
    api.admin.posts.create.mutationOptions({
      onSuccess: post => {
        void queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
        if (post) navigate(`/admin/posts/${post.slug}`)
      }
    })
  )

  // Publishing and deleting apply to the cached list first and roll back if the
  // request fails, so a row never sits waiting on a round trip.
  const optimistic = <TVariables extends { slug: string }>(
    apply: (posts: Post[], variables: TVariables) => Post[]
  ) => ({
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries(api.admin.posts.list.queryFilter())
      const previous = queryClient.getQueryData<Post[]>(listKey)
      if (previous) queryClient.setQueryData(listKey, apply(previous, variables))
      return { previous }
    },
    onError: (_error: unknown, _variables: TVariables, context?: { previous?: Post[] }) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
  })

  const setStatus = useMutation(
    api.admin.posts.setStatus.mutationOptions(
      optimistic<{ slug: string; status: "draft" | "published" }>((current, { slug, status }) =>
        current.map(post => (post.slug === slug ? { ...post, status } : post))
      )
    )
  )

  const remove = useMutation(
    api.admin.posts.remove.mutationOptions(
      optimistic<{ slug: string }>((current, { slug }) =>
        current.filter(post => post.slug !== slug)
      )
    )
  )

  const error = posts.error ?? create.error ?? setStatus.error ?? remove.error

  const newPost = (
    <Button
      onClick={() =>
        create.mutate({ slug: `untitled-${Date.now().toString(36)}`, title: "Untitled" })
      }
      disabled={create.isPending}
    >
      <Plus data-icon="inline-start" />
      New post
    </Button>
  )

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-8 py-10">
      <PageHeader title="Posts" description={summarise(posts.data)} action={newPost} />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{errorMessage(error)}</AlertTitle>
        </Alert>
      )}

      {posts.isPending ? (
        <PostRowsSkeleton />
      ) : posts.data?.length === 0 ? (
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
            {posts.data?.map(post => {
              const live = post.status === "published"

              return (
                <Item key={post.slug} className="group relative gap-3 py-3">
                  {post.coverImage && (
                    <ItemMedia variant="image">
                      <img src={post.coverImage} alt="" width={64} height={44} loading="lazy" />
                    </ItemMedia>
                  )}

                  <ItemContent className="gap-0.5">
                    <span className="flex items-center gap-2">
                      {/* Stretched so the whole row is a target without nesting
                          the action button inside the anchor. */}
                      <Link
                        to={`/admin/posts/${post.slug}`}
                        className="truncate text-sm font-medium text-foreground after:absolute after:inset-0"
                      >
                        {post.title}
                      </Link>
                      {!live && <Badge variant="outline">Draft</Badge>}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {post.excerpt || `/writing/${post.slug}`}
                    </span>
                  </ItemContent>

                  <ItemActions className="relative z-10 gap-1">
                    <span className="font-mono text-xs tabular-nums text-subtle-foreground">
                      {formatDate(post.publishedAt ?? post.updatedAt)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${post.title}`}
                            className="opacity-0 focus-visible:opacity-100 group-hover:opacity-100 aria-expanded:opacity-100"
                          />
                        }
                      >
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus.mutate({
                              slug: post.slug,
                              status: live ? "draft" : "published"
                            })
                          }
                        >
                          {live ? <EyeOff /> : <Eye />}
                          {live ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        {live && (
                          <DropdownMenuItem
                            onClick={() => window.open(`/writing/${post.slug}`, "_blank")}
                          >
                            <ArrowUpRight />
                            View live
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => remove.mutate({ slug: post.slug })}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ItemActions>
                </Item>
              )
            })}
          </ItemGroup>
        </Card>
      )}
    </div>
  )
}

/** Shaped like the rows it replaces, so the list does not jump when it loads. */
function PostRowsSkeleton() {
  return (
    <Card className="p-0">
      <ItemGroup>
        {[0, 1, 2].map(row => (
          <Item key={row} className="gap-3 py-3">
            <ItemContent className="gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3.5 w-72" />
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-3.5 w-20" />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </Card>
  )
}

function summarise(posts: Post[] | undefined): string | undefined {
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
