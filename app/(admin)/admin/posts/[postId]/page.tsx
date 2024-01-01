import { usePost } from "@/hooks/use-post";
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

interface PostProps {
    params: {
        postId: string;
    };
}

const editor = new EditorJS({
    holder: 'editorjs', // Replace with the ID of the container div
    // Other configurations as per your needs
});

const Post = ({ params }: PostProps) => {

    return (
        <div className="container mx-auto">
            <div id="editorjs"></div>
        </div>
    );

};