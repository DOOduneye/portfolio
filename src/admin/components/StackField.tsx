import { useEffect, useId, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SEPARATOR = " · "

export function parseStack(value: string): string[] {
  return value
    .split(/[·,]/)
    .map(part => part.trim())
    .filter(Boolean)
}

export function formatStack(parts: string[]): string {
  return parts.join(SEPARATOR)
}

export function StackField({
  value,
  suggestions,
  onChange
}: {
  value: string[]
  suggestions: string[]
  onChange: (next: string[]) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const container = useRef<HTMLDivElement>(null)
  const listId = useId()

  const needle = query.trim().toLowerCase()
  const matches = suggestions.filter(
    item => !value.includes(item) && item.toLowerCase().includes(needle)
  )
  const exact = matches.some(item => item.toLowerCase() === needle)
  const options = needle && !exact ? [...matches, query.trim()] : matches
  const creating = needle.length > 0 && !exact

  useEffect(() => setHighlighted(0), [query, open])

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  const add = (item: string) => {
    const trimmed = item.trim()
    if (!trimmed || value.includes(trimmed)) return
    onChange([...value, trimmed])
    setQuery("")
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!needle) return
      event.preventDefault()
      setOpen(true)
      setHighlighted(current => {
        const next = event.key === "ArrowDown" ? current + 1 : current - 1
        return (next + options.length) % Math.max(options.length, 1)
      })
      return
    }
    if (event.key === "Enter") {
      event.preventDefault()
      const picked = options[highlighted]
      if (picked) add(picked)
      return
    }
    if (event.key === "Escape") {
      setOpen(false)
      return
    }
    if (event.key === "Backspace" && !query && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div ref={container} className="relative">
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {value.map(item => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-md bg-muted py-0.5 pr-1 pl-2 font-mono text-xs text-foreground"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(value.filter(entry => entry !== item))}
              aria-label={`Remove ${item}`}
              className="text-subtle-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <input
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={event => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? "Go, React, Postgres" : ""}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && needle.length > 0 && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {options.map((item, index) => (
            <li key={item}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlighted}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => add(item)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left font-mono text-xs text-muted-foreground",
                  index === highlighted && "bg-muted text-foreground"
                )}
              >
                {item}
                {creating && index === options.length - 1 && (
                  <span className="font-sans text-[0.6875rem] text-subtle-foreground">Add</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
