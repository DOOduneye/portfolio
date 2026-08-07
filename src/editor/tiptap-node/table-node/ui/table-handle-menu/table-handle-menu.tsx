"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { MoreVerticalIcon } from "@/components/icons/more-vertical"
import type { Node } from "@tiptap/pm/model"
import { TableMap } from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/react"

import { cn } from "@/lib/utils"
import { Separator } from "@/editor/ui/menu"
import { useTiptapEditor } from "../../../../hooks/use-tiptap-editor"
import { isValidPosition } from "../../../../lib/tiptap-utils"
import {
  Menu,
  MenuButton,
  MenuContent,
  MenuGroup,
  MenuItem
} from "../../../../tiptap-ui-primitive/menu"
import { dragEnd } from "../../extensions/table-handle"
import type { Orientation } from "../../lib/tiptap-table-utils"
import { selectCellsByCoords } from "../../lib/tiptap-table-utils"
import { useTableAddRowColumn } from "../table-add-row-column-button"
import { useTableDeleteRowColumn } from "../table-delete-row-column-button"
import { useTableDuplicateRowColumn } from "../table-duplicate-row-column-button"
import { useTableMoveRowColumn } from "../table-move-row-column-button"

interface BaseProps {
  editor?: Editor | null
  orientation: Orientation
  index?: number
  tableNode?: Node
  tablePos?: number
}

interface TableHandleMenuProps extends BaseProps {
  onToggleOtherHandle?: (visible: boolean) => void
  onOpenChange?: (open: boolean) => void
  dragStart?: (e: React.DragEvent) => void
}

type TableHandleContextValue = BaseProps

interface TableActionItemProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  onClick: () => void
  disabled?: boolean
  shortcutBadge?: React.ReactNode
}

const MENU_PLACEMENT_MAP: Record<Orientation, React.ComponentProps<typeof Menu>["placement"]> = {
  row: "top-start",
  column: "bottom-start"
}

const ARIA_LABELS: Record<Orientation, string> = {
  row: "Row actions",
  column: "Column actions"
}

const TableHandleContext = createContext<TableHandleContextValue | null>(null)

function useTableHandleContext() {
  const context = useContext(TableHandleContext)
  if (!context) {
    throw new Error("useTableHandleContext must be used within TableHandleProvider")
  }
  return context
}

function useTableHandleMenu(
  onToggleOtherHandle?: (visible: boolean) => void,
  onOpenChange?: (open: boolean) => void
) {
  const { editor, orientation, index, tableNode, tablePos } = useTableHandleContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const menuPlacement = useMemo(() => MENU_PLACEMENT_MAP[orientation], [orientation])

  const selectRowOrColumn = useCallback(() => {
    if (!editor || !tableNode || !isValidPosition(tablePos) || !isValidPosition(index)) return

    try {
      const { width, height } = TableMap.get(tableNode)
      const start = orientation === "row" ? { row: index, col: 0 } : { row: 0, col: index }
      const end =
        orientation === "row" ? { row: index, col: width - 1 } : { row: height - 1, col: index }

      selectCellsByCoords(editor, tablePos, [start, end], {
        mode: "dispatch",
        dispatch: editor.view.dispatch.bind(editor.view)
      })
    } catch (error) {
      console.warn("Failed to select row/column:", error)
    }
  }, [editor, tableNode, tablePos, orientation, index])

  const handleMenuToggle = useCallback(
    (isOpen: boolean) => {
      if (!editor) return

      setIsMenuOpen(isOpen)
      onOpenChange?.(isOpen)

      if (isOpen) {
        editor.commands.freezeHandles()
        selectRowOrColumn()
        onToggleOtherHandle?.(false)
      } else {
        editor.commands.unfreezeHandles()
        onToggleOtherHandle?.(true)
      }
    },
    [editor, onOpenChange, onToggleOtherHandle, selectRowOrColumn]
  )

  const resetMenu = useCallback(() => {
    if (!editor) return

    setIsMenuOpen(false)
    onOpenChange?.(false)
    editor.commands.unfreezeHandles()
    onToggleOtherHandle?.(true)
  }, [editor, onOpenChange, onToggleOtherHandle])

  return {
    isMenuOpen,
    isDragging,
    setIsDragging,
    menuPlacement,
    handleMenuToggle,
    resetMenu
  }
}

