import Image from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"

export const contentExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }
  }),
  Typography,
  Image
]
