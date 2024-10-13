"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { useCreatePost } from "@/hooks/use-post";

import { AllPosts } from "./_components/all-posts";
import { Button } from "@/components/ui/button";
import Editor from "@/components/editor/editor";


const Post = () => {
    const createPost = useCreatePost();

    const handleCreatePost = async () => {
        try {
            const promise = createPost.mutateAsync({
                title: 'Untitled Post',
                content: '',
                date: Timestamp.fromDate(new Date()),
                subtitle: '',
                published: false,
            });
            toast.promise(promise, {
                loading: 'Creating post...',
                success: 'Post created successfully!',
                error: 'Failed to create post.',
            });
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post.');
        }
    }

    return (
        <div className='flex flex-col w-full max-w-5xl mt-10 space-y-4 '>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-y-1">
                    <h1 className='text-3xl font-bold'>Posts</h1>
                    <span className='text-sm text-muted-foreground sm:text-md'>Manage your posts.</span>
                </div>
                <Button onClick={handleCreatePost}>
                    <Plus className='w-4 h-4' />
                    <span className='ml-2'>New Post</span>
                </Button>
            </div>
            <div>
                <AllPosts />
            </div>
        </div>
    );
}

export default Post;