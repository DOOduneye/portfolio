import Link from "next/link";

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

export const PostCard = ({ title, description, date, slug, timeToRead }: { title: string, description: string, date: string, slug: string, timeToRead?: number }) => {
    return (
        <Link href={`/blog/${slug}`} className='p-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500'>
            <div className='flex flex-row justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {title}
                </h3>
                <p className='text-sm text-gray-500'>{date}</p>
            </div>
            <div className='flex flex-row justify-between gap-x-4'>
                <p className='text-sm text-gray-500'>{description}</p>
                <p className='text-sm text-gray-500'>{timeToRead} min read</p>
            </div>
        </Link >
    );
}
