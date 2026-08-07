"use client"

import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { UseBlockquoteConfig } from "."
import { BLOCKQUOTE_SHORTCUT_KEY, useBlockquote } from "."
// --- UI Primitives ---
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
// --- Hooks ---
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
// --- Lib ---
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface BlockquoteButtonProps extends Omit<ButtonProps, "type">, UseBlockquoteConfig {
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

export function BlockquoteShortcutKeys({
  shortcutKeys = BLOCKQUOTE_SHORTCUT_KEY
}: {
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
 * Button component for toggling blockquote in a Tiptap editor.
 *
 * For custom button implementations, use the `useBlockquote` hook instead.
 */
export const BlockquoteButton = forwardRef<HTMLButtonElement, BlockquoteButtonProps>(
  (
    {
      editor: providedEditor,
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
    const { isVisible, canToggle, isActive, handleToggle, shortcutKeys, Icon } = useBlockquote({
      editor,
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
            {showShortcut && <BlockquoteShortcutKeys shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    )
  }
)

BlockquoteButton.displayName = "BlockquoteButton"
