import { ProjectCard } from "../_components/project-card";

const Projects = () => {
    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Project</h2>
            {Array.from({ length: 10 }, (_, i) => (
                <ProjectCard
                    title='The First Project'
                    description='This is the first project on my blog.'
                    tags={['tag1', 'tag2']}
                    year='2021'
                    key={i}
                />
            ))}
        </main >
    );
}

export default Projects;