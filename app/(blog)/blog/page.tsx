import Link from "next/link";

import { PostCard } from "../_components/post-card";

const Blog = () => {
    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Blog</h2>
            {Array.from({ length: 10 }, (_, i) => (
                <PostCard
                    key={i}
                    title='The First Post'
                    description='This is the first post on my blog.'
                    date='2021-07-15'
                    slug='the-first-post'
                    timeToRead={5}
                />
            ))}
        </main >
    );
}

export default Blog;