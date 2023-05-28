import { useQuery } from '@tanstack/react-query';
import { getArrow } from 'helpers/axios';

export const ARROW_QUERY_KEY = 'arrow';

const useArrow = (id?: string | null) => {
  return useQuery({
    queryKey: [ARROW_QUERY_KEY, id],
    queryFn: () => getArrow(id as string),
    enabled: !!id,
  });
};

export default useArrow;
