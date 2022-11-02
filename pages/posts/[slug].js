import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { motion } from 'framer-motion';

import tw from 'tailwind-styled-components';

import PostHeader from '@/components/Post/PostHeader';

const PostContainer = tw.main`
    flex 
    flex-col
    justify-center
    bg-[#191919] 
    border
    border-zinc-100/10 
    text-lg 
    text-gray-400 
    font-light
    leading-relaxed
    racking-wide 
    rounded-md 
    p-10 
    my-10
    mx-auto
    max-w-prose
`;


const Content = tw.div`
    flex
    flex-col 
    gap-5 
    justify-center 
    py-8 
    mx-auto 
    max-w-prose 
    text-slate-50
`;

const PostPage = ({ frontmatter: { title, date }, mdxSource }) => {
    return (
        <PostContainer>
            <PostHeader title={title} date={date}/>

            <Content>
                <MDXRemote {...mdxSource} />
            </Content>
        </PostContainer>
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
