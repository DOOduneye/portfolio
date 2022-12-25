import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const Projects = ({ projects }) => {
    projects = projects.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    projects = projects.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));

    return (
        <Layout>
            <main className="grid w-full h-full grid-flow-row px-6 auto-row-max">
                <section className="flex flex-row justify-center p-10">
                    <p className="mt-1 text-base text-gray-500">
                        {`Things I've built* (and things I\'m working on)`}
                    </p>
                </section>

                <section className="grid content-end gap-5 h-fit grid-col-1 md:grid-cols-1 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </section>
                
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