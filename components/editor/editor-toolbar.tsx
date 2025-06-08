import { type Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
    Code,
    Heading1,
    Heading2,
    Link as LinkIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface EditorToolbarProps {
    editor: Editor | null;
    className?: string;
}

export const EditorToolbar = ({ editor, className }: EditorToolbarProps) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div
            className={cn(
                'border border-gray-200 dark:border-gray-800 rounded-lg p-2 mb-4 flex flex-wrap gap-2',
                className
            )}
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('bold'),
                })}
            >
                <Bold className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('italic'),
                })}
            >
                <Italic className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('strike'),
                })}
            >
                <Strikethrough className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('code'),
                })}
            >
                <Code className="w-5 h-5" />
            </button>
            <button
                onClick={setLink}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('link'),
                })}
            >
                <LinkIcon className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('heading', { level: 1 }),
                })}
            >
                <Heading1 className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('heading', { level: 2 }),
                })}
            >
                <Heading2 className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('bulletList'),
                })}
            >
                <List className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('orderedList'),
                })}
            >
                <ListOrdered className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn('p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800', {
                    'bg-gray-100 dark:bg-gray-800': editor.isActive('blockquote'),
                })}
            >
                <Quote className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Undo className="w-5 h-5" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Redo className="w-5 h-5" />
            </button>
        </div>
    );
}; 