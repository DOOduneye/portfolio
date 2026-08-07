"use client"

import { useCallback, useEffect, useState } from "react"
// --- Icons ---
import { ExternalLinkIcon } from "@/components/icons/external-link"
import { LinkIcon } from "@/components/icons/link"
import { TrashIcon } from "@/components/icons/trash"
import type { Editor } from "@tiptap/react"

// --- Tiptap UI ---
import type { UseLinkPopoverConfig } from "."
import { useLinkPopover } from "."
// --- UI Primitives ---
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Input } from "@/components/ui/input"
// --- Hooks ---
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { ToolbarSeparator, ToolbarTooltip } from "../../tiptap-ui-primitive/toolbar"

export interface LinkMainProps {
  /**
   * The URL to set for the link.
   */
  url: string
  /**
   * Function to update the URL state.
   */
  setUrl: React.Dispatch<React.SetStateAction<string | null>>
  /**
   * Function to set the link in the editor.
   */
  setLink: (url?: string) => void
  /**
   * Function to remove the link from the editor.
   */
  removeLink: () => void
  /**
   * Function to open the link.
   */
  openLink: () => void
  /**
   * Whether the link is currently active in the editor.
   */
  isActive: boolean
  /**
   * Whether to autofocus the input when empty.
   * @default true
   */
  autoFocus?: boolean
  /**
   * Callback when the link is saved (e.g., on Enter key).
   * Used to refocus editor and collapse selection.
   */
  onSave?: () => void
}

export interface LinkPopoverProps extends Omit<ButtonProps, "type">, UseLinkPopoverConfig {
  /**
   * Callback for when the popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  autoOpenOnLinkActive?: boolean
}

/**
 * Link button component for triggering the link popover
 */
export function LinkButton({
  className,
  children,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <Button
      type="button"
      className={className}
      variant="ghost"
      size="iconSm"
      tabIndex={-1}
      ref={ref}
      {...props}
    >
      {children || <LinkIcon />}
    </Button>
  )
}

/**
 * Main content component for the link popover
 */
const LinkMain: React.FC<LinkMainProps> = ({
  url,
  setUrl,
  setLink,
  removeLink,
  openLink,
  isActive,
  autoFocus = true,
  onSave
}) => {
  const handleBlur = () => {
    if (url) {
      setLink(url)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setLink(url)
      onSave?.()
    }
  }

  return (
    <div
      className="flex items-center gap-1"
      onKeyDownCapture={e => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
          e.stopPropagation()
        }
      }}
    >
      <Input
        type="url"
        placeholder="Paste link..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus={autoFocus && !url}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="min-w-[180px]"
      />

      <ToolbarSeparator />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          onClick={() => openLink()}
          disabled={!url && !isActive}
          variant="ghost"
          size="iconSm"
        >
          <ExternalLinkIcon />
        </Button>

        <Button
          type="button"
          onClick={removeLink}
          disabled={!url && !isActive}
          variant="ghost"
          size="iconSm"
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}

export const LinkContent: React.FC<{
  editor?: Editor | null
  autoFocus?: boolean
}> = ({ editor, autoFocus = false }) => {
  const linkPopover = useLinkPopover({
    editor
  })

  const handleSave = useCallback(() => {
    if (!editor) return
    const { to } = editor.state.selection
    editor.chain().focus().setTextSelection(to).run()
  }, [editor])

  return <LinkMain {...linkPopover} autoFocus={autoFocus} onSave={handleSave} />
}

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export function LinkPopover({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onSetLink,
  onOpenChange,
  autoOpenOnLinkActive = true,
  onClick,
  children,
  ref,
  ...buttonProps
}: LinkPopoverProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)

  const { isVisible, canSet, isActive, url, setUrl, setLink, removeLink, openLink, Icon, label } =
    useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink
    })

  const handleOnOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      if (!nextIsOpen && url) {
        setLink(url)
      }
      setIsOpen(nextIsOpen)
      onOpenChange?.(nextIsOpen)
    },
    [onOpenChange, url, setLink]
  )

  const handleSetLink = useCallback(
    (newUrl?: string) => {
      setLink(newUrl)
    },
    [setLink]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      setIsOpen(!isOpen)
    },
    [onClick, isOpen]
  )

  useEffect(() => {
    if (autoOpenOnLinkActive && isActive) {
      setIsOpen(true)
    }
  }, [autoOpenOnLinkActive, isActive])

  if (!isVisible) {
    return null
  }

  const trigger = (
    <LinkButton
      disabled={!canSet}
      data-active={isActive}
      onClick={handleClick}
      {...buttonProps}
      ref={ref}
    >
      {children ?? <Icon />}
    </LinkButton>
  )

  return (
    <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger
        render={isOpen ? trigger : <ToolbarTooltip label={label}>{trigger}</ToolbarTooltip>}
      />

      <PopoverContent className="w-auto rounded-xl px-1.5 py-1" sideOffset={8}>
        <LinkMain
          url={url}
          setUrl={setUrl}
          setLink={handleSetLink}
          removeLink={removeLink}
          openLink={openLink}
          isActive={isActive}
        />
      </PopoverContent>
    </Popover>
  )
}
