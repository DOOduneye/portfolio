"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Timestamp } from "firebase/firestore";
import { Experience } from '@/types/experience';

const Experiences = () => {
    // const createProjects = useCreateProjects();

    // const handleCreateProjects = async () => {
    //     try {
    //         const promise = createProjects.mutateAsync({
    //         });
    //         toast.promise(promise, {
    //             loading: 'Creating post...',
    //             success: 'Post created successfully!',
    //             error: 'Failed to create post.',
    //         });
    //     } catch (error) {
    //         console.error('Error creating post:', error);
    //         toast.error('Failed to create post.');
    //     }
    // }

    return (
        <div className='flex flex-col w-full max-w-5xl space-y-4 mt-10 '>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-y-1">
                    <h1 className='text-3xl font-bold'>Experience</h1>
                    <span className='text-sm text-muted-foreground sm:text-md'>Manage your experience.</span>
                </div>
                <Button onClick={() => { }}>
                    <Plus className='w-4 h-4' />
                    <span className='ml-2'>New Post</span>
                </Button>
            </div>
            {/* <div><AllPosts /></div> */}
        </div>
    );
}

export default Experiences;