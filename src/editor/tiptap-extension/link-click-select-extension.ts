import { Extension, getMarkRange } from "@tiptap/core"
import { Plugin, TextSelection } from "@tiptap/pm/state"

export const LinkClickSelect = Extension.create({
  name: "linkClickSelect",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const target = event.target as HTMLElement
            const linkElement = target.closest("a")

            if (!linkElement) return false

            if (event.metaKey || event.ctrlKey) {
              const href = linkElement.getAttribute("href")
              if (href) {
                window.open(href, "_blank", "noopener,noreferrer")
                return true
              }
            }

            const $pos = view.state.doc.resolve(pos)
            const linkType = view.state.schema.marks["link"]
            if (!linkType) return false

            const range = getMarkRange($pos, linkType)
            if (!range || range.from === range.to) return false

            view.dispatch(
              view.state.tr.setSelection(TextSelection.create(view.state.doc, range.from, range.to))
            )
            return true
          }
        }
      })
    ]
  }
})
