import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Layers, Plus } from "lucide-react"
import { toast } from "sonner"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
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

  const reorder = (ordered: typeof items) => {
    ordered.forEach((item, index) => {
      if (item.sortOrder !== index) update.mutate({ id: item.id, sortOrder: index })
    })
  }

  const newProject = (
    <Button size="sm" onClick={() => setDraft(blank)}>
      <Plus data-icon="inline-start" />
      New project
    </Button>
  )

  return (
    <AdminPage title="Projects" action={newProject}>
      <Arrangement
        loading={list.isPending}
        items={items}
        empty={{
          icon: Layers,
          title: "No projects yet",
          description: "They appear on the site in the order you arrange them here.",
          action: newProject
        }}
        onReorder={reorder}
        onOpen={item => setDraft(toDraft(item))}
        actions={item => (
          <ItemActions
            label={item.name}
            visible={item.visible === 1}
            onToggle={() => update.mutate({ id: item.id, visible: item.visible === 1 ? 0 : 1 })}
            onDelete={() => setConfirming(item)}
          />
        )}
      >
        {item => (
          <>
            <h3 className="font-medium text-foreground">
              {item.name}
              {item.url && (
                <span className="ml-1.5 font-mono text-xs text-subtle-foreground">↗</span>
              )}
              {item.visible === 0 && (
                <span className="ml-2 text-xs font-normal text-subtle-foreground">Hidden</span>
              )}
            </h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            {item.stack && (
              <p className="mt-2.5 font-mono text-xs text-subtle-foreground">{item.stack}</p>
            )}
          </>
        )}
      </Arrangement>

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
