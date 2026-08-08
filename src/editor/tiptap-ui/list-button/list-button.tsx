"use client"

import { forwardRef, useCallback } from "react"

import type { ListType, UseListConfig } from "."
import { LIST_SHORTCUT_KEYS, useList } from "."
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface ListButtonProps extends Omit<ButtonProps, "type">, UseListConfig {
  text?: string
  showShortcut?: boolean
}

export function ListShortcutKeys({
  type,
  shortcutKeys = LIST_SHORTCUT_KEYS[type]
}: {
  type: ListType
  shortcutKeys?: string
}) {
  const keys = parseShortcutKeys({ shortcutKeys })
  return (
    <KbdGroup>
      {keys.map((key, i) => (
        <Kbd key={i}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  (
    {
      editor: providedEditor,
      type,
      text,
      hideWhenUnavailable = false,
      onToggled,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, canToggle, isActive, handleToggle, shortcutKeys, Icon } = useList({
      editor,
      type,
      hideWhenUnavailable,
      onToggled
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleToggle()
      },
      [handleToggle, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        variant="ghost"
        size="iconSm"
        tabIndex={-1}
        data-active={isActive}
        disabled={!canToggle}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon />
            {text}
            {showShortcut && <ListShortcutKeys type={type} shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    )
  }
)

ListButton.displayName = "ListButton"
