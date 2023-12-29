"use client"

import { useProjects } from "@/hooks/useFirebase";
import { ProjectCard } from "@/components/project-card";
import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";
import { groupBy } from "@/lib/utils";

const Projects = () => {
    const { data: projects, isLoading, error } = useProjects();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    if (!projects) return null;

    const groupedProjects = groupBy(projects, (project) =>
        project.date.toDate().getFullYear().toString()
    );

    const sortedYears = Object.keys(groupedProjects).sort(
        (a, b) => parseInt(b) - parseInt(a)
    );


    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Projects</h2>
            {sortedYears.map((year) => (
                <div key={year} className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold mt-4">{year}</h3>
                    {groupedProjects[year].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()).map((project) => (
                        <ProjectCard project={project} key={project.id} />
                    ))}
                </div>
            ))}
        </main >
    );
}

export default Projects;