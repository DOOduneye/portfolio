import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import Markdown from '@/styles/Markdown';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';

const PostPage = ({ frontmatter: { title, date }, mdxSource }) => {

    const wordsPerMinute = 200;
    const words = mdxSource.compiledSource.match(/(?<=")(.*?)(?=")/g).join(" ").split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);

    Markdown.p = ({ children, ...props }) => <p className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</p>;


    return (
        <Layout>
            <main className="flex flex-col items-center justify-center w-screen mt-5">
                <div className="flex flex-col justify-center gap-5 px-5 py-8 mx-auto font-sans text-lg font-normal leading-normal text-left break-words align-middle max-w-prose text-slategrey-50 subpixel-antialiase dark:text-slate-100 text-slate-900">
                    <h1 className="pb-3 font-sans text-5xl font-bold max-w-prose text-slate-100 lg:text-6xl">
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
        </Layout>
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
