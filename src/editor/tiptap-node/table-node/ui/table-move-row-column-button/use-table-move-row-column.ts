"use client"

import { useCallback, useMemo } from "react"
import { ArrowDownIcon } from "@/components/icons/arrow-down"
import { ArrowLeftIcon } from "@/components/icons/arrow-left"
import { ArrowRightIcon } from "@/components/icons/arrow-right"
import { ArrowUpIcon } from "@/components/icons/arrow-up"
import type { Node } from "@tiptap/pm/model"
import type { Transaction } from "@tiptap/pm/state"
import type { TableMap } from "@tiptap/pm/tables"
import {
  CellSelection,
  columnIsHeader,
  moveTableColumn,
  moveTableRow,
  rowIsHeader,
  selectedRect
} from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { isExtensionAvailable } from "../../../../lib/tiptap-utils"
import type { Orientation } from "../../lib/tiptap-table-utils"
import {
  cellsOverlapRectangle,
  getIndexCoordinates,
  getTable,
  getTableSelectionType,
  selectCellsByCoords
} from "../../lib/tiptap-table-utils"

export type MoveDirection = "up" | "down" | "left" | "right"

export interface UseTableMoveRowColumnConfig {
  editor?: Editor | null
  index?: number
  orientation?: Orientation
  tablePos?: number
  direction: MoveDirection
  hideWhenUnavailable?: boolean
  onMoved?: () => void
}

const REQUIRED_EXTENSIONS = ["tableHandleExtension"]

export const tableMoveRowColumnLabels: Record<Orientation, Record<MoveDirection, string>> = {
  row: {
    up: "Move row up",
    down: "Move row down",
    left: "Move row left",
    right: "Move row right"
  },
  column: {
    up: "Move column up",
    down: "Move column down",
    left: "Move column left",
    right: "Move column right"
  }
}

export const tableMoveRowColumnIcons = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  left: ArrowLeftIcon,
  right: ArrowRightIcon
}

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

function isValidDirectionForOrientation(
  orientation: Orientation,
  direction: MoveDirection
): boolean {
  if (orientation === "row") {
    return direction === "up" || direction === "down"
  } else if (orientation === "column") {
    return direction === "left" || direction === "right"
  }
  return false
}

function canMoveRowColumn({
  editor,
  index,
  orientation,
  direction,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  direction: MoveDirection
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

    const { orientation: finalOrientation, index: finalIndex } = selectionType

    if (!isValidDirectionForOrientation(finalOrientation, direction)) {
      return false
    }

    if (finalOrientation === "row" && safeRowIsHeader(table.map, table.node, finalIndex)) {
      return false
    }

    if (finalOrientation === "column" && safeColumnIsHeader(table.map, table.node, finalIndex)) {
      return false
    }

    const { width, height } = table.map

    const targetIndex =
      finalOrientation === "row"
        ? direction === "up"
          ? finalIndex - 1
          : finalIndex + 1
        : direction === "left"
          ? finalIndex - 1
          : finalIndex + 1

    const maxIndex = finalOrientation === "row" ? height : width
    if (targetIndex < 0 || targetIndex >= maxIndex) {
      return false
    }

    const sourceCoords = getIndexCoordinates({
      editor,
      index: finalIndex,
      orientation: finalOrientation,
      tablePos
    })
    const targetCoords = getIndexCoordinates({
      editor,
      index: targetIndex,
      orientation: finalOrientation,
      tablePos
    })
    if (!sourceCoords || !targetCoords) return false

    const sourceSelection = selectCellsByCoords(editor, table.pos, sourceCoords, { mode: "state" })
    if (!sourceSelection) return false
    const sourceRect = selectedRect(sourceSelection)

    const targetSelection = selectCellsByCoords(editor, table.pos, targetCoords, { mode: "state" })
    if (!targetSelection) return false
    const targetRect = selectedRect(targetSelection)

    if (
      cellsOverlapRectangle(table.map, sourceRect) &&
      cellsOverlapRectangle(table.map, targetRect)
    ) {
      return false
    }

    return finalOrientation === "row"
      ? direction === "up"
        ? finalIndex > 0
        : finalIndex < height - 1
      : direction === "left"
        ? finalIndex > 0
        : finalIndex < width - 1
  } catch {
    return false
  }
}

