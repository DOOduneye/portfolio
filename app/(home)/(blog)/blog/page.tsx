"use client"

import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "../_components/post-card";

const Blog = () => {
    const { data: blogs, isLoading, error } = usePosts();

    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Blog</h2>
            <div className='grid grid-cols-1 gap-4'>
                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}
                {blogs?.map((blog: any) => (
                    <PostCard post={blog} key={blog.title} />
                ))}
            </div>
        </main >
    );
}

export default Blog;