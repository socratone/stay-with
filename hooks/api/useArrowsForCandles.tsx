import { useQuery } from '@tanstack/react-query';
import { getArrows, GetLexioDivinasParams } from 'helpers/axios';

type UseArrowsForCandlesOptions = { enabled?: boolean };

export const ARROWS_FOR_CANDLES_QUERY_KEY = 'arrows-for-candles';

const useArrowsForCandles = (
  params: GetLexioDivinasParams,
  options?: UseArrowsForCandlesOptions
) => {
  return useQuery({
    queryKey: [ARROWS_FOR_CANDLES_QUERY_KEY, params],
    queryFn: () => getArrows(params),
    keepPreviousData: true,
    enabled: options?.enabled,
  });
};

export default useArrowsForCandles;
