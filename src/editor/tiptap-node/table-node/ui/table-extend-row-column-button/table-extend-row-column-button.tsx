"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FloatingPortal } from "@floating-ui/react"
import { PlusIcon } from "@/components/icons/plus"
import type { Node } from "@tiptap/pm/model"
import { TableMap } from "@tiptap/pm/tables"
import { type Editor } from "@tiptap/react"

import { cn } from "@/lib/utils"
import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { useTableHandleState } from "../../hooks/use-table-handle-state"
import type { Orientation } from "../../lib/tiptap-table-utils"
import {
  countEmptyColumnsFromEnd,
  countEmptyRowsFromEnd,
  EMPTY_CELL_HEIGHT,
  EMPTY_CELL_WIDTH,
  marginRound,
  runPreservingCursor,
  selectLastCell
} from "../../lib/tiptap-table-utils"
import { useTableExtendRowColumnButtonsPositioning } from "./use-table-extend-row-column"

interface TableExtendRowColumnButtonProps {
  editor?: Editor | null
  block: Node
  onMouseDown: () => void
  onMouseUp: () => void
  orientation: Orientation
  children?: React.ReactNode
}

export const TableExtendRowColumnButton: React.FC<TableExtendRowColumnButtonProps> = ({
  editor: providedEditor,
  onMouseDown,
  onMouseUp,
  orientation,
  children
}) => {
  const { editor } = useTiptapEditor(providedEditor)
  const state = useTableHandleState({ editor })
  const isRowOrientation = orientation === "row"

  const movedRef = useRef(false)
  const [dragState, setDragState] = useState<{
    startPos: number
    originalHeight: number
    originalWidth: number
  } | null>(null)

  const startDrag = useCallback(
    (ev: React.MouseEvent) => {
      if (!state) return

      const dims = TableMap.get(state.block)
      movedRef.current = false

      setDragState({
        startPos: isRowOrientation ? ev.clientY : ev.clientX,
        originalHeight: dims.height,
        originalWidth: dims.width
      })

      onMouseDown()
      ev.preventDefault()
    },
    [state, isRowOrientation, onMouseDown]
  )

  const handleClick = useCallback(() => {
    if (movedRef.current || !editor || !state) return

    runPreservingCursor(editor, () => {
      selectLastCell(editor, state.block, state.blockPos, orientation)

      if (isRowOrientation) {
        editor.commands.addRowAfter()
      } else {
        editor.commands.addColumnAfter()
      }
    })
  }, [editor, isRowOrientation, orientation, state])

  useEffect(() => {
    if (!dragState || !editor || !state) return

    const handleMove = (ev: MouseEvent) => {
      movedRef.current = true

      const currentPos = isRowOrientation ? ev.clientY : ev.clientX
      const diff = currentPos - dragState.startPos
      const cellSize = isRowOrientation ? EMPTY_CELL_HEIGHT : EMPTY_CELL_WIDTH

      const currentDims = TableMap.get(state.block)
      const currentCount = isRowOrientation ? currentDims.height : currentDims.width
      const originalCount = isRowOrientation ? dragState.originalHeight : dragState.originalWidth

      const newCount = Math.max(1, originalCount + marginRound(diff / cellSize, 0.3))
      const delta = newCount - currentCount

      if (delta === 0) return

      if (delta > 0) {
        runPreservingCursor(editor, () => {
          selectLastCell(editor, state.block, state.blockPos, orientation)

          for (let i = 0; i < delta; i++) {
            if (isRowOrientation) {
              editor.commands.addRowAfter()
            } else {
              editor.commands.addColumnAfter()
            }
          }
        })
      } else {
        runPreservingCursor(editor, () => {
          const absDelta = Math.abs(delta)

          const emptyCount = isRowOrientation
            ? countEmptyRowsFromEnd(editor, state.blockPos)
            : countEmptyColumnsFromEnd(editor, state.blockPos)

          const safeToRemove = Math.min(absDelta, emptyCount, currentCount - 1)

          selectLastCell(editor, state.block, state.blockPos, orientation)

          for (let i = 0; i < safeToRemove; i++) {
            if (isRowOrientation) {
              editor.commands.deleteRow()
            } else {
              editor.commands.deleteColumn()
            }
          }
        })
      }
    }

    const handleUp = () => {
      setDragState(null)
      onMouseUp()
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleUp)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleUp)
    }
  }, [dragState, editor, isRowOrientation, orientation, onMouseUp, state])

  if (!editor?.isEditable) return null

  return (
    <button
      className={cn(
        "border-none flex items-center justify-center bg-[var(--editor-table-handle-bg)] rounded-lg",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[var(--tt-table-extend-icon-color)]",
        isRowOrientation ? "w-full h-3 cursor-row-resize" : "w-3 h-full cursor-col-resize"
      )}
      onClick={handleClick}
      onMouseDown={startDrag}
      type="button"
      aria-label={isRowOrientation ? "Add or remove rows" : "Add or remove columns"}
    >
      {children ?? <PlusIcon />}
    </button>
  )
}

export interface TableExtendRowColumnButtonsProps {
  editor?: Editor | null
  onMouseDown?: () => void
  onMouseUp?: () => void
}

export const TableExtendRowColumnButtons: React.FC<TableExtendRowColumnButtonsProps> = ({
  editor: providedEditor,
  onMouseDown,
  onMouseUp
}) => {
  const { editor } = useTiptapEditor(providedEditor)
  const state = useTableHandleState({ editor })
  const { columnButton, rowButton } = useTableExtendRowColumnButtonsPositioning(
    state?.showAddOrRemoveColumnsButton ?? false,
    state?.showAddOrRemoveRowsButton ?? false,
    state?.referencePosTable ?? null
  )

  const handleDown = useCallback(() => {
    if (!editor) return
    editor.commands.freezeHandles()
    onMouseDown?.()
  }, [editor, onMouseDown])

  const handleUp = useCallback(() => {
    if (!editor) return
    editor.commands.unfreezeHandles()
    onMouseUp?.()
  }, [editor, onMouseUp])

  if (!state) return null

  return (
    <FloatingPortal root={state.widgetContainer}>
      <div ref={rowButton.ref} style={rowButton.style}>
        <TableExtendRowColumnButton
          editor={editor}
          orientation="row"
          block={state.block}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        />
      </div>

      <div ref={columnButton.ref} style={columnButton.style}>
        <TableExtendRowColumnButton
          editor={editor}
          orientation="column"
          block={state.block}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
        />
      </div>
    </FloatingPortal>
  )
}
