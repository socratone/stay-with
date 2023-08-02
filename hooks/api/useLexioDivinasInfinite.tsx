import { useInfiniteQuery } from '@tanstack/react-query';
import { getLexioDivinas, GetLexioDivinasParams } from 'helpers/axios';

export const LEXIO_DIVINAS_INFINITE_QUERY_KEY = 'lexio-divinas-infinite';

const useLexioDivinasInfinite = (
  params: Pick<GetLexioDivinasParams, 'userId' | 'limit'>
) => {
  const query = useInfiniteQuery({
    queryKey: [LEXIO_DIVINAS_INFINITE_QUERY_KEY, params],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ?? undefined;
      return getLexioDivinas({
        cursor,
        limit: params?.limit,
        userId: params?.userId,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.lexioDivinas.length === 0) return undefined;
      const lastItem = lastPage.lexioDivinas[lastPage.lexioDivinas.length - 1];
      return lastItem._id;
    },
  });

  const mappedPages = query.data?.pages.flatMap((page) => page.lexioDivinas);

  return {
    ...query,
    data: mappedPages ? { lexioDivinas: mappedPages } : undefined,
  };
};

export default useLexioDivinasInfinite;
