import type { Extensions, JSONContent } from "@tiptap/core"
import { Markdown } from "@tiptap/markdown"
import type { Editor as TiptapEditor } from "@tiptap/react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { Placeholder, Selection } from "@tiptap/extensions"
import { cva, type VariantProps } from "class-variance-authority"
import { useEffect } from "react"

import { cn } from "@/lib/utils"
import { ToolbarFloating } from "./components/toolbar-floating"
import { contentExtensions } from "./extensions"
import { LinkClickSelect } from "./tiptap-extension/link-click-select-extension"
import { ListNormalizationExtension } from "./tiptap-extension/list-normalization-extension"
import { MarkdownPaste } from "./tiptap-extension/markdown-paste-extension"
import { TableHandleExtension } from "./tiptap-node/table-node/extensions/table-handle"
import { TableExtendRowColumnButtons } from "./tiptap-node/table-node/ui/table-extend-row-column-button"
import { TableHandle } from "./tiptap-node/table-node/ui/table-handle"
import { TableSelectionOverlay } from "./tiptap-node/table-node/ui/table-selection-overlay"
import { SlashDropdownMenu } from "./tiptap-ui/slash-dropdown-menu"
import type { SlashMenuConfig } from "./tiptap-ui/slash-dropdown-menu/use-slash-dropdown-menu"
import "./editor.css"

type EditorVariant = "default" | "fullPage" | "compact"

const editorVariants = cva("editor", {
  variants: {
    spacing: {
      compact: "[--editor-spacing-lg:0] [--editor-spacing-md:0] [--editor-spacing-sm:0]"
    },
    scrollPast: {
      none: "[--editor-scroll-past:0]",
      default: "[--editor-scroll-past:6rem]",
      fullPage: "[--editor-scroll-past:24rem]"
    }
  },
  defaultVariants: {
    scrollPast: "default"
  }
})

type EditorVariantProps = VariantProps<typeof editorVariants>

function getEditorSpacing(variant: EditorVariant): EditorVariantProps["spacing"] {
  return variant === "compact" ? "compact" : undefined
}

function getEditorScrollPast({
  editable,
  variant
}: {
  editable: boolean
  variant: EditorVariant
}): NonNullable<EditorVariantProps["scrollPast"]> {
  if (!editable || variant === "compact") {
    return "none"
  }

  return variant === "fullPage" ? "fullPage" : "default"
}

type BaseEditorProps = {
  content: JSONContent
  placeholder?: string
  emptyLineHint?: string
  editable?: boolean
  immediatelyRender?: boolean
  className?: string
  extensions?: Extensions
  onChange?: (document: JSONContent) => void
  onCreate?: (editor: TiptapEditor) => void
  onLeaveStart?: () => void
  slashConfig?: SlashMenuConfig
  children?: React.ReactNode
  variant?: EditorVariant
}

function BaseEditor({
  content,
  placeholder,
  emptyLineHint = "Write, or press '/' for blocks…",
  editable = true,
  immediatelyRender = false,
  variant,
  className,
  extensions: additionalExtensions,
  onChange,
  onCreate,
  onLeaveStart,
  slashConfig,
  children
}: BaseEditorProps) {
  const editor = useEditor({
    content,
    editable,
    immediatelyRender,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    onCreate: ({ editor }) => onCreate?.(editor),
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key !== "Backspace" || !onLeaveStart) return false
        const { empty, from } = view.state.selection
        if (!empty || from !== 1) return false
        onLeaveStart()
        return true
      }
    },
    extensions: [
      ...contentExtensions,
      Placeholder.configure({
        placeholder: ({ editor }) => {
          if (!editable) return ""
          if (editor.isEmpty) return placeholder ?? emptyLineHint
          return emptyLineHint
        },
        emptyNodeClass: "is-empty"
      }),
      Selection,
      LinkClickSelect,
      ListNormalizationExtension,
      TableHandleExtension,
      Markdown,
      MarkdownPaste,
      ...(additionalExtensions ?? [])
    ]
  })

  useEffect(() => {
    editor?.setEditable(editable)
  }, [editor, editable])

  const resolvedVariant = variant ?? "default"

  return (
    <EditorContext.Provider value={{ editor }}>
      <EditorContent
        editor={editor}
        className={cn(
          editorVariants({
            spacing: getEditorSpacing(resolvedVariant),
            scrollPast: getEditorScrollPast({ editable, variant: resolvedVariant })
          }),
          className
        )}
      >
        {editable && (
          <>
            <SlashDropdownMenu config={slashConfig} />
            <ToolbarFloating />
            <TableExtendRowColumnButtons />
            <TableHandle />
            <TableSelectionOverlay />
            {children}
          </>
        )}
      </EditorContent>
    </EditorContext.Provider>
  )
}

export { BaseEditor }
export type { BaseEditorProps, TiptapEditor }
