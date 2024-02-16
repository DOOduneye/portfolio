"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { cn, formatDateRange } from "@/lib/utils";
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

    let date;
    if (experience.to === undefined) {
        date = formatDateRange(experience.from.toDate(), null);
    } else {
        date = formatDateRange(experience.from.toDate(), experience.to.toDate());
    }

    return (
        <div className={cn('flex flex-row p-5 gap-x-5 justify-between border border-transparent border-gray-200 shadow-sm dark:border-gray-900', {
            'rounded-t-xl': isFirst,
            'rounded-b-xl': isLast,
        })}>
            <div className='flex flex-col space-y-2'>
                <h3 className='text-lg font-semibold'>{experience.role} @ <span className='text-gray-600 dark:text-gray-400 text-md'>{experience.company}</span></h3>
                <p>
                    {date}
                </p>
                <p className='text-sm font-normal text-gray-500'>{experience.description}</p>
                <div className='flex flex-row items-center space-x-2'>
                    <span className='text-sm font-normal text-gray-500'>Published:</span>
                    <span className={cn('text-sm font-normal', {
                        'text-green-500': experience.published,
                        'text-red-500': !experience.published,
                    })}>
                        {experience.published ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>
            <AdminDropdown onEdit={handleEditClick} onDelete={removeExperience} />
        </div>
    );
}