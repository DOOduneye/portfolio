import { mergeAttributes, Node } from "@tiptap/core"

export type CalloutTone = "note" | "warning"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (tone?: CalloutTone) => ReturnType
      toggleCallout: (tone?: CalloutTone) => ReturnType
    }
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      tone: {
        default: "note" as CalloutTone,
        parseHTML: element => element.getAttribute("data-tone") ?? "note",
        renderHTML: attributes => ({ "data-tone": attributes.tone as string })
      }
    }
  },

  parseHTML() {
    return [{ tag: "aside[data-callout]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes, { "data-callout": "" }), 0]
  },

  addCommands() {
    return {
      setCallout:
        (tone = "note") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { tone }),
      toggleCallout:
        (tone = "note") =>
        ({ commands }) =>
          commands.toggleWrap(this.name, { tone })
    }
  }
})
