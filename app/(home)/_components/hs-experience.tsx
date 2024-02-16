"use client";

import { useEffect } from "react";

import { compareExperiences } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import { useExperiences } from "@/hooks/use-experience";

import { ExperienceCard } from "./experience-card";
import { Error } from "@/components/error";
import { Skeletons } from "@/components/ui/skeleton";

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
            {isLoading && <Skeletons skeleton={ExperienceCard.Skeleton} />}
            <div className='space-y-4'>
                {experiences?.filter((experience) => experience.published).sort(compareExperiences).map((experience: Experience) => (
                    <ExperienceCard experience={experience} key={experience.id} />
                ))}
            </div>
        </div>
    );
}