import ProjectCard from '@/components/ProjectCard'
import CardHeader from '@/components/Card/CardHeader'
import { ContentContainer, MapProjects } from '@/styles/styles';

import fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const Projects = ({ projects }) => {
    return (
        <ContentContainer>
            <CardHeader title={'Things I\'ve built* (and things I\'m working on).'} />

            <MapProjects>
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </MapProjects>
        </ContentContainer>
    );
}

const getStaticProps = async () => {
    const files = fs.readdirSync(path.join('pages', '../content/projects'));

    const projects = files.map((filename) => {
        const markdownWithMeta = fs.readFileSync(path.join('pages', '../content/projects', filename), 'utf-8');
        const { data: frontmatter } = matter(markdownWithMeta);

        return { frontmatter, slug: filename.split('.')[0] };
    });

    return { props: { projects } };
};

export { getStaticProps };
export default Projects;