import { ProjectCard } from "@/components/project-card";
import { useProjects } from "@/hooks/useFirebase";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HomeScreenProjects = () => {

    const { data: projects, error, isLoading } = useProjects();

    return (
        <div className='mt-10 space-y-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-md font-semibold'>
                    Projects
                </h1>
                <Link href='/projects' className='flex flex-row items-center space-x-2 cursor-pointer group'>
                    <ArrowRight className='w-6 h-6 text-gray-500 group-hover:text-gray-400' />
                </Link>
            </div>
            <div className='grid grid-cols-1 gap-4'>
                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}
                {projects?.map((project: any) => (
                    <ProjectCard project={project} key={project.title} />
                ))}
            </div>
        </div>
    );
}

export default HomeScreenProjects;