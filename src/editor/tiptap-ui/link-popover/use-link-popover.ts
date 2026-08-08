"use client"

import { useCallback, useEffect, useState } from "react"
import { LinkIcon } from "@/components/icons/link"
import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"

import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import { isMarkInSchema, isNodeTypeSelected, sanitizeUrl } from "../../lib/tiptap-utils"

export interface UseLinkPopoverConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onSetLink?: () => void
}

export interface LinkHandlerProps {
  editor: Editor | null
  onSetLink?: () => void
}

export function canSetLink(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false

  if (isNodeTypeSelected(editor, ["image"], true)) return false
  return editor.can().setMark("link")
}

export function isLinkActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("link")
}

export function shouldShowLinkButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  const linkInSchema = isMarkInSchema("link", editor)

  if (!linkInSchema || !editor) {
    return false
  }

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetLink(editor)
  }

  return true
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  try {
    new URL(trimmed)
    return trimmed
  } catch {
    return `https://${trimmed}`
  }
}

export function useLinkHandler(props: LinkHandlerProps) {
  const { editor, onSetLink } = props
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!editor) return

    const { href } = editor.getAttributes("link")

    if (isLinkActive(editor) && url === null) {
      setUrl(href || "")
    }
  }, [editor, url])

  useEffect(() => {
    if (!editor) return

    const updateLinkState = () => {
      const { href } = editor.getAttributes("link")
      setUrl(href || "")
    }

    editor.on("selectionUpdate", updateLinkState)
    return () => {
      editor.off("selectionUpdate", updateLinkState)
    }
  }, [editor])

  const setLink = useCallback(
    (newUrl?: string) => {
      const rawUrl = newUrl ?? url
      if (!rawUrl || !editor) return

      const normalizedUrl = normalizeUrl(rawUrl)
      const isEditingExistingLink = editor.isActive("link")
      const hasSelection = !editor.state.selection.empty

      let chain = editor.chain().focus()

      if (isEditingExistingLink) {
        chain = chain.extendMarkRange("link").setLink({ href: normalizedUrl })
      } else if (hasSelection) {
        chain = chain.setLink({ href: normalizedUrl })
      } else {
        chain = chain.insertContent({
          type: "text",
          text: normalizedUrl,
          marks: [{ type: "link", attrs: { href: normalizedUrl } }]
        })
      }

      chain.run()

      if (!newUrl) setUrl(null)
      onSetLink?.()
    },
    [editor, onSetLink, url]
  )

  const removeLink = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .setMeta("preventAutolink", true)
      .run()
    setUrl("")
  }, [editor])

  const openLink = useCallback(
    (target: string = "_blank", features: string = "noopener,noreferrer") => {
      if (!url) return

      const safeUrl = sanitizeUrl(url, window.location.href)
      if (safeUrl !== "#") {
        window.open(safeUrl, target, features)
      }
    },
    [url]
  )

  return {
    url: url || "",
    setUrl,
    setLink,
    removeLink,
    openLink
  }
}

export function useLinkState(props: { editor: Editor | null; hideWhenUnavailable: boolean }) {
  const { editor, hideWhenUnavailable = false } = props

  const [isVisible, setIsVisible] = useState(true)

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      if (!ctx.editor) {
        return { canSet: false, isActive: false }
      }
      return {
        canSet: canSetLink(ctx.editor),
        isActive: ctx.editor.isActive("link")
      }
    }
  })

  const canSet = editorState?.canSet ?? false
  const isActive = editorState?.isActive ?? false

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowLinkButton({
          editor,
          hideWhenUnavailable
        })
      )
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  return {
    isVisible,
    canSet,
    isActive
  }
}

export function useLinkPopover(config?: UseLinkPopoverConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false, onSetLink } = config || {}

  const { editor } = useTiptapEditor(providedEditor)

  const { isVisible, canSet, isActive } = useLinkState({
    editor,
    hideWhenUnavailable
  })

  const linkHandler = useLinkHandler({
    editor,
    onSetLink
  })

  return {
    isVisible,
    canSet,
    isActive,
    label: "Link",
    Icon: LinkIcon,
    ...linkHandler
  }
}
