"use client"

import type { FC, SVGProps } from "react"
import { BulletListIcon } from "@/components/icons/bullet-list"
import { ChecklistIcon } from "@/components/icons/checklist"
import { CodeBlockIcon } from "@/components/icons/code-block"
import { HeadingOneIcon } from "@/components/icons/heading-one"
import { HeadingThreeIcon } from "@/components/icons/heading-three"
import { HeadingTwoIcon } from "@/components/icons/heading-two"
import { OrderedListIcon } from "@/components/icons/ordered-list"
import { QuoteIcon } from "@/components/icons/quote"
import { TextIcon } from "@/components/icons/text"

export type ListType = "bulletList" | "orderedList" | "taskList"

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type BlockType =
  | "paragraph"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "blockquote"
  | "codeBlock"

export interface BlockTypeDefinition {
  label: string
  subtext?: string
  keywords?: string[]
  icon: FC<SVGProps<SVGSVGElement>>
}

export interface HeadingDefinition extends BlockTypeDefinition {
  level: HeadingLevel
}

export const LIST_LABELS: Record<ListType, string> = {
  bulletList: "Bulleted list",
  orderedList: "Numbered list",
  taskList: "Checklist"
}

export const LIST_SUBTEXTS: Record<ListType, string> = {
  bulletList: "List with unordered items",
  orderedList: "List with ordered items",
  taskList: "List with tasks"
}

export const LIST_KEYWORDS: Record<ListType, string[]> = {
  bulletList: ["ul", "li", "list", "bulletlist", "bullet list"],
  orderedList: ["ol", "li", "list", "numberedlist", "numbered list"],
  taskList: ["tasklist", "task list", "todo", "checklist"]
}

export const LIST_ICONS: Record<ListType, FC<SVGProps<SVGSVGElement>>> = {
  bulletList: BulletListIcon,
  orderedList: OrderedListIcon,
  taskList: ChecklistIcon
}

export const LIST_SHORTCUT_KEYS: Record<ListType, string> = {
  bulletList: "mod+shift+8",
  orderedList: "mod+shift+7",
  taskList: "mod+shift+9"
}

export const HEADING_LABELS: Record<1 | 2 | 3, string> = {
  1: "Heading 1",
  2: "Heading 2",
  3: "Heading 3"
}

export const HEADING_SUBTEXTS: Record<1 | 2 | 3, string> = {
  1: "Top-level heading",
  2: "Key section heading",
  3: "Subsection and group heading"
}

export const HEADING_KEYWORDS: Record<1 | 2 | 3, string[]> = {
  1: ["h", "heading1", "h1"],
  2: ["h2", "heading2", "subheading"],
  3: ["h3", "heading3", "subheading"]
}

export const HEADING_ICONS: Record<1 | 2 | 3, FC<SVGProps<SVGSVGElement>>> = {
  1: HeadingOneIcon,
  2: HeadingTwoIcon,
  3: HeadingThreeIcon
}

export const BLOCK_DEFINITIONS = {
  paragraph: {
    label: "Text",
    icon: TextIcon
  },
  blockquote: {
    label: "Blockquote",
    subtext: "Blockquote block",
    keywords: ["quote", "blockquote"],
    icon: QuoteIcon
  },
  codeBlock: {
    label: "Code block",
    subtext: "Code block with syntax highlighting",
    keywords: ["code", "pre"],
    icon: CodeBlockIcon
  }
} as const satisfies Record<string, BlockTypeDefinition>

export const EDITOR_GROUPS = {
  TABLE: "Table",
  HEADINGS: "Headings",
  LISTS: "Lists",
  BLOCKS: "Blocks",
  IMAGE: "Image"
} as const

export const GROUP_ORDER: readonly string[] = [
  EDITOR_GROUPS.TABLE,
  EDITOR_GROUPS.HEADINGS,
  EDITOR_GROUPS.LISTS,
  EDITOR_GROUPS.BLOCKS,
  EDITOR_GROUPS.IMAGE
]

export function getListDefinition(type: ListType): BlockTypeDefinition {
  return {
    label: LIST_LABELS[type],
    subtext: LIST_SUBTEXTS[type],
    keywords: LIST_KEYWORDS[type],
    icon: LIST_ICONS[type]
  }
}

export function getHeadingDefinition(level: 1 | 2 | 3): HeadingDefinition {
  return {
    label: HEADING_LABELS[level],
    subtext: HEADING_SUBTEXTS[level],
    keywords: HEADING_KEYWORDS[level],
    icon: HEADING_ICONS[level],
    level
  }
}
