"use client"

import { useCallback, useEffect, useState } from "react"
import { TextIcon } from "@/components/icons/text"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { type Editor } from "@tiptap/react"
import { useHotkeys } from "react-hotkeys-hook"

import { useIsBreakpoint } from "../../hooks/use-is-breakpoint"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import {
  findNodePosition,
  isNodeInSchema,
  isValidPosition,
  selectionWithinConvertibleTypes
} from "../../lib/tiptap-utils"

export const TEXT_SHORTCUT_KEY = "mod+alt+0"

export interface UseTextConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export function canToggleText(editor: Editor | null, turnInto: boolean = true): boolean {
  if (!editor) return false
  if (!editor.schema.nodes["paragraph"]) return false

  if (!turnInto) {
    return editor.can().setNode("paragraph")
  }

  if (
    !selectionWithinConvertibleTypes(editor, [
      "paragraph",
      "heading",
      "bulletList",
      "orderedList",
      "taskList",
      "blockquote",
      "codeBlock"
    ])
  )
    return false

  return editor.can().setNode("paragraph") || editor.can().clearNodes()
}

export function isParagraphActive(editor: Editor | null): boolean {
  if (!editor) return false
  return editor.isActive("paragraph")
}

export function toggleParagraph(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggleText(editor)) return false

  try {
    const view = editor.view
    let state = view.state
    let tr = state.tr

    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1)
      })?.pos
      if (!isValidPosition(pos)) return false

      tr = tr.setSelection(NodeSelection.create(state.doc, pos))
      view.dispatch(tr)
      state = view.state
    }

    const selection = state.selection
    let chain = editor.chain().focus()

    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild
      const lastChild = selection.node.lastChild?.lastChild

      const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1

      const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1

      const resolvedFrom = state.doc.resolve(from)
      const resolvedTo = state.doc.resolve(to)

      chain = chain.setTextSelection(TextSelection.between(resolvedFrom, resolvedTo)).clearNodes()
    }

    if (!editor.isActive("paragraph")) {
      chain.setNode("paragraph").run()
    }

    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("paragraph", editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleText(editor)
  }

  return true
}

export function useText(config?: UseTextConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false, onToggled } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const isMobile = useIsBreakpoint()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canToggle = canToggleText(editor)
  const isActive = isParagraphActive(editor)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggle = useCallback(() => {
    if (!editor) return false

    const success = toggleParagraph(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  useHotkeys(
    TEXT_SHORTCUT_KEY,
    event => {
      event.preventDefault()
      handleToggle()
    },
    {
      enabled: isVisible && canToggle,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true
    }
  )

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: "Text",
    shortcutKeys: TEXT_SHORTCUT_KEY,
    Icon: TextIcon
  }
}
