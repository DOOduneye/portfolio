"use client"

import { useCallback, useMemo } from "react"
import { DeleteRowIcon } from "@/components/icons/delete-row"
import type { Transaction } from "@tiptap/pm/state"
import { CellSelection, deleteColumn, deleteRow } from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { isExtensionAvailable } from "../../../../lib/tiptap-utils"
import type { Orientation } from "../../lib/tiptap-table-utils"
import { getTable, getTableSelectionType, selectCellsByCoords } from "../../lib/tiptap-table-utils"

export interface UseTableDeleteRowColumnConfig {
  editor?: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
  hideWhenUnavailable?: boolean
  onDeleted?: () => void
}

const REQUIRED_EXTENSIONS = ["table"]

export const tableDeleteRowColumnLabels: Record<Orientation, string> = {
  row: "Delete row",
  column: "Delete column"
}

function canDeleteRowColumn({
  editor,
  index,
  orientation,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
}): boolean {
  if (!editor || !editor.isEditable || !isExtensionAvailable(editor, REQUIRED_EXTENSIONS)) {
    return false
  }

  try {
    const table = getTable(editor, tablePos)
    if (!table) return false

    const selectionType = getTableSelectionType(editor, index, orientation)
    if (!selectionType) return false

    return true
  } catch {
    return false
  }
}

function tableDeleteRowColumn({
  editor,
  index,
  orientation,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
}): boolean {
  if (!canDeleteRowColumn({ editor, index, orientation, tablePos }) || !editor) {
    return false
  }

  try {
    const selectionType = getTableSelectionType(editor, index, orientation)
    if (!selectionType) return false

    const { orientation: finalOrientation, index: finalIndex } = selectionType

    const isRow = finalOrientation === "row"
    const dispatch = (tr: Transaction) => editor.view.dispatch(tr)
    const deleteOperation = isRow ? deleteRow : deleteColumn

    if (editor.state.selection instanceof CellSelection) {
      return deleteOperation(editor.state, dispatch)
    }

    const table = getTable(editor, tablePos)
    if (!table) return false

    const cellCoords = isRow ? { row: finalIndex, col: 0 } : { row: 0, col: finalIndex }

    const cellState = selectCellsByCoords(editor, table.pos, [cellCoords], {
      mode: "state"
    })

    if (!cellState) return false

    return deleteOperation(cellState, dispatch)
  } catch (error) {
    console.error(`Error deleting table row/column:`, error)
    return false
  }
}

function shouldShowButton({
  editor,
  index,
  orientation,
  hideWhenUnavailable,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  hideWhenUnavailable: boolean
  tablePos?: number
}): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, REQUIRED_EXTENSIONS)) return false
  return hideWhenUnavailable ? canDeleteRowColumn({ editor, index, orientation, tablePos }) : true
}

export function useTableDeleteRowColumn(config: UseTableDeleteRowColumnConfig) {
  const {
    editor: providedEditor,
    index,
    orientation,
    tablePos,
    hideWhenUnavailable = false,
    onDeleted
  } = config

  const { editor } = useTiptapEditor(providedEditor)

  const selectionType = getTableSelectionType(editor, index, orientation)

  const isVisible = shouldShowButton({
    editor,
    index,
    orientation,
    hideWhenUnavailable
  })

  const canPerformDelete = canDeleteRowColumn({
    editor,
    index,
    orientation,
    tablePos
  })

  const handleDelete = useCallback(() => {
    const success = tableDeleteRowColumn({
      editor,
      index,
      orientation,
      tablePos
    })
    if (success) onDeleted?.()
    return success
  }, [editor, index, orientation, tablePos, onDeleted])

  const label = useMemo(() => {
    return tableDeleteRowColumnLabels[selectionType?.orientation || "row"]
  }, [selectionType])

  return {
    isVisible,
    canDeleteRowColumn: canPerformDelete,
    handleDelete,
    label,
    Icon: DeleteRowIcon
  }
}
