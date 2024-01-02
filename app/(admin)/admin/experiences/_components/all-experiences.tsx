
"use client";

import { useExperiences } from "@/hooks/use-experience";

import { ExperienceCard } from "./experience-card";
import { CardSkeleton } from "../../_components/card-skeleton";
import { Error } from "@/components/error";
import { Skeletons } from "@/components/ui/skeleton";

export const AllExperiences = () => {
    const { data: experiences, error, isLoading } = useExperiences();

    if (error) return <Error message={error.message} />

    return (
        <>
            {isLoading && <Skeletons skeleton={CardSkeleton} />}
            {experiences && experiences.map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} length={experiences.length} />
            ))}
        </>
    );
}