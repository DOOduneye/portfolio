import ProjectCard from '../components/ProjectCard';

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
    mx-auto 
    grid-flow-rows
    gap-4
    px-1
`;

const HeadingText = tw.p`
    mt-1
    text-base 
    text-gray-500
`;

export default function Projects({ projects }) {
    return (
        <MotionContainer initial="initial" animate="animate" exit="exit" variants={variants}>
            <HeadingSection>
                <HeadingText>{"Things I've built* (and things I'm working on)."}</HeadingText>
            </HeadingSection>

            <MapContainer>
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </MapContainer>
        </MotionContainer>
    );
}

export const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/projects'));

    const projects = files.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/projects', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return { frontmatter, slug: filename.split('.')[0] };
    });

    return { props: { projects } };
};