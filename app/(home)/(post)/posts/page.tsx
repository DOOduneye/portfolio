"use client"

import { Loader } from "lucide-react";


import { PostCard } from "../_components/post-card";
import { Error } from "@/components/error";
import { usePosts } from "@/hooks/use-post";

const Posts = () => {
    const { data: posts, isLoading, error } = usePosts();

    if (isLoading) return <Loader className='w-5 h-5 animate-spin mx-auto' />
    if (error) return <Error message={error.message} />

    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Writing</h2>
            <div className='grid grid-cols-1'>
                {posts?.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()).map((post, index) => (
                    <PostCard post={post} key={post.id} index={index} totalPosts={posts.length} />
                ))}
            </div>
        </main >
    );
}

export default Posts;