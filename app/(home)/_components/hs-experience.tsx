"use client";

import { compareExperiences } from "@/lib/utils";
import { useExperiences } from "@/hooks/useFirebase";

import { ExperienceCard } from "./experience-card";
import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";

export const HomeScreenExperience = () => {

    const { data: experiences, isLoading, error } = useExperiences();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    return (
        <div className='mt-10 space-y-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-md font-semibold'>
                    Experience
                </h1>
            </div>

            <div className='space-y-4'>
                {experiences?.sort(compareExperiences).map((experience: any) => (
                    <ExperienceCard experience={experience} key={experience.id} />
                ))}
            </div>
        </div>
    );
}