function useTableActionItems() {
  const { editor, index, orientation, tablePos } = useTableHandleContext()

  const deleteAction = useTableDeleteRowColumn({
    editor,
    index,
    orientation,
    tablePos
  })

  const duplicateAction = useTableDuplicateRowColumn({
    editor,
    index,
    orientation,
    tablePos
  })

  const moveUpAction = useTableMoveRowColumn({
    editor,
    index,
    tablePos,
    orientation: "row",
    direction: "up",
    hideWhenUnavailable: true
  })

  const moveDownAction = useTableMoveRowColumn({
    editor,
    index,
    tablePos,
    orientation: "row",
    direction: "down",
    hideWhenUnavailable: true
  })

  const moveLeftAction = useTableMoveRowColumn({
    editor,
    index,
    tablePos,
    orientation: "column",
    direction: "left",
    hideWhenUnavailable: true
  })

  const moveRightAction = useTableMoveRowColumn({
    editor,
    index,
    tablePos,
    orientation: "column",
    direction: "right",
    hideWhenUnavailable: true
  })

  const addAbove = useTableAddRowColumn({
    editor,
    index,
    tablePos,
    orientation: "row",
    side: "above",
    hideWhenUnavailable: true
  })

  const addBelow = useTableAddRowColumn({
    editor,
    index,
    tablePos,
    orientation: "row",
    side: "below",
    hideWhenUnavailable: true
  })

  const addLeft = useTableAddRowColumn({
    editor,
    index,
    tablePos,
    orientation: "column",
    side: "left",
    hideWhenUnavailable: true
  })

  const addRight = useTableAddRowColumn({
    editor,
    index,
    tablePos,
    orientation: "column",
    side: "right",
    hideWhenUnavailable: true
  })

  const moveActions = useMemo(
    () => ({
      moveUp: moveUpAction,
      moveDown: moveDownAction,
      moveLeft: moveLeftAction,
      moveRight: moveRightAction
    }),
    [moveUpAction, moveDownAction, moveLeftAction, moveRightAction]
  )

  const addActions = useMemo(
    () => ({
      addAbove,
      addBelow,
      addLeft,
      addRight
    }),
    [addAbove, addBelow, addLeft, addRight]
  )

  const getActionItems = useCallback(() => {
    const items: TableActionItemProps[] = []

    if (orientation === "row") {
      if (addActions.addAbove.isVisible) {
        items.push({
          icon: addActions.addAbove.Icon,
          label: addActions.addAbove.label,
          disabled: !addActions.addAbove.canAddRowColumn,
          onClick: addActions.addAbove.handleAdd
        })
      }
      if (addActions.addBelow.isVisible) {
        items.push({
          icon: addActions.addBelow.Icon,
          label: addActions.addBelow.label,
          disabled: !addActions.addBelow.canAddRowColumn,
          onClick: addActions.addBelow.handleAdd
        })
      }
    } else {
      if (addActions.addLeft.isVisible) {
        items.push({
          icon: addActions.addLeft.Icon,
          label: addActions.addLeft.label,
          disabled: !addActions.addLeft.canAddRowColumn,
          onClick: addActions.addLeft.handleAdd
        })
      }
      if (addActions.addRight.isVisible) {
        items.push({
          icon: addActions.addRight.Icon,
          label: addActions.addRight.label,
          disabled: !addActions.addRight.canAddRowColumn,
          onClick: addActions.addRight.handleAdd
        })
      }
    }

    return items
  }, [orientation, addActions])

  const getMoveItems = useCallback(() => {
    const items: TableActionItemProps[] = []

    if (orientation === "row") {
      if (moveActions.moveUp.isVisible) {
        items.push({
          icon: moveActions.moveUp.Icon,
          label: moveActions.moveUp.label,
          disabled: !moveActions.moveUp.canMoveRowColumn,
          onClick: moveActions.moveUp.handleMove
        })
      }
      if (moveActions.moveDown.isVisible) {
        items.push({
          icon: moveActions.moveDown.Icon,
          label: moveActions.moveDown.label,
          disabled: !moveActions.moveDown.canMoveRowColumn,
          onClick: moveActions.moveDown.handleMove
        })
      }
    } else {
      if (moveActions.moveLeft.isVisible) {
        items.push({
          icon: moveActions.moveLeft.Icon,
          label: moveActions.moveLeft.label,
          disabled: !moveActions.moveLeft.canMoveRowColumn,
          onClick: moveActions.moveLeft.handleMove
        })
      }
      if (moveActions.moveRight.isVisible) {
        items.push({
          icon: moveActions.moveRight.Icon,
          label: moveActions.moveRight.label,
          disabled: !moveActions.moveRight.canMoveRowColumn,
          onClick: moveActions.moveRight.handleMove
        })
      }
    }

    return items
  }, [orientation, moveActions])

  return {
    deleteAction,
    duplicateAction,
    addItems: getActionItems(),
    moveItems: getMoveItems()
  }
}

