'use client';

import Editor from "@/components/editor/editor";
import { usePost } from "@/hooks/use-post";
import React, { useEffect, useRef } from 'react';

interface PostProps {
    params: {
        postId: string;
    };
}

const Post = ({ params }: PostProps) => {

    return (
        <div className='flex flex-col w-full max-w-5xl mt-10 space-y-4 '>
            <Editor />
        </div>
    );

};

export default Post;