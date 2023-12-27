import { useExperiences } from "@/hooks/useFirebase";
import { compareExperiences } from "@/lib/utils";
import { ExperienceCard } from "./experience-card";

const HomeScreenExperience = () => {

    const { data: experiences, isLoading, error } = useExperiences();

    return (
        <div className='mt-10 space-y-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-md font-semibold'>
                    Experience
                </h1>
            </div>

            <div className='space-y-4'>
                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}
                {experiences?.sort(compareExperiences).map((experience: any) => (
                    <ExperienceCard experience={experience} key={experience.id} />
                ))}
            </div>
        </div>
    );
}

export default HomeScreenExperience;