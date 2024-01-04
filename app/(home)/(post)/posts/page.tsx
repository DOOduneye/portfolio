"use client"

import { Loader } from "lucide-react";

import { usePosts } from "@/hooks/use-post";

import { PostCard } from "../_components/post-card";
import { Error } from "@/components/error";
import { Skeletons } from "@/components/ui/skeleton";

const Posts = () => {
    const { data: posts, isLoading, error } = usePosts();

    if (error) return <Error message={error.message} />

    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Writing</h2>
            <div className='grid grid-cols-1'>
                {isLoading && <Skeletons skeleton={PostCard.Skeleton} />}
                {posts?.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()).map((post, index) => (
                    <PostCard post={post} key={post.id} index={index} length={posts.length} />
                ))}
            </div>
        </main >
    );
}

export default Posts;