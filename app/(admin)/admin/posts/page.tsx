import { Plus } from "lucide-react";

import { AllPosts } from "./_components/all-posts";
import { Button } from "@/components/ui/button";

const Post = () => {

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
                        New Post
                    </Button>
                </div>
            </div>
            <AllPosts />
        </div>
    );
}

export default Post;