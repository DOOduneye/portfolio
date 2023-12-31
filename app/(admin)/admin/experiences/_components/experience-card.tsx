"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Experience } from "@/types/experience";
import { useDeleteExperience } from "@/hooks/use-experience";
import { useEditExperienceStore } from "@/hooks/use-modal";

import { AdminDropdown } from "../../_components/admin-dropdown";

interface ExperienceCardProps {
    experience: Experience;
    index: number;
    length: number;
}

export const ExperienceCard = ({ experience, index, length }: ExperienceCardProps) => {
    const [isFirst, setIsFirst] = useState(index === 0);
    const [isLast, setIsLast] = useState(index === length - 1);
    const deleteExperience = useDeleteExperience();
    const editExperienceStore = useEditExperienceStore();

    useEffect(() => {
        setIsFirst(index === 0);
        setIsLast(index === length - 1);
    }, [index, length])


    const handleEditClick = () => {
        editExperienceStore.setData(experience);
        editExperienceStore.onOpen();
    };

    const removeExperience = async () => {
        try {
            const promise = deleteExperience.mutateAsync(experience.id);
            toast.promise(promise, {
                loading: 'Deleting experience...',
                success: 'Experience deleted successfully!',
                error: 'Failed to delete experience.',
            });
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience.');
        }
    };

    return (
        <div className={cn('flex flex-row p-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900', {
            'rounded-t-xl': isFirst,
            'rounded-b-xl': isLast,
        })}>
            <div className='flex flex-col justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {experience.role}
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                    {experience.company}
                </p>
                <p className='text-gray-500 dark:text-gray-400'>
                    {experience.from.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {' - '}
                    {experience.to?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) ?? 'Present'}
                </p>

            </div>

            <AdminDropdown onEdit={handleEditClick} onDelete={removeExperience} />
        </div>
    );
}