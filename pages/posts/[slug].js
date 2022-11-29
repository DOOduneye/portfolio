import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { motion } from 'framer-motion';

import tw from 'tailwind-styled-components';

import PostHeader from '@/components/Post/PostHeader';

import { TextContainer } from '@/styles/styles';

const PostMain = tw.main`
    grid 
    grid-rows-1 
    sm:mx-5 
    mx-2 
    px-5 
    pb-5
`;

const PostContainer = tw.main`
    border-b border-l border-r border-zinc-100/20 bg-[#191919] rounded-b-md  p-10 shadow-md drop-shadow-lg hover:inner-shadow mx-auto max-w-prose text-lg
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
    
    px-5
    font-normal	
    subpixel-antialiase
    text-lg
    leading-normal
    align-middle
    break-words
    text-left
    font-sans
    text-slate-100
    

`;

const PostPage = ({ frontmatter: { title, date }, mdxSource }) => {
    return (
        <TextContainer>
            <PostHeader title={title} date={date}/>

            <Content>
                <MDXRemote {...mdxSource} />
            </Content>
        </TextContainer>
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
f
export { getStaticPaths, getStaticProps };
export default PostPage;
