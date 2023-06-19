import { useQuery } from '@tanstack/react-query';
import { getMissa, GetMissaParams } from 'helpers/axios';

export const MISSA_QUERY_KEY = 'missa';

const useMissa = (params?: GetMissaParams) => {
  return useQuery({
    queryKey: [MISSA_QUERY_KEY, params],
    queryFn: () => getMissa(params),
  });
};

export default useMissa;
