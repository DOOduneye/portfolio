import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"

/**
 * Simple heuristic to check if text looks like markdown
 */
function looksLikeMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers: # ## ### etc
    /\*\*[^*]+\*\*/, // Bold: **text**
    /\*[^*]+\*/, // Italic: *text*
    /__[^_]+__/, // Bold: __text__
    /_[^_]+_/, // Italic: _text_
    /\[.+\]\(.+\)/, // Links: [text](url)
    /^[-*+]\s/m, // Unordered lists: - * +
    /^\d+\.\s/m, // Ordered lists: 1. 2. 3.
    /^>\s/m, // Blockquotes: >
    /`[^`]+`/, // Inline code: `code`
    /```[\s\S]*```/, // Code blocks: ```code```
    /^\s*[-*_]{3,}\s*$/m, // Horizontal rules: --- *** ___
    /!\[.*\]\(.*\)/, // Images: ![alt](url)
    /^- \[[ x]\]/m // Task lists: - [ ] or - [x]
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Extension that handles pasting markdown content and converts it to rich text.
 * Requires the @tiptap/markdown extension to be loaded.
 */
export const MarkdownPaste = Extension.create({
  name: "markdownPaste",

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste(_view, event) {
            // Only handle if markdown extension is available
            if (!editor.markdown) {
              return false
            }

            const text = event.clipboardData?.getData("text/plain")
            const html = event.clipboardData?.getData("text/html")

            // If there's HTML content, let default handler process it
            // (user might be pasting from a rich text source)
            if (html && html.trim().length > 0) {
              return false
            }

            if (!text || !text.trim()) {
              return false
            }

            // Check if the pasted text looks like markdown
            if (!looksLikeMarkdown(text)) {
              return false
            }

            // Parse and insert the markdown content
            editor.commands.insertContent(text, { contentType: "markdown" })
            return true
          }
        }
      })
    ]
  }
})
