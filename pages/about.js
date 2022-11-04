import TextCard from '../components/TextCard';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import tw from 'tailwind-styled-components';
import { TextContainer } from '@/styles/styles';

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
    text-[#F57A89] 
    underline
    underline-offset-8
    decoration-[#F57A89]
    decoration-3
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
