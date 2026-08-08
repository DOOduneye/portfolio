import { useEffect, useMemo } from "react"
import { offset, size, useFloating, useTransitionStyles } from "@floating-ui/react"

import { clamp } from "../../lib/tiptap-table-utils"

type Orientation = "row" | "col" | "cell"

type DraggingState = {
  draggedCellOrientation: Exclude<Orientation, "cell">
  mousePos: number
  initialOffset?: number
}

function makeRowRect(cell: DOMRect, table: DOMRect, dragging?: DraggingState): DOMRect {
  if (dragging?.draggedCellOrientation === "row") {
    const adjustedY = dragging.mousePos + (dragging.initialOffset ?? 0)
    const clampedY = clamp(adjustedY, table.y, table.bottom - cell.height)
    return new DOMRect(table.x, clampedY, table.width, cell.height)
  }
  return new DOMRect(table.x, cell.y, table.width, cell.height)
}

function makeColRect(cell: DOMRect, table: DOMRect, dragging?: DraggingState): DOMRect {
  if (dragging?.draggedCellOrientation === "col") {
    const adjustedX = dragging.mousePos + (dragging.initialOffset ?? 0)
    const clampedX = clamp(adjustedX, table.x, table.right - cell.width)
    return new DOMRect(clampedX, table.y, cell.width, table.height)
  }
  return new DOMRect(cell.x, table.y, cell.width, table.height)
}

function makeCellRect(cell: DOMRect): DOMRect {
  return new DOMRect(cell.x, cell.y, cell.width, 0)
}

function getPlacement(orientation: Orientation) {
  switch (orientation) {
    case "row":
      return "left" as const
    case "col":
      return "top" as const
    case "cell":
    default:
      return "bottom-end" as const
  }
}

function getOffset(orientation: Orientation) {
  switch (orientation) {
    case "row":
      return 4
    case "col":
      return 4
    case "cell":
    default:
      return { mainAxis: 1, crossAxis: -1 } as const
  }
}

function rectFactory(
  orientation: Orientation,
  cell: DOMRect,
  table: DOMRect,
  dragging?: DraggingState
): DOMRect {
  switch (orientation) {
    case "row":
      return makeRowRect(cell, table, dragging)
    case "col":
      return makeColRect(cell, table, dragging)
    case "cell":
    default:
      return makeCellRect(cell)
  }
}

export function useTableHandlePosition(
  orientation: Orientation,
  show: boolean,
  referencePosCell: DOMRect | null,
  referencePosTable: DOMRect | null,
  draggingState?: DraggingState
): {
  isMounted: boolean
  ref: (node: HTMLElement | null) => void
  style: React.CSSProperties
} {
  const placement = useMemo(() => getPlacement(orientation), [orientation])
  const offsetValue = useMemo(() => getOffset(orientation), [orientation])

  const { refs, update, context, floatingStyles } = useFloating({
    open: show,
    placement,
    middleware: [
      offset(offsetValue),
      size({
        apply({ rects, elements }) {
          if (!elements.floating) return

          const refWidth =
            (orientation === "col"
              ? (referencePosCell?.width ?? referencePosTable?.width)
              : referencePosTable?.width) ?? rects.reference.width

          const refHeight =
            (orientation === "row"
              ? (referencePosCell?.height ?? referencePosTable?.height)
              : referencePosTable?.height) ?? rects.reference.height

          elements.floating.style.setProperty("--table-handle-ref-width", `${refWidth}px`)
          elements.floating.style.setProperty("--table-handle-ref-height", `${refHeight}px`)

          const mainSize = orientation === "row" ? refHeight : refWidth
          elements.floating.style.setProperty("--table-handle-available-size", `${mainSize}px`)
        }
      })
    ]
  })

  const { isMounted, styles } = useTransitionStyles(context)

  useEffect(() => {
    update()
  }, [update, show, orientation, referencePosCell, referencePosTable, draggingState])

  useEffect(() => {
    if (!referencePosCell || !referencePosTable) return

    if (draggingState && orientation === "cell") return

    refs.setReference({
      getBoundingClientRect: () =>
        rectFactory(orientation, referencePosCell, referencePosTable, draggingState)
    })
  }, [refs, orientation, referencePosCell, referencePosTable, draggingState])

  return useMemo(
    () => ({
      isMounted,
      ref: refs.setFloating,
      style: {
        display: "flex",
        ...styles,
        ...floatingStyles
      }
    }),
    [isMounted, refs.setFloating, styles, floatingStyles]
  )
}

export function useTableHandlePositioning(
  show: boolean,
  referencePosCell: DOMRect | null,
  referencePosTable: DOMRect | null,
  draggingState?: DraggingState
) {
  const rowHandle = useTableHandlePosition(
    "row",
    show,
    referencePosCell,
    referencePosTable,
    draggingState
  )

  const colHandle = useTableHandlePosition(
    "col",
    show,
    referencePosCell,
    referencePosTable,
    draggingState
  )

  const cellHandle = useTableHandlePosition(
    "cell",
    show,
    referencePosCell,
    referencePosTable,
    draggingState
  )

  return useMemo(() => ({ rowHandle, colHandle, cellHandle }), [rowHandle, colHandle, cellHandle])
}
