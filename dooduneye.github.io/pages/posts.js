import PostCard from '../components/PostCard';

import { motion } from 'framer-motion';
import variants from '../utils/motion' 

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter'; 

export default function Posts({ posts }) {
    return (        
        <motion.main initial='hidden' animate='animate' exit='exit' variants={variants} className="grid grid-flow-row auto-rows-max h-full w-full mb-10">
            <section className="flex flex-row justify-center p-12">
                <p className="mt-1 text-base text-gray-500">
                    I write about things I find interesting.
                </p>
           </section>

            <section className="grid grid-col-1 md:grid-cols-1 lg:grid-cols-3 gap-5 px-10">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </section>

        </motion.main>
    );
}

export const getStaticProps = async() => {
    const files = fs.readdirSync(path.join('pages', '../content/posts'));

    const posts = files.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/posts', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            frontmatter,
            slug: filename.split('.')[0]
        }
    })

    return {
        props: {
            posts
        }
    }
}