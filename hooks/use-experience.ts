import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/providers";

import type { Update } from "@/types/global";
import type { Experience, ExperienceWithoutId } from "@/types/experience";

import { getAllExperiences, getExperienceById, createExperience, deleteExperience, updateExperience } from "@/services/experiences";

/**
 * Fetches all experiences.
 * @returns {UseQueryResult<Experience[], Error>} The query result for fetching all experiences.
 */
export const useExperiences = (): UseQueryResult<Experience[], Error> => {
    return useQuery<Experience[], Error>({
        queryKey: ['experiences'],
        queryFn: getAllExperiences
    });
};

/**
 * Fetches a specific experience by its ID.
 * @param {string} id - The ID of the experience to fetch.
 * @returns {UseQueryResult<Experience, Error>} The query result for fetching a specific experience.
 */
export const useExperience = (id: string): UseQueryResult<Experience, Error> => {
    return useQuery<Experience, Error>({
        queryKey: ['experiences', id],
        queryFn: () => getExperienceById(id)
    });
}

/**
 * Creates a new experience.
 * @returns {MutationResult<void, Error, ExperienceWithoutId, unknown>} The mutation result for creating a experience.
 */
export const useCreateExperience = (): UseMutationResult<void, Error, ExperienceWithoutId, unknown> => {
    return useMutation({
        mutationFn: (experience: ExperienceWithoutId) => createExperience(experience),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        },
    })
}

/**
 * Updates an experience.
 * @returns {UseMutationResult<void, Error, Update<Experience>, unknown>} The mutation result for updating a experience.
*/
export const useUpdateExperience = (): UseMutationResult<void, Error, Update<Experience>, unknown> => {
    return useMutation({
        mutationFn: ({ id, data }) => updateExperience(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        },
    })
}

/**
 * Deletes a experience by its ID.
 * @returns {UseMutationResult<void, Error, string, unknown>} The mutation result for deleting a experience.
 */
export const useDeleteExperience = (): UseMutationResult<void, Error, string, unknown> => {
    return useMutation({
        mutationFn: (id: string) => deleteExperience(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        },
    })
}