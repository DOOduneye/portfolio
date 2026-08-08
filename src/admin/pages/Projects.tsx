import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Eye,
  EyeOff,
  Layers,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type Project = RouterOutputs["admin"]["projects"]["list"][number]

interface Draft {
  id: number | null
  name: string
  url: string
  description: string
  stack: string
  visible: boolean
}

const blank: Draft = { id: null, name: "", url: "", description: "", stack: "", visible: true }

const toDraft = (project: Project): Draft => ({
  id: project.id,
  name: project.name,
  url: project.url ?? "",
  description: project.description,
  stack: project.stack,
  visible: project.visible === 1
})

export function Projects() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [confirming, setConfirming] = useState<Project | null>(null)
  const queryClient = useQueryClient()

  const list = useQuery(api.admin.projects.list.queryOptions())

  const settled = {
    onError: (cause: unknown) => toast.error(errorMessage(cause)),
    onSuccess: () => queryClient.invalidateQueries(api.admin.projects.list.queryFilter())
  }
  const create = useMutation(api.admin.projects.create.mutationOptions(settled))
  const update = useMutation(api.admin.projects.update.mutationOptions(settled))
  const destroy = useMutation(api.admin.projects.remove.mutationOptions(settled))

  useEffect(() => {
    if (list.error) toast.error(errorMessage(list.error))
  }, [list.error])

  const items = list.data ?? []
  const saving = create.isPending || update.isPending

  const save = async () => {
    if (!draft?.name.trim()) return
    const payload = {
      name: draft.name.trim(),
      url: draft.url.trim() || null,
      description: draft.description.trim(),
      stack: draft.stack.trim(),
      visible: draft.visible ? 1 : 0
    }
    if (draft.id === null) await create.mutateAsync({ ...payload, sortOrder: items.length })
    else await update.mutateAsync({ id: draft.id, ...payload })
    setDraft(null)
  }

  const move = (project: Project, by: -1 | 1) => {
    const index = items.findIndex(item => item.id === project.id)
    const swap = items[index + by]
    if (!swap) return
    update.mutate({ id: project.id, sortOrder: swap.sortOrder })
    update.mutate({ id: swap.id, sortOrder: project.sortOrder })
  }

  const newProject = (
    <Button size="sm" onClick={() => setDraft(blank)}>
      <Plus data-icon="inline-start" />
      New project
    </Button>
  )

  return (
    <AdminPage title="Projects" action={newProject}>
      {list.isPending ? (
        <RowsSkeleton />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Layers />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>They appear on the site in the order listed here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{newProject}</EmptyContent>
        </Empty>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="group/row flex items-start gap-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0 grow">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-subtle-foreground transition-colors hover:text-foreground"
                      aria-label={`Open ${item.name}`}
                    >
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                  {item.visible === 0 && (
                    <span className="text-xs text-subtle-foreground">Hidden</span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{item.description}</p>
                {item.stack && (
                  <p className="mt-1 truncate font-mono text-xs text-subtle-foreground">
                    {item.stack}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${item.name}`}
                      className="shrink-0 text-subtle-foreground opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100 aria-expanded:opacity-100"
                    />
                  }
                >
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDraft(toDraft(item))}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      update.mutate({ id: item.id, visible: item.visible === 1 ? 0 : 1 })
                    }
                  >
                    {item.visible === 1 ? <EyeOff /> : <Eye />}
                    {item.visible === 1 ? "Hide from the site" : "Show on the site"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={index === 0} onClick={() => move(item, -1)}>
                    <ArrowUp />
                    Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={index === items.length - 1}
                    onClick={() => move(item, 1)}
                  >
                    <ArrowDown />
                    Move down
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirming(item)}>
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={draft !== null} onOpenChange={open => !open && setDraft(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id === null ? "New project" : "Edit project"}</DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={draft.name}
                  onChange={event => setDraft({ ...draft, name: event.target.value })}
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel>Link</FieldLabel>
                <Input
                  value={draft.url}
                  onChange={event => setDraft({ ...draft, url: event.target.value })}
                  placeholder="https://github.com/DOOduneye/…"
                />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={draft.description}
                  onChange={event => setDraft({ ...draft, description: event.target.value })}
                  rows={3}
                />
              </Field>
              <Field>
                <FieldLabel>Stack</FieldLabel>
                <Input
                  value={draft.stack}
                  onChange={event => setDraft({ ...draft, stack: event.target.value })}
                  placeholder="Go · React · Postgres"
                />
              </Field>
              <label className="flex items-center justify-between gap-4 text-sm text-foreground">
                Show on the site
                <Switch
                  checked={draft.visible}
                  onCheckedChange={visible => setDraft({ ...draft, visible })}
                />
              </label>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={() => void save()} disabled={saving || !draft?.name.trim()}>
              {saving ? "Saving" : draft?.id === null ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming !== null} onOpenChange={open => !open && setConfirming(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              {confirming?.name} comes off the site. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirming(null)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirming) destroy.mutate({ id: confirming.id })
                setConfirming(null)
              }}
            >
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}

function RowsSkeleton() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {[0, 1, 2].map(row => (
        <div key={row} className="flex flex-col gap-2 py-3.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3.5 w-full max-w-md" />
        </div>
      ))}
    </div>
  )
}
