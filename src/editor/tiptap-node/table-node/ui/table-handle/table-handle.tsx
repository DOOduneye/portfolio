"use client"

import type { ComponentType } from "react"
import { useCallback, useMemo, useState } from "react"
import { FloatingPortal } from "@floating-ui/react"
import type { Node } from "@tiptap/pm/model"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { colDragStart, rowDragStart } from "../../extensions/table-handle"
import { useTableHandleState } from "../../hooks/use-table-handle-state"
import { type Orientation } from "../../lib/tiptap-table-utils"
import { TableHandleMenu } from "../table-handle-menu"
import { useTableHandlePositioning } from "./use-table-handle-positioning"

export interface TableHandleButtonProps {
  editor: Editor
  orientation: Orientation
  index?: number
  tablePos?: number
  tableNode?: Node
  onToggleOtherHandle?: (visible: boolean) => void
  onOpenChange?: (open: boolean) => void
}

export interface TableHandleRenderProps {
  editor: Editor
  state: ReturnType<typeof useTableHandleState>
  rowHandle: ReturnType<typeof useTableHandlePositioning>["rowHandle"]
  colHandle: ReturnType<typeof useTableHandlePositioning>["colHandle"]
  toggleRowVisibility: (visible: boolean) => void
  toggleColumnVisibility: (visible: boolean) => void
}

export interface TableHandleProps {
  editor?: Editor | null

  rowButton?: ComponentType<TableHandleButtonProps>

  columnButton?: ComponentType<TableHandleButtonProps>
}

export function TableHandle({
  editor: providedEditor,
  rowButton: CustomRowButton,
  columnButton: CustomColumnButton
}: TableHandleProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const state = useTableHandleState({ editor })

  const [isRowVisible, setIsRowVisible] = useState(true)
  const [isColumnVisible, setIsColumnVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState<null | "row" | "column">(null)

  const draggingState = useMemo(() => {
    if (!state?.draggingState) return undefined

    return {
      draggedCellOrientation: state.draggingState.draggedCellOrientation,
      mousePos: state.draggingState.mousePos,
      initialOffset: state.draggingState.initialOffset
    }
  }, [state?.draggingState])

  const { rowHandle, colHandle } = useTableHandlePositioning(
    state?.show || false,
    state?.referencePosCell || null,
    state?.referencePosTable || null,
    draggingState
  )

  const toggleRowVisibility = useCallback((visible: boolean) => {
    setIsRowVisible(visible)
  }, [])

  const toggleColumnVisibility = useCallback((visible: boolean) => {
    setIsColumnVisible(visible)
  }, [])

  const handleMenuOpenChange = useCallback((type: "row" | "column", open: boolean) => {
    setMenuOpen(open ? type : null)
  }, [])

  if (!editor || !state) return null

  const hasValidRowIndex = typeof state.rowIndex === "number"
  const hasValidColIndex = typeof state.colIndex === "number"

  const shouldShowRow =
    (isRowVisible && rowHandle.isMounted && hasValidRowIndex) || menuOpen === "row"

  const shouldShowColumn =
    (isColumnVisible && colHandle.isMounted && hasValidColIndex) || menuOpen === "column"

  const RowButton = CustomRowButton || TableHandleMenu
  const ColumnButton = CustomColumnButton || TableHandleMenu

  return (
    <FloatingPortal root={state.widgetContainer}>
      {shouldShowRow && (
        <div ref={rowHandle.ref} style={rowHandle.style}>
          <RowButton
            editor={editor}
            orientation="row"
            index={state.rowIndex}
            tablePos={state.blockPos}
            tableNode={state.block}
            onToggleOtherHandle={toggleColumnVisibility}
            dragStart={rowDragStart}
            onOpenChange={open => handleMenuOpenChange("row", open)}
          />
        </div>
      )}

      {shouldShowColumn && (
        <div ref={colHandle.ref} style={colHandle.style}>
          <ColumnButton
            editor={editor}
            orientation="column"
            index={state.colIndex}
            tablePos={state.blockPos}
            tableNode={state.block}
            onToggleOtherHandle={toggleRowVisibility}
            dragStart={colDragStart}
            onOpenChange={open => handleMenuOpenChange("column", open)}
          />
        </div>
      )}
    </FloatingPortal>
  )
}

TableHandle.displayName = "TableHandle"
