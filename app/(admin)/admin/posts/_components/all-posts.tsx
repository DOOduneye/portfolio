"use client";

import { usePosts } from "@/hooks/useFirebase";

import { PostCard } from "../../_components/post-card";
import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";

export const AllPosts = () => {
    const { data: posts, error, isLoading } = usePosts();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    return (
        <>
            {posts && posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} totalPosts={posts.length} />
            ))}
        </>
    );
}