import { useEffect, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/*
 * A small primitive set in the shadcn idiom: one control height, one radius,
 * variants that differ by surface rather than by hue. Written out rather than
 * pulled in, because five components do not justify a component library.
 */

const CONTROL =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  destructive: "bg-transparent text-destructive hover:bg-destructive/10"
} as const

type Variant = keyof typeof VARIANTS

export function Button({
  variant = "outline",
  icon: Icon,
  children,
  className = "",
  ...props
}: {
  variant?: Variant
  icon?: LucideIcon
  children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${CONTROL} ${VARIANTS[variant]} ${className}`} {...props}>
      {Icon && <Icon size={15} strokeWidth={2} />}
      {children}
    </button>
  )
}

export function LinkButton({
  variant = "outline",
  icon: Icon,
  children,
  className = "",
  ...props
}: {
  variant?: Variant
  icon?: LucideIcon
  children?: ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${CONTROL} ${VARIANTS[variant]} ${className}`} {...props}>
      {Icon && <Icon size={15} strokeWidth={2} />}
      {children}
    </a>
  )
}

/**
 * Only a draft is marked. Published is the resting state, and its date already
 * says so, so labelling both leaves every row shouting the same thing.
 */
export function Status({ status }: { status: "draft" | "published" }) {
  if (status === "published") return null

  return (
    <span className="rounded border border-border px-1.5 py-px text-xs font-medium text-muted-foreground">
      Draft
    </span>
  )
}

export function PageHeader({
  title,
  description,
  action
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-border pb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  )
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-border bg-card ${className}`}>{children}</div>
}

/** An empty screen is an invitation to act, so it carries the action itself. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Alert({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground outline-none transition-colors focus:border-ring"

/** The second press happens in the page, not in an unstyleable browser dialog. */
export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  disabled,
  icon
}: {
  label: string
  confirmLabel: string
  onConfirm: () => void
  disabled?: boolean
  icon?: LucideIcon
}) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(timer)
  }, [armed])

  if (!armed) {
    return (
      <Button variant="destructive" icon={icon} onClick={() => setArmed(true)} disabled={disabled}>
        {label}
      </Button>
    )
  }

  return (
    <span className="flex items-center gap-1">
      <Button
        onClick={onConfirm}
        disabled={disabled}
        className="bg-destructive text-background hover:bg-destructive/90"
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" onClick={() => setArmed(false)}>
        Cancel
      </Button>
    </span>
  )
}
