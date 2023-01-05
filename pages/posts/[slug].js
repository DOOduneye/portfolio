import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import Markdown from '@/styles/Markdown';
import Footer from '@/components/Footer';
import ThemeToggle from '../../components/ThemeToggle';

const PostPage = ({ frontmatter: { title, date }, mdxSource }) => {

    const wordsPerMinute = 200;
    const words = mdxSource.compiledSource.match(/"(.*?)"/g).join(" ").split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return (
        <>
            <button className="w-12 h-12 p-2 m-5 text-xl font-bold rounded-full cursor-pointer" onClick={() => window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>


            <section className="hidden">
                <ThemeToggle />
            </section>
            <main className="flex flex-col items-center justify-center w-screen mt-5">
                <div className="flex flex-col justify-center gap-5 px-5 py-8 mx-auto font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose">
                    <h1 className="pb-3 font-sans text-5xl font-bold max-w-prose lg:text-6xl">
                        <span className="dark:drop-shadow-lg text-slate-900 dark:text-slate-100">
                            {title}
                        </span>
                    </h1>

                    <p className="pb-5 font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose text-slategrey-50 subpixel-antialiase text-slate-900 dark:text-slate-100">
                        {date} &middot; {minutes} min read
                    </p>
                    

                    <hr className="w-10 mx-auto border-t dark:border-slate-100/20 border-slate-900/20" />
                
                    <MDXRemote {...mdxSource} components={Markdown} />
                </div>
            </main>
            <Footer />
        </>
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
