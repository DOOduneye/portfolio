"use client"

import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { UseCodeBlockConfig } from "."
import { CODE_BLOCK_SHORTCUT_KEY, useCodeBlock } from "."
// --- UI Primitives ---
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
// --- Hooks ---
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
// --- Lib ---
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface CodeBlockButtonProps extends Omit<ButtonProps, "type">, UseCodeBlockConfig {
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

export function CodeBlockShortcutKeys({
  shortcutKeys = CODE_BLOCK_SHORTCUT_KEY
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
 * Button component for toggling code block in a Tiptap editor.
 *
 * For custom button implementations, use the `useCodeBlock` hook instead.
 */
export const CodeBlockButton = forwardRef<HTMLButtonElement, CodeBlockButtonProps>(
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
    const { isVisible, canToggle, isActive, handleToggle, shortcutKeys, Icon } = useCodeBlock({
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
            {showShortcut && <CodeBlockShortcutKeys shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    )
  }
)

CodeBlockButton.displayName = "CodeBlockButton"
