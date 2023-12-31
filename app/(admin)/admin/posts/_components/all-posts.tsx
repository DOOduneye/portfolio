"use client";



import { PostCard } from "./post-card";
import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";
import { usePosts } from "@/hooks/use-post";

export const AllPosts = () => {
    const { data: posts, error, isLoading } = usePosts();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    return (
        <>
            {posts && posts.sort((a, b) => b.date.toMillis() - a.date.toMillis()).map((post, index) => (
                <PostCard key={post.id} post={post} index={index} length={posts.length} />
            ))}
        </>
    );
}