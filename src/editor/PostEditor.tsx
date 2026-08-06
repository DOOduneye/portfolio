import { useCallback, useEffect, useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import { Tiptap, useEditor } from "@tiptap/react"
import FileHandler from "@tiptap/extension-file-handler"
import { Placeholder } from "@tiptap/extensions"
import { uploadImage } from "../admin/api"
import { parseDocument } from "./document"
import { contentExtensions } from "./extensions"
import { InsertMenu } from "./InsertMenu"
import { SelectionMenu } from "./SelectionMenu"
import "./prose.css"

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"]

export function PostEditor({
  initialContent,
  onChange,
  onError,
  onLeaveStart,
  onReady
}: {
  initialContent: string
  onChange: (document: string) => void
  onError: (message: string) => void
  onLeaveStart?: () => void
  onReady?: (editor: Editor) => void
}) {
  const [uploads, setUploads] = useState(0)

  // The editor is built once, so its callbacks would otherwise close over the
  // props from the first render.
  const handlers = useRef({ onChange, onError, onLeaveStart })
  handlers.current = { onChange, onError, onLeaveStart }

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  const insertImage = useCallback(async (editor: Editor, file: File, position?: number) => {
    setUploads(count => count + 1)
    try {
      const src = await uploadImage(file)
      const at = position ?? editor.state.selection.anchor
      editor.chain().focus().insertContentAt(at, { type: "image", attrs: { src } }).run()
    } catch (error) {
      handlers.current.onError(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setUploads(count => count - 1)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      ...contentExtensions,
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading" ? "Heading" : "Start writing, or press + to insert"
      }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_TYPES,
        // Without this both the file handler and the image extension act on a
        // pasted screenshot, inserting it twice.
        consumePasteEvent: true,
        onDrop: (editor, files, position) => {
          files.forEach(file => void insertImage(editor, file, position))
        },
        onPaste: (editor, files) => {
          files.forEach(file => void insertImage(editor, file))
        }
      })
    ],
    content: parseDocument(initialContent),
    editorProps: {
      attributes: { class: "prose tiptap" },
      handleKeyDown: (view, event) => {
        if (event.key !== "Backspace") return false
        const { empty, from } = view.state.selection
        // Position 1 is inside the document's first block, so this is the
        // caret sitting before the first character with nothing to delete.
        if (!empty || from !== 1) return false
        handlers.current.onLeaveStart?.()
        return true
      }
    },
    onUpdate: ({ editor }) => handlers.current.onChange(JSON.stringify(editor.getJSON()))
  })

  useEffect(() => {
    if (editor) onReadyRef.current?.(editor)
  }, [editor])

  if (!editor) return null

  return (
    <Tiptap editor={editor}>
      {/* ProseMirror only focuses from a click on a text block, so the space
          under a short document would otherwise be dead. */}
      <div
        className="min-h-96 cursor-text"
        onMouseDown={event => {
          if (event.target !== event.currentTarget) return
          event.preventDefault()
          editor.commands.focus("end")
        }}
      >
        <Tiptap.Content />
      </div>
      <SelectionMenu editor={editor} />
      <InsertMenu
        editor={editor}
        uploading={uploads > 0}
        onInsertImage={file => void insertImage(editor, file)}
      />
    </Tiptap>
  )
}
