import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  FlexRender,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react"
import { api, errorMessage, type RouterOutputs } from "../api"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Post = RouterOutputs["admin"]["posts"]["list"][number]
type StatusFilter = "all" | "draft" | "published"

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" }
]

// Sizing and visibility are separate features in v9; without them a column
// definition cannot carry a width and rows have no getVisibleCells.
const features = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel()
})

const column = createColumnHelper<typeof features, Post>()

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function PostsList() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sorting, setSorting] = useState<SortingState>([{ id: "updated", desc: true }])
  const [rowSelection, setRowSelection] = useState({})

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
      optimistic<{ slug: string; status: "draft" | "published" }>((current, variables) =>
        current.map(post =>
          post.slug === variables.slug ? { ...post, status: variables.status } : post
        )
      )
    )
  )

  const remove = useMutation(
    api.admin.posts.remove.mutationOptions(
      optimistic<{ slug: string }>((current, variables) =>
        current.filter(post => post.slug !== variables.slug)
      )
    )
  )

  const error = posts.error ?? create.error ?? setStatus.error ?? remove.error

  // Annotated because the helper narrows each accessor to its own value type,
  // and a mixed array of those does not widen on its own.
  const columns = useMemo<ColumnDef<typeof features, Post, any>[]>(
    () => [
      column.display({
        id: "select",
        size: 44,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onCheckedChange={checked => table.toggleAllRowsSelected(Boolean(checked))}
            aria-label="Select every post shown"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={checked => row.toggleSelected(Boolean(checked))}
            aria-label={`Select ${row.original.title}`}
            className="relative z-10"
          />
        )
      }),
      column.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          // Stretched so the whole row opens the post without nesting the menu
          // button inside the anchor.
          <Link
            to={`/admin/posts/${row.original.slug}`}
            className="truncate text-foreground after:absolute after:inset-0"
          >
            {row.original.title}
          </Link>
        )
      }),
      column.accessor("status", {
        header: "Status",
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue() === "published" ? "Published" : "Draft"}
          </span>
        )
      }),
      column.accessor("slug", {
        header: "Slug",
        size: 240,
        cell: ({ getValue }) => (
          <span className="truncate font-mono text-[0.8125rem] text-subtle-foreground">
            {getValue()}
          </span>
        )
      }),
      column.accessor(post => post.publishedAt ?? post.updatedAt, {
        id: "updated",
        header: "Updated",
        size: 110,
        cell: ({ getValue }) => (
          <span className="font-mono text-[0.8125rem] whitespace-nowrap tabular-nums text-subtle-foreground">
            {formatDate(getValue())}
          </span>
        )
      }),
      column.display({
        id: "actions",
        size: 52,
        cell: ({ row }) => {
          const post = row.original
          const live = post.status === "published"

          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Actions for ${post.title}`}
                    className="relative z-10 opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100 aria-expanded:opacity-100"
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setStatus.mutate({ slug: post.slug, status: live ? "draft" : "published" })
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
          )
        }
      })
    ],
    [remove, setStatus]
  )

  // Narrowing happens before the table sees the rows. Registering the global
  // filtering feature just to re-implement two string checks buys nothing.
  const data = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return (posts.data ?? []).filter(post => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false
      if (!needle) return true
      return post.title.toLowerCase().includes(needle) || post.slug.includes(needle)
    })
  }, [posts.data, statusFilter, query])

  const table = useTable({
    features,
    data,
    columns,
    state: { sorting, rowSelection },
    getRowId: row => row.slug,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection
  })

  const picked = table.getSelectedRowModel().rows
  const rows = table.getRowModel().rows

  const applyToPicked = (run: (slug: string) => void) => {
    picked.forEach(row => run(row.original.slug))
    setRowSelection({})
  }

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

  return (
    <div className="flex h-svh flex-col">
      {/* The header carries whichever mode the list is in: making something, or
          acting on a selection. Never both. */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-6">
        {picked.length > 0 ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
              <X data-icon="inline-start" />
              Clear
            </Button>
            <span className="text-sm text-foreground">
              <span className="font-mono tabular-nums">{picked.length}</span> selected
            </span>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                applyToPicked(slug => setStatus.mutate({ slug, status: "published" }))
              }
            >
              <Eye data-icon="inline-start" />
              Publish
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyToPicked(slug => setStatus.mutate({ slug, status: "draft" }))}
            >
              <EyeOff data-icon="inline-start" />
              Move to drafts
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => applyToPicked(slug => remove.mutate({ slug }))}
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-sm font-medium text-foreground">Posts</h1>
            <div className="ml-auto">{newPost}</div>
          </>
        )}
      </header>

      {/* Narrowing what is already on the page belongs with the list, not with
          the button that makes a new one. */}
      <div className="flex shrink-0 items-center gap-2 px-6 pt-4 pb-3">
        <InputGroup className="h-7 w-40 lg:w-56">
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

        {/* The group is array-valued even when only one item can be pressed,
            and deselecting the current filter falls back to showing everything. */}
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          value={[statusFilter]}
          onValueChange={value => setStatusFilter((value[0] as StatusFilter) ?? "all")}
          aria-label="Filter by status"
          className="ml-auto shrink-0"
        >
          {STATUS_FILTERS.map(filter => (
            <ToggleGroupItem key={filter.value} value={filter.value}>
              {filter.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{errorMessage(error)}</AlertTitle>
          </Alert>
        )}

        {posts.isPending ? (
          <PostRowsSkeleton />
        ) : (posts.data?.length ?? 0) === 0 ? (
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
        ) : rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No posts match</EmptyTitle>
              <EmptyDescription>Try a shorter search, or switch the filter.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(group => (
                <TableRow key={group.id} className="hover:bg-transparent">
                  {group.headers.map(header => {
                    const sortable = header.column.getCanSort()
                    const direction = header.column.getIsSorted()

                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        aria-sort={
                          direction === "asc"
                            ? "ascending"
                            : direction === "desc"
                              ? "descending"
                              : undefined
                        }
                      >
                        {header.isPlaceholder ? null : sortable ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
                          >
                            <FlexRender header={header} />
                            {direction === "asc" ? (
                              <ChevronUp className="size-3" />
                            ) : direction === "desc" ? (
                              <ChevronDown className="size-3" />
                            ) : (
                              <ChevronsUpDown className="size-3 opacity-0 transition-opacity group-hover/head:opacity-40" />
                            )}
                          </button>
                        ) : (
                          <FlexRender header={header} />
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="group/row relative"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="max-w-0 truncate">
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

/** Shaped like the rows it replaces, so the list does not jump when it loads. */
function PostRowsSkeleton() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {[0, 1, 2, 3, 4].map(row => (
        <div key={row} className="flex h-11 items-center gap-3">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="ml-auto h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}
