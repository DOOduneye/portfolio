import Image from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"

// Both the editor and the static renderer take this exact list, or a post
// renders differently from the way it was written. Editing behaviour belongs
// in the editor. Headings start at h2 because the post title is the page's h1.
export const contentExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }
  }),
  Typography,
  Image
]
