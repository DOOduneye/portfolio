import { useQuery } from '@tanstack/react-query';
import { getAllExperiences, Experience } from '@/services/experiences';

export const useExperiences = () => {
    return useQuery<Experience[], Error>({
        queryKey: ['experiences'],
        queryFn: getAllExperiences
    });
};
