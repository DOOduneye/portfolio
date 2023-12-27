import { useQuery } from '@tanstack/react-query';
import { getAllProjects, Project } from '@/services/projects';

export const useProjects = () => {
    return useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: getAllProjects
    });
};
