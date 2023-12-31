import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/providers";

import type { Post, PostWithoutId } from "@/types/post";

import type { Update } from "@/types/global";
import { getAllPosts, getPostById, createPost, deletePost, updatePost } from "@/services/posts";

/**
 * Fetches all posts.
 * @returns {UseQueryResult<Post[], Error>} The query result for fetching all posts.
 */
export const usePosts = (): UseQueryResult<Post[], Error> => {
    return useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: getAllPosts
    });
};

/**
 * Fetches a specific post by its ID.
 * @param {string} id - The ID of the post to fetch.
 * @returns {UseQueryResult<Post, Error>} The query result for fetching a specific post.
 */
export const usePost = (id: string): UseQueryResult<Post, Error> => {
    return useQuery<Post, Error>({
        queryKey: ['posts', id],
        queryFn: () => getPostById(id)
    });
}

/**
 * Creates a new post.
 * @returns {UseMutationResult<void, Error, PostWithoutId, unknown>} The mutation result for creating a post.
 */
export const useCreatePost = (): UseMutationResult<void, Error, PostWithoutId, unknown> => {
    return useMutation({
        mutationFn: (post: PostWithoutId) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    })
}

/**
 * Updates a post.
 * @returns {UseMutationResult<void, Error, Update<Post>, unknown>} The mutation result for updating a post.
*/
export const useUpdatePost = (): UseMutationResult<void, Error, Update<Post>, unknown> => {
    return useMutation({
        mutationFn: ({ id, data }) => updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    })
}


/**
 * Deletes a post by its ID.
 * @returns {UseMutationResult<void, Error, string, unknown>} The mutation result for deleting a post.
 */
export const useDeletePost = (): UseMutationResult<void, Error, string, unknown> => {
    return useMutation({
        mutationFn: (id: string) => deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    })
}