import { renderToReactElement } from "@tiptap/static-renderer/pm/react"
import { parseDocument } from "./document"
import { contentExtensions } from "./extensions"
import "./prose.css"

/**
 * Renders a stored post as React elements. The document never becomes an HTML
 * string on the way to the page, so there is nothing to inject into.
 */
export function Prose({ content }: { content: string }) {
  return (
    <div className="prose">
      {renderToReactElement({ extensions: contentExtensions, content: parseDocument(content) })}
    </div>
  )
}
