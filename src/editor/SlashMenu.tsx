import { useEffect, useState } from "react"
import type { Editor, Range } from "@tiptap/core"
import type { SlashState } from "./slash"
import {
  Heading2,
  Heading3,
  Image as ImageIcon,
  Info,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  SquareCode,
  Table,
  type LucideIcon
} from "lucide-react"

export interface SlashItem {
  title: string
  keywords: string
  icon: LucideIcon
  run: (editor: Editor, range: Range) => void
}

export const REQUEST_IMAGE = "portfolio:slash-image"

// A stable identity, so the key handler effect is not rebuilt every render.
const NO_ITEMS: SlashItem[] = []

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Heading",
    keywords: "h2 title section",
    icon: Heading2,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
  },
  {
    title: "Subheading",
    keywords: "h3 title",
    icon: Heading3,
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
  },
  {
    title: "Bulleted list",
    keywords: "ul unordered bullet",
    icon: List,
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run()
  },
  {
    title: "Numbered list",
    keywords: "ol ordered number",
    icon: ListOrdered,
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run()
  },
  {
    title: "Task list",
    keywords: "todo checkbox check",
    icon: ListChecks,
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run()
  },
  {
    title: "Code block",
    keywords: "pre snippet syntax",
    icon: SquareCode,
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
  },
  {
    title: "Quote",
    keywords: "blockquote citation",
    icon: Quote,
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run()
  },
  {
    title: "Callout",
    keywords: "note aside info",
    icon: Info,
    run: (editor, range) => editor.chain().focus().deleteRange(range).setCallout("note").run()
  },
  {
    title: "Table",
    keywords: "grid rows columns",
    icon: Table,
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
  },
  {
    title: "Divider",
    keywords: "hr rule separator break",
    icon: Minus,
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run()
  },
  {
    title: "Image",
    keywords: "picture photo upload",
    icon: ImageIcon,
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run()
      window.dispatchEvent(new CustomEvent(REQUEST_IMAGE))
    }
  }
]

export function SlashMenu({
  state,
  keyHandler
}: {
  state: SlashState | null
  keyHandler: { current: ((event: KeyboardEvent) => boolean) | null }
}) {
  const [selected, setSelected] = useState(0)
  const items = state?.items ?? NO_ITEMS

  useEffect(() => setSelected(0), [state?.items])

  useEffect(() => {
    keyHandler.current = event => {
      if (!state) return false
      if (event.key === "ArrowUp") {
        setSelected(current => (current + items.length - 1) % items.length)
        return true
      }
      if (event.key === "ArrowDown") {
        setSelected(current => (current + 1) % items.length)
        return true
      }
      if (event.key === "Enter") {
        const item = items[selected]
        if (item) state.select(item)
        return true
      }
      return false
    }
    return () => {
      keyHandler.current = null
    }
  }, [items, keyHandler, selected, state])

  if (!state) return null

  // Flips above the caret when there is no room below it.
  const below = state.rect.bottom + 320 < window.innerHeight
  const style = {
    left: Math.min(state.rect.left, window.innerWidth - 272),
    top: below ? state.rect.bottom + 8 : undefined,
    bottom: below ? undefined : window.innerHeight - state.rect.top + 8
  }

  return (
    <div style={{ position: "fixed", zIndex: 50, ...style }}>
      {items.length === 0 ? (
        <div className="w-64 rounded-lg border border-border bg-popover p-3 text-sm text-muted-foreground shadow-lg shadow-black/50">
          No blocks match that.
        </div>
      ) : (
        <div className="max-h-72 w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg shadow-black/50">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.title}
                type="button"
                onMouseMove={() => setSelected(index)}
                onMouseDown={event => event.preventDefault()}
                onClick={() => state.select(item)}
                data-highlighted={index === selected || undefined}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-muted-foreground data-highlighted:bg-muted data-highlighted:text-foreground"
              >
                <Icon size={15} strokeWidth={2} className="shrink-0" />
                {item.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