const TableActionItem = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  shortcutBadge
}: TableActionItemProps) => (
  <MenuItem onClick={onClick} disabled={disabled}>
    <Icon />
    {label}
    {shortcutBadge}
  </MenuItem>
)

const TableActionGroup = () => {
  const { deleteAction, duplicateAction, addItems, moveItems } = useTableActionItems()

  const hasDuplicateOrDeleteActions = deleteAction.isVisible || duplicateAction.isVisible
  const hasAddItems = addItems.length > 0
  const hasMoveItems = moveItems.length > 0

  if (!hasDuplicateOrDeleteActions && !hasAddItems && !hasMoveItems) {
    return null
  }

  return (
    <>
      {hasMoveItems && (
        <>
          <MenuGroup>
            {moveItems.map((item, i) => (
              <TableActionItem key={`move-${i}`} {...item} />
            ))}
          </MenuGroup>
          <Separator />
        </>
      )}

      {hasAddItems && (
        <>
          <MenuGroup>
            {addItems.map((item, i) => (
              <TableActionItem key={`add-${i}`} {...item} />
            ))}
          </MenuGroup>
          <Separator />
        </>
      )}

      {hasDuplicateOrDeleteActions && (
        <MenuGroup>
          {duplicateAction.isVisible && (
            <TableActionItem
              icon={duplicateAction.Icon}
              label={duplicateAction.label}
              disabled={!duplicateAction.canDuplicateRowColumn}
              onClick={duplicateAction.handleDuplicate}
            />
          )}

          {deleteAction.isVisible && (
            <TableActionItem
              icon={deleteAction.Icon}
              label={deleteAction.label}
              disabled={!deleteAction.canDeleteRowColumn}
              onClick={deleteAction.handleDelete}
            />
          )}
        </MenuGroup>
      )}
    </>
  )
}

const TableActionMenu = () => {
  const { resetMenu } = useTableHandleMenu()

  return (
    <MenuContent autoFocusOnShow autoFocusOnHide={false} modal onClose={resetMenu}>
      <TableActionGroup />
    </MenuContent>
  )
}

export const TableHandleMenu = ({
  editor: providedEditor,
  orientation,
  index,
  tableNode,
  tablePos,
  onToggleOtherHandle,
  onOpenChange,
  dragStart
}: TableHandleMenuProps) => {
  const { editor } = useTiptapEditor(providedEditor)

  const contextValue = useMemo<TableHandleContextValue>(
    () => ({
      editor,
      orientation,
      index,
      tableNode,
      tablePos
    }),
    [editor, orientation, index, tableNode, tablePos]
  )

  return (
    <TableHandleContext.Provider value={contextValue}>
      <TableHandleMenuContent
        onToggleOtherHandle={onToggleOtherHandle}
        onOpenChange={onOpenChange}
        dragStart={dragStart}
      />
    </TableHandleContext.Provider>
  )
}

const TableHandleMenuContent = ({
  onToggleOtherHandle,
  onOpenChange,
  dragStart
}: Pick<TableHandleMenuProps, "onToggleOtherHandle" | "onOpenChange" | "dragStart">) => {
  const { orientation } = useTableHandleContext()
  const { isMenuOpen, isDragging, setIsDragging, menuPlacement, handleMenuToggle } =
    useTableHandleMenu(onToggleOtherHandle, onOpenChange)

  const ariaLabel = ARIA_LABELS[orientation]

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      setIsDragging(true)
      dragStart?.(e)
    },
    [dragStart, setIsDragging]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    dragEnd()
  }, [setIsDragging])

  return (
    <Menu
      open={isMenuOpen}
      onOpenChange={handleMenuToggle}
      placement={menuPlacement}
      trigger={
        <MenuButton
          className={cn(
            "border-none flex items-center justify-center bg-[var(--editor-table-handle-bg)] rounded-lg cursor-grab",
            (isMenuOpen || isDragging) && "bg-brand [&_svg]:text-background",
            isDragging && "cursor-grabbing",
            orientation === "row" && "w-3 h-[var(--table-handle-ref-height)]",
            orientation === "column" && "h-3 w-[var(--table-handle-ref-width)] [&_svg]:rotate-90"
          )}
          draggable
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <MoreVerticalIcon className="size-4 shrink-0" />
        </MenuButton>
      }
    >
      <TableActionMenu />
    </Menu>
  )
}

export { TableActionMenu }
