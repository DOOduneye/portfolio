import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Image from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { Typography } from "@tiptap/extension-typography"
import { UniqueID } from "@tiptap/extension-unique-id"
import StarterKit from "@tiptap/starter-kit"
import { createLowlight } from "lowlight"
import bash from "highlight.js/lib/languages/bash"
import css from "highlight.js/lib/languages/css"
import go from "highlight.js/lib/languages/go"
import json from "highlight.js/lib/languages/json"
import python from "highlight.js/lib/languages/python"
import sql from "highlight.js/lib/languages/sql"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"

import { Callout } from "./callout"
import { PreservingParagraph } from "./tiptap-extension/preserving-paragraph-extension"
import { HorizontalRule } from "./tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { TableKit } from "./tiptap-node/table-node/extensions/table-node-extension"

export const lowlight = createLowlight({ bash, css, go, json, python, sql, typescript, xml })

export const contentExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } },
    codeBlock: false,
    paragraph: false,
    horizontalRule: false,
    dropcursor: { width: 2 }
  }),
  PreservingParagraph,
  HorizontalRule,
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: "typescript" }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: false, cellMinWidth: 0 } }),
  Callout,
  UniqueID.configure({ types: ["heading"] }),
  Typography.configure({
    openDoubleQuote: false,
    closeDoubleQuote: false,
    openSingleQuote: false,
    closeSingleQuote: false,
    oneHalf: false,
    oneQuarter: false,
    threeQuarters: false,
    multiplication: false
  }),
  Image
]
