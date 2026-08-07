"use client"

import { useCallback } from "react"
import { AddColRightIcon } from "@/components/icons/add-col-right"
import { AddRowBottomIcon } from "@/components/icons/add-row-bottom"
import { CodeBlockIcon } from "@/components/icons/code-block"
import { DeleteColumnIcon } from "@/components/icons/delete-column"
import { DeleteRowIcon } from "@/components/icons/delete-row"
import { ImageIcon } from "@/components/icons/image"
import { MinusIcon } from "@/components/icons/minus"
import { QuoteIcon } from "@/components/icons/quote"
import { TableIcon } from "@/components/icons/table"
import { TrashIcon } from "@/components/icons/trash"
import type { Editor } from "@tiptap/react"

import {
  BLOCK_DEFINITIONS,
  EDITOR_GROUPS,
  GROUP_ORDER,
  HEADING_ICONS,
  HEADING_KEYWORDS,
  HEADING_LABELS,
  HEADING_SUBTEXTS,
  LIST_ICONS,
  LIST_KEYWORDS,
  LIST_LABELS,
  LIST_SUBTEXTS
} from "../../lib/tiptap-block-types"
import { isNodeInSchema } from "../../lib/tiptap-utils"
import type { SuggestionItem } from "../../tiptap-ui-utils/suggestion-menu"

export interface SlashMenuConfig {
  enabledItems?: SlashMenuItemType[]
  customItems?: SuggestionItem[]
  itemGroups?: {
    [key in SlashMenuItemType]?: string
  }
  showGroups?: boolean
}

export const GROUPS = EDITOR_GROUPS

export { GROUP_ORDER }

const texts = {
  heading_1: {
    title: HEADING_LABELS[1],
    subtext: HEADING_SUBTEXTS[1],
    keywords: HEADING_KEYWORDS[1],
    badge: HEADING_ICONS[1],
    group: GROUPS.HEADINGS
  },
  heading_2: {
    title: HEADING_LABELS[2],
    subtext: HEADING_SUBTEXTS[2],
    keywords: HEADING_KEYWORDS[2],
    badge: HEADING_ICONS[2],
    group: GROUPS.HEADINGS
  },
  heading_3: {
    title: HEADING_LABELS[3],
    subtext: HEADING_SUBTEXTS[3],
    keywords: HEADING_KEYWORDS[3],
    badge: HEADING_ICONS[3],
    group: GROUPS.HEADINGS
  },

  bullet_list: {
    title: LIST_LABELS.bulletList,
    subtext: LIST_SUBTEXTS.bulletList,
    keywords: LIST_KEYWORDS.bulletList,
    badge: LIST_ICONS.bulletList,
    group: GROUPS.LISTS
  },
  ordered_list: {
    title: LIST_LABELS.orderedList,
    subtext: LIST_SUBTEXTS.orderedList,
    keywords: LIST_KEYWORDS.orderedList,
    badge: LIST_ICONS.orderedList,
    group: GROUPS.LISTS
  },
  task_list: {
    title: LIST_LABELS.taskList,
    subtext: LIST_SUBTEXTS.taskList,
    keywords: LIST_KEYWORDS.taskList,
    badge: LIST_ICONS.taskList,
    group: GROUPS.LISTS
  },

  blockquote: {
    title: BLOCK_DEFINITIONS.blockquote.label,
    subtext: BLOCK_DEFINITIONS.blockquote.subtext,
    keywords: BLOCK_DEFINITIONS.blockquote.keywords,
    badge: QuoteIcon,
    group: GROUPS.BLOCKS
  },
  code_block: {
    title: BLOCK_DEFINITIONS.codeBlock.label,
    subtext: BLOCK_DEFINITIONS.codeBlock.subtext,
    keywords: BLOCK_DEFINITIONS.codeBlock.keywords,
    badge: CodeBlockIcon,
    group: GROUPS.BLOCKS
  },
  table: {
    title: "Table",
    subtext: "Insert a table",
    aliases: ["table", "insertTable"],
    badge: TableIcon,
    group: GROUPS.BLOCKS
  },
  divider: {
    title: "Separator",
    subtext: "Horizontal line to separate content",
    keywords: ["hr", "horizontalRule", "line", "separator"],
    badge: MinusIcon,
    group: GROUPS.BLOCKS
  },

  image: {
    title: "Upload image",
    subtext: "Resizable image with caption",
    keywords: ["image", "imageUpload", "upload", "img", "picture", "media", "url"],
    badge: ImageIcon,
    group: GROUPS.IMAGE
  },

  add_row: {
    title: "Add row below",
    subtext: "Insert a new row below current",
    keywords: ["row", "add row", "insert row", "table row"],
    badge: AddRowBottomIcon,
    group: GROUPS.TABLE
  },
  add_column: {
    title: "Add column right",
    subtext: "Insert a new column to the right",
    keywords: ["column", "add column", "insert column", "table column"],
    badge: AddColRightIcon,
    group: GROUPS.TABLE
  },
  delete_row: {
    title: "Delete row",
    subtext: "Remove the current row",
    keywords: ["delete row", "remove row", "table row"],
    badge: DeleteRowIcon,
    group: GROUPS.TABLE
  },
  delete_column: {
    title: "Delete column",
    subtext: "Remove the current column",
    keywords: ["delete column", "remove column", "table column"],
    badge: DeleteColumnIcon,
    group: GROUPS.TABLE
  },
  delete_table: {
    title: "Delete table",
    subtext: "Remove the entire table",
    keywords: ["delete table", "remove table"],
    badge: TrashIcon,
    group: GROUPS.TABLE
  }
}

