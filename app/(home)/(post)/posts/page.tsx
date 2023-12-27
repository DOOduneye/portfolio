"use client"

import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "../_components/post-card";
import { Loader } from "lucide-react";

const Posts = () => {
    const { data: posts, isLoading, error } = usePosts();

    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Writing</h2>
            <div className='grid grid-cols-1 gap-4'>
                {isLoading && <Loader className='w-5 h-5 animate-spin mx-auto' />}
                {error && <p>{error.message}</p>}
                {posts?.map((post) => (
                    <PostCard post={post} key={post.id} />
                ))}
            </div>
        </main >
    );
}

export default Posts;