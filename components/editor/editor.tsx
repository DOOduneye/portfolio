import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import "@blocknote/react/style.css";
import "@blocknote/core/fonts/inter.css";

import "../../app/globals.css";

const Editor = () => {
    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: "heading",
                content: "Post Title",
            },
        ],
        placeholders: {
            heading: "Post Title",
            // paragraph: "Start writing here...",
        },

    });

    // Renders the editor instance using a React component.
    return <BlockNoteView editor={editor} />;
}

export default Editor;