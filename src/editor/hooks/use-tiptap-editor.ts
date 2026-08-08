"use client"

import { useMemo } from "react"
import type { Editor } from "@tiptap/react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"

export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
  editorState?: Editor["state"]
  canCommand?: Editor["can"]
} {
  const { editor: coreEditor } = useCurrentEditor()
  const mainEditor = useMemo(() => providedEditor || coreEditor, [providedEditor, coreEditor])

  const selectedEditorState = useEditorState({
    editor: mainEditor,
    selector(context) {
      if (!context.editor) {
        return {
          editor: null,
          editorState: undefined,
          canCommand: undefined
        }
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can
      }
    }
  })

  if (!mainEditor) {
    return { editor: null }
  }

  return {
    editor: mainEditor,
    editorState: selectedEditorState?.editorState ?? mainEditor.state,
    canCommand: selectedEditorState?.canCommand ?? mainEditor.can
  }
}
