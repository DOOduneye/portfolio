import { useCallback, useEffect, useState } from "react";
import { api, errorMessage, isUnauthorized } from "../api";
import {
  dangerButton,
  Field,
  ghostButton,
  inputClass,
  primaryButton,
} from "../components/ui";

type Project = Awaited<ReturnType<typeof api.projects.list.query>>[number];

interface Draft {
  id: number | null;
  name: string;
  url: string;
  description: string;
  sortOrder: number;
  visible: boolean;
}

const empty: Draft = {
  id: null,
  name: "",
  url: "",
  description: "",
  sortOrder: 0,
  visible: true,
};

export function Projects({ onAuthError }: { onAuthError: () => void }) {
  const [items, setItems] = useState<Project[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    api.projects.list
      .query()
      .then(setItems)
      .catch((err) => {
        if (isUnauthorized(err)) onAuthError();
        else setError(errorMessage(err));
      });
  }, [onAuthError]);

  useEffect(refresh, [refresh]);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    const payload = {
      name: draft.name,
      url: draft.url.trim() || null,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0,
    };
    try {
      if (draft.id === null) await api.projects.create.mutate(payload);
      else await api.projects.update.mutate({ id: draft.id, ...payload });
      setDraft(null);
      refresh();
    } catch (err) {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Project) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.projects.remove.mutate({ id: item.id });
      refresh();
    } catch (err) {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">Projects</h1>
        <button onClick={() => setDraft(empty)} className={primaryButton}>
          New project
        </button>
      </header>

      {error && (
        <p className="mt-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {draft && (
        <div className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5">
          <Field label="Name">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputClass}
              autoFocus
            />
          </Field>
          <Field label="URL (optional)">
            <input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://github.com/DOOduneye/…"
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              rows={3}
              className={inputClass}
            />
          </Field>
          <div className="flex items-center gap-6">
            <Field label="Order">
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft({ ...draft, sortOrder: Number(e.target.value) })
                }
                className={`${inputClass} w-24`}
              />
            </Field>
            <label className="flex items-center gap-2 pt-5 text-sm text-muted">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) =>
                  setDraft({ ...draft, visible: e.target.checked })
                }
                className="accent-accent"
              />
              Visible on site
            </label>
          </div>
          <div className="flex gap-2 border-t border-line pt-4">
            <button
              onClick={save}
              disabled={saving || !draft.name.trim()}
              className={primaryButton}
            >
              {saving ? "Saving…" : draft.id === null ? "Create" : "Save"}
            </button>
            <button onClick={() => setDraft(null)} className={ghostButton}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {items && items.length === 0 && !draft && (
        <p className="mt-10 text-sm text-subtle">No projects yet.</p>
      )}

      <ul className="mt-6 divide-y divide-line">
        {items?.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <div className="min-w-0">
              <span className="font-medium text-fg">
                {item.name}
                {!item.visible && (
                  <span className="ml-2 text-xs text-subtle">(hidden)</span>
                )}
              </span>
              <p className="truncate text-sm text-subtle">
                {item.description}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                onClick={() =>
                  setDraft({
                    id: item.id,
                    name: item.name,
                    url: item.url ?? "",
                    description: item.description,
                    sortOrder: item.sortOrder,
                    visible: item.visible === 1,
                  })
                }
                className={ghostButton}
              >
                Edit
              </button>
              <button onClick={() => remove(item)} className={dangerButton}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
