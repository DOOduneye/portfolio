import TextCard from '../components/TextCard';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import { motion } from 'framer-motion';
import variants from '../utils/motion';

import tw from 'tailwind-styled-components';

const Grid = tw.main`
    grid
    grid-flow-row
    auto-rows-max
    h-full
    m-10
`;

const HeadingContainer = tw.section`
    border
    border-zinc-100/10 
    hover:border-zinc-200/50 
    bg-[#191919] 
    rounded-md 
    p-10 
    shadow-md 
    drop-shadow-sm 
    hover:inner-shadow 
    hover:transition 
    ease-in-out 
    delay-150 
    hover:-translate-y-2 
    hover:scale-200 
    duration-300 
    mx-auto 
    max-w-prose 
    text-lg 
    text-gray-400 
    leading-relaxed
    racking-wide 
    font-light
`;

const Date = tw.span`
    block 
    text-center 
    text-lg 
    font-semibold 
    text-red-300
`;

const Title = tw.span`
    mt-2 
    block 
    text-center 
    text-3xl 
    font-bold 
    leading-8 
    tracking-tight 
    text-[#DA4167] 
    sm:text-4xl
`;

const Content = tw.section`
    flex 
    flex-col 
    gap-5 
    mt-8 
    text-lg 
    leading-8 
    text-slate-200 
    text-left
`;

const MotionGrid = motion(Grid);

export default function About({ frontmatter: { title, date }, mdxSource }) {
    return (
        <MotionGrid initial="initial" animate="animate" exit="exit" variants={variants}>
            <HeadingContainer>
                <h1>
                    <Date>{date}</Date>
                    <Title>{title}</Title>
                </h1>

                <Content>
                    <MDXRemote {...mdxSource} />
                </Content>
            </HeadingContainer>
        </MotionGrid>
    );
}

const getStaticProps = async () => {
    const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/', 'about.mdx'), 'utf-8');

    const { data: frontmatter, content } = matter(markdownWithMeta);
    const mdxSource = await serialize(content);

    return {
        props: {
            frontmatter,
            mdxSource,
        },
    };
};

export { getStaticProps };
