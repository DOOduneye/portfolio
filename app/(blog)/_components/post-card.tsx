import Link from "next/link";

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
