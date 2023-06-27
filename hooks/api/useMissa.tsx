import { useQuery } from '@tanstack/react-query';
import { getMissa, GetMissaParams } from 'helpers/axios';

export const MISSA_QUERY_KEY = 'missa';

const useMissa = (params?: GetMissaParams) => {
  return useQuery({
    queryKey: [MISSA_QUERY_KEY, params],
    queryFn: () => getMissa(params),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60,
  });
};

export default useMissa;
