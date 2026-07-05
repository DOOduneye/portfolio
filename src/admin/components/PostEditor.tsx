import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  initialContent: string;
  onChange: (html: string) => void;
}

// One editor, one stack: TipTap v3 on ProseMirror. StarterKit covers
// headings, lists, code blocks, links, bold/italic, blockquotes.
export function PostEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const toggle = (action: () => boolean) => () => action();

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button
          type="button"
          data-active={editor.isActive("heading", { level: 2 })}
          onClick={toggle(() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )}
        >
          H2
        </button>
        <button
          type="button"
          data-active={editor.isActive("bold")}
          onClick={toggle(() => editor.chain().focus().toggleBold().run())}
        >
          Bold
        </button>
        <button
          type="button"
          data-active={editor.isActive("italic")}
          onClick={toggle(() => editor.chain().focus().toggleItalic().run())}
        >
          Italic
        </button>
        <button
          type="button"
          data-active={editor.isActive("codeBlock")}
          onClick={toggle(() => editor.chain().focus().toggleCodeBlock().run())}
        >
          Code block
        </button>
        <button
          type="button"
          data-active={editor.isActive("bulletList")}
          onClick={toggle(() => editor.chain().focus().toggleBulletList().run())}
        >
          List
        </button>
        <button
          type="button"
          data-active={editor.isActive("blockquote")}
          onClick={toggle(() => editor.chain().focus().toggleBlockquote().run())}
        >
          Quote
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
