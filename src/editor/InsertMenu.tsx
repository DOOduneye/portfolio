import { useEffect, useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import { useTiptapState } from "@tiptap/react"
import { FloatingMenu } from "@tiptap/react/menus"
import {
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Plus,
  Quote,
  SquareCode,
  X
} from "lucide-react"
import { floatingPanel, ToolButton } from "./controls"

/**
 * The block inserter, offered only on an empty line. It starts as a single
 * plus so an empty document is not a wall of buttons.
 */
export function InsertMenu({
  editor,
  onInsertImage,
  uploading
}: {
  editor: Editor
  onInsertImage: (file: File) => void
  uploading: boolean
}) {
  const [open, setOpen] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  // Moving to a different empty line should present a fresh plus rather than
  // whatever state the last one was left in.
  const anchor = useTiptapState(({ editor }) => editor.state.selection.anchor)
  useEffect(() => setOpen(false), [anchor])

  const insert = (run: () => void) => () => {
    run()
    setOpen(false)
  }

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ editor, state }) => {
        const { $anchor, empty } = state.selection
        return (
          empty &&
          $anchor.parent.type.name === "paragraph" &&
          $anchor.parent.content.size === 0 &&
          !editor.isActive("blockquote") &&
          !editor.isActive("listItem")
        )
      }}
      options={{ placement: "left-start", offset: 8 }}
      className={open ? floatingPanel : ""}
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          if (file) onInsertImage(file)
          event.target.value = ""
          setOpen(false)
        }}
      />

      {open ? (
        <>
          <ToolButton
            icon={uploading ? LoaderCircle : ImageIcon}
            label="Image"
            onClick={() => fileInput.current?.click()}
          />
          <ToolButton
            icon={Heading2}
            label="Heading"
            onClick={insert(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          />
          <ToolButton
            icon={Heading3}
            label="Subheading"
            onClick={insert(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          />
          <ToolButton
            icon={Quote}
            label="Quote"
            onClick={insert(() => editor.chain().focus().toggleBlockquote().run())}
          />
          <ToolButton
            icon={SquareCode}
            label="Code block"
            onClick={insert(() => editor.chain().focus().toggleCodeBlock().run())}
          />
          <ToolButton
            icon={List}
            label="Bulleted list"
            onClick={insert(() => editor.chain().focus().toggleBulletList().run())}
          />
          <ToolButton
            icon={ListOrdered}
            label="Numbered list"
            onClick={insert(() => editor.chain().focus().toggleOrderedList().run())}
          />
          <ToolButton
            icon={Minus}
            label="Divider"
            onClick={insert(() => editor.chain().focus().setHorizontalRule().run())}
          />
          <ToolButton icon={X} label="Close" onClick={() => setOpen(false)} />
        </>
      ) : (
        <button
          type="button"
          aria-label="Insert"
          onMouseDown={event => event.preventDefault()}
          onClick={() => setOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-subtle-foreground transition-colors hover:border-ring hover:text-foreground"
        >
          <Plus size={15} strokeWidth={2} />
        </button>
      )}
    </FloatingMenu>
  )
}
