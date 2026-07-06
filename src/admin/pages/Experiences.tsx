import { useCallback, useEffect, useState } from "react";
import { api, errorMessage, isUnauthorized } from "../api";
import {
  dangerButton,
  Field,
  ghostButton,
  inputClass,
  primaryButton,
} from "../components/ui";

type Experience = Awaited<
  ReturnType<typeof api.experiences.list.query>
>[number];

interface Draft {
  id: number | null;
  role: string;
  org: string;
  orgUrl: string;
  dates: string;
  description: string;
  sortOrder: number;
  visible: boolean;
}

const empty: Draft = {
  id: null,
  role: "",
  org: "",
  orgUrl: "",
  dates: "",
  description: "",
  sortOrder: 0,
  visible: true,
};

export function Experiences({ onAuthError }: { onAuthError: () => void }) {
  const [items, setItems] = useState<Experience[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    api.experiences.list
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
      role: draft.role,
      org: draft.org,
      orgUrl: draft.orgUrl.trim() || null,
      dates: draft.dates,
      description: draft.description,
      sortOrder: draft.sortOrder,
      visible: draft.visible ? 1 : 0,
    };
    try {
      if (draft.id === null) await api.experiences.create.mutate(payload);
      else await api.experiences.update.mutate({ id: draft.id, ...payload });
      setDraft(null);
      refresh();
    } catch (err) {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Experience) => {
    if (!confirm(`Delete "${item.role} · ${item.org}"?`)) return;
    try {
      await api.experiences.remove.mutate({ id: item.id });
      refresh();
    } catch (err) {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">Experiences</h1>
        <button onClick={() => setDraft(empty)} className={primaryButton}>
          New experience
        </button>
      </header>

      {error && (
        <p className="mt-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {draft && (
        <div className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role">
              <input
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder="Software Engineer"
                className={inputClass}
                autoFocus
              />
            </Field>
            <Field label="Organization">
              <input
                value={draft.org}
                onChange={(e) => setDraft({ ...draft, org: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Organization URL (optional)">
              <input
                value={draft.orgUrl}
                onChange={(e) => setDraft({ ...draft, orgUrl: e.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </Field>
            <Field label="Dates">
              <input
                value={draft.dates}
                onChange={(e) => setDraft({ ...draft, dates: e.target.value })}
                placeholder="Jan 2025 — Present"
                className={inputClass}
              />
            </Field>
          </div>
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
              disabled={saving || !draft.role.trim() || !draft.org.trim()}
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
        <p className="mt-10 text-sm text-subtle">No experiences yet.</p>
      )}

      <ul className="mt-6 divide-y divide-line">
        {items?.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <div className="min-w-0">
              <span className="font-medium text-fg">
                {item.role} <span className="text-subtle">· {item.org}</span>
                {!item.visible && (
                  <span className="ml-2 text-xs text-subtle">(hidden)</span>
                )}
              </span>
              <p className="text-sm text-subtle">{item.dates}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                onClick={() =>
                  setDraft({
                    id: item.id,
                    role: item.role,
                    org: item.org,
                    orgUrl: item.orgUrl ?? "",
                    dates: item.dates,
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
