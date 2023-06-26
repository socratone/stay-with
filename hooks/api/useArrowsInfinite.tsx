import { useInfiniteQuery } from '@tanstack/react-query';
import { getArrows } from 'helpers/axios';

export const ARROWS_INFINITE_QUERY_KEY = 'arrows-infinite';

type UseArrowsInfiniteParams = {
  limit?: number;
};

const useArrowsInfinite = ({ limit }: UseArrowsInfiniteParams) => {
  return useInfiniteQuery({
    queryKey: [ARROWS_INFINITE_QUERY_KEY, limit],
    queryFn: ({ pageParam = 1 }) => {
      return getArrows({
        limit: limit as number,
        skip: (limit as number) * (pageParam - 1),
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Return undefined to indicate there is no next page available.
      if (lastPage.arrows.length === 0) return undefined;
      return allPages.length + 1;
    },
    enabled: !!limit,
  });
};

export default useArrowsInfinite;
