"use client";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Project } from "@/types/project";
import { AdminDropdown } from "../../_components/admin-dropdown";
import { useDeleteProject } from "@/hooks/use-project";
import { useEditProjectStore, useProjectStore } from "@/store/modal-store";

interface ProjectCardProps {
    project: Project;
    index: number;
    length: number;
}

export const ProjectCard = ({ project, index, length }: ProjectCardProps) => {
    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === length - 1);
    const deleteProject = useDeleteProject();
    const editProjectStore = useEditProjectStore();

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === length - 1);
    }, [index, length])


    const handleEditClick = () => {
        editProjectStore.setData(project);
        editProjectStore.onOpen();
    };

    const removeProject = async () => {
        try {
            const promise = deleteProject.mutateAsync(project.id);
            toast.promise(promise, {
                loading: 'Deleting project...',
                success: 'Project deleted successfully!',
                error: 'Failed to delete project.',
            });
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project.');
        }
    };

    return (
        <div className={cn('flex flex-row p-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900', {
            'rounded-t-xl': isFirst,
            'rounded-b-xl': isLast,
        })}>
            <div className='flex flex-col justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {project.title}
                </h3>
                <p className='text-sm text-gray-500'>{project.date.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            </div>

            <AdminDropdown onEdit={handleEditClick} onDelete={removeProject} />
        </div>
    );
}
