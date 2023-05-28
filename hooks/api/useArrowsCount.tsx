import { useQuery } from '@tanstack/react-query';
import { getArrowsCount, GetLexioDivinasCountParams } from 'helpers/axios';

export const ARROWS_COUNT_QUERY_KEY = 'arrows-count';

const useArrowsCount = (params?: GetLexioDivinasCountParams) => {
  return useQuery({
    queryKey: [ARROWS_COUNT_QUERY_KEY, params],
    queryFn: () => getArrowsCount(params),
  });
};

export default useArrowsCount;
