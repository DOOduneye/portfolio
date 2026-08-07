"use client"

import { useCallback, useEffect, useState } from "react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { type Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import {
  LIST_ICONS,
  LIST_LABELS,
  LIST_SHORTCUT_KEYS,
  type ListType
} from "../../lib/tiptap-block-types"
import {
  findNodePosition,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes
} from "../../lib/tiptap-utils"

export type { ListType }

export interface UseListConfig {
  editor?: Editor | null
  type: ListType
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export const listIcons = LIST_ICONS

export const listLabels = LIST_LABELS

export { LIST_SHORTCUT_KEYS }

export function canToggleList(
  editor: Editor | null,
  type: ListType,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) return false

  if (!turnInto) {
    switch (type) {
      case "bulletList":
        return editor.can().toggleBulletList()
      case "orderedList":
        return editor.can().toggleOrderedList()
      case "taskList":
        return editor.can().toggleList("taskList", "taskItem")
      default:
        return false
    }
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

  switch (type) {
    case "bulletList":
      return editor.can().toggleBulletList() || editor.can().clearNodes()
    case "orderedList":
      return editor.can().toggleOrderedList() || editor.can().clearNodes()
    case "taskList":
      return editor.can().toggleList("taskList", "taskItem") || editor.can().clearNodes()
    default:
      return false
  }
}

export function isListActive(editor: Editor | null, type: ListType): boolean {
  if (!editor || !editor.isEditable) return false

  switch (type) {
    case "bulletList":
      return editor.isActive("bulletList")
    case "orderedList":
      return editor.isActive("orderedList")
    case "taskList":
      return editor.isActive("taskList")
    default:
      return false
  }
}

export function toggleList(editor: Editor | null, type: ListType): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggleList(editor, type)) return false

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

    if (editor.isActive(type)) {
      chain.liftListItem("listItem").lift("bulletList").lift("orderedList").lift("taskList").run()
    } else {
      const toggleMap: Record<ListType, () => typeof chain> = {
        bulletList: () => chain.toggleBulletList(),
        orderedList: () => chain.toggleOrderedList(),
        taskList: () => chain.toggleList("taskList", "taskItem")
      }

      const toggle = toggleMap[type]
      if (!toggle) return false

      toggle().run()
    }

    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

export function shouldShowButton(props: {
  editor: Editor | null
  type: ListType
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, type, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema(type, editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleList(editor, type)
  }

  return true
}

export function useList(config: UseListConfig) {
  const { editor: providedEditor, type, hideWhenUnavailable = false, onToggled } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canToggle = canToggleList(editor, type)
  const isActive = isListActive(editor, type)

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

  const handleToggle = useCallback(() => {
    if (!editor) return false

    const success = toggleList(editor, type)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, type, onToggled])

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: LIST_LABELS[type],
    shortcutKeys: LIST_SHORTCUT_KEYS[type],
    Icon: LIST_ICONS[type]
  }
}
