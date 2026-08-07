"use client"

import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { Level, UseHeadingConfig } from "."
import { HEADING_SHORTCUT_KEYS, useHeading } from "."
// --- UI Primitives ---
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
// --- Lib ---
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface HeadingButtonProps extends Omit<ButtonProps, "type">, UseHeadingConfig {
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

export function HeadingShortcutKeys({
  level,
  shortcutKeys = HEADING_SHORTCUT_KEYS[level]
}: {
  level: Level
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
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = forwardRef<HTMLButtonElement, HeadingButtonProps>(
  (
    {
      editor: providedEditor,
      level,
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
    const { isVisible, canToggle, isActive, handleToggle, Icon, shortcutKeys } = useHeading({
      editor,
      level,
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
            {showShortcut && <HeadingShortcutKeys level={level} shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    )
  }
)

HeadingButton.displayName = "HeadingButton"
