import type { Editor } from "@tiptap/react"

export const isElementWithinEditor = (editor: Editor | null, element: Node | null) => {
  if (!element || !editor) {
    return false
  }

  const editorWrapper = editor.view.dom.parentElement
  const editorDom = editor.view.dom

  if (!editorWrapper) {
    return false
  }

  return editorWrapper === element || editorDom === element || editorWrapper.contains(element)
}

export const isElementWithinRadixPortal = (element: Node | null): boolean => {
  if (!element || !(element instanceof HTMLElement)) {
    return false
  }

  let current: HTMLElement | null = element

  while (current) {
    if (
      current.hasAttribute("data-radix-popper-content-wrapper") ||
      current.hasAttribute("data-radix-portal") ||
      current.getAttribute("role") === "menu" ||
      current.getAttribute("role") === "dialog" ||
      current.getAttribute("data-slot") === "dropdown-menu-content" ||
      current.getAttribute("data-slot") === "popover-content"
    ) {
      return true
    }
    current = current.parentElement
  }

  return false
}
