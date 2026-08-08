"use client"

import { useCallback } from "react"

import type { Mark, UseMarkConfig } from "."
import { MARK_SHORTCUT_KEYS, useMark } from "."
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { parseShortcutKeys } from "../../lib/tiptap-utils"
import { ToolbarTooltip } from "../../tiptap-ui-primitive/toolbar"

export interface MarkButtonProps extends Omit<ButtonProps, "type">, UseMarkConfig {
  text?: string
  showShortcut?: boolean
}

export function MarkShortcutKeys({
  type,
  shortcutKeys = MARK_SHORTCUT_KEYS[type]
}: {
  type: Mark
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

export function MarkButton({
  editor: providedEditor,
  type,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ref,
  ...buttonProps
}: MarkButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const { editor } = useTiptapEditor(providedEditor)
  const { isVisible, handleMark, canToggle, isActive, Icon, shortcutKeys, label } = useMark({
    editor,
    type,
    hideWhenUnavailable,
    onToggled
  })

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      handleMark()
    },
    [handleMark, onClick]
  )

  if (!isVisible) {
    return null
  }

  return (
    <ToolbarTooltip label={label} shortcut={shortcutKeys}>
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
            {showShortcut && <MarkShortcutKeys type={type} shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    </ToolbarTooltip>
  )
}
