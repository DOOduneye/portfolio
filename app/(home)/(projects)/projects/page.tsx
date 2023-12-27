"use client"

import { ProjectCard } from "@/components/project-card";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
    const { data: projects, isLoading, error } = useProjects();

    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Projects</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {projects?.map((project) => (
                <ProjectCard project={project} key={project.id} />
            ))}
        </main >
    );
}

export default Projects;