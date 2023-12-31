import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/providers";

import type { Update } from "@/types/global";
import type { Project, ProjectWithoutId } from "@/types/project";
import { getAllProjects, getProjectById, createProject, deleteProject, updateProject } from "@/services/projects";

/**
 * Fetches all projects.
 * @returns {UseQueryResult<Project[], Error>} The query result for fetching all projects.
 */
export const useProjects = (): UseQueryResult<Project[], Error> => {
    return useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: getAllProjects
    });
};

/**
 * Fetches a specific project by its ID.
 * @param {string} id - The ID of the project to fetch.
 * @returns {UseQueryResult<Project, Error>} The query result for fetching a specific project.
 */
export const useProject = (id: string): UseQueryResult<Project, Error> => {
    return useQuery<Project, Error>({
        queryKey: ['projects', id],
        queryFn: () => getProjectById(id)
    });
}

/**
 * Creates a new project.
 * @returns {UseMutationResult<void, Error, ProjectWithoutId, unknown>} The mutation result for creating a project.
 */
export const useCreateProject = (): UseMutationResult<void, Error, ProjectWithoutId, unknown> => {
    return useMutation({
        mutationFn: (project: ProjectWithoutId) => createProject(project),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    })
}

/**
 * Updates a project.
 * @returns {UseMutationResult<void, Error, Update<Project>, unknown>} The mutation result for updating a project.
*/
export const useUpdateProject = (): UseMutationResult<void, Error, Update<Project>, unknown> => {
    return useMutation({
        mutationFn: ({ id, data }) => updateProject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    })
}

/**
 * Deletes a project by its ID.
 * @returns {UseMutationResult<void, Error, string, unknown>} The mutation result for deleting a project.
 */
export const useDeleteProject = (): UseMutationResult<void, Error, string, unknown> => {
    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    })
}