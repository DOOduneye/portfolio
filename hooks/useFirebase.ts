import { useQuery } from "@tanstack/react-query";

import { Experience, getAllExperiences } from "@/services/experiences";
import { Post, getAllPosts } from "@/services/posts";
import { getAllProjects, Project } from "@/services/projects";

export const usePosts = () => {
    return useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: getAllPosts
    });
};

export const useExperiences = () => {
    return useQuery<Experience[], Error>({
        queryKey: ['experiences'],
        queryFn: getAllExperiences
    });
};

export const useProjects = () => {
    return useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: getAllProjects
    });
};
