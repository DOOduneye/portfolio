import ProjectCard from '../components/ProjectCard';

import { motion } from 'framer-motion';
import variants from '../utils/motion' 

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

export default function Projects( { projects }) {
    return (       
        <motion.main initial='hidden' animate='animate' exit='exit' variants={variants} className="grid grid-flow-row auto-rows-max h-full w-full mb-10">
            <section className="flex flex-row justify-center p-12">
                <p className="mt-1 text-base text-gray-500">
                    Things I've built* (and things I'm working on).
                </p>
             </section>

            <section className="grid mx-auto grid-flow-rows gap-4 px-1">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </section>
        </motion.main> 
    );
}

export const getStaticProps = async() => {
    const files = fs.readdirSync(path.join('pages', '../content/projects'));

    const projects = files.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/projects', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return { frontmatter, slug: filename.split('.')[0] };
    });

    return { props: { projects } }
}
