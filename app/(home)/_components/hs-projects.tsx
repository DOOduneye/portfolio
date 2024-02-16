"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useProjects } from "@/hooks/use-project";

import { ProjectCard } from "./project-card";
import { Error } from "@/components/error";
import { cn, compareProjects } from "@/lib/utils";
import { Skeletons } from "@/components/ui/skeleton";

export const HomeScreenProjects = () => {
    const { data: projects, error, isLoading } = useProjects();

    if (error) return <Error message={error.message} />

    return (
        <div className='mt-10 space-y-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-md font-semibold'>
                    Projects
                </h1>
                <Link
                    href='/projects'
                    className={cn(`flex flex-row items-center space-x-2 cursor-pointer group group-hover:text-gray-400`, {
                        'text-gray-700': !isLoading,
                        'text-gray-500 pointer-events-none': isLoading,
                    })}
                >
                    <span className='text-sm font-normal hidden text-gray-500 group-hover:block'>
                        See More
                    </span>
                    <ChevronRight className='w-6 h-6 dark:text-gray-500 dark:group-hover:text-gray-400 text-gray-500 group-hover:text-gray-700' />
                </Link>
            </div>
            {isLoading && <Skeletons skeleton={ProjectCard.Skeleton} />}
            <div className='grid grid-cols-1 gap-4'>
                {projects?.filter((project) => project.published).sort(compareProjects).slice(0, 3).map((project) => (
                    <ProjectCard project={project} key={project.title} />
                ))}
            </div>
        </div>
    );
}