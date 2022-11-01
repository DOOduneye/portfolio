import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { motion } from 'framer-motion';

import Link from 'next/link';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import components from '../../utils/mdxComponents';

const PostPage = ({ frontmatter: { title, date }, mdxSource }) => {
    // bg-[#191919]
    return (
        <motion.main
            initial="hidden"
            animate="animate"
            exit="exit"
            variants={{
                hidden: { opacity: 0, x: 100 },
                animate: {
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration: 2,
                        delay: 0.5,
                        ease: [0.6, 0.05, -0.01, 0.9],
                    },
                },
                exit: {
                    opacity: 0,
                    x: -100,
                    transition: {
                        duration: 2,
                        delay: 0.5,
                        ease: [0.6, 0.05, -0.01, 0.9],
                    },
                },
            }}
            className="grid grid-rows-1 sm:mx-5 mx-2 px-5 pb-5"
        >
            <div className="border-b border-l border-r border-zinc-100/20 bg-[#191919] rounded-b-md  p-10 shadow-md drop-shadow-lg hover:inner-shadow mx-auto max-w-prose text-lg">
                <div
                    className={`flex flex-row justify-center py-8  mx-auto max-w-prose px-10 rounded-lg bg-gradient-to-r to-[#F57A89] from-[#191919]`}
                >
                    <Link href="/posts" className="flex-2 text-slate-200 hover:text-slate-300">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="pt-3 transition ease-in-out delay translate-x-0 hover:-translate-x-1 duration-300"
                        />
                    </Link>

                    <span className="flex-auto mt-2 block text-center text-3xl font-bold leading-8 tracking-tightsm:text-4xl text-slate-200">
                        {title}
                    </span>

                    <span className="flex-2 mt-2 block font-bold leading-8 tracking-tight text-slate-200">{date}</span>
                </div>

                <div className="flex flex-col gap-5 justify-center py-8  mx-auto max-w-prose text-slate-50">
                    <MDXRemote {...mdxSource} />
                </div>
            </div>
        </motion.main>
    );
};

const getStaticPaths = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/posts'));

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.mdx', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
};

const getStaticProps = async ({ params: { slug } }) => {
    const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/posts', slug + '.mdx'), 'utf-8');

    const { data: frontmatter, content } = matter(markdownWithMeta);
    const mdxSource = await serialize(content);

    return { props: { frontmatter, slug, mdxSource } };
};

export { getStaticPaths, getStaticProps };
export default PostPage;
