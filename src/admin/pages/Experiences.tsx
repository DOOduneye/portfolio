import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowUpRight, Briefcase, Plus } from "lucide-react"
import { toast } from "sonner"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
import { RecordsList, type Column } from "../components/RecordsList"
import { RowActions } from "../components/RowActions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const COLUMNS: Column[] = [
  { key: "role", label: "Role" },
  { key: "org", label: "Organisation", className: "w-44" },
  { key: "dates", label: "Dates", className: "w-44" },
  { key: "visible", className: "w-20" },
  { key: "actions", className: "w-12" }
]

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
      <RecordsList
        loading={list.isPending}
        rows={items}
        columns={COLUMNS}
        empty={{
          icon: Briefcase,
          title: "No roles yet",
          description: "They appear on the site in the order listed here.",
          action: newExperience
        }}
      >
        {(item, index) => (
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
            <TableCell className="text-xs text-subtle-foreground">
              {item.visible === 1 ? null : "Hidden"}
            </TableCell>
            <TableCell className="text-right">
              <RowActions
                index={index}
                total={items.length}
                onEdit={() => setDraft(toDraft(item))}
                onToggle={() => update.mutate({ id: item.id, visible: item.visible === 1 ? 0 : 1 })}
                onMove={by => move(item, by)}
                onDelete={() => setConfirming(item)}
                visible={item.visible === 1}
                label={`${item.role} at ${item.org}`}
              />
            </TableCell>
          </TableRow>
        )}
      </RecordsList>

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