export type SlashMenuItemType = keyof typeof texts

function isInsideTable(editor: Editor): boolean {
  return editor.isActive("table")
}

const getItemImplementations = () => {
  return {
    heading_1: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      }
    },
    heading_2: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
    },
    heading_3: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 3 }).run()
      }
    },

    bullet_list: {
      check: (editor: Editor) => isNodeInSchema("bulletList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleBulletList().run()
      }
    },
    ordered_list: {
      check: (editor: Editor) => isNodeInSchema("orderedList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleOrderedList().run()
      }
    },
    task_list: {
      check: (editor: Editor) => isNodeInSchema("taskList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleTaskList().run()
      }
    },

    blockquote: {
      check: (editor: Editor) => isNodeInSchema("blockquote", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleBlockquote().run()
      }
    },
    code_block: {
      check: (editor: Editor) => isNodeInSchema("codeBlock", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleNode("codeBlock", "paragraph").run()
      }
    },
    table: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && !isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true
          })
          .run()
      }
    },
    divider: {
      check: (editor: Editor) => isNodeInSchema("horizontalRule", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().setHorizontalRule().run()
      }
    },
    image: {
      check: (editor: Editor) => isNodeInSchema("image", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "imageUpload"
          })
          .run()
      }
    },

    add_row: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().addRowAfter().run()
      }
    },
    add_column: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().addColumnAfter().run()
      }
    },
    delete_row: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().deleteRow().run()
      }
    },
    delete_column: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().deleteColumn().run()
      }
    },
    delete_table: {
      check: (editor: Editor) => isNodeInSchema("table", editor) && isInsideTable(editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().deleteTable().run()
      }
    }
  }
}

function organizeItemsByGroups(items: SuggestionItem[], showGroups: boolean): SuggestionItem[] {
  if (!showGroups) {
    return items.map(item => ({ ...item, group: "" }))
  }

  const groups: { [groupLabel: string]: SuggestionItem[] } = {}

  items.forEach(item => {
    const groupLabel = item.group || ""
    if (!groups[groupLabel]) {
      groups[groupLabel] = []
    }
    groups[groupLabel].push(item)
  })

  const organizedItems: SuggestionItem[] = []
  Object.entries(groups).forEach(([, groupItems]) => {
    organizedItems.push(...groupItems)
  })

  return organizedItems
}

export function useSlashDropdownMenu(config?: SlashMenuConfig) {
  const getSlashMenuItems = useCallback(
    (editor: Editor) => {
      const items: SuggestionItem[] = []

      const enabledItems = config?.enabledItems || (Object.keys(texts) as SlashMenuItemType[])
      const showGroups = config?.showGroups !== false
      const itemImplementations = getItemImplementations()

      enabledItems.forEach(itemType => {
        const itemImpl = itemImplementations[itemType]
        const itemText = texts[itemType]

        if (itemImpl && itemText && itemImpl.check(editor)) {
          const item: SuggestionItem = {
            onSelect: ({ editor }) => itemImpl.action({ editor }),
            ...itemText
          }

          if (config?.itemGroups?.[itemType]) {
            item.group = config.itemGroups[itemType]
          } else if (!showGroups) {
            item.group = ""
          }

          items.push(item)
        }
      })

      if (config?.customItems) {
        items.push(...config.customItems)
      }

      return organizeItemsByGroups(items, showGroups)
    },
    [config]
  )

  return {
    getSlashMenuItems,
    config
  }
}
