"use client";

import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { Plus } from "lucide-react";
import { PostCard } from "../_components/post-card";

const Post = () => {
    const { data: posts, error, isLoading } = usePosts();

    return (
        <div className='flex flex-col w-full max-w-5xl space-y-4 mt-10 '>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-3xl font-semibold">Posts</h1>
                    <p className="text-gray-500 dark:text-gray-400">Create and manage posts.</p>
                </div>
                <div className="flex flex-row gap-x-2">
                    <Button className="gap-x-2">
                        <Plus className="w-5 h-5" />
                        Create
                    </Button>
                </div>
            </div>
            <div>
                {isLoading && <div>Loading...</div>}
                {error && <div>{error.message}</div>}
                {posts && posts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} totalPosts={posts.length} />
                ))}
            </div>
        </div>
    );
}

export default Post;