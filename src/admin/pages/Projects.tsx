import { useCallback, useEffect, useState } from "react"
import { api, errorMessage } from "../api"
import { PageHeader } from "../components/PageHeader"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Project = Awaited<ReturnType<typeof api.admin.projects.list.query>>[number]

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
  const [items, setItems] = useState<Project[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    api.admin.projects.list
      .query()
      .then(setItems)
      .catch(err => setError(errorMessage(err)))
  }, [])

  useEffect(refresh, [refresh])

  const save = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)
    const payload = {
      name: draft.name,
      url: draft.url.trim() || null,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0
    }
    try {
      if (draft.id === null) await api.admin.projects.create.mutate(payload)
      else await api.admin.projects.update.mutate({ id: draft.id, ...payload })
      setDraft(null)
      refresh()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: Project) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    try {
      await api.admin.projects.remove.mutate({ id: item.id })
      refresh()
    } catch (err) {
      setError(errorMessage(err))
    }
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
          <AlertTitle>{error}</AlertTitle>
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
            <Button onClick={save} disabled={saving || !draft.name.trim()}>
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
