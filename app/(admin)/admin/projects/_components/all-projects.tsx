
"use client";


import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";
import { ProjectCard } from "./project-card";
import { useProjects } from "@/hooks/use-project";

export const AllProjects = () => {
    const { data: projects, error, isLoading } = useProjects();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    return (
        <>
            {projects && projects.sort((a, b) => b.date.toMillis() - a.date.toMillis()).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} totalProjects={projects.length} />
            ))}
        </>
    );
}