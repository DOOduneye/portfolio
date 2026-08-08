"use client"

import { useCallback, useEffect, useState } from "react"
import { CodeBlockIcon } from "@/components/icons/code-block"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { type Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import {
  findNodePosition,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes
} from "../../lib/tiptap-utils"

export const CODE_BLOCK_SHORTCUT_KEY = "mod+alt+c"

export interface UseCodeBlockConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export function canToggle(editor: Editor | null, turnInto: boolean = true): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("codeBlock", editor) || isNodeTypeSelected(editor, ["image"])) return false

  if (!turnInto) {
    return editor.can().toggleNode("codeBlock", "paragraph")
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

  return editor.can().toggleNode("codeBlock", "paragraph") || editor.can().clearNodes()
}

export function toggleCodeBlock(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggle(editor)) return false

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

    const toggle = editor.isActive("codeBlock")
      ? chain.setNode("paragraph")
      : chain.toggleNode("codeBlock", "paragraph")

    toggle.run()

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
  if (!isNodeInSchema("codeBlock", editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggle(editor)
  }

  return true
}

export function useCodeBlock(config?: UseCodeBlockConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false, onToggled } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canToggleState = canToggle(editor)
  const isActive = editor?.isActive("codeBlock") || false

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

    const success = toggleCodeBlock(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: "Code Block",
    shortcutKeys: CODE_BLOCK_SHORTCUT_KEY,
    Icon: CodeBlockIcon
  }
}
