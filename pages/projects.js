import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import Project from '@/components/Project';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const Projects = ({ projects }) => {
    projects = projects.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    projects = projects.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));

    return (
        <Layout>
            <main className="grid w-full h-full grid-flow-row px-6 auto-row-max">
                <Project projects={projects} />
                <Footer />
            </main>
        </Layout>
    );
}

const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/projects'));

    const projects = files.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/projects', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return { 
            frontmatter, 
            slug: filename.split('.')[0] 
        };
    });

    return { 
        props: { 
            projects 
        } 
    };
};

export { getStaticProps };
export default Projects;