import { useInfiniteQuery } from '@tanstack/react-query';
import { getArrows, GetLexioDivinasParams } from 'helpers/axios';

export const ARROWS_INFINITE_QUERY_KEY = 'arrows-infinite';

const useArrowsInfinite = (params: Pick<GetLexioDivinasParams, 'limit'>) => {
  return useInfiniteQuery({
    queryKey: [ARROWS_INFINITE_QUERY_KEY, params],
    queryFn: ({ pageParam = 1 }) => {
      return getArrows({
        limit: params.limit,
        skip: params.limit * (pageParam - 1),
      });
    },
    getNextPageParam: (_, allPages) => allPages.length + 1,
  });
};

export default useArrowsInfinite;
