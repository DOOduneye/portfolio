"use client";

import { compareExperiences } from "@/lib/utils";
import { useExperiences } from "@/hooks/use-experience";

import { ExperienceCard } from "./experience-card";
import { Error } from "@/components/error";

export const HomeScreenExperience = () => {
    const { data: experiences, isLoading, error } = useExperiences();

    if (error) return <Error message={error.message} />

    return (
        <div className='mt-10 space-y-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-md font-semibold'>
                    Experience
                </h1>
            </div>

            {isLoading && (
                <>
                    {[...Array(3)].map((_, i) => (
                        <ExperienceCard.Skeleton key={i} />
                    ))}
                </>
            )}
            <div className='space-y-4'>
                {experiences?.sort(compareExperiences).map((experience: any) => (
                    <ExperienceCard experience={experience} key={experience.id} />
                ))}
            </div>
        </div>
    );
}