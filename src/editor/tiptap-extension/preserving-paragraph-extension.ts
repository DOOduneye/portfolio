import { Paragraph } from "@tiptap/extension-paragraph"

const NBSP = "\u00A0"

/**
 * Empty paragraphs survive `markdown → json → markdown` round-trips by
 * serializing to a non-breaking space. Markdown spec collapses consecutive
 * blank lines, so without this a `[A, "", B]` document comes back as `[A, B]`.
 */
export const PreservingParagraph = Paragraph.extend({
  renderMarkdown(node, h) {
    if (!node || !Array.isArray(node.content) || node.content.length === 0) {
      return NBSP
    }
    return h.renderChildren(node.content)
  }
})
