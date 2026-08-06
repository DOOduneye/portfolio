import { useCallback, useEffect, useState } from "react"
import { api, errorMessage } from "../api"
import { PageHeader } from "../components/PageHeader"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Experience = Awaited<ReturnType<typeof api.admin.experiences.list.query>>[number]

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
  const [items, setItems] = useState<Experience[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(() => {
    api.admin.experiences.list
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
      role: draft.role,
      org: draft.org,
      orgUrl: draft.orgUrl.trim() || null,
      dates: draft.dates,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0
    }
    try {
      if (draft.id === null) await api.admin.experiences.create.mutate(payload)
      else await api.admin.experiences.update.mutate({ id: draft.id, ...payload })
      setDraft(null)
      refresh()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: Experience) => {
    if (!confirm(`Delete "${item.role} · ${item.org}"?`)) return
    try {
      await api.admin.experiences.remove.mutate({ id: item.id })
      refresh()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-8 py-10">
      <PageHeader
        title="Experiences"
        description="Roles listed on the site, in the order they appear."
        action={<Button onClick={() => setDraft(empty)}>New experience</Button>}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

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
            <Button onClick={save} disabled={saving || !draft.role.trim() || !draft.org.trim()}>
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
  )
}
