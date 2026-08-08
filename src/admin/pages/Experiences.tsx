import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Experience = RouterOutputs["admin"]["experiences"]["list"][number]

interface Draft {
  id: number | null
  role: string
  org: string
  orgUrl: string
  dates: string
  description: string
  sortOrder: number
  visible: boolean
}

const empty: Draft = {
  id: null,
  role: "",
  org: "",
  orgUrl: "",
  dates: "",
  description: "",
  sortOrder: 0,
  visible: true
}

export function Experiences() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const queryClient = useQueryClient()

  const list = useQuery(api.admin.experiences.list.queryOptions())

  const reportFailure = (cause: unknown) => toast.error(errorMessage(cause))

  const settled = {
    onError: reportFailure,
    onSuccess: () => queryClient.invalidateQueries(api.admin.experiences.list.queryFilter())
  }
  const create = useMutation(api.admin.experiences.create.mutationOptions(settled))
  const update = useMutation(api.admin.experiences.update.mutationOptions(settled))
  const destroy = useMutation(api.admin.experiences.remove.mutationOptions(settled))

  useEffect(() => {
    if (list.error) toast.error(errorMessage(list.error))
  }, [list.error])

  const items = list.data
  const saving = create.isPending || update.isPending

  const save = async () => {
    if (!draft) return
    const payload = {
      role: draft.role,
      org: draft.org,
      orgUrl: draft.orgUrl.trim() || null,
      dates: draft.dates,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0
    }
    if (draft.id === null) await create.mutateAsync(payload)
    else await update.mutateAsync({ id: draft.id, ...payload })
    setDraft(null)
  }

  const remove = (item: Experience) => {
    if (!confirm(`Delete "${`${item.role} · ${item.org}`}"?`)) return
    destroy.mutate({ id: item.id })
  }

  return (
    <AdminPage
      title="Experience"
      action={<Button onClick={() => setDraft(empty)}>New experience</Button>}
    >
      <div className="flex flex-col gap-6">
        {draft && (
          <Card className="gap-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Input
                  value={draft.role}
                  onChange={e => setDraft({ ...draft, role: e.target.value })}
                  placeholder="Software Engineer"
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel>Organization</FieldLabel>
                <Input
                  value={draft.org}
                  onChange={e => setDraft({ ...draft, org: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Organization URL (optional)</FieldLabel>
                <Input
                  value={draft.orgUrl}
                  onChange={e => setDraft({ ...draft, orgUrl: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field>
                <FieldLabel>Dates</FieldLabel>
                <Input
                  value={draft.dates}
                  onChange={e => setDraft({ ...draft, dates: e.target.value })}
                  placeholder="Jan 2025 - Present"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={draft.description}
                onChange={e => setDraft({ ...draft, description: e.target.value })}
                rows={3}
              />
            </Field>
            <div className="flex items-center gap-6">
              <Field>
                <FieldLabel>Order</FieldLabel>
                <Input
                  type="number"
                  value={draft.sortOrder}
                  onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                  className="w-24"
                />
              </Field>
              <label className="flex items-center gap-2 pt-5 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={draft.visible}
                  onChange={e => setDraft({ ...draft, visible: e.target.checked })}
                  className="accent-brand"
                />
                Visible on site
              </label>
            </div>
            <div className="flex gap-2 border-t border-border pt-4">
              <Button
                onClick={() => void save()}
                disabled={saving || !draft.role.trim() || !draft.org.trim()}
              >
                {saving ? "Saving…" : draft.id === null ? "Create" : "Save"}
              </Button>
              <Button onClick={() => setDraft(null)}>Cancel</Button>
            </div>
          </Card>
        )}

        {items && items.length === 0 && !draft && (
          <p className="text-sm text-muted-foreground">No experiences yet.</p>
        )}

        <ul className="divide-y divide-border">
          {items?.map(item => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <span className="font-medium text-foreground">
                  {item.role} <span className="text-subtle-foreground">· {item.org}</span>
                  {!item.visible && (
                    <span className="ml-2 text-xs text-subtle-foreground">(hidden)</span>
                  )}
                </span>
                <p className="text-sm text-subtle-foreground">{item.dates}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  onClick={() =>
                    setDraft({
                      id: item.id,
                      role: item.role,
                      org: item.org,
                      orgUrl: item.orgUrl ?? "",
                      dates: item.dates,
                      description: item.description,
                      sortOrder: item.sortOrder,
                      visible: item.visible === 1
                    })
                  }
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => remove(item)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminPage>
  )
}
