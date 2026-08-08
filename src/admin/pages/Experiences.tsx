import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Eye,
  EyeOff,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type Experience = RouterOutputs["admin"]["experiences"]["list"][number]

interface Draft {
  id: number | null
  role: string
  org: string
  orgUrl: string
  dates: string
  description: string
  visible: boolean
}

const blank: Draft = {
  id: null,
  role: "",
  org: "",
  orgUrl: "",
  dates: "",
  description: "",
  visible: true
}

const toDraft = (experience: Experience): Draft => ({
  id: experience.id,
  role: experience.role,
  org: experience.org,
  orgUrl: experience.orgUrl ?? "",
  dates: experience.dates,
  description: experience.description,
  visible: experience.visible === 1
})

export function Experiences() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [confirming, setConfirming] = useState<Experience | null>(null)
  const queryClient = useQueryClient()

  const list = useQuery(api.admin.experiences.list.queryOptions())

  const settled = {
    onError: (cause: unknown) => toast.error(errorMessage(cause)),
    onSuccess: () => queryClient.invalidateQueries(api.admin.experiences.list.queryFilter())
  }
  const create = useMutation(api.admin.experiences.create.mutationOptions(settled))
  const update = useMutation(api.admin.experiences.update.mutationOptions(settled))
  const destroy = useMutation(api.admin.experiences.remove.mutationOptions(settled))

  useEffect(() => {
    if (list.error) toast.error(errorMessage(list.error))
  }, [list.error])

  const items = list.data ?? []
  const saving = create.isPending || update.isPending
  const complete = Boolean(draft?.role.trim() && draft?.org.trim() && draft?.dates.trim())

  const save = async () => {
    if (!draft || !complete) return
    const payload = {
      role: draft.role.trim(),
      org: draft.org.trim(),
      orgUrl: draft.orgUrl.trim() || null,
      dates: draft.dates.trim(),
      description: draft.description.trim(),
      visible: draft.visible ? 1 : 0
    }
    if (draft.id === null) await create.mutateAsync({ ...payload, sortOrder: items.length })
    else await update.mutateAsync({ id: draft.id, ...payload })
    setDraft(null)
  }

  const move = (experience: Experience, by: -1 | 1) => {
    const index = items.findIndex(item => item.id === experience.id)
    const swap = items[index + by]
    if (!swap) return
    update.mutate({ id: experience.id, sortOrder: swap.sortOrder })
    update.mutate({ id: swap.id, sortOrder: experience.sortOrder })
  }

  const newExperience = (
    <Button size="sm" onClick={() => setDraft(blank)}>
      <Plus data-icon="inline-start" />
      New role
    </Button>
  )

  return (
    <AdminPage title="Experience" action={newExperience}>
      {list.isPending ? (
        <RowsSkeleton />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Briefcase />
            </EmptyMedia>
            <EmptyTitle>No roles yet</EmptyTitle>
            <EmptyDescription>They appear on the site in the order listed here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{newExperience}</EmptyContent>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Role</TableHead>
              <TableHead className="w-44">Organisation</TableHead>
              <TableHead className="w-44">Dates</TableHead>
              <TableHead className="w-24">On site</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="group/row">
                <TableCell className="max-w-0 truncate font-medium text-foreground">
                  {item.role}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    {item.org}
                    {item.orgUrl && (
                      <a
                        href={item.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-subtle-foreground transition-colors hover:text-foreground"
                        aria-label={`Open ${item.org}`}
                      >
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-[0.8125rem] whitespace-nowrap text-subtle-foreground">
                  {item.dates}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.visible === 1 ? "Shown" : "Hidden"}
                </TableCell>
                <TableCell className="text-right">
                  <RowActions
                    index={index}
                    total={items.length}
                    onEdit={() => setDraft(toDraft(item))}
                    onToggle={() =>
                      update.mutate({ id: item.id, visible: item.visible === 1 ? 0 : 1 })
                    }
                    onMove={by => move(item, by)}
                    onDelete={() => setConfirming(item)}
                    visible={item.visible === 1}
                    label={`${item.role} at ${item.org}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={draft !== null} onOpenChange={open => !open && setDraft(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id === null ? "New role" : "Edit role"}</DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Input
                  value={draft.role}
                  onChange={event => setDraft({ ...draft, role: event.target.value })}
                  placeholder="Software Engineering Intern"
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel>Organisation</FieldLabel>
                <Input
                  value={draft.org}
                  onChange={event => setDraft({ ...draft, org: event.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Link</FieldLabel>
                <Input
                  value={draft.orgUrl}
                  onChange={event => setDraft({ ...draft, orgUrl: event.target.value })}
                  placeholder="https://example.com"
                />
              </Field>
              <Field>
                <FieldLabel>Dates</FieldLabel>
                <Input
                  value={draft.dates}
                  onChange={event => setDraft({ ...draft, dates: event.target.value })}
                  placeholder="Aug - Nov 2024"
                />
              </Field>
              <Field>
                <FieldLabel>What you did</FieldLabel>
                <Textarea
                  value={draft.description}
                  onChange={event => setDraft({ ...draft, description: event.target.value })}
                  rows={3}
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
            <Button onClick={() => void save()} disabled={saving || !complete}>
              {saving ? "Saving" : draft?.id === null ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirming !== null} onOpenChange={open => !open && setConfirming(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this role?</DialogTitle>
            <DialogDescription>
              {confirming?.role} at {confirming?.org} comes off the site. This cannot be undone.
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
              Delete role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}

function RowActions({
  index,
  total,
  label,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  visible
}: {
  index: number
  total: number
  label: string
  visible: boolean
  onEdit: () => void
  onToggle: () => void
  onMove: (by: -1 | 1) => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Actions for ${label}`}
            className="text-subtle-foreground opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100 aria-expanded:opacity-100"
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggle}>
          {visible ? <EyeOff /> : <Eye />}
          {visible ? "Hide from the site" : "Show on the site"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={index === 0} onClick={() => onMove(-1)}>
          <ArrowUp />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem disabled={index === total - 1} onClick={() => onMove(1)}>
          <ArrowDown />
          Move down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RowsSkeleton() {
  return (
    <div className="divide-y divide-border border-t border-border">
      {[0, 1, 2].map(row => (
        <div key={row} className="flex h-11 items-center gap-4">
          <Skeleton className="h-3.5 w-48" />
          <Skeleton className="ml-auto h-3 w-32" />
        </div>
      ))}
    </div>
  )
}
