import { useCallback, useMemo, useRef, useState } from "react"
import FileHandler from "@tiptap/extension-file-handler"
import type { Editor } from "@tiptap/react"

import { ImageIcon } from "@/components/icons/image"
import { uploadImage } from "../admin/api"
import { parseDocument } from "./document"
import { BaseEditor } from "./editor"
import type { SlashMenuConfig } from "./tiptap-ui/slash-dropdown-menu/use-slash-dropdown-menu"

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"]

const SLASH_ITEMS = [
  "heading_2",
  "heading_3",
  "bullet_list",
  "ordered_list",
  "task_list",
  "blockquote",
  "code_block",
  "table",
  "divider",
  "add_row",
  "add_column",
  "delete_row",
  "delete_column",
  "delete_table"
] as const

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
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const editorRef = useRef<Editor | null>(null)

  const handlers = useRef({ onChange, onError, onLeaveStart, onReady })
  handlers.current = { onChange, onError, onLeaveStart, onReady }

  const insertImage = useCallback(async (editor: Editor, file: File, position?: number) => {
    setUploading(true)
    try {
      const src = await uploadImage(file)
      const at = position ?? editor.state.selection.anchor
      editor.chain().focus().insertContentAt(at, { type: "image", attrs: { src } }).run()
    } catch (error) {
      handlers.current.onError(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }, [])

  const content = useMemo(() => parseDocument(initialContent), [initialContent])

  const extensions = useMemo(
    () => [
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
    [insertImage]
  )

  const slashConfig = useMemo<SlashMenuConfig>(
    () => ({
      enabledItems: [...SLASH_ITEMS],
      customItems: [
        {
          title: uploading ? "Uploading…" : "Image",
          subtext: "Upload a picture from your machine",
          keywords: ["image", "photo", "picture", "upload", "media"],
          badge: ImageIcon,
          group: "Media",
          onSelect: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run()
            fileInput.current?.click()
          }
        }
      ]
    }),
    [uploading]
  )

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          const editor = editorRef.current
          if (file && editor) void insertImage(editor, file)
          event.target.value = ""
        }}
      />
      <BaseEditor
        content={content}
        variant="fullPage"
        placeholder="Tell the story."
        slashConfig={slashConfig}
        extensions={extensions}
        onChange={document => handlers.current.onChange(JSON.stringify(document))}
        onLeaveStart={() => handlers.current.onLeaveStart?.()}
        onCreate={editor => {
          editorRef.current = editor
          handlers.current.onReady?.(editor)
        }}
      />
    </>
  )
}
