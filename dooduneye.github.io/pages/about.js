import TextCard from '../components/TextCard';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';


import { motion } from 'framer-motion';
import variants from '../utils/motion' 

export default function About( { frontmatter: { title, date }, mdxSource } ) {
    return (
        <motion.main initial='hidden' animate='animate' exit='exit' variants={variants} className="grid grid-rows-1 m-10">
            <div className="border border-zinc-100/10 hover:border-zinc-200/50 bg-[#191919] rounded-md p-10 shadow-md drop-shadow-sm hover:inner-shadow hover:transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-200 duration-300 mx-auto max-w-prose text-lg">
                <h1>
                    <span className="block text-center text-lg font-semibold text-red-300">{date}</span>
                    <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
                        {title}
                    </span>
                </h1>
    
                <div className="mt-8 text-lg leading-8 text-slate-200 text-justify">
                    <MDXRemote {...mdxSource} />
                </div>
            </div>        
        </motion.main> 
    );
}


// const path = 'pages/content/about.mdx';

// with just one file 
const getStaticProps = async () => {
    const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/', 'about.mdx'), 'utf-8'); 

    const { data: frontmatter, content } = matter(markdownWithMeta);
    const mdxSource = await serialize(content);

    return {
        props: {
            frontmatter,
            mdxSource
        }
    }
}

export { getStaticProps }