import PostCard from '../components/PostCard';

import { motion } from 'framer-motion';
import variants from '../utils/motion';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

import tw from 'tailwind-styled-components';

const Container = tw.main`  
    grid
    grid-flow-row
    auto-rows-max
    h-full
    w-full
    mb-10
`;

const HeadingSection = tw.section`
    flex
    flex-row
    justify-center
    p-12
`;

const MotionContainer = motion(Container);

const MapContainer = tw.section`
    grid 
    grid-col-1 
    md:grid-cols-1 
    lg:grid-cols-3 
    gap-5 
    px-10
`;

const HeadingText = tw.p`
    mt-1
    text-base
    text-gray-500
`;

export default function Posts({ posts }) {
    return (
        <MotionContainer initial="initial" animate="animate" exit="exit" variants={variants}>
            <HeadingSection>
                <HeadingText>{"Things I've written."}</HeadingText>
            </HeadingSection>

            <MapContainer>
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </MapContainer>
        </MotionContainer>
    );
}

export const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/posts'));

    const posts = files.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/posts', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            frontmatter,
            slug: filename.split('.')[0],
        };
    });

    return {
        props: {
            posts,
        },
    };
};
