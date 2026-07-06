import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./editor.css";

interface Props {
  initialContent: string;
  onChange: (html: string) => void;
}

export function PostEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const buttons = [
    {
      label: "H2",
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      active: editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bold",
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Code",
      active: editor.isActive("code"),
      run: () => editor.chain().focus().toggleCode().run(),
    },
    {
      label: "List",
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1. List",
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code block",
      active: editor.isActive("codeBlock"),
      run: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 transition-colors focus-within:border-zinc-700">
      <div className="flex flex-wrap gap-1 border-b border-zinc-800 bg-zinc-900/60 p-1.5">
        {buttons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.run}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              button.active
                ? "bg-blue-500/15 text-blue-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
