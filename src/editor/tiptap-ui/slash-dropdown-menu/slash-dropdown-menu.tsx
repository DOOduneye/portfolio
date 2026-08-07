"use client"

import { useEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"
import { menuItemVariants, menuPopupVariants, Separator } from "@/editor/ui/menu"
import { getElementOverflowPosition } from "../../lib/tiptap-utils"
import type {
  SuggestionItem,
  SuggestionMenuProps,
  SuggestionMenuRenderProps
} from "../../tiptap-ui-utils/suggestion-menu"
import { filterSuggestionItems, SuggestionMenu } from "../../tiptap-ui-utils/suggestion-menu"
import { GROUP_ORDER, useSlashDropdownMenu, type SlashMenuConfig } from "./use-slash-dropdown-menu"

type SlashDropdownMenuProps = Omit<SuggestionMenuProps, "items" | "children"> & {
  config?: SlashMenuConfig
}

function reorderItemsByGroups(items: SuggestionItem[]): SuggestionItem[] {
  const groupedItems = new Map<string, SuggestionItem[]>()
  const seenGroups: string[] = []

  items.forEach(item => {
    const groupLabel = item.group || ""
    let group = groupedItems.get(groupLabel)
    if (!group) {
      group = []
      groupedItems.set(groupLabel, group)
      seenGroups.push(groupLabel)
    }
    group.push(item)
  })

  const sortedGroups = seenGroups.sort((a, b) => {
    const aIndex = GROUP_ORDER.indexOf(a)
    const bIndex = GROUP_ORDER.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  const reordered: SuggestionItem[] = []
  sortedGroups.forEach(groupLabel => {
    const groupItems = groupedItems.get(groupLabel)
    if (groupItems) {
      reordered.push(...groupItems)
    }
  })

  return reordered
}

export const SlashDropdownMenu = (props: SlashDropdownMenuProps) => {
  const { config, ...restProps } = props
  const { getSlashMenuItems } = useSlashDropdownMenu(config)
  const showGroups = config?.showGroups !== false

  return (
    <SuggestionMenu
      char="/"
      pluginKey="slashDropdownMenu"
      decorationClass="tiptap-slash-decoration"
      selector="tiptap-slash-dropdown-menu"
      maxHeight={Infinity}
      items={({ query, editor }) => {
        const filtered = filterSuggestionItems(getSlashMenuItems(editor), query)
        return showGroups ? reorderItemsByGroups(filtered) : filtered
      }}
      {...restProps}
    >
      {props => <List {...props} config={config} />}
    </SuggestionMenu>
  )
}

const Item = (props: {
  item: SuggestionItem
  isSelected: boolean
  onSelect: () => void
  onHighlight: () => void
}) => {
  const { item, isSelected, onSelect, onHighlight } = props
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selector = document.querySelector(
      '[data-selector="tiptap-slash-dropdown-menu"]'
    ) as HTMLElement
    if (!itemRef.current || !isSelected || !selector) return

    const overflow = getElementOverflowPosition(itemRef.current, selector)

    if (overflow === "top") {
      itemRef.current.scrollIntoView(true)
    } else if (overflow === "bottom") {
      itemRef.current.scrollIntoView(false)
    }
  }, [isSelected])

  const BadgeIcon = item.badge

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={isSelected}
      data-highlighted={isSelected ? "" : undefined}
      className={menuItemVariants()}
      onClick={onSelect}
      onPointerMove={onHighlight}
    >
      {BadgeIcon && <BadgeIcon />}
      {item.title}
    </div>
  )
}

const List = ({
  items,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  config
}: SuggestionMenuRenderProps & { config?: SlashMenuConfig }) => {
  const showGroups = config?.showGroups !== false

  const renderedContent = useMemo(() => {
    const rendered: React.ReactElement[] = []

    if (!showGroups) {
      items.forEach((item, index) => {
        rendered.push(
          <Item
            key={`item-${index}-${item.title}`}
            item={item}
            isSelected={index === selectedIndex}
            onSelect={() => onSelect(item)}
            onHighlight={() => setSelectedIndex(index)}
          />
        )
      })
      return rendered
    }

    const groups: { label: string; items: Array<{ item: SuggestionItem; index: number }> }[] = []
    let currentGroup: {
      label: string
      items: Array<{ item: SuggestionItem; index: number }>
    } | null = null

    items.forEach((item, index) => {
      const groupLabel = item.group || ""
      if (!currentGroup || currentGroup.label !== groupLabel) {
        currentGroup = { label: groupLabel, items: [] }
        groups.push(currentGroup)
      }
      currentGroup.items.push({ item, index })
    })

    groups.forEach((group, groupIndex) => {
      if (groupIndex > 0) {
        rendered.push(<Separator key={`separator-${groupIndex}`} />)
      }

      const groupItems = group.items.map(({ item, index }) => (
        <Item
          key={`item-${index}-${item.title}`}
          item={item}
          isSelected={index === selectedIndex}
          onSelect={() => onSelect(item)}
          onHighlight={() => setSelectedIndex(index)}
        />
      ))

      rendered.push(...groupItems)
    })

    return rendered
  }, [items, selectedIndex, setSelectedIndex, onSelect, showGroups])

  if (!renderedContent.length) {
    return null
  }

  return (
    <div className={cn(menuPopupVariants(), "min-w-60 max-h-[var(--suggestion-menu-max-height)]")}>
      {renderedContent}
    </div>
  )
}
