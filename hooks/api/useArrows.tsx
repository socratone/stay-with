import { useQuery } from '@tanstack/react-query';
import { getArrows, GetArrowsParams } from 'helpers/axios';

type UseArrowsOptions = { enabled?: boolean };

export const ARROWS_QUERY_KEY = 'arrows';

const useArrows = (params: GetArrowsParams, options?: UseArrowsOptions) => {
  return useQuery({
    queryKey: [ARROWS_QUERY_KEY, params],
    queryFn: () => getArrows(params),
    keepPreviousData: true,
    enabled: options?.enabled,
  });
};

export default useArrows;
