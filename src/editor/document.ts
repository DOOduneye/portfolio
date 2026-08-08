import type { JSONContent } from "@tiptap/core"

export const EMPTY_DOCUMENT = '{"type":"doc","content":[{"type":"paragraph"}]}'

const blankDocument = (): JSONContent => ({
  type: "doc",
  content: [{ type: "paragraph" }]
})

export function parseDocument(stored: string): JSONContent {
  if (!stored.trim()) return blankDocument()

  try {
    const parsed: unknown = JSON.parse(stored)
    if (isDocument(parsed)) {
      return parsed.content?.length ? parsed : blankDocument()
    }
  } catch {}

  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: stored }] }]
  }
}

function isDocument(value: unknown): value is JSONContent {
  return typeof value === "object" && value !== null && (value as JSONContent).type === "doc"
}

export function documentText(document: JSONContent): string {
  const parts: string[] = []

  const walk = (node: JSONContent) => {
    if (node.text) parts.push(node.text)
    node.content?.forEach(walk)
  }
  walk(document)

  return parts.join(" ")
}

export function wordCount(document: JSONContent): number {
  const text = documentText(document).trim()
  return text ? text.split(/\s+/).length : 0
}

export function readingMinutes(document: JSONContent): number {
  return Math.max(1, Math.round(wordCount(document) / 200))
}

export const UNTITLED = "Untitled"

export function isUntitled(title: string): boolean {
  const trimmed = title.trim()
  return trimmed === "" || trimmed.toLowerCase() === UNTITLED.toLowerCase()
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128)
    .replace(/-+$/g, "")

  return slug || `untitled-${Date.now().toString(36)}`
}
