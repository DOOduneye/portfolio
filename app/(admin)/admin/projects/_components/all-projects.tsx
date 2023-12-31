
"use client";


import { Error } from "@/components/error";
import { ProjectCard } from "./project-card";
import { useProjects } from "@/hooks/use-project";
import { Loader } from "lucide-react";
import { Spinner } from "@/components/spinner";

export const AllProjects = () => {
    const { data: projects, error, isLoading } = useProjects();

    if (isLoading) return (
        <Spinner vertical={"top"} />
    )
    if (error) return <Error message={error.message} />

    return (
        <>
            {projects && projects.sort((a, b) => b.date.toMillis() - a.date.toMillis()).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} totalProjects={projects.length} />
            ))}
        </>
    );
}