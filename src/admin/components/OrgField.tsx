import { useState } from "react"
import { Building2 } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export function hostFrom(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname
  } catch {
    return null
  }
}

export function normaliseUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.includes("://")) return trimmed
  return hostFrom(trimmed) ? `https://${trimmed}` : trimmed
}

export function orgFromUrl(value: string): string {
  const host = hostFrom(value)
  if (!host) return ""
  const label = host.replace(/^(www|about|go|jobs|careers)\./, "").split(".")[0]
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : ""
}

export function OrgField({
  value,
  url,
  onChange,
  placeholder
}: {
  value: string
  url: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const host = hostFrom(url)
  const [broken, setBroken] = useState(false)

  return (
    <InputGroup>
      <InputGroupAddon>
        {host && !broken ? (
          <img
            src={`https://${host}/favicon.ico`}
            alt=""
            onError={() => setBroken(true)}
            className="size-4 rounded-[3px] object-contain"
          />
        ) : (
          <Building2 />
        )}
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  )
}
