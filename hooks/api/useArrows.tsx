import { useQuery } from '@tanstack/react-query';
import { getArrows, GetLexioDivinasParams } from 'helpers/axios';

export const ARROWS_QUERY_KEY = 'arrows';

const useArrows = (params?: GetLexioDivinasParams & { enabled?: boolean }) => {
  return useQuery({
    queryKey: [ARROWS_QUERY_KEY, params],
    queryFn: () => getArrows(params),
    keepPreviousData: true,
    enabled: params?.enabled,
  });
};

export default useArrows;
