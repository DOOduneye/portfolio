import { useQuery } from '@tanstack/react-query';
import { getAllPosts, Post } from '@/services/posts';

export const usePosts = () => {
    return useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: getAllPosts
    });
};
