"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flip, offset, shift, size } from "@floating-ui/react"
import { PluginKey } from "@tiptap/pm/state"
import { Suggestion, SuggestionPluginKey, type SuggestionProps } from "@tiptap/suggestion"

import { useFloatingElement } from "../../hooks/use-floating-element"
import { useMenuNavigation } from "../../hooks/use-menu-navigation"
import { useTiptapEditor } from "../../hooks/use-tiptap-editor"
import type { SuggestionItem, SuggestionMenuProps } from "./suggestion-menu-types"

export const SuggestionMenu = ({
  editor: providedEditor,
  floatingOptions,
  selector = "tiptap-suggestion-menu",
  children,
  maxHeight = 384,
  pluginKey = SuggestionPluginKey,
  controlledItems,
  onDismiss,
  ...internalSuggestionProps
}: SuggestionMenuProps) => {
  const { editor } = useTiptapEditor(providedEditor)

  const [show, setShow] = useState(false)
  const [clientRect, setClientRect] = useState<(() => DOMRect | null) | null>(null)
  const [command, setCommand] = useState<((item: SuggestionItem) => void) | null>(null)
  const [items, setItems] = useState<SuggestionItem[]>([])
  const [query, setQuery] = useState("")

  const dispatchEmptyTransaction = useCallback(() => {
    if (editor && !editor.isDestroyed) editor.view.dispatch(editor.state.tr)
  }, [editor])

  const { ref, style, getFloatingProps, isMounted } = useFloatingElement(show, clientRect, 1000, {
    placement: "bottom-start",
    middleware: [
      offset(10),
      flip({ mainAxis: true, crossAxis: false }),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          if (elements.floating) {
            const maxHeightValue = maxHeight
              ? Math.min(maxHeight, availableHeight)
              : availableHeight
            elements.floating.style.setProperty(
              "--suggestion-menu-max-height",
              `${maxHeightValue}px`
            )
          }
        }
      })
    ],
    onOpenChange(open) {
      if (!open) {
        onDismissRef.current?.()
        setShow(false)
        dispatchEmptyTransaction()
      }
    },
    ...floatingOptions
  })

  const suggestionPropsRef = useRef(internalSuggestionProps)
  useEffect(() => {
    suggestionPropsRef.current = internalSuggestionProps
  }, [internalSuggestionProps])

  const onDismissRef = useRef(onDismiss)
  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  const closePopup = useCallback(() => setShow(false), [])

  useEffect(() => {
    if (!editor || editor.isDestroyed) return

    const existingPlugin = editor.state.plugins.find(plugin => plugin.spec.key === pluginKey)
    if (existingPlugin) {
      editor.unregisterPlugin(pluginKey)
    }

    const suggestion = Suggestion({
      pluginKey: pluginKey instanceof PluginKey ? pluginKey : new PluginKey(pluginKey),
      editor,

      allow(props) {
        const $from = editor.state.doc.resolve(props.range.from)
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type.name === "image") return false
        }
        return true
      },

      command({ editor, range, props }) {
        if (!range) return

        const { view, state } = editor

        const isMention = editor.extensionManager.extensions.some(extension => {
          return (
            extension.name === "mention" &&
            extension.options?.suggestion?.char === suggestionPropsRef.current.char
          )
        })

        if (!isMention) {
          view.dispatch(state.tr.deleteRange(range.from, range.to))
        }

        const nodeAfter = view.state.selection.$to.nodeAfter
        const overrideSpace = nodeAfter?.text?.startsWith(" ")
        const rangeToUse = { ...range }
        if (overrideSpace) rangeToUse.to += 1

        props.onSelect({ editor, range: rangeToUse, context: props.context })
      },

      render: () => ({
        onStart: (props: SuggestionProps<SuggestionItem>) => {
          setClientRect(() => props.clientRect ?? null)
          setCommand(() => props.command)
          setItems(props.items)
          setQuery(props.query)
          setShow(true)
        },

        onUpdate: (props: SuggestionProps<SuggestionItem>) => {
          setClientRect(() => props.clientRect ?? null)
          setCommand(() => props.command)
          setItems(props.items)
          setQuery(props.query)
        },

        onExit: () => setShow(false)
      }),

      ...suggestionPropsRef.current
    })

    editor.registerPlugin(suggestion)

    return () => {
      if (!editor.isDestroyed) editor.unregisterPlugin(pluginKey)
    }
  }, [editor, pluginKey, closePopup])

  useEffect(() => {
    if (!isMounted) {
      setItems([])
      setClientRect(null)
      setCommand(null)
      setQuery("")
    }
  }, [isMounted])

  const onSelect = useCallback(
    (item: SuggestionItem) => {
      closePopup()
      command?.(item)
    },
    [closePopup, command]
  )

  const displayItems = controlledItems ?? items

  const { selectedIndex, setSelectedIndex } = useMenuNavigation({
    editor,
    query,
    items: displayItems,
    onSelect,
    disabled: !show
  })

  if (!isMounted || !editor) return null

  return (
    <div
      ref={ref}
      style={style}
      {...getFloatingProps()}
      data-selector={selector}
      role="listbox"
      aria-label="Suggestions"
      onPointerDown={e => e.preventDefault()}
    >
      {children({ items: displayItems, selectedIndex, setSelectedIndex, onSelect })}
    </div>
  )
}
