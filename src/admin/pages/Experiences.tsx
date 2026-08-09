import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Briefcase, Plus } from "lucide-react"
import { toast } from "sonner"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
import { OrgField, normaliseUrl, orgFromUrl } from "../components/OrgField"
import { DateRangeField } from "../components/DateRangeField"
import {
  emptyRange,
  formatRange,
  isRangeComplete,
  parseRange,
  type DateRange
} from "../lib/dateRange"
import { Arrangement } from "../components/Arrangement"
import { ItemActions } from "../components/ItemActions"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type Experience = RouterOutputs["admin"]["experiences"]["list"][number]

interface Draft {
  id: number | null
  role: string
  org: string
  orgUrl: string
  dates: DateRange
  description: string
  visible: boolean
}

const blank: Draft = {
  id: null,
  role: "",
  org: "",
  orgUrl: "",
  dates: emptyRange,
  description: "",
  visible: true
}

const toDraft = (experience: Experience): Draft => ({
  id: experience.id,
  role: experience.role,
  org: experience.org,
  orgUrl: experience.orgUrl ?? "",
  dates: parseRange(experience.dates),
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
  const complete = Boolean(
    draft?.role.trim() && draft?.org.trim() && draft && isRangeComplete(draft.dates)
  )

  const save = async () => {
    if (!draft || !complete) return
    const payload = {
      role: draft.role.trim(),
      org: draft.org.trim(),
      orgUrl: draft.orgUrl.trim() || null,
      dates: formatRange(draft.dates),
      description: draft.description.trim(),
      visible: draft.visible ? 1 : 0
    }
    if (draft.id === null) await create.mutateAsync({ ...payload, sortOrder: items.length })
    else await update.mutateAsync({ id: draft.id, ...payload })
    setDraft(null)
  }

  const reorder = (ordered: typeof items) => {
    ordered.forEach((item, index) => {
      if (item.sortOrder !== index) update.mutate({ id: item.id, sortOrder: index })
    })
  }

  const newExperience = (
    <Button size="sm" onClick={() => setDraft(blank)}>
      <Plus data-icon="inline-start" />
      New role
    </Button>
  )

  return (
    <AdminPage title="Experience" action={newExperience}>
      <Arrangement
        loading={list.isPending}
        items={items}
        empty={{
          icon: Briefcase,
          title: "No roles yet",
          description: "They appear on the site in the order you arrange them here.",
          action: newExperience
        }}
        onReorder={reorder}
        onOpen={item => setDraft(toDraft(item))}
        actions={item => (
          <ItemActions
            label={`${item.role} at ${item.org}`}
            visible={item.visible === 1}
            onToggle={() => update.mutate({ id: item.id, visible: item.visible === 1 ? 0 : 1 })}
            onDelete={() => setConfirming(item)}
          />
        )}
      >
        {item => (
          <div className="grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <span className="pt-0.5 font-mono text-xs leading-6 whitespace-nowrap text-subtle-foreground">
              {item.dates}
            </span>
            <div>
              <h3 className="font-medium text-foreground">
                {item.role}
                <span className="text-subtle-foreground"> · </span>
                {item.org}
                {item.visible === 0 && (
                  <span className="ml-2 text-xs font-normal text-subtle-foreground">Hidden</span>
                )}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        )}
      </Arrangement>

      <Dialog open={draft !== null} onOpenChange={open => !open && setDraft(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id === null ? "New role" : "Edit role"}</DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="flex flex-col gap-3.5">
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
                <OrgField
                  value={draft.org}
                  url={draft.orgUrl}
                  onChange={org => setDraft({ ...draft, org })}
                  placeholder="Google"
                />
              </Field>
              <Field>
                <FieldLabel>Link</FieldLabel>
                <Input
                  value={draft.orgUrl}
                  onChange={event => setDraft({ ...draft, orgUrl: event.target.value })}
                  onBlur={event => {
                    const orgUrl = normaliseUrl(event.target.value)
                    setDraft({
                      ...draft,
                      orgUrl,
                      org: draft.org.trim() || orgFromUrl(orgUrl)
                    })
                  }}
                  placeholder="google.com"
                />
              </Field>
              <Field>
                <FieldLabel>Dates</FieldLabel>
                <DateRangeField
                  value={draft.dates}
                  onChange={dates => setDraft({ ...draft, dates })}
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
              <label className="mt-1 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm text-foreground">
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
