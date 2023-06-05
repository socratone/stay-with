import { useQuery } from '@tanstack/react-query';
import { getMissa } from 'helpers/axios';

export const MISSA_QUERY_KEY = 'missa';

const useMissa = () => {
  return useQuery({
    queryKey: [MISSA_QUERY_KEY],
    queryFn: () => getMissa(),
  });
};

export default useMissa;
