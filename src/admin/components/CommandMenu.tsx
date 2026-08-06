import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, Briefcase, FileText, Layers, Plus, type LucideIcon } from "lucide-react"
import { api } from "../api"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface Command {
  id: string
  group: string
  label: string
  hint?: string
  icon: LucideIcon
  run: () => void
}

export function CommandMenu({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState(0)
  const posts = useQuery(api.admin.posts.list.queryOptions())

  const create = useMutation(
    api.admin.posts.create.mutationOptions({
      onSuccess: post => {
        void queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
        if (post) navigate(`/admin/posts/${post.slug}`)
      }
    })
  )

  const commands = useMemo<Command[]>(() => {
    const close = (action: () => void) => () => {
      onOpenChange(false)
      action()
    }

    return [
      {
        id: "new",
        group: "Actions",
        label: "New post",
        hint: "C",
        icon: Plus,
        run: close(() =>
          create.mutate({ slug: `untitled-${Date.now().toString(36)}`, title: "Untitled" })
        )
      },
      {
        id: "site",
        group: "Actions",
        label: "View site",
        icon: ArrowUpRight,
        run: close(() => window.open("/", "_blank"))
      },
      {
        id: "go-posts",
        group: "Go to",
        label: "Posts",
        hint: "G P",
        icon: FileText,
        run: close(() => navigate("/admin/posts"))
      },
      {
        id: "go-projects",
        group: "Go to",
        label: "Projects",
        hint: "G R",
        icon: Layers,
        run: close(() => navigate("/admin/projects"))
      },
      {
        id: "go-experience",
        group: "Go to",
        label: "Experience",
        hint: "G E",
        icon: Briefcase,
        run: close(() => navigate("/admin/experiences"))
      },
      ...(posts.data ?? []).map(post => ({
        id: `post-${post.slug}`,
        group: "Posts",
        label: post.title,
        hint: post.status === "draft" ? "Draft" : undefined,
        icon: FileText,
        run: close(() => navigate(`/admin/posts/${post.slug}`))
      }))
    ]
  }, [create, navigate, onOpenChange, posts.data])

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return commands
    return commands.filter(command => command.label.toLowerCase().includes(needle))
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery("")
      setHighlighted(0)
    }
  }, [open])

  useEffect(() => setHighlighted(0), [query])

  const move = (delta: number) =>
    setHighlighted(current => {
      if (matches.length === 0) return 0
      return (current + delta + matches.length) % matches.length
    })

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      matches[highlighted]?.run()
    }
  }

  let lastGroup = ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-1/4 max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Commands</DialogTitle>
        <DialogDescription className="sr-only">
          Search posts or jump to a section.
        </DialogDescription>

        <input
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search posts, or jump to a section…"
          aria-label="Search commands"
          spellCheck={false}
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-subtle-foreground"
        />

        <div className="max-h-80 overflow-y-auto p-1.5">
          {matches.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Nothing matches that.
            </p>
          )}

          {matches.map((command, index) => {
            const heading = command.group !== lastGroup ? command.group : null
            lastGroup = command.group
            const Icon = command.icon

            return (
              <div key={command.id}>
                {heading && (
                  <p className="px-2.5 pb-1 pt-3 text-xs font-medium text-subtle-foreground">
                    {heading}
                  </p>
                )}
                <button
                  type="button"
                  onClick={command.run}
                  onMouseMove={() => setHighlighted(index)}
                  data-highlighted={index === highlighted || undefined}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-muted-foreground data-highlighted:bg-muted data-highlighted:text-foreground"
                >
                  <Icon size={15} strokeWidth={2} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{command.label}</span>
                  {command.hint && (
                    <span className="shrink-0 font-mono text-xs text-subtle-foreground">
                      {command.hint}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useAdminShortcuts(openCommands: () => void) {
  const navigate = useNavigate()

  useEffect(() => {
    let awaitingGoTo = false

    const isTyping = () => {
      const active = document.activeElement as HTMLElement | null
      if (!active) return false
      return active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openCommands()
        return
      }

      if (isTyping() || event.metaKey || event.ctrlKey || event.altKey) return

      if (awaitingGoTo) {
        awaitingGoTo = false
        const destination = { p: "posts", r: "projects", e: "experiences" }[event.key.toLowerCase()]
        if (destination) {
          event.preventDefault()
          navigate(`/admin/${destination}`)
        }
        return
      }

      if (event.key.toLowerCase() === "g") {
        awaitingGoTo = true
        setTimeout(() => (awaitingGoTo = false), 1500)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [navigate, openCommands])
}
