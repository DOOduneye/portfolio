"use client"

import { cn } from "@/lib/utils";
import { Post } from "@/services/posts";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PostCardProps {
    post: Post;
    index: number;
    totalPosts: number;
}

export const PostCard = ({ post: { id, title, subtitle, date, content }, index, totalPosts }: PostCardProps) => {
    const timeToRead = Math.ceil(content.split(' ').length / 200);

    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === totalPosts - 1);

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === totalPosts - 1);
    }, [index, totalPosts])

    return (
        <Link href={`/posts/${id}`} className={cn('p-5 border border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 hover:border-gray-500', {
            'rounded-t-xl': isFirst,
            'rounded-b-xl': isLast,
        })}>
            <div className='flex flex-row justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {title}
                </h3>
                <p className='text-sm text-gray-500'>{date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className='flex flex-row justify-between gap-x-4'>
                <p className='text-sm text-gray-500'>{subtitle}</p>
                <p className='text-sm text-gray-500'>{timeToRead} min read</p>
            </div>
        </Link >
    );
}
