import type { Editor } from "@tiptap/core"
import { Extension } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"
import { canJoin } from "@tiptap/pm/transform"

export const ListNormalizationExtension = Extension.create({
  name: "listNormalization",

  addKeyboardShortcuts() {
    const listTypes = ["bulletList", "orderedList", "taskList"]

    const handleBackspace = ({ editor }: { editor: Editor }) => {
      const { state, view } = editor
      const { selection } = state
      const { $from, empty } = selection

      if (!empty) return false
      if ($from.parentOffset !== 0) return false

      const currentNode = $from.parent

      if (currentNode.type.name !== "paragraph" || currentNode.content.size > 0) {
        return false
      }

      const parentDepth = $from.depth - 1
      if (parentDepth < 0) return false

      const parent = $from.node(parentDepth)
      const indexInParent = $from.index(parentDepth)

      if (indexInParent === 0 || indexInParent >= parent.childCount - 1) {
        return false
      }

      const nodeBefore = parent.child(indexInParent - 1)
      const nodeAfter = parent.child(indexInParent + 1)

      const isBeforeList = listTypes.includes(nodeBefore.type.name)
      const isAfterList = listTypes.includes(nodeAfter.type.name)

      if (!isBeforeList || !isAfterList) {
        return false
      }

      if (nodeBefore.type.name !== nodeAfter.type.name) {
        return false
      }

      const startOfPara = $from.before(parentDepth + 1)
      const endOfPara = $from.after(parentDepth + 1)

      const $insideFirstList = state.doc.resolve(startOfPara - 1)
      const targetSelection = TextSelection.findFrom($insideFirstList, -1, true)

      if (!targetSelection) {
        return false
      }

      const cursorTargetPos = targetSelection.from

      const tr = state.tr

      tr.delete(startOfPara, endOfPara)

      if (canJoin(tr.doc, startOfPara)) {
        tr.join(startOfPara)
      }

      const mappedPos = tr.mapping.map(cursorTargetPos)
      tr.setSelection(TextSelection.create(tr.doc, mappedPos))

      view.dispatch(tr)
      return true
    }

    return {
      Backspace: handleBackspace
    }
  }
})
