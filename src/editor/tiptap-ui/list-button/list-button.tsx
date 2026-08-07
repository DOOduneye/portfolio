"use client"

import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { ListType, UseListConfig } from "."
import { LIST_SHORTCUT_KEYS, useList } from "."
// --- UI Primitives ---
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
// --- Hooks ---
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
// --- Lib ---
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface ListButtonProps extends Omit<ButtonProps, "type">, UseListConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
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

/**
 * Button component for toggling lists in a Tiptap editor.
 *
 * For custom button implementations, use the `useList` hook instead.
 */
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
