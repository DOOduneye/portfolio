import type { LucideIcon } from "lucide-react"

export function ToolButton({
  icon: Icon,
  label,
  active = false,
  onClick
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // The editor loses focus to a mousedown on the button, which collapses
      // the selection the command is about to act on.
      onMouseDown={event => event.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-primary/15 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  )
}

export function ToolDivider() {
  return <div className="mx-1 my-1.5 w-px self-stretch bg-border" />
}

export const floatingPanel =
  "flex items-center rounded-xl border border-border bg-card p-1 shadow-xl shadow-black/40"
