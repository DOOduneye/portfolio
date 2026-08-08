import { Paragraph } from "@tiptap/extension-paragraph"

const NBSP = "\u00A0"

export const PreservingParagraph = Paragraph.extend({
  renderMarkdown(node, h) {
    if (!node || !Array.isArray(node.content) || node.content.length === 0) {
      return NBSP
    }
    return h.renderChildren(node.content)
  }
})
