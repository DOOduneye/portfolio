"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLinkIcon } from "@/components/icons/external-link"
import { LinkIcon } from "@/components/icons/link"
import { TrashIcon } from "@/components/icons/trash"
import type { Editor } from "@tiptap/react"

import type { UseLinkPopoverConfig } from "."
import { useLinkPopover } from "."
import { Button, type ButtonProps } from "@/editor/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { ToolbarSeparator, ToolbarTooltip } from "../../tiptap-ui-primitive/toolbar"

export interface LinkMainProps {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string | null>>
  setLink: (url?: string) => void
  removeLink: () => void
  openLink: () => void
  isActive: boolean
  autoFocus?: boolean
  onSave?: () => void
}

export interface LinkPopoverProps extends Omit<ButtonProps, "type">, UseLinkPopoverConfig {
  onOpenChange?: (isOpen: boolean) => void
  autoOpenOnLinkActive?: boolean
}

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
        aria-label="Link address"
        placeholder="Paste a link"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus={autoFocus && !url}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="h-7 w-64 border-transparent bg-transparent px-1.5 text-sm focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
      />

      <ToolbarSeparator />

      <div className="flex items-center gap-1">
        <ToolbarTooltip label="Open in a new tab">
          <Button
            type="button"
            aria-label="Open in a new tab"
            onClick={() => openLink()}
            disabled={!url && !isActive}
            variant="ghost"
            size="iconSm"
          >
            <ExternalLinkIcon />
          </Button>
        </ToolbarTooltip>

        <ToolbarTooltip label="Remove link">
          <Button
            type="button"
            aria-label="Remove link"
            onClick={removeLink}
            disabled={!url && !isActive}
            variant="ghost"
            size="iconSm"
          >
            <TrashIcon />
          </Button>
        </ToolbarTooltip>
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
