"use client"

import { forwardRef } from "react"

import type { UseTurnIntoDropdownConfig } from "."
import { getFilteredBlockTypeOptions, useTurnIntoDropdown } from "."
import { BulletListIcon } from "@/components/icons/bullet-list"
import { ChecklistIcon } from "@/components/icons/checklist"
import { CodeBlockIcon } from "@/components/icons/code-block"
import { HeadingFiveIcon } from "@/components/icons/heading-five"
import { HeadingFourIcon } from "@/components/icons/heading-four"
import { HeadingOneIcon } from "@/components/icons/heading-one"
import { HeadingSixIcon } from "@/components/icons/heading-six"
import { HeadingThreeIcon } from "@/components/icons/heading-three"
import { HeadingTwoIcon } from "@/components/icons/heading-two"
import { OrderedListIcon } from "@/components/icons/ordered-list"
import { QuoteIcon } from "@/components/icons/quote"
import { TextIcon } from "@/components/icons/text"
import { Button, type ButtonProps } from "@/editor/ui/button"
import * as Menu from "@/editor/ui/menu"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { EDITOR_GROUPS } from "../../lib/tiptap-block-types"

const headingIcons = {
  1: HeadingOneIcon,
  2: HeadingTwoIcon,
  3: HeadingThreeIcon,
  4: HeadingFourIcon,
  5: HeadingFiveIcon,
  6: HeadingSixIcon
} as const

const TURN_INTO_GROUP_ORDER = [
  EDITOR_GROUPS.HEADINGS,
  EDITOR_GROUPS.LISTS,
  EDITOR_GROUPS.BLOCKS
] as const

function getItemGroup(option: ReturnType<typeof getFilteredBlockTypeOptions>[0]): string {
  switch (option.type) {
    case "paragraph":
    case "heading":
      return EDITOR_GROUPS.HEADINGS
    case "bulletList":
    case "orderedList":
    case "taskList":
      return EDITOR_GROUPS.LISTS
    case "blockquote":
    case "codeBlock":
      return EDITOR_GROUPS.BLOCKS
    default:
      return EDITOR_GROUPS.HEADINGS
  }
}

function getIcon(option: ReturnType<typeof getFilteredBlockTypeOptions>[0]) {
  switch (option.type) {
    case "paragraph":
      return TextIcon
    case "heading":
      return option.level ? headingIcons[option.level as keyof typeof headingIcons] : HeadingOneIcon
    case "bulletList":
      return BulletListIcon
    case "orderedList":
      return OrderedListIcon
    case "taskList":
      return ChecklistIcon
    case "blockquote":
      return QuoteIcon
    case "codeBlock":
      return CodeBlockIcon
    default:
      return TextIcon
  }
}

export interface TurnIntoDropdownContentProps {
  blockTypes?: string[]
  onItemClick?: () => void
}

export const TurnIntoDropdownContent: React.FC<TurnIntoDropdownContentProps> = ({
  blockTypes,
  onItemClick
}) => {
  const { editor } = useTiptapEditor()
  const filteredOptions = getFilteredBlockTypeOptions(blockTypes)

  const handleItemAction = (option: ReturnType<typeof getFilteredBlockTypeOptions>[0]) => {
    if (!editor) return

    switch (option.type) {
      case "paragraph":
        editor.chain().focus().setParagraph().run()
        break
      case "heading":
        if (option.level) {
          editor.chain().focus().toggleHeading({ level: option.level }).run()
        }
        break
      case "bulletList":
        editor.chain().focus().toggleBulletList().run()
        break
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run()
        break
      case "taskList":
        editor.chain().focus().toggleTaskList().run()
        break
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run()
        break
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run()
        break
    }

    onItemClick?.()
  }

  const groupedOptions = TURN_INTO_GROUP_ORDER.map(groupName => ({
    name: groupName,
    items: filteredOptions.filter(option => getItemGroup(option) === groupName)
  })).filter(group => group.items.length > 0)

  return (
    <>
      {groupedOptions.map((group, groupIndex) => (
        <Menu.Group key={group.name}>
          {groupIndex > 0 && <Menu.Separator />}
          {group.items.map((option, index) => {
            const Icon = getIcon(option)
            const key = `${option.type}-${option.level ?? index}`

            return (
              <Menu.Item key={key} onClick={() => handleItemAction(option)}>
                <Icon />
                {option.label}
              </Menu.Item>
            )
          })}
        </Menu.Group>
      ))}
    </>
  )
}

export interface TurnIntoDropdownProps
  extends Omit<ButtonProps, "type">, UseTurnIntoDropdownConfig {}

export const TurnIntoDropdown = forwardRef<HTMLButtonElement, TurnIntoDropdownProps>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      blockTypes,
      onOpenChange,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, canToggle, isOpen, activeBlockType, handleOpenChange, Icon } =
      useTurnIntoDropdown({
        editor,
        hideWhenUnavailable,
        blockTypes,
        onOpenChange
      })

    if (!isVisible) {
      return null
    }

    return (
      <Menu.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Menu.Trigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              tabIndex={-1}
              disabled={!canToggle}
              {...buttonProps}
              ref={ref}
            >
              {children ?? (
                <>
                  {activeBlockType?.label || "Text"}
                  <Icon className="size-3.5" />
                </>
              )}
            </Button>
          }
        />

        <Menu.Portal>
          <Menu.Positioner align="start" sideOffset={8}>
            <Menu.Popup>
              <TurnIntoDropdownContent
                blockTypes={blockTypes}
                onItemClick={() => handleOpenChange(false)}
              />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    )
  }
)

TurnIntoDropdown.displayName = "TurnIntoDropdown"
