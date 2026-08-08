"use client"

import { useCallback } from "react"
import { AddColLeftIcon } from "@/components/icons/add-col-left"
import { AddColRightIcon } from "@/components/icons/add-col-right"
import { AddRowBottomIcon } from "@/components/icons/add-row-bottom"
import { AddRowTopIcon } from "@/components/icons/add-row-top"
import type { Node } from "@tiptap/pm/model"
import type { Transaction } from "@tiptap/pm/state"
import type { TableMap } from "@tiptap/pm/tables"
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  CellSelection,
  columnIsHeader,
  rowIsHeader
} from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { isExtensionAvailable } from "../../../../lib/tiptap-utils"
import type { Orientation } from "../../lib/tiptap-table-utils"
import {
  getTable,
  getTableSelectionType,
  selectCellsByCoords,
  updateSelectionAfterAction
} from "../../lib/tiptap-table-utils"

export type RowSide = "above" | "below"
export type ColSide = "left" | "right"

export interface UseTableAddRowColumnConfig {
  editor?: Editor | null
  index?: number
  orientation?: Orientation
  side: RowSide | ColSide
  tablePos?: number
  hideWhenUnavailable?: boolean
  onAdded?: () => void
}

const REQUIRED_EXTENSIONS = ["table"]

export const tableAddRowColumnLabels = {
  row: {
    above: "Insert row above",
    below: "Insert row below"
  } as Record<RowSide, string>,
  column: {
    left: "Insert column left",
    right: "Insert column right"
  } as Record<ColSide, string>
} as const

function safeColumnIsHeader(map: TableMap, node: Node, index: number): boolean {
  try {
    return columnIsHeader(map, node, index)
  } catch {
    return false
  }
}

function safeRowIsHeader(map: TableMap, node: Node, index: number): boolean {
  try {
    return rowIsHeader(map, node, index)
  } catch {
    return false
  }
}

function canAddRowColumn({
  editor,
  index,
  orientation,
  tablePos,
  side
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
  side: RowSide | ColSide
}): boolean {
  if (!editor || !editor.isEditable || !isExtensionAvailable(editor, REQUIRED_EXTENSIONS)) {
    return false
  }

  const table = getTable(editor, tablePos)
  if (!table) return false

  const selectionType = getTableSelectionType(editor, index, orientation)
  if (!selectionType) return false

  const { map, node } = table
  const selIndex = selectionType.index
  const selOrient = selectionType.orientation

  if (typeof selIndex !== "number" || selIndex < 0) return false
  if (selOrient === "column" && selIndex >= map.width) return false
  if (selOrient === "row" && selIndex >= map.height) return false

  if (side === "left" && selOrient === "column") {
    if (safeColumnIsHeader(map, node, selIndex)) return false
  }

  if (side === "above" && selOrient === "row") {
    if (safeRowIsHeader(map, node, selIndex)) return false
  }

  return true
}

function calculateNewIndex(
  index: number,
  orientation: Orientation,
  side: RowSide | ColSide
): number {
  if (orientation === "row") {
    return side === "above" ? index : index + 1
  } else {
    return side === "left" ? index : index + 1
  }
}

function tableAddRowColumn({
  editor,
  index,
  orientation,
  side,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  side: RowSide | ColSide
  tablePos: number | undefined
}): boolean {
  if (!canAddRowColumn({ editor, index, orientation, tablePos, side }) || !editor) {
    return false
  }

  const selectionType = getTableSelectionType(editor, index, orientation)
  if (!selectionType) return false

  const { orientation: finalOrientation, index: finalIndex } = selectionType

  const isRow = finalOrientation === "row"
  const dispatch = (tr: Transaction) => editor.view.dispatch(tr)
  const addOperation = isRow
    ? side === "above"
      ? addRowBefore
      : addRowAfter
    : side === "left"
      ? addColumnBefore
      : addColumnAfter

  try {
    let success = false

    if (editor.state.selection instanceof CellSelection) {
      success = addOperation(editor.state, dispatch)
    } else {
      const table = getTable(editor, tablePos)
      if (!table) return false

      const cellCoords =
        finalOrientation === "row" ? { row: finalIndex, col: 0 } : { row: 0, col: finalIndex }

      const cellState = selectCellsByCoords(editor, table.pos, [cellCoords], {
        mode: "state"
      })

      if (!cellState) return false

      success = addOperation(cellState, dispatch)
    }

    if (success) {
      const newIndex = calculateNewIndex(finalIndex, finalOrientation, side)
      updateSelectionAfterAction(editor, finalOrientation, newIndex, tablePos)
    }

    return success
  } catch (error) {
    console.error("Error adding row/column:", error)
    return false
  }
}

function shouldShowButton({
  editor,
  index,
  orientation,
  tablePos,
  side,
  hideWhenUnavailable
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
  side: RowSide | ColSide
  hideWhenUnavailable: boolean
}): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, REQUIRED_EXTENSIONS)) return false

  if (hideWhenUnavailable) {
    return canAddRowColumn({ editor, index, orientation, tablePos, side })
  }

  const selectionType = getTableSelectionType(editor, index, orientation)
  return Boolean(selectionType)
}

export function useTableAddRowColumn(config: UseTableAddRowColumnConfig) {
  const {
    editor: providedEditor,
    index,
    orientation,
    side,
    tablePos,
    hideWhenUnavailable = false,
    onAdded
  } = config

  const { editor } = useTiptapEditor(providedEditor)

  const selectionType = getTableSelectionType(editor, index, orientation)

  const isVisible = shouldShowButton({
    editor,
    index,
    orientation,
    tablePos,
    side,
    hideWhenUnavailable
  })

  const canPerformAdd = canAddRowColumn({
    editor,
    index,
    orientation,
    tablePos,
    side
  })

  const handleAdd = useCallback(() => {
    const success = tableAddRowColumn({
      editor,
      index,
      orientation,
      tablePos,
      side
    })
    if (success) onAdded?.()
    return success
  }, [editor, index, orientation, tablePos, side, onAdded])

  const label =
    selectionType?.orientation === "row"
      ? tableAddRowColumnLabels.row[side as RowSide]
      : tableAddRowColumnLabels.column[side as ColSide]

  const Icon =
    selectionType?.orientation === "row"
      ? side === "above"
        ? AddRowTopIcon
        : AddRowBottomIcon
      : side === "left"
        ? AddColLeftIcon
        : AddColRightIcon

  return {
    isVisible,
    canAddRowColumn: canPerformAdd,
    handleAdd,
    label,
    Icon
  }
}
