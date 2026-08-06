import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  disabled,
  icon: Icon
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
      <Button variant="destructive" onClick={() => setArmed(true)} disabled={disabled}>
        {Icon && <Icon data-icon="inline-start" />}
        {label}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="destructive" onClick={onConfirm} disabled={disabled}>
        {confirmLabel}
      </Button>
      <Button variant="ghost" onClick={() => setArmed(false)}>
        Cancel
      </Button>
    </div>
  )
}
