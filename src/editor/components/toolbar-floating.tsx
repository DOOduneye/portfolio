import { useEffect, useState } from "react"
import { useEditorState } from "@tiptap/react"

import { useFloatingToolbarVisibility } from "../hooks/use-floating-toolbar-visibility"
import { useTiptapEditor } from "../hooks/use-tiptap-editor"
import { isSelectionValid } from "../lib/tiptap-utils"
import { Toolbar, ToolbarSeparator, ToolbarTooltip } from "../tiptap-ui-primitive/toolbar"
import { FloatingElement } from "../tiptap-ui-utils/floating-element"
import { LinkButton, LinkContent } from "../tiptap-ui/link-popover"
import { MarkButton } from "../tiptap-ui/mark-button"
import { TurnIntoDropdown } from "../tiptap-ui/turn-into-dropdown"

export function ToolbarFloating() {
  const { editor } = useTiptapEditor()

  const [isCreatingLink, setIsCreatingLink] = useState(false)

  const { shouldShow: hasTextSelection } = useFloatingToolbarVisibility({
    editor,
    isSelectionValid
  })

  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isLinkActive: ctx.editor?.isActive("link") ?? false,
      selectionFrom: ctx.editor?.state.selection.from ?? 0,
      selectionTo: ctx.editor?.state.selection.to ?? 0
    })
  })

  const isEditingLink =
    editorState?.isLinkActive && editorState.selectionFrom !== editorState.selectionTo

  const showLinkMode = isEditingLink || isCreatingLink
  const isVisible = hasTextSelection || showLinkMode

  useEffect(() => {
    if (!hasTextSelection && !isEditingLink) {
      setIsCreatingLink(false)
    }
  }, [hasTextSelection, isEditingLink])

  if (showLinkMode) {
    return (
      <FloatingElement shouldShow={isVisible}>
        <Toolbar>
          <LinkContent editor={editor} autoFocus={isCreatingLink} />
        </Toolbar>
      </FloatingElement>
    )
  }

  return (
    <FloatingElement shouldShow={isVisible}>
      <Toolbar>
        <TurnIntoDropdown hideWhenUnavailable />

        <MarkButton type="bold" hideWhenUnavailable />
        <MarkButton type="italic" hideWhenUnavailable />
        <MarkButton type="underline" hideWhenUnavailable />
        <MarkButton type="strike" hideWhenUnavailable />
        <MarkButton type="code" hideWhenUnavailable />

        <ToolbarSeparator />

        <ToolbarTooltip label="Link">
          <LinkButton onClick={() => setIsCreatingLink(true)} />
        </ToolbarTooltip>
      </Toolbar>
    </FloatingElement>
  )
}
