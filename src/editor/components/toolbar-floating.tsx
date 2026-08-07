import { useEffect, useState } from "react"
import { useEditorState } from "@tiptap/react"

// --- Hooks ---
import { useFloatingToolbarVisibility } from "../hooks/use-floating-toolbar-visibility"
import { useTiptapEditor } from "../hooks/use-tiptap-editor"
// --- Utils ---
import { isSelectionValid } from "../lib/tiptap-utils"
// --- Primitive UI Components ---
import { Toolbar, ToolbarSeparator, ToolbarTooltip } from "../tiptap-ui-primitive/toolbar"
// --- UI Utils ---
import { FloatingElement } from "../tiptap-ui-utils/floating-element"
// --- UI ---
import { LinkButton, LinkContent } from "../tiptap-ui/link-popover"
import { MarkButton } from "../tiptap-ui/mark-button"
import { TurnIntoDropdown } from "../tiptap-ui/turn-into-dropdown"

/**
 * Floating toolbar that appears when text is selected or when editing links.
 *
 * Two modes:
 * 1. Format toolbar: Shows when text is selected. Has formatting buttons + link button.
 * 2. Link editor: Shows when clicking on a link OR clicking the link button.
 *
 * The toolbar hides when clicking elsewhere (no selection and not on a link).
 */
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
