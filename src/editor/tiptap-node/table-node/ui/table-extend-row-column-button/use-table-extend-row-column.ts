import { useCallback, useEffect, useMemo } from "react"
import { offset, size, useFloating, useTransitionStyles, type Placement } from "@floating-ui/react"

import type { Orientation } from "../../lib/tiptap-table-utils"

interface TableExtendRowColumnButtonPositionResult {
  isMounted: boolean
  ref: (node: HTMLElement | null) => void
  style: React.CSSProperties
}

interface TableExtendRowColumnButtonsPositioningResult {
  rowButton: TableExtendRowColumnButtonPositionResult
  columnButton: TableExtendRowColumnButtonPositionResult
}

const ORIENTATION_CONFIG = {
  row: {
    placement: "bottom" as Placement,
    sizeProperty: "width"
  },
  column: {
    placement: "right" as Placement,
    sizeProperty: "height"
  }
} as const

function useTableExtendRowColumnButtonPosition(
  orientation: Orientation,
  show: boolean,
  referencePosTable: DOMRect | null
): TableExtendRowColumnButtonPositionResult {
  const config = ORIENTATION_CONFIG[orientation]

  const { refs, update, context, floatingStyles } = useFloating({
    open: show,
    placement: config.placement,
    middleware: [
      offset(4),
      size({
        apply({ rects, elements }) {
          const floating = elements.floating
          if (!floating) return

          const sizeValue = `${rects.reference[config.sizeProperty]}px`
          floating.style[config.sizeProperty] = sizeValue
        }
      })
    ]
  })

  const { isMounted, styles } = useTransitionStyles(context)

  const createVirtualReference = useCallback(
    (rect: DOMRect) => ({
      getBoundingClientRect: () => rect
    }),
    []
  )

  useEffect(() => {
    if (!referencePosTable) return

    refs.setReference(createVirtualReference(referencePosTable))
    update()
  }, [referencePosTable, refs, update, createVirtualReference])

  return useMemo(
    () => ({
      isMounted,
      ref: refs.setFloating,
      style: {
        display: "flex",
        ...styles,
        ...floatingStyles
      } as React.CSSProperties
    }),
    [floatingStyles, isMounted, refs.setFloating, styles]
  )
}

export function useTableExtendRowColumnButtonsPositioning(
  showAddOrRemoveColumnsButton: boolean,
  showAddOrRemoveRowsButton: boolean,
  referencePosTable: DOMRect | null
): TableExtendRowColumnButtonsPositioningResult {
  const rowButton = useTableExtendRowColumnButtonPosition(
    "row",
    showAddOrRemoveRowsButton,
    referencePosTable
  )

  const columnButton = useTableExtendRowColumnButtonPosition(
    "column",
    showAddOrRemoveColumnsButton,
    referencePosTable
  )

  return useMemo(
    () => ({
      rowButton,
      columnButton
    }),
    [rowButton, columnButton]
  )
}
