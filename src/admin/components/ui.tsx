import { useEffect, useState } from "react"

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="rounded-full border border-ok/20 bg-ok/10 px-2 py-0.5 font-mono text-xs text-ok">
      published
    </span>
  ) : (
    <span className="rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-xs text-subtle">
      draft
    </span>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-subtle">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  "w-full rounded-lg border border-line bg-page px-3 py-2 text-sm text-fg placeholder-subtle outline-none transition-colors focus:border-accent"

export const primaryButton =
  "rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-page transition-colors hover:bg-accent-strong disabled:opacity-50"

export const ghostButton =
  "rounded-lg border border-line px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:border-subtle hover:text-fg"

export const dangerButton =
  "rounded-lg px-3.5 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"

/**
 * Asks for the second press in the page rather than in a native dialog, which
 * cannot be styled and reads as a browser warning rather than part of the app.
 */
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  disabled
}: {
  label: string
  confirmLabel: string
  onConfirm: () => void
  disabled?: boolean
}) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(timer)
  }, [armed])

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        disabled={disabled}
        className={dangerButton}
      >
        {label}
      </button>
    )
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="rounded-lg bg-danger px-3.5 py-1.5 text-sm font-medium text-page transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {confirmLabel}
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        className="text-sm text-subtle transition-colors hover:text-muted"
      >
        Cancel
      </button>
    </span>
  )
}
