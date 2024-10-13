"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { type Post } from "@/types/post";
import { useDeletePost } from "@/hooks/use-post";

import { AdminDropdown } from "../../_components/admin-dropdown";
import { useRouter } from "next/navigation";

interface PostCardProps {
    post: Post;
    index: number;
    length: number;
}

export const PostCard = ({ post, index, length }: PostCardProps) => {
    const router = useRouter();
    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === length - 1);
    const deletePost = useDeletePost();

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === length - 1);
    }, [index, length])

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
            <AdminDropdown onEdit={() => router.push(`/admin/posts/${post.id}`)} onDelete={removePost} />
        </div>
    );
}