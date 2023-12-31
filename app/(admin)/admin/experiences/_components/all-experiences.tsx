
"use client";

import { Spinner } from "@/components/spinner";
import { Error } from "@/components/error";
import { useExperiences } from "@/hooks/use-experience";

export const AllExperiences = () => {
    const { data: experiences, error, isLoading } = useExperiences();

    if (isLoading) return <Spinner />
    if (error) return <Error message={error.message} />

    return (
        <>
            {experiences && experiences.map((experience) => (
                <div key={experience.id}>
                    <h2>{experience.company}</h2>
                    <p>{experience.description}</p>
                </div>
            ))}
        </>
    );
}