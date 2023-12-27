"use client";
import { Post } from "@/services/posts";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";


interface PostCardProps {
    post: Post;
    index: number;
    totalPosts: number;
}

export const PostCard = ({ post, index, totalPosts }: PostCardProps) => {

    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === totalPosts - 1);

    const cardClasses = `
      flex flex-row p-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900
      ${isFirst ? 'rounded-t-xl' : ''}
      ${isLast ? 'rounded-b-xl' : ''}
    `;

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === totalPosts - 1);
    }, [index, totalPosts])

    return (
        <div className={` ${cardClasses} `}>
            <div className='flex flex-col justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {post.title}
                </h3>
                <p className='text-sm text-gray-500'>{post.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className='flex flex-row justify-between gap-x-4 items-center border-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'>
                        <MoreVertical className='w-4 h-4' />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <DropdownMenuLabel>Edit</DropdownMenuLabel>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <DropdownMenuLabel>Delete</DropdownMenuLabel>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
}
