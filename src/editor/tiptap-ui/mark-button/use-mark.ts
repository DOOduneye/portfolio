"use client"

import { useCallback, useEffect, useState } from "react"
import { BoldIcon } from "@/components/icons/bold"
import { CodeInlineIcon } from "@/components/icons/code-inline"
import { ItalicIcon } from "@/components/icons/italic"
import { StrikeThroughIcon } from "@/components/icons/strike-through"
import { SubscriptIcon } from "@/components/icons/subscript"
import { SuperscriptIcon } from "@/components/icons/superscript"
import { UnderlineIcon } from "@/components/icons/underline"
import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"

import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { isMarkInSchema, isNodeTypeSelected } from "../../lib/tiptap-utils"

export type Mark = "bold" | "italic" | "strike" | "code" | "underline" | "superscript" | "subscript"

export interface UseMarkConfig {
  editor?: Editor | null
  type: Mark
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export const markIcons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikeThroughIcon,
  code: CodeInlineIcon,
  superscript: SuperscriptIcon,
  subscript: SubscriptIcon
}

export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
  bold: "mod+b",
  italic: "mod+i",
  underline: "mod+u",
  strike: "mod+shift+s",
  code: "mod+e",
  superscript: "mod+.",
  subscript: "mod+,"
}

export function canToggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isMarkInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) return false

  return editor.can().toggleMark(type)
}

export function isMarkActive(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive(type)
}

export function toggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggleMark(editor, type)) return false

  return editor.chain().focus().toggleMark(type).run()
}

export function shouldShowButton(props: {
  editor: Editor | null
  type: Mark
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, type, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isMarkInSchema(type, editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleMark(editor, type)
  }

  return true
}

export function getFormattedMarkName(type: Mark): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function useMark(config: UseMarkConfig) {
  const { editor: providedEditor, type, hideWhenUnavailable = false, onToggled } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      if (!ctx.editor) {
        return { isActive: false, canToggle: false }
      }
      return {
        isActive: ctx.editor.isActive(type),
        canToggle: canToggleMark(ctx.editor, type)
      }
    }
  })

  const isActive = editorState?.isActive ?? false
  const canToggle = editorState?.canToggle ?? false

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, type, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, type, hideWhenUnavailable])

  const handleMark = useCallback(() => {
    if (!editor) return false

    const success = toggleMark(editor, type)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, type, onToggled])

  return {
    isVisible,
    isActive,
    handleMark,
    canToggle,
    label: getFormattedMarkName(type),
    shortcutKeys: MARK_SHORTCUT_KEYS[type],
    Icon: markIcons[type]
  }
}
