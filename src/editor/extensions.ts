import Image from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"

/**
 * The extensions that define what a post can contain.
 *
 * Both the editor and the static renderer take this exact list. Anything that
 * only affects editing behaviour belongs in the editor instead, or the two
 * will disagree about the document and a post will render differently from the
 * way it was written.
 *
 * The post title is the page's only h1, so headings inside the body start at
 * level two.
 */
export const contentExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }
  }),
  Typography,
  Image
]
