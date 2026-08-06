import { Extension, type Editor, type Range } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"
import { SLASH_ITEMS, type SlashItem } from "./SlashMenu"

export interface SlashState {
  items: SlashItem[]
  rect: DOMRect
  select: (item: SlashItem) => void
}

export interface SlashBridge {
  onChange: (state: SlashState | null) => void
  /** Set by the menu so the plugin can hand arrow keys and enter to it. */
  keyHandler: { current: ((event: KeyboardEvent) => boolean) | null }
}

/**
 * The plugin only reports state. The menu itself is an ordinary component in
 * the editor's React tree, which keeps it on the same renderer as every other
 * piece of UI here.
 */
export function createSlashExtension(bridge: SlashBridge) {
  return Extension.create({
    name: "slashMenu",

    addProseMirrorPlugins() {
      return [
        Suggestion<SlashItem>({
          editor: this.editor,
          char: "/",
          allowSpaces: false,

          items: ({ query }) => {
            const needle = query.toLowerCase()
            return SLASH_ITEMS.filter(
              item => item.title.toLowerCase().includes(needle) || item.keywords.includes(needle)
            )
          },

          command: ({ editor, range, props }) => props.run(editor as Editor, range as Range),

          render: () => {
            const report = (props: {
              items: SlashItem[]
              clientRect?: (() => DOMRect | null) | null
              command: (item: SlashItem) => void
            }) => {
              const rect = props.clientRect?.()
              if (!rect) return
              bridge.onChange({ items: props.items, rect, select: props.command })
            }

            return {
              onStart: report,
              onUpdate: report,
              onKeyDown: ({ event }) => {
                if (event.key === "Escape") {
                  bridge.onChange(null)
                  return true
                }
                return bridge.keyHandler.current?.(event) ?? false
              },
              onExit: () => bridge.onChange(null)
            }
          }
        })
      ]
    }
  })
}
