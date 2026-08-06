import { renderToReactElement } from "@tiptap/static-renderer/pm/react"
import { parseDocument } from "./document"
import { contentExtensions } from "./extensions"
import "./prose.css"

export function Prose({ content }: { content: string }) {
  return (
    <div className="prose">
      {renderToReactElement({ extensions: contentExtensions, content: parseDocument(content) })}
    </div>
  )
}
