import { useCallback, useEffect, useState } from "react"
import { api, errorMessage } from "../api"
import { Alert, Button, Card, Field, inputClass, Page, PageHeader } from "../components/ui"

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
    <Page>
      <PageHeader
        title="Experiences"
        description="Roles listed on the site, in the order they appear."
        action={
          <Button variant="primary" onClick={() => setDraft(empty)}>
            New experience
          </Button>
        }
      />

      {error && <Alert message={error} />}

      {draft && (
        <Card className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role">
              <input
                value={draft.role}
                onChange={e => setDraft({ ...draft, role: e.target.value })}
                placeholder="Software Engineer"
                className={inputClass}
                autoFocus
              />
            </Field>
            <Field label="Organization">
              <input
                value={draft.org}
                onChange={e => setDraft({ ...draft, org: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Organization URL (optional)">
              <input
                value={draft.orgUrl}
                onChange={e => setDraft({ ...draft, orgUrl: e.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </Field>
            <Field label="Dates">
              <input
                value={draft.dates}
                onChange={e => setDraft({ ...draft, dates: e.target.value })}
                placeholder="Jan 2025 - Present"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={draft.description}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>
          <div className="flex items-center gap-6">
            <Field label="Order">
              <input
                type="number"
                value={draft.sortOrder}
                onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                className={`${inputClass} w-24`}
              />
            </Field>
            <label className="flex items-center gap-2 pt-5 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={e => setDraft({ ...draft, visible: e.target.checked })}
                className="accent-accent"
              />
              Visible on site
            </label>
          </div>
          <div className="flex gap-2 border-t border-border pt-4">
            <Button
              variant="primary"
              onClick={save}
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
    </Page>
  )
}
