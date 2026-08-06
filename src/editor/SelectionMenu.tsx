import { useEffect, useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import { useTiptapState } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import { Bold, Check, Code, Heading2, Heading3, Italic, Link, Quote, Unlink } from "lucide-react"
import { floatingPanel, ToolButton, ToolDivider } from "./controls"

/**
 * Formatting appears against a selection rather than in a permanent toolbar,
 * so the page stays the article while it is being written.
 */
export function SelectionMenu({ editor }: { editor: Editor }) {
  const [editingLink, setEditingLink] = useState(false)

  const active = useTiptapState(
    ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      code: editor.isActive("code"),
      link: editor.isActive("link"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      quote: editor.isActive("blockquote")
    }),
    shallowEqual
  )

  return (
    <BubbleMenu
      editor={editor}
      // A selection inside a code block is code, not prose; offering bold there
      // would produce a command the schema rejects.
      shouldShow={({ editor, from, to }) =>
        from !== to && !editor.isActive("codeBlock") && !editor.isActive("image")
      }
      options={{ placement: "top", offset: 8 }}
      className={floatingPanel}
      onKeyDown={event => event.key === "Escape" && setEditingLink(false)}
    >
      {editingLink ? (
        <LinkField
          initialHref={editor.getAttributes("link").href ?? ""}
          onCancel={() => setEditingLink(false)}
          onSubmit={href => {
            const chain = editor.chain().focus().extendMarkRange("link")
            if (href) chain.setLink({ href }).run()
            else chain.unsetLink().run()
            setEditingLink(false)
          }}
        />
      ) : (
        <>
          <ToolButton
            icon={Bold}
            label="Bold"
            active={active.bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolButton
            icon={Italic}
            label="Italic"
            active={active.italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolButton
            icon={Code}
            label="Inline code"
            active={active.code}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <ToolButton
            icon={active.link ? Unlink : Link}
            label={active.link ? "Edit link" : "Add link"}
            active={active.link}
            onClick={() => setEditingLink(true)}
          />
          <ToolDivider />
          <ToolButton
            icon={Heading2}
            label="Heading"
            active={active.h2}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolButton
            icon={Heading3}
            label="Subheading"
            active={active.h3}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
          <ToolButton
            icon={Quote}
            label="Quote"
            active={active.quote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </>
      )}
    </BubbleMenu>
  )
}

function LinkField({
  initialHref,
  onSubmit,
  onCancel
}: {
  initialHref: string
  onSubmit: (href: string) => void
  onCancel: () => void
}) {
  const [href, setHref] = useState(initialHref)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => input.current?.focus(), [])

  return (
    <form
      className="flex items-center gap-1 px-1"
      onSubmit={event => {
        event.preventDefault()
        onSubmit(href.trim())
      }}
    >
      <input
        ref={input}
        value={href}
        onChange={event => setHref(event.target.value)}
        onKeyDown={event => event.key === "Escape" && onCancel()}
        placeholder="Paste a link"
        className="w-56 bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-subtle-foreground outline-none"
      />
      <ToolButton icon={Check} label="Apply link" onClick={() => onSubmit(href.trim())} />
      {initialHref && <ToolButton icon={Unlink} label="Remove link" onClick={() => onSubmit("")} />}
    </form>
  )
}

function shallowEqual<T extends Record<string, unknown>>(a: T, b: T | null): boolean {
  if (!b) return false
  return Object.keys(a).every(key => a[key] === b[key])
}
