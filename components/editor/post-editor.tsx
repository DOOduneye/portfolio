import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';

import { cn } from '@/lib/utils';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EditorToolbar } from './editor-toolbar';

interface PostEditorProps {
    content: string;
    onChange: (content: { markdown: string; html: string }) => void;
    editable?: boolean;
    className?: string;
}

export const PostEditor = ({
    content,
    onChange,
    editable = true,
    className,
}: PostEditorProps) => {
    const handleImageUpload = useCallback(
        async (file: File): Promise<string> => {
            const storageRef = ref(storage, `blog-images/${file.name}`);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        },
        []
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:text-blue-700 underline',
                },
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange({
                markdown: editor.storage.markdown.getMarkdown(),
                html: editor.getHTML(),
            });
        },
    });

    const addImage = useCallback(async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file && editor) {
                const url = await handleImageUpload(file);
                editor.chain().focus().setImage({ src: url }).run();
            }
        };
        input.click();
    }, [editor, handleImageUpload]);

    return (
        <div className={cn('flex flex-col', className)}>
            {editable && (
                <>
                    <EditorToolbar editor={editor} />
                    <button
                        onClick={addImage}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Image
                    </button>
                </>
            )}
            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}; 