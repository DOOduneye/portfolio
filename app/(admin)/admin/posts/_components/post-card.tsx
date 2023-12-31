"use client";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { type Post } from "@/types/post";


import { AdminDropdown } from "../../_components/admin-dropdown";
import { useDeletePost } from "@/hooks/use-post";

interface PostCardProps {
    post: Post;
    index: number;
    totalPosts: number;
}

export const PostCard = ({ post, index, totalPosts }: PostCardProps) => {

    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === totalPosts - 1);
    const deletePost = useDeletePost();

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === totalPosts - 1);
    }, [index, totalPosts])

    const removePost = async () => {
        try {
            const promise = deletePost.mutateAsync(post.id);
            toast.promise(promise, {
                loading: 'Deleting post...',
                success: 'Post deleted successfully!',
                error: 'Failed to delete post.',
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post.');
        }
    };

    return (
        <div className={cn('flex flex-row p-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900', {
            'rounded-t-xl': isFirst,
            'rounded-b-xl': isLast,
        })}>
            <div className='flex flex-col justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {post.title}
                </h3>
                <p className='text-sm text-gray-500'>{post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <AdminDropdown onEdit={() => { }} onDelete={removePost} />
        </div>
    );
}