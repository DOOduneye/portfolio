import '../../App.scss';

import BlogCard from './BlogCard';
import posts from './posts';

import { motion } from 'framer-motion';

function Blog() {
    return (        
        <motion.main className="grid grid-flow-row auto-rows-max h-full w-full" initial={{ opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            <section className="flex flex-row justify-center p-12">
                <p className="mt-1 text-base text-gray-500">
                    I write about things I find interesting.
                </p>
           </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-12 mb-10">
                {posts.map((post) => (  
                    <BlogCard key={post.title} date={post.date} title={post.title} description={post.description} link={post.link} />
                ))}
            </section>

        </motion.main>
    );
}

export default Blog;
