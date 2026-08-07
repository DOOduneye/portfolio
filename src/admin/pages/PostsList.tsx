import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Trash2
} from "lucide-react"
import { api, errorMessage, type RouterOutputs } from "../api"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"

type Post = RouterOutputs["admin"]["posts"]["list"][number]
type StatusFilter = "all" | "draft" | "published"

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" }
]

export function PostsList() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
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
      size="sm"
      onClick={() =>
        create.mutate({ slug: `untitled-${Date.now().toString(36)}`, title: "Untitled" })
      }
      disabled={create.isPending}
    >
      <Plus data-icon="inline-start" />
      New post
    </Button>
  )

  const all = posts.data ?? []
  const needle = query.trim().toLowerCase()
  const visible = all.filter(post => {
    if (statusFilter !== "all" && post.status !== statusFilter) return false
    if (!needle) return true
    return post.title.toLowerCase().includes(needle) || post.slug.includes(needle)
  })

  const rowProps = {
    onSetStatus: (slug: string, next: "draft" | "published") =>
      setStatus.mutate({ slug, status: next }),
    onRemove: (slug: string) => remove.mutate({ slug })
  }

  return (
    <div className="flex h-svh flex-col">
      {/* One bar, not three: the list is the page, everything else is chrome. */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-6">
        <h1 className="text-sm font-medium text-foreground">Posts</h1>

        <InputGroup className="h-7 w-56">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Filter posts"
            aria-label="Filter posts"
          />
        </InputGroup>

        <div className="ml-auto flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
          {STATUS_FILTERS.map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              aria-pressed={statusFilter === filter.value}
              className="flex h-6 items-center rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {newPost}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="w-full px-6 py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{errorMessage(error)}</AlertTitle>
            </Alert>
          )}

          {posts.isPending ? (
            <PostRowsSkeleton />
          ) : all.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PenLine />
                </EmptyMedia>
                <EmptyTitle>Nothing written yet</EmptyTitle>
                <EmptyDescription>Drafts stay private until you publish them.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>{newPost}</EmptyContent>
            </Empty>
          ) : visible.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No posts match</EmptyTitle>
                <EmptyDescription>Try a shorter search, or switch the filter.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border text-left [&>th]:pb-2 [&>th]:text-xs [&>th]:font-medium [&>th]:text-muted-foreground">
                  <th className="pl-3">Title</th>
                  <th className="w-28">Status</th>
                  <th className="w-72">Address</th>
                  <th className="w-28 pr-3 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map(post => (
                  <PostRow key={post.slug} post={post} {...rowProps} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function PostRow({
  post,
  onSetStatus,
  onRemove
}: {
  post: Post
  onSetStatus: (slug: string, status: "draft" | "published") => void
  onRemove: (slug: string) => void
}) {
  const live = post.status === "published"

  return (
    <tr className="group relative transition-colors hover:bg-muted/50">
      <td className="h-11 max-w-0 truncate pl-3">
        {/* Stretched so the whole row is a target without nesting the menu
            button inside the anchor. */}
        <Link
          to={`/admin/posts/${post.slug}`}
          className="truncate text-sm text-foreground after:absolute after:inset-0"
        >
          {post.title}
        </Link>
      </td>

      <td className="text-sm text-muted-foreground">{live ? "Published" : "Draft"}</td>

      <td className="truncate font-mono text-[0.8125rem] text-subtle-foreground">{post.slug}</td>

      <td className="pr-3 text-right font-mono text-[0.8125rem] tabular-nums text-subtle-foreground">
        <span className="inline-flex items-center gap-1">
          {formatDate(post.publishedAt ?? post.updatedAt)}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Actions for ${post.title}`}
                  className="relative z-10 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 aria-expanded:opacity-100"
                />
              }
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onSetStatus(post.slug, live ? "draft" : "published")}
              >
                {live ? <EyeOff /> : <Eye />}
                {live ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              {live && (
                <DropdownMenuItem onClick={() => window.open(`/writing/${post.slug}`, "_blank")}>
                  <ArrowUpRight />
                  View live
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onRemove(post.slug)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </td>
    </tr>
  )
}

/** Shaped like the rows it replaces, so the list does not jump when it loads. */
function PostRowsSkeleton() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {[0, 1, 2, 3, 4].map(row => (
        <div key={row} className="flex h-9 items-center gap-3 px-2">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="ml-auto h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