function tableMoveRowColumn({
  editor,
  index,
  orientation,
  direction,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  direction: MoveDirection
  tablePos?: number
}): boolean {
  if (!canMoveRowColumn({ editor, index, orientation, direction, tablePos }) || !editor) {
    return false
  }

  try {
    const table = getTable(editor, tablePos)
    if (!table) return false

    const selectionType = getTableSelectionType(editor, index, orientation)
    if (!selectionType) return false

    const { orientation: finalOrientation, index: from } = selectionType

    if (!isValidDirectionForOrientation(finalOrientation, direction)) {
      return false
    }

    const delta: Record<MoveDirection, number> = {
      up: -1,
      down: 1,
      left: -1,
      right: 1
    }

    const to = from + delta[direction]

    const moveOperation = finalOrientation === "row" ? moveTableRow : moveTableColumn

    const dispatch = (tr: Transaction) => editor.view.dispatch(tr)

    if (editor.state.selection instanceof CellSelection) {
      return moveOperation({ from, to, select: true, pos: table.start })(editor.state, dispatch)
    } else {
      const sourceCoords = getIndexCoordinates({
        editor,
        index: from,
        orientation: finalOrientation,
        tablePos
      })
      if (!sourceCoords) return false

      const selectionState = selectCellsByCoords(editor, table.pos, sourceCoords, { mode: "state" })

      if (!selectionState) return false

      return moveOperation({ from, to, select: true, pos: table.start })(selectionState, dispatch)
    }
  } catch (error) {
    console.error("Error moving table row/column:", error)
    return false
  }
}

function shouldShowButton({
  editor,
  index,
  orientation,
  direction,
  hideWhenUnavailable,
  tablePos
}: {
  editor: Editor | null
  index?: number
  orientation?: Orientation
  direction: MoveDirection
  hideWhenUnavailable: boolean
  tablePos?: number
}): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, REQUIRED_EXTENSIONS)) return false

  const selectionType = getTableSelectionType(editor, index, orientation)
  if (!selectionType) return false

  if (!isValidDirectionForOrientation(selectionType.orientation, direction)) {
    return false
  }

  return hideWhenUnavailable
    ? canMoveRowColumn({ editor, index, orientation, direction, tablePos })
    : true
}

export function useTableMoveRowColumn(config: UseTableMoveRowColumnConfig) {
  const {
    editor: providedEditor,
    index,
    orientation,
    tablePos,
    direction,
    hideWhenUnavailable = false,
    onMoved
  } = config

  const { editor } = useTiptapEditor(providedEditor)

  const selectionType = getTableSelectionType(editor, index, orientation)

  const isVisible = shouldShowButton({
    editor,
    index,
    orientation,
    direction,
    hideWhenUnavailable,
    tablePos
  })

  const canPerformMove = canMoveRowColumn({
    editor,
    index,
    orientation,
    direction,
    tablePos
  })

  const handleMove = useCallback(() => {
    const success = tableMoveRowColumn({
      editor,
      index,
      orientation,
      direction,
      tablePos
    })
    if (success) onMoved?.()
    return success
  }, [editor, index, orientation, direction, tablePos, onMoved])

  const label = useMemo(() => {
    const orientationLabels = tableMoveRowColumnLabels[selectionType?.orientation || "row"]
    return orientationLabels[direction] || `Move ${selectionType?.orientation} ${direction}`
  }, [selectionType, direction])

  const Icon = useMemo(() => {
    return tableMoveRowColumnIcons[direction]
  }, [direction])

  return {
    isVisible,
    canMoveRowColumn: canPerformMove,
    handleMove,
    label,
    Icon
  }
}
