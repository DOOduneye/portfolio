import { create } from "zustand";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/providers";

import type { Project, ProjectWithoutId } from "@/types/project";

import { getAllProjects, getProjectById, createProject, deleteProject, updateProject } from "@/services/projects";
import { Update } from "@/types/global";
import { Timestamp } from "firebase/firestore";

type ProjectStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

type EditProjectStore = {
    isOpen: boolean;
    project: Project;
    setProject: (project: Project) => void;
    onOpen: () => void;
    onClose: () => void;
};

export const useEditProjectStore = create<EditProjectStore>((set) => ({
    isOpen: false,
    project: {
        id: '',
        title: '',
        description: '',
        tags: [],
        date: Timestamp.fromDate(new Date()),
        link: '',
    },
    setProject: (project: Project) => set((state) => ({ project: { ...state.project, ...project } })),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));


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