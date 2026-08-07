"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronDownSmIcon } from "@/components/icons/chevron-down-sm"
import { NodeSelection } from "@tiptap/pm/state"
import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"

import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { BLOCK_DEFINITIONS, HEADING_LABELS, LIST_LABELS } from "../../lib/tiptap-block-types"
import type { Level } from "../heading-button"

export const TURN_INTO_BLOCKS = [
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "taskList",
  "blockquote",
  "codeBlock"
]

export interface UseTurnIntoDropdownConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  blockTypes?: string[]
  onOpenChange?: (isOpen: boolean) => void
}

export const blockTypeOptions = [
  {
    type: "paragraph",
    label: BLOCK_DEFINITIONS.paragraph.label,
    isActive: (editor: Editor) =>
      editor.isActive("paragraph") &&
      !editor.isActive("heading") &&
      !editor.isActive("bulletList") &&
      !editor.isActive("orderedList") &&
      !editor.isActive("taskList") &&
      !editor.isActive("blockquote") &&
      !editor.isActive("codeBlock")
  },
  // Level one is the post title, so the schema does not carry it and the menu
  // must not offer a row that silently does nothing.
  {
    type: "heading",
    label: HEADING_LABELS[2],
    level: 2 as Level,
    isActive: (editor: Editor) => editor.isActive("heading", { level: 2 })
  },
  {
    type: "heading",
    label: HEADING_LABELS[3],
    level: 3 as Level,
    isActive: (editor: Editor) => editor.isActive("heading", { level: 3 })
  },
  {
    type: "bulletList",
    label: LIST_LABELS.bulletList,
    isActive: (editor: Editor) => editor.isActive("bulletList")
  },
  {
    type: "orderedList",
    label: LIST_LABELS.orderedList,
    isActive: (editor: Editor) => editor.isActive("orderedList")
  },
  {
    type: "taskList",
    label: LIST_LABELS.taskList,
    isActive: (editor: Editor) => editor.isActive("taskList")
  },
  {
    type: "blockquote",
    label: BLOCK_DEFINITIONS.blockquote.label,
    isActive: (editor: Editor) => editor.isActive("blockquote")
  },
  {
    type: "codeBlock",
    label: BLOCK_DEFINITIONS.codeBlock.label,
    isActive: (editor: Editor) => editor.isActive("codeBlock")
  }
]

export function canTurnInto(editor: Editor | null, allowedBlockTypes?: string[]): boolean {
  if (!editor || !editor.isEditable) return false

  const blockTypes = allowedBlockTypes || TURN_INTO_BLOCKS
  const { selection } = editor.state

  if (selection instanceof NodeSelection) {
    const nodeType = selection.node.type.name
    return blockTypes.includes(nodeType)
  }

  const { $anchor } = selection
  const nodeType = $anchor.parent.type.name
  return blockTypes.includes(nodeType)
}

export function getFilteredBlockTypeOptions(blockTypes?: string[]) {
  if (!blockTypes) return blockTypeOptions

  return blockTypeOptions.filter(option => {
    return blockTypes.includes(option.type)
  })
}

export function getActiveBlockType(editor: Editor | null, blockTypes?: string[]) {
  if (!editor) return getFilteredBlockTypeOptions(blockTypes)[0]

  const filteredOptions = getFilteredBlockTypeOptions(blockTypes)
  const activeOption = filteredOptions.find(option => option.isActive(editor))
  return activeOption || filteredOptions[0]
}

export function shouldShowTurnInto(params: {
  editor: Editor | null
  hideWhenUnavailable: boolean
  blockTypes?: string[]
}): boolean {
  const { editor, hideWhenUnavailable, blockTypes } = params

  if (!editor) {
    return false
  }

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canTurnInto(editor, blockTypes)
  }

  return true
}

export function useTurnIntoDropdown(config?: UseTurnIntoDropdownConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    blockTypes,
    onOpenChange
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      if (!ctx.editor) {
        return { canToggle: false, activeBlockType: getFilteredBlockTypeOptions(blockTypes)[0] }
      }
      return {
        canToggle: canTurnInto(ctx.editor, blockTypes),
        activeBlockType: getActiveBlockType(ctx.editor, blockTypes)
      }
    }
  })

  const canToggle = editorState?.canToggle ?? false
  const activeBlockType = editorState?.activeBlockType ?? getFilteredBlockTypeOptions(blockTypes)[0]

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!editor || !canToggle) return
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [canToggle, editor, onOpenChange]
  )

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowTurnInto({
          editor,
          hideWhenUnavailable,
          blockTypes
        })
      )
    }

    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable, blockTypes])

  return {
    isVisible,
    canToggle,
    isOpen,
    setIsOpen,
    activeBlockType,
    handleOpenChange,
    filteredOptions: getFilteredBlockTypeOptions(blockTypes),
    label: `Turn into (current: ${activeBlockType?.label || BLOCK_DEFINITIONS.paragraph.label})`,
    Icon: ChevronDownSmIcon
  }
}
