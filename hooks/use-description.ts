import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import {queryClient} from '@/components/providers/providers';

import type {Update} from '@/types/global';
import {Description, DESCRIPTION_ID} from '@/types/description';
import {getDescription, updateDescription} from '@/services/description';

/**
 * Fetches the description.
 * @returns {UseQueryResult<Description, Error>} The query result for fetching the description.
 */
export const useDescription = (): UseQueryResult<Description, Error> => {
  return useQuery<Description, Error>({
    queryKey: ['description', DESCRIPTION_ID],
    queryFn: () => getDescription(),
  });
};

/**
 * Updates the description.
 * @returns {UseMutationResult<void, Error, Update<Description>, unknown>} The mutation result for updating the description.
 */
export const useUpdateDescription = (): UseMutationResult<
  void,
  Error,
  Update<Description>,
  unknown
> => {
  return useMutation({
    mutationFn: ({data}) => updateDescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['description']});
    },
  });
};
