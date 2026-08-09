import { useEffect, useState } from "react"
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

function iconCandidates(url: string): string[] {
  const host = hostFrom(url)
  if (!host) return []

  const labels = host.split(".")
  const apex = labels.length > 2 ? labels.slice(-2).join(".") : host
  const hosts = apex === host ? [host] : [host, apex]

  return hosts.map(name => `https://${name}/favicon.ico`)
}

export function OrgIcon({ url, name }: { url: string; name: string }) {
  const candidates = iconCandidates(url)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => setAttempt(0), [url])

  const source = candidates[attempt]

  if (!source) {
    return (
      <span className="flex size-4 items-center justify-center rounded-[3px] bg-muted text-[0.5625rem] font-medium text-muted-foreground">
        {name.trim().charAt(0).toUpperCase() || "·"}
      </span>
    )
  }

  return (
    <img
      src={source}
      alt=""
      onError={() => setAttempt(current => current + 1)}
      className="size-4 rounded-[3px] object-contain"
    />
  )
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
  return (
    <InputGroup>
      <InputGroupAddon>
        <OrgIcon url={url} name={value} />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  )
}
