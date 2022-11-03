import TextCard from '../components/TextCard';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import tw from 'tailwind-styled-components';

const TextContainer = tw.section`
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

    lg:hover:border-zinc-200/50 
    lg:hover:inner-shadow 
    lg:hover:transition 
    lg:hover:scale-200 
    lg:hover:-translate-y-2 
    lg:ease-in-out 
    lg:delay-150 
    lg:duration-300 
    lg:shadow-md 
    lg:drop-shadow-sm 
    lg:transform

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

const About = ({ frontmatter: { title, date }, mdxSource }) => {
    return (
        <TextContainer>
            <h1>
                <Date>{date}</Date>
                <Title>{title}</Title>
            </h1>

            <Content>
                <MDXRemote {...mdxSource} />
            </Content>
        </TextContainer>
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
export default About;
