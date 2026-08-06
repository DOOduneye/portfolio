import { useCallback, useEffect, useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import { Tiptap, useEditor } from "@tiptap/react"
import FileHandler from "@tiptap/extension-file-handler"
import { Placeholder } from "@tiptap/extensions"
import { uploadImage } from "../admin/api"
import { parseDocument } from "./document"
import { contentExtensions } from "./extensions"
import { createSlashExtension, type SlashState } from "./slash"
import { InsertMenu } from "./InsertMenu"
import { SelectionMenu } from "./SelectionMenu"
import { REQUEST_IMAGE, SlashMenu } from "./SlashMenu"
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

  const fileInput = useRef<HTMLInputElement>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const slashKeys = useRef<((event: KeyboardEvent) => boolean) | null>(null)
  const slashBridge = useRef({ onChange: setSlash, keyHandler: slashKeys })

  useEffect(() => {
    const open = () => fileInput.current?.click()
    window.addEventListener(REQUEST_IMAGE, open)
    return () => window.removeEventListener(REQUEST_IMAGE, open)
  }, [])

  const editor = useEditor({
    extensions: [
      ...contentExtensions,
      createSlashExtension(slashBridge.current),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading" ? "Heading" : "Start writing, or press + to insert"
      }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_TYPES,
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
      <input
        ref={fileInput}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          if (file) void insertImage(editor, file)
          event.target.value = ""
        }}
      />
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
      <SlashMenu state={slash} keyHandler={slashKeys} />
      <SelectionMenu editor={editor} />
      <InsertMenu
        editor={editor}
        uploading={uploads > 0}
        onInsertImage={file => void insertImage(editor, file)}
      />
    </Tiptap>
  )
}
