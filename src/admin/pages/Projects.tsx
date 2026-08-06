import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, errorMessage, type RouterOutputs } from "../api"
import { PageHeader } from "../components/PageHeader"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Project = RouterOutputs["admin"]["projects"]["list"][number]

interface Draft {
  id: number | null
  name: string
  url: string
  description: string
  sortOrder: number
  visible: boolean
}

const empty: Draft = {
  id: null,
  name: "",
  url: "",
  description: "",
  sortOrder: 0,
  visible: true
}

export function Projects() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const queryClient = useQueryClient()

  const list = useQuery(api.admin.projects.list.queryOptions())

  const settled = {
    onSuccess: () => queryClient.invalidateQueries(api.admin.projects.list.queryFilter())
  }
  const create = useMutation(api.admin.projects.create.mutationOptions(settled))
  const update = useMutation(api.admin.projects.update.mutationOptions(settled))
  const destroy = useMutation(api.admin.projects.remove.mutationOptions(settled))

  const items = list.data
  const saving = create.isPending || update.isPending
  const error = list.error ?? create.error ?? update.error ?? destroy.error

  const save = async () => {
    if (!draft) return
    const payload = {
      name: draft.name,
      url: draft.url.trim() || null,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0
    }
    if (draft.id === null) await create.mutateAsync(payload)
    else await update.mutateAsync({ id: draft.id, ...payload })
    setDraft(null)
  }

  const remove = (item: Project) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    destroy.mutate({ id: item.id })
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-8 py-10">
      <PageHeader
        title="Projects"
        description="The work listed on the site, in the order it appears."
        action={<Button onClick={() => setDraft(empty)}>New project</Button>}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{errorMessage(error)}</AlertTitle>
        </Alert>
      )}

      {draft && (
        <Card className="gap-4 p-5">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
              autoFocus
            />
          </Field>
          <Field>
            <FieldLabel>URL (optional)</FieldLabel>
            <Input
              value={draft.url}
              onChange={e => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://github.com/DOOduneye/…"
            />
          </Field>
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
            <Button onClick={() => void save()} disabled={saving || !draft.name.trim()}>
              {saving ? "Saving…" : draft.id === null ? "Create" : "Save"}
            </Button>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      {items && items.length === 0 && !draft && (
        <p className="text-sm text-muted-foreground">No projects yet.</p>
      )}

      <ul className="divide-y divide-border">
        {items?.map(item => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <span className="font-medium text-foreground">
                {item.name}
                {!item.visible && (
                  <span className="ml-2 text-xs text-subtle-foreground">(hidden)</span>
                )}
              </span>
              <p className="truncate text-sm text-subtle-foreground">{item.description}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button
                onClick={() =>
                  setDraft({
                    id: item.id,
                    name: item.name,
                    url: item.url ?? "",
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
  )
}
