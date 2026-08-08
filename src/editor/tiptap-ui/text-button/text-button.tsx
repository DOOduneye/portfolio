"use client"

import { forwardRef, useCallback } from "react"

import type { UseTextConfig } from "."
import { TEXT_SHORTCUT_KEY, useText } from "."
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { parseShortcutKeys } from "../../lib/tiptap-utils"

export interface TextButtonProps extends Omit<ButtonProps, "type">, UseTextConfig {
  text?: string
  showShortcut?: boolean
}

export function TextShortcutKeys({ shortcutKeys = TEXT_SHORTCUT_KEY }: { shortcutKeys?: string }) {
  const keys = parseShortcutKeys({ shortcutKeys })
  return (
    <KbdGroup>
      {keys.map((key, i) => (
        <Kbd key={i}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
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
    const { isVisible, canToggle, isActive, handleToggle, shortcutKeys, Icon } = useText({
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
            {showShortcut && <TextShortcutKeys shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    )
  }
)

TextButton.displayName = "TextButton"
