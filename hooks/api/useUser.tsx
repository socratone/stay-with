import { useQuery } from '@tanstack/react-query';
import { getUser } from 'helpers/axios';

export const USER_QUERY_KEY = 'user';

const useUser = (id?: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => getUser(id as string),
    enabled: !!id,
  });
};

export default useUser;
