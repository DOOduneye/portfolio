
"use client";

import { useExperiences } from "@/hooks/use-experience";

import { ExperienceCard } from "./experience-card";
import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";

export const AllExperiences = () => {
    const { data: experiences, error, isLoading } = useExperiences();

    if (isLoading) return <Spinner vertical={"top"} />
    if (error) return <Error message={error.message} />

    return (
        <>
            {experiences && experiences.map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} length={experiences.length} />
            ))}
        </>
    );
